function start(){
    getMissionGroupsAPI();

    loadMissionGroupActionAndMissions();

    document.getElementById('mission').classList.add('selected');
}

start();

function missionGroupListBtnHTML(name, guid, index){
    return `
        <li>
            <div class="flex row gap-5px nowrap pointer mission-group-btn" onclick="toggleHidden('${guid}-actions-list')">
                <img class="plus-btn-img" alt="${name}" src="/Mir/images/mission-group-${index}.svg" loading="lazy"/>
                ${name}
            </div>
            <ul class="flex col absolute-pos action-list hidden" id="${guid}-actions-list">
            </ul>
        </li>
    `;
}

function loadMissionGroupActionAndMissions(){
    getAPI("/mission_groups", function(missionGroups) {
        missionGroups.map(function(missionGroup){
            getMissionGroupActions(missionGroup.id);
            getMissionGroupMissions(missionGroup.id);
        })
    });
}



