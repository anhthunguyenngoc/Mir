let guid = 'www'

function start(){
    getMapsAPI();
}

// start();

function mapHTML(name, id, createdBy){
    return `
    <tr id="map-${id}">
        <td class="col-1 text-align-center" style="width: 5%" id="map-table-icon">
            <svg class="fill-color-btn stroke-color-btn plus-btn-img" width="64px" height="64px" viewBox="0 -32 576 576" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>            
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>  
            <g id="SVGRepo_iconCarrier"> 
            <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"/>                   
            </g>
            </svg>                    
        </td>
        <td class="col-2" id="map-table-name">${name}</td>
        <td class="col-3" id="map-table-mapname">Username</td>
        <td class="col-n" id="map-table-functions">
            <div class="row-5px">
                <button id="edit-map">
                    <img class="plus-btn-img" alt="Edit mission" src="../../images/edit.svg" loading="lazy"/>                     
                </button>
                <button class="del-btn" id="del-map">
                    <img class="plus-btn-img" alt="Create map groups" src="../../images/x.svg" loading="lazy"/>
                </button>
            </div>
        </td>
    </tr>
    `;
}

try {
    document.getElementById('map').classList.add('selected');
} catch (error) { 
}

function createMapClick(){
    window.open("../../html/setup/maps/create-map.html", '_top');
}

function editMapClick(){
    window.open("../../html/setup/maps/edit-map.html", '_top');
}