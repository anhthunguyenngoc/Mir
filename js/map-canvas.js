const maxWidth = 1000; // Kích thước tối đa của map
const maxHeight = 600; // Kích thước tối đa của map
const mapArray = Array.from({ length: maxHeight }, () => Array(maxWidth).fill(-1));
document.getElementById('map-canvas').innerHTML = 
`
<div class="tools">
   ` + defaultToolsHTML() + `
</div>
<canvas id="canvas" width="${maxWidth}" height="${maxHeight}"></canvas>
`;

function defaultToolsHTML() {
    return `
    <ul class="map-options">
        <li>
            <button class="map-option" id="edit" onclick="editMap()">
                <img class="map-option-tool-img" src="/Mir/images/brush.svg" alt="Edit map">
            </button>              
        </li>
    </ul>
    `;
}

function editToolsHTML() {
    return `
    <ul class="map-options">
        <li>
            <button class="map-option toggle-button" id="brushToggle">
                <img class="map-option-tool-img" src="/Mir/images/brush.svg" alt="Edit map">
            </button>              
        </li>
        <li>
            <button class="map-option toggle-button" id="lineToggle">
                <img class="map-option-tool-img" src="/Mir/images/line.svg" alt="Draw line">
            </button>              
        </li>
        <li>
            <button class="map-option toggle-button" id="curveToggle">
                <img class="map-option-tool-img" src="/Mir/images/curve.svg" alt="Draw curve">
            </button>              
        </li>
        <li>
            <button class="map-option toggle-button" id="zigzagToggle">
                <img class="map-option-tool-img" src="/Mir/images/zigzag.svg" alt="Draw zigzag">
            </button>              
        </li>
        <li>
            <button class="map-option toggle-button" id="squareToggle">
                <img class="map-option-tool-img" src="/Mir/images/brush.svg" alt="Draw square">
            </button>              
        </li>
        <li>
            <button class="map-option" id="deleteSelected" onclick="deleteSelected()">
                <img class="map-option-tool-img" src="/Mir/images/bin.svg" alt="Delete">
            </button>              
        </li>
        <li>
            <button class="map-option" id="saveEditMap">
                <img class="map-option-tool-img" src="/Mir/images/tick.svg" alt="Delete">
            </button>              
        </li>
    </ul>
`;
}

const canvas = new fabric.Canvas('canvas');
let point1 = null;
let point2 = null;
let line = null;
let square = null;
let curve = null;
let zigzag = null;
let points = [];
let selectedCurve = null;
let isDrawing = false; // Biến theo dõi trạng thái vẽ

// Hàm để xử lý sự kiện thay đổi
function handleToggleChange(selectedToggle) {
    // Tắt tất cả các toggle
    document.querySelectorAll('.toggle-button').forEach(btn => {
        btn.classList.remove('active'); // Tắt toggle
    });
    // Đánh dấu toggle đã chọn
    document.getElementById(selectedToggle).classList.add('active');

    // Reset điểm
    point1 = null;
    point2 = null;
}

function deleteSelected() {
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(function(obj) {
        canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.renderAll();
};

canvas.on('mouse:down', function(event) {
    const pointer = canvas.getPointer(event.e);
    if (document.getElementById('brushToggle').classList.contains('active')) {
        // Bắt đầu vẽ tự do
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = "red"; // Màu bút vẽ
        canvas.freeDrawingBrush.width = 5; // Độ rộng bút vẽ
    } else {
        canvas.isDrawingMode = false;
    }
    if (document.getElementById('lineToggle').classList.contains('active')) {
        if (!point1) {
            point1 = pointer; // Lưu điểm đầu tiên
            line = new fabric.Line([point1.x, point1.y, point1.x, point1.y], {
                strokeWidth: 2,
                stroke: 'black'
            });
            canvas.add(line);
        }
    } else if (document.getElementById('squareToggle').classList.contains('active')) {
        if (!point1) {
            point1 = pointer; // Lưu điểm bắt đầu
            square = new fabric.Rect({
                left: pointer.x,
                top: pointer.y,
                fill: 'rgba(0, 150, 136, 0.5)',
                width: 0,
                height: 0,
                stroke: 'black',
                strokeWidth: 2
            });
            canvas.add(square);
        }
    } else if (document.getElementById('curveToggle').classList.contains('active')) {
        if (!point1) {
            point1 = pointer; // Lưu điểm đầu tiên
        } else if (!point2) {
            point2 = pointer; // Lưu điểm thứ hai
            curve = new fabric.Path(`M ${point1.x} ${point1.y} Q ${(point1.x + point2.x) / 2} ${point2.y - 100} ${point2.x} ${point2.y}`, {
                strokeWidth: 2,
                stroke: 'black', // Đặt màu đường cong thành đen
                fill: 'transparent'
            });
            canvas.add(curve);
            point1 = null; // Reset điểm sau khi vẽ xong
            point2 = null; // Reset điểm sau khi vẽ xong
        }
    } else if (document.getElementById('zigzagToggle').classList.contains('active')) {
        if (!point1) {
            point1 = pointer; // Lưu điểm đầu tiên
        } else if (!point2) {
            point2 = pointer; // Lưu điểm thứ hai
            var zp0 = { x: (point1.x + point2.x)/2 - 101, y: point1.y}
            var zp1 = { x: (point1.x + point2.x)/2, y: point2.y}
            // (27, 25, 20, 18, 11, 0)
            // (0, 11, 18, 20, 25, 27)
            zigzag = new fabric.Path(`M ${point1.x} ${point1.y} H ${zp0.x} C ${zp0.x + 27} ${zp0.y} ${zp0.x + 52} ${zp0.y - 10} ${zp0.x + 72} ${zp0.y - 30} ${zp0.x + 90} ${zp0.y - 49} ${zp0.x + 101} ${zp0.y - 75} ${zp0.x + 101} ${zp0.y - 102} V ${zp1.y + 102} C ${zp1.x} ${zp1.y + 102} ${zp1.x + 11} ${zp1.y + 75} ${zp1.x + 29} ${zp1.y + 49} ${zp1.x + 49} ${zp1.y + 30} ${zp1.x + 74} ${zp1.y + 10} ${zp1.x + 101} ${zp1.y}H ${point2.x}`, {
                strokeWidth: 2,
                stroke: 'black', // Đặt màu đường cong thành đen
                fill: 'transparent'
            });
            canvas.add(zigzag);
            point1 = null; // Reset điểm sau khi vẽ xong
            point2 = null; // Reset điểm sau khi vẽ xong
        }
    }

    const target = canvas.findTarget(event.e);
    if (target) {
        if (target.type === 'path') {
          target.selectable = false;
          target.evented = false;
          points.forEach(p => {
              if(p) canvas.remove(p);
          });

          const pathData = target.path; // Lấy dữ liệu đường cong
          selectedCurve = target;
          points = [
              new fabric.Circle({ left: pathData[0][1] - 50, top: pathData[0][2], radius: 5, fill: 'red', name: 'p0' }),
              new fabric.Circle({ left: pathData[1][1], top: pathData[1][2], radius: 5, fill: 'red', name: 'p1' }),
              new fabric.Circle({ left: pathData[1][3] + 50, top: pathData[1][4], radius: 5, fill: 'red', name: 'p2' })
          ];
          points.forEach(p => {
              p.set({ hasControls: true, hasBorders: false });
              canvas.add(p);
          });
        }
    }
});

canvas.on('mouse:move', function(event) {
    if (line && point1) {
        const pointer = canvas.getPointer(event.e);
        line.set({ x2: pointer.x, y2: pointer.y }); // Cập nhật điểm cuối của đường thẳng
        line.setCoords(); // Cập nhật tọa độ
        canvas.renderAll(); // Vẽ lại canvas
    } else if (square && point1) {
        const pointer = canvas.getPointer(event.e);
        const width = pointer.x - point1.x;
        const height = pointer.y - point1.y;

        // Cập nhật kích thước của hình vuông
        square.set({
            left: Math.min(point1.x, pointer.x),
            top: Math.min(point1.y, pointer.y),
            width: Math.abs(width),
            height: Math.abs(height)
        });
        square.setCoords(); // Cập nhật tọa độ
        canvas.renderAll(); // Vẽ lại canvas
    } else if (document.getElementById('curveToggle').classList.contains('active') && point1 && !point2) {
        const pointer = canvas.getPointer(event.e);
        // Cập nhật vị trí điểm thứ hai
        point2 = pointer; // Tạm thời gán lại cho point2 để cập nhật

        // Xóa đường cong cũ nếu có
        if (curve) {
            canvas.remove(curve);
            curve = null; // Reset biến curve
        }

        curve = new fabric.Path(`M ${point1.x} ${point1.y} Q ${(point1.x + point2.x) / 2} ${point2.y - 100} ${point2.x} ${point2.y}`, {
            strokeWidth: 2,
            stroke: 'black', // Đặt màu đường cong thành đen
            fill: 'transparent'
        });
        canvas.add(curve);
        canvas.renderAll(); // Vẽ lại canvas
        point2 = null; // Reset điểm thứ hai
    } else if (document.getElementById('zigzagToggle').classList.contains('active')) {
       const pointer = canvas.getPointer(event.e);
        // Cập nhật vị trí điểm thứ hai
        point2 = pointer; // Tạm thời gán lại cho point2 để cập nhật

        // Xóa đường cong cũ nếu có
        if (zigzag) {
            canvas.remove(zigzag);
            zigzag = null; // Reset biến zigzag
        }

        var zp0 = { x: (point1.x + point2.x)/2 - 101, y: point1.y}
        var zp1 = { x: (point1.x + point2.x)/2, y: point2.y}
        // (27, 25, 20, 18, 11, 0) (0, 10, 20, 19, 26, 27)
        // (0, 11, 18, 20, 25, 27) (27, 26, 19, 20, 10, 0)
        zigzag = new fabric.Path(`M ${point1.x} ${point1.y} H ${zp0.x} C ${zp0.x + 27} ${zp0.y} ${zp0.x + 52} ${zp0.y - 10} ${zp0.x + 72} ${zp0.y - 30} ${zp0.x + 90} ${zp0.y - 49} ${zp0.x + 101} ${zp0.y - 75} ${zp0.x + 101} ${zp0.y - 102} V ${zp1.y + 102} C ${zp1.x} ${zp1.y + 102} ${zp1.x + 11} ${zp1.y + 75} ${zp1.x + 29} ${zp1.y + 49} ${zp1.x + 49} ${zp1.y + 30} ${zp1.x + 74} ${zp1.y + 10} ${zp1.x + 101} ${zp1.y}H ${point2.x}`, {
            strokeWidth: 2,
            stroke: 'black', // Đặt màu đường cong thành đen
            fill: 'transparent'
        });
        console.log(`M ${point1.x} ${point1.y} H ${zp0.x} C ${zp0.x + 27} ${zp0.y} ${zp0.x + 52} ${zp0.y - 10} ${zp0.x + 72} ${zp0.y - 30} ${zp0.x + 90} ${zp0.y - 49} ${zp0.x + 101} ${zp0.y - 75} ${zp0.x + 101} ${zp0.y - 102} V ${zp1.y + 102} C ${zp1.x} ${zp1.y + 102} ${zp1.x + 11} ${zp1.y + 75} ${zp1.x + 29} ${zp1.y + 49} ${zp1.x + 49} ${zp1.y + 30} ${zp1.x + 74} ${zp1.y + 10} ${zp1.x + 101} ${zp1.y}H ${point2.x}`);
        canvas.add(zigzag);
        canvas.renderAll(); // Vẽ lại canvas
        point2 = null; // Reset điểm sau khi vẽ xong
    }
});

canvas.on('object:moving', function(e) {
  updateCurve();
});

function updateCurve() {
    if (selectedCurve) canvas.remove(selectedCurve);
    const p0 = points[0], p1 = points[1], p2 = points[2];
    selectedCurve = new fabric.Path(`M ${p0.left  + 50} ${p0.top} Q ${p1.left} ${p1.top} ${p2.left  - 50} ${p2.top}`, {
        strokeWidth: 2,
        stroke: 'black',
        fill: 'transparent'
    });
    selectedCurve.selectable = false;
    selectedCurve.evented = false;
    canvas.add(selectedCurve);
    canvas.renderAll();
}

canvas.on('mouse:up', function() {
    if (line) {
        line = null; // Reset đường thẳng khi thả chuột
    }
    if (square) {
        square = null; // Reset hình vuông khi thả chuột
    }
    if (zigzag) {
        zigzag = null; // Reset hình vuông khi thả chuột
    }

    point1 = null; // Reset điểm
    point2 = null; // Reset điểm
});

function editMap() {
    document.querySelector('.tools').innerHTML = editToolsHTML();
    
    // Thiết lập sự kiện cho các toggle
    document.querySelectorAll('.toggle-button').forEach(toggle => {
        toggle.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                handleToggleChange(this.id);
            } else {
                this.classList.remove('active');
            }
        });
    });
}

const robot = {
    x: 500,
    y: 250,
    theta: 135 // Góc hướng của robot
};

function createMapArray(data) {
    // Khởi tạo min và max
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    // Đầu tiên, lặp qua dữ liệu để xác định min và max
    data.forEach(item => {
        const polygon = item.polygon;
        polygon.forEach(point => {
            const x = point.x;
            const y = point.y;

            if (item.type === "stroke") {
                mapArray[y][x] = 1; // Stroke
                // Cập nhật xMin, xMax, yMin, yMax
                if (x < xMin) xMin = x;
                if (x > xMax) xMax = x;
                if (y < yMin) yMin = y;
                if (y > yMax) yMax = y;
            } else if (item.type === "unstroke") {
                mapArray[y][x] = 0; // Unstroke
            }
        });
    });

    // Đặt giá trị trong mapArray từ (xMin, yMin) đến (xMax, yMax) thành 0
    for (let y = yMin; y <= yMax; y++) {
        for (let x = xMin; x <= xMax; x++) {
            mapArray[y][x] = 0; // Đặt thành 0
        }
    }

    xMin = Infinity;
    xMax = -Infinity;
    yMin = Infinity;
    yMax = -Infinity;

    // Đầu tiên, lặp qua dữ liệu để xác định min và max
    strokeData.forEach(point => {
        const x = point.x;
        const y = point.y;

        mapArray[y][x] = 1; // Stroke
        // Cập nhật xMin, xMax, yMin, yMax
        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
    });

    // Đặt giá trị trong mapArray từ (xMin, yMin) đến (xMax, yMax) thành 0
    for (let y = yMin; y <= yMax; y++) {
        for (let x = xMin; x <= xMax; x++) {
            mapArray[y][x] = -1; // Đặt thành -1
        }
    }

    data.forEach(item => {
        const polygon = item.polygon;
        polygon.forEach(point => {
        const x = point.x;
        const y = point.y;
                if (item.type === "stroke") {
                    mapArray[y][x] = 1; // Stroke
                } else if (item.type === "unstroke") {
                    mapArray[y][x] = 0; // Unstroke
                }
            });
    });

    strokeData.forEach(point => {
        const x = point.x;
        const y = point.y;
        mapArray[y][x] = 1; // Stroke
    });
        
    // Đặt vị trí của robot
    mapArray[robot.y][robot.x] = 2;
}

// Hàm vẽ robot
function drawRobot(x, y, theta, width, height, directW, color) {
    const radians = theta * (Math.PI / 180); // Chuyển đổi độ sang radian
    const startX = x - width * Math.sin(radians); // Tọa độ X điểm bắt đầu
    const startY = y + width * Math.cos(radians); // Tọa độ Y điểm bắt đầu
    const endX = x + width * Math.sin(radians); // Tọa độ X điểm kết thúc
    const endY = y - width * Math.cos(radians); // Tọa độ Y điểm kết thúc
    const endDirectionX = x + (width + 10) * Math.sin(radians); // Tọa độ X hướng chiều
    const endDirectionY = y - (width + 10) * Math.cos(radians); // Tọa độ Y hướng chiều

    // Vẽ thân robot
    const bodyLine = new fabric.Line([startX, startY, endX, endY], {
        stroke: color,
        strokeWidth: height,
        selectable: false // Không cho phép chọn đối tượng này
    });
    canvas.add(bodyLine); // Thêm thân robot vào canvas

    // Vẽ hướng robot
    const directionLine = new fabric.Line([endX, endY, endDirectionX, endDirectionY], {
        stroke: color,
        strokeWidth: directW,
        selectable: false // Không cho phép chọn đối tượng này
    });
    canvas.add(directionLine); // Thêm hướng robot vào canvas
}

function renderMap() {
    // Xóa canvas trước khi vẽ lại
    canvas.clear();

    for (let y = 0; y < mapArray.length; y++) {
        let currentValue = mapArray[y][0];
        let startX = 0; // Vị trí bắt đầu của ô
        let count = 0; // Đếm số ô liên tiếp

        for (let x = 0; x < mapArray[y].length; x++) {
            const value = mapArray[y][x];

            if (value === currentValue) {
                count++; // Tăng số lượng ô liên tiếp
            } else {
                // Vẽ hình chữ nhật cho nhóm ô trước đó
                if (count > 0) {
                    const rect = new fabric.Rect({
                        left: startX,
                        top: y,
                        fill: getColor(currentValue),
                        width: count,
                        height: 1
                    });
                    rect.evented = false;
                    rect.selectable = false;
                    canvas.add(rect); // Thêm hình chữ nhật vào canvas
                }
                // Cập nhật giá trị và vị trí bắt đầu cho nhóm mới
                currentValue = value;
                startX = x;
                count = 1; // Reset đếm cho ô mới
            }
        }

        // Vẽ hình chữ nhật cho nhóm ô cuối cùng trong hàng
        if (count > 0) {
            const rect = new fabric.Rect({
                left: startX,
                top: y,
                fill: getColor(currentValue),
                width: count,
                height: 1
            });
            rect.evented = false;
            rect.selectable = false;
            canvas.add(rect); // Thêm hình chữ nhật vào canvas
        }
    }

    // Vẽ robot
    drawRobot(robot.x, robot.y, robot.theta, 15, 25, 4, "#00474F");

    // Tạo độ gốc của robot
    const originRect = new fabric.Rect({
        left: robot.x,
        top: robot.y,
        fill: "#ff0000",
        width: 1,
        height: 1
    });
    canvas.add(originRect); // Thêm hình chữ nhật gốc vào canvas
}

// Hàm để lấy màu tương ứng với giá trị
function getColor(value) {
    if (value === 1) {
        return "#000000"; // Màu đen cho giá trị 1
    } else if (value === 0) {
        return "#ffffff"; // Màu trắng cho giá trị 0
    } else {
        return "#CEEBE9"; // Màu khác cho các giá trị khác
    }
}

function initialize() {
    createMapArray(mapdata);
    renderMap();
}

initialize();

//======================
function createMaker(){
    try{
        document.getElementById('form flex').classList.remove('flex');
      }catch(e){}
      document.getElementById('maker-form').classList.add('flex');
      
}

function createPos(){
    try{
        document.getElementById('form flex').classList.remove('flex');
      }catch(e){}
      document.getElementById('pos-form').classList.add('flex');
      
}


// getMap('/maps/' + guid, initialize);

//khi vẽ 1 đường thì sẽ cập nhật vị trí của robot
//- gọi api update vị trí của robot trong map (origin_theta, origin_x, origin_y)
//- nhận thông tin map trả về nếu cập nhật thành công
//- cập nhật lại giao diện

let drawnPoints = [];
let isPaused = false; // Biến cờ để kiểm soát trạng thái
let isCancel = false; // Biến cờ để kiểm soát trạng thái
let currentIndex = 0; // Chỉ số hiện tại trong mảng drawnPoints


function brushToggle() {
    const ctx = canvas.getContext('2d');
    let snapshot,
    selectedTool = "brush",
    brushWidth = 1,
    selectedColor = "#000";

    ctx.fillStyle = selectedColor;

    // Mảng để lưu tọa độ
    // var drawnPoints = [];

    const startDraw = (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.lineWidth = brushWidth; 
        ctx.strokeStyle = "#000000"; 
        ctx.fillStyle = "#000000";
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    const drawing = (e) => {
        if(!isDrawing) return; 
        ctx.putImageData(snapshot, 0, 0); 
        ctx.strokeStyle = selectedTool === "eraser" ? "#ceebe9" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); 
        ctx.stroke(); 

        // Lưu tọa độ của điểm
        drawnPoints.push({ x: e.offsetX, y: e.offsetY })
    }

    // In ra tọa độ khi kết thúc vẽ
    const endDraw = () => {
        isDrawing = false;
        removeDuplicatePoints(drawnPoints);
        drawnPoints = invalidPoints(drawnPoints, mapArray);
        calculateAngles(drawnPoints);
        console.log("Tọa độ các điểm đã vẽ:", drawnPoints);
        // for (let i = currentIndex; i < drawnPoints.length; i++) {
        //     setTimeout(() => {
        //         if(isCancel) {
        //             return;
        //         }
        //         if (!isPaused) { // Kiểm tra xem có bị tạm dừng không
        //             robotMove(drawnPoints[i]); // Gọi hàm robotMove với điểm hiện tại
        //             currentIndex = i + 1; // Cập nhật chỉ số hiện tại
        //         }
        //     }, i * 1000); // Tính toán thời gian trễ cho từng điểm
        // }
        // drawnPoints = [];
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", endDraw);
}

// Hàm kiểm tra và loại bỏ các điểm trùng nhau
function removeDuplicatePoints(points) {
    return points.filter((point, index, self) =>
        index === self.findIndex((p) => p.x === point.x && p.y === point.y)
    );
}

function findShortestPath(mapArray, start, end) {
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;

    const directions = [
        [1, 0],  // xuống
        [-1, 0], // lên
        [0, 1],  // phải
        [0, -1]  // trái
    ];

    const queue = [[startX, startY]]; // Mảng chứa [x, y]
    const visited = new Set(); // Để theo dõi các điểm đã thăm
    const parent = {}; // Để theo dõi điểm trước đó
    visited.add(`${startX},${startY}`);
    
    while (queue.length > 0) {
        const [x, y] = queue.shift(); // Lấy điểm đầu tiên trong hàng đợi

        // Kiểm tra nếu đã đến đích
        if (x === endX && y === endY) {
            const path = [];
            let current = `${endX},${endY}`;
            
            // Xây dựng đường đi từ điểm đích về điểm bắt đầu
            while (current) {
                const [px, py] = current.split(',').map(Number);
                path.push({x: px, y: py});
                current = parent[current]; // Truy cập điểm trước đó
            }

            console.log(path)
            return path.reverse(); // Trả về đường đi từ bắt đầu đến đích
        }

        // Duyệt qua các hướng
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            console.log("path", newX, newY, mapArray[newY][newX])
            // Kiểm tra xem điểm mới có hợp lệ và chưa được thăm
            if (
                newX >= 0 && newX < mapArray[0].length && // Kiểm tra giới hạn x
                newY >= 0 && newY < mapArray.length && // Kiểm tra giới hạn y
                mapArray[newY][newX] == 0 && // Kiểm tra điểm hợp lệ
                !visited.has(`${newX},${newY}`) // Kiểm tra đã thăm chưa
            ) {
                visited.add(`${newX},${newY}`); // Đánh dấu là đã thăm
                parent[`${newX},${newY}`] = `${x},${y}`; // Ghi lại điểm trước đó
                queue.push([newX, newY]); // Thêm điểm mới vào hàng đợi
            }
        }
    }

    return []; // Trả về mảng rỗng nếu không tìm thấy đường đi
}

// Hàm kiểm tra và loại bỏ các điểm không hợp lệ (trùng với tường/ngoài khoảng tường)
function invalidPoints(points, mapArray) {
    var validPoints = []; // Mảng chứa các điểm hợp lệ

    for (let i = 0; i < points.length; i++) {
        const { x, y, theta } = points[i];
        
        console.log(y, x, mapArray[y][x])
        // Kiểm tra điểm hiện tại
        if (mapArray[y][x] == 0) {
            validPoints.push(points[i]); // Điểm hợp lệ
        } else if (mapArray[y][x] == 1 || mapArray[y][x] == -1){

            // Tìm điểm hợp lệ trước đó trong danh sách đường đi
            // Sau đó tìm điểm hợp lệ đầu tiên trong danh sách đường đi
            // Tìm quãng đường ngắn nhất nối 2 điểm trên
            var prevValidPoint;
            var nextValidPoint;
            
            // Tìm điểm hợp lệ trước đó 
            for (let j = i - 1; j >= 0; j--) {
                if (mapArray[points[j].y][points[j].x] == 0) {
                    prevValidPoint = points[j];
                    break;
                }
            }

            // Tìm điểm hợp lệ đầu tiên
            for (let k = i + 1; k < points.length; k++) {
                if (mapArray[points[k].y][points[k].x] == 0) {
                    nextValidPoint = points[k];
                    break; // Dừng vòng lặp khi đã tìm được điểm hợp lệ đầu tiên
                }
            }

            console.log("find", prevValidPoint, ",", nextValidPoint)
            // Tìm quãng đường ngắn nhất nối 2 điểm trên
            var res = findShortestPath(mapArray, prevValidPoint, nextValidPoint);

            validPoints = [...validPoints, ...res]
            console.log("res", res)
            console.log(validPoints)
        }
    }

    return validPoints; // Trả về mảng các điểm hợp lệ
}

// Hàm tính góc giữa các điểm và thêm thuộc tính theta
function calculateAngles(points) {
    for (let i = 0; i < points.length - 1; i++) {
        const x1 = points[i].x;
        const y1 = points[i].y;
        const x2 = points[i + 1].x;
        const y2 = points[i + 1].y;

        // Tính góc giữa hai điểm
        const angle = Math.atan2(x2 - x1, y2 - y1) * (180 / Math.PI); // Tính góc

        // Thêm thuộc tính theta mới cho điểm đầu và điểm kế tiếp
        points[i].theta = angle; // Thêm theta cho điểm đầu
        points[i + 1].theta = angle; // Thêm theta cho điểm kế tiếp
    }

    // Thêm theta cho điểm cuối nếu cần
    if (points.length > 0) {
        points[points.length - 1].theta = points[points.length - 2].theta; // Giả sử góc cuối giống góc trước đó
    }
}

// Cập nhật vị trí robot mà không cần vẽ lại toàn bộ canvas
function updateMoveUi(map) {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');

    // Xóa robot cũ (vẽ lại = màu trắng)
    drawRobot(ctx, robot.x, robot.y, robot.theta, 17, 27, 6, "#ffffff");

    // Cập nhật vị trí
    // robot.x = map.origin_x;
    // robot.y = map.origin_y;
    // robot.theta = map.origin_theta;

    // Cập nhật vị trí
    robot.x = map.x;
    robot.y = map.y;
    robot.theta = map.theta;

    console.log(robot);

    // Vẽ robot mới
    drawRobot(ctx, robot.x, robot.y, robot.theta, 15, 25, 4, "#00474F");
}

// Hàm để tạm dừng di chuyển
function pauseMove() {
    isPaused = true; // Đặt biến cờ thành true

    document.querySelector('.tools').innerHTML = `
    <ul class="map-options">
        <li>
            <button class="map-option tool" id="resume-move" onclick="resumeMove()">
                <img class="map-option-tool-img" src="/Mir/images/stop.svg" alt="Zoom in">
            </button>              
        </li>
        <li>
            <button class="map-option tool" id="cancel-move" onclick="cancelMove()">
                <img class="map-option-tool-img" src="/Mir/images/x.svg" alt="Zoom in">
            </button>              
        </li>
    </ul>
    `
}

// Hàm để tiếp tục di chuyển
function resumeMove() {
    isPaused = false; // Đặt biến cờ thành false

    document.querySelector('.tools').innerHTML = `
    <ul class="map-options">
        <li>
            <button class="map-option tool" id="pause-move" onclick="pauseMove()">
                <img class="map-option-tool-img" src="/Mir/images/start.svg" alt="Zoom in">
            </button>              
        </li>
    </ul>
    `

    robotMove(drawnPoints); // Bắt đầu lại di chuyển
}

function cancelMove() {
    isCancel = true;

    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');

    //xóa đường đi còn lại
    for (let i = currentIndex; i < drawnPoints.length; i++) {
        ctx.fillStyle = "#CEEBE9";
        ctx.fillRect(drawnPoints[i].x, drawnPoints[i].y, 1, 1); // Vẽ từng pixel
    }

    document.querySelector('.tools').innerHTML = `
    <ul class="map-options">
        <li>
            <button class="map-option tool" id="pause-move" onclick="pauseMove()">
                <img class="map-option-tool-img" src="/Mir/images/start.svg" alt="Zoom in">
            </button>              
        </li>
    </ul>
    `
}

function robotMove(pos) {
    console.log(pos)
    const body = {
        'origin_x': pos.x,
        'origin_y': pos.y,
        'origin_theta': pos.theta // Góc hướng của robot
    };

    updateMoveUi(pos);
    // putMap('/maps/' + guid, body, updateMoveUi);
}