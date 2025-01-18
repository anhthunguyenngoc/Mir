const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các nguồn
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Các phương thức cho phép
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Các tiêu đề cho phép

    if (req.method === 'OPTIONS') {
        res.writeHead(204); // Phản hồi cho yêu cầu OPTIONS
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Chuyển đổi Buffer thành chuỗi
        });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Success', data: body }));
        });
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});