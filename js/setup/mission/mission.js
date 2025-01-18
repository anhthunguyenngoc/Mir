function start(){
    getMissionGroupsAPI();

    getMissionsAPI();

    getMissionQueuesAPI();

    document.getElementById('mission').classList.add('selected');
}

start();

function missionRowHTML(guid, name){
    return `
        <li class="mission" id="mission-${guid}">
            <div class="mission-icon">
            <svg width="25" height="24" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="stroke-color-btn" d="M22.3 10.4V6.2L26.65 2L28.1 4.8L31 6.2L26.65 10.4H22.3ZM22.3 10.4L16.5 15.9999M31 16C31 23.7319 24.5081 30 16.5 30C8.49187 30 2 23.7319 2 16C2 8.26801 8.49187 2 16.5 2M23.75 16C23.75 19.866 20.504 23 16.5 23C12.4959 23 9.25 19.866 9.25 16C9.25 12.134 12.4959 9 16.5 9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
            <div class="mission-content">
            <div class="mission-info">
                <div id="mission-name">${name}</div>
                <div id="mission-group">Back and forth</div>
            </div>
            <div class="row-5px">              
                <button onclick="editMissionClick()">
                    <img class="plus-btn-img" alt="Edit mission" src="/Mir/images/edit.svg" loading="lazy"/>                     
                </button>       

                <button class="del-btn" onclick="deleteMission(${guid})">
                    <img class="plus-btn-img" alt="Create mission" src="/Mir/images/x.svg" loading="lazy"/>
                </button>

                <button onclick="postMissionQueues(${guid})">
                    <img class="plus-btn-img" alt="Create mission" src="/Mir/images/queue-add.svg" loading="lazy"/>
                </button>
            </div>
            </div>
        </li>
        `;
}

function missionQueueHTML(name, id, state){
    return `
        <li class="full-width flex row align-center border" id="mission-queue-${id}">
            <div class="flex row align-center padding-7px mission-queue-icon">
            <svg class="plus-btn-img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path d="M16.1924 5.65683C16.5829 5.2663 16.5829 4.63314 16.1924 4.24261L13.364 1.41419C12.5829 0.633139 11.3166 0.633137 10.5355 1.41419L7.70711 4.24261C7.31658 4.63314 7.31658 5.2663 7.70711 5.65683C8.09763 6.04735 8.73079 6.04735 9.12132 5.65683L11 3.77812V11.0503H3.72784L5.60655 9.17157C5.99707 8.78104 5.99707 8.14788 5.60655 7.75735C5.21602 7.36683 4.58286 7.36683 4.19234 7.75735L1.36391 10.5858C0.582863 11.3668 0.582859 12.6332 1.36391 13.4142L4.19234 16.2426C4.58286 16.6332 5.21603 16.6332 5.60655 16.2426C5.99707 15.8521 5.99707 15.219 5.60655 14.8284L3.8284 13.0503H11V20.2219L9.12132 18.3432C8.73079 17.9526 8.09763 17.9526 7.7071 18.3432C7.31658 18.7337 7.31658 19.3669 7.7071 19.7574L10.5355 22.5858C11.3166 23.3669 12.5829 23.3669 13.364 22.5858L16.1924 19.7574C16.5829 19.3669 16.5829 18.7337 16.1924 18.3432C15.8019 17.9526 15.1687 17.9526 14.7782 18.3432L13 20.1213V13.0503H20.071L18.2929 14.8284C17.9024 15.219 17.9024 15.8521 18.2929 16.2426C18.6834 16.6332 19.3166 16.6332 19.7071 16.2426L22.5355 13.4142C23.3166 12.6332 23.3166 11.3668 22.5355 10.5858L19.7071 7.75735C19.3166 7.36683 18.6834 7.36683 18.2929 7.75735C17.9024 8.14788 17.9024 8.78104 18.2929 9.17157L20.1716 11.0503H13V3.87867L14.7782 5.65683C15.1687 6.04735 15.8019 6.04735 16.1924 5.65683Z"/> </g>
            </svg>
            </div>
            <div class="full-width flex row align-center padding-7px">
            <div class="full-width flex col">
                <div id="mission-queue-title">${name}</div>
            </div>
            <div class="row-5px">
                <div>
                ${state}
                </div>         
                <button class="del-btn" id="del-mission-queue" onclick="deleteMissionQueue(${id})">
                <img class="plus-btn-img" alt="Delete mission from queue" src="/Mir/images/x.svg" loading="lazy"/>
                </button>
            </div>
            </div>
        </li>
    `
}

function createMissionClick(){
    openWindow(getURLForItemID("create-mission"));
}

function editMissionClick(){
    openWindow(getURLForItemID("edit-mission"));
}