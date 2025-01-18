let loggingUser = {
    ip: "<string>",
    expiration_time: "<dateTime>",
    user_id: "<string>",
    token: "<string>",
    login_time: "<dateTime>"
};

// Hàm mã hóa mật khẩu theo sha-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Hàm tạo authorization (ghép username và password sau khi encoded BASE64( <username>:SHA-256( <password> ) ))
async function setAuthorization(username, password) {
    const hashedPassword = await hashPassword(password);
    const authString = `${username}:${hashedPassword}`;
    const base64AuthString = btoa(authString); // Base64 encode
    return `Basic ${base64AuthString}`;
}

//get request
// var ip = loggingUser.ip;
// host = "https://jsonplaceholder.typicode.com/users";

var ip = '192.168.86.139';
host = 'http://' + ip + '/api/v2.0.0';
let authorization = setAuthorization("admin", "admin");

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Basic YWRtaW46OGM2OTc2ZTViNTQxMDQxNWJkZTkwOGJkNGRl1ZGZiMTY3YTljODczZmM0YmI4YTgxZjZmMmFiNDQ4YTkxOA==');
headers.append('Accept-Language', 'en_US');

async function postAPI(url, body, callback){
    fetch(host + url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(function(response) {
        if(response.status == '404'){
            return Promise.reject("Not found");
        }
        return response.json();
    })
    .then(callback)
    .catch(function(error) {
        console.log(error);
        return error;
    });
}

function putAPI(url, body, callback){
    fetch(host + url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(function(response) {
        if(response.status == '404'){
            return Promise.reject("Not found");
        }
        return response.json();
    })
    .then(callback)
    .catch(function(error) {
        console.log(error);
        return error;
    });
}

function getAPI(url, callback){
    fetch(host + url, {
        method: 'GET',
        headers: headers,
    })
    .then(function(response) {
        if(response.status == '404'){
            return Promise.reject("Not found");
        }
        return response.json();
    })
    .then(callback)
    .catch(function(error) {
        console.log(error);
        return error;
    });
}

function deleteAPI(url, callback){
    fetch(host + url +"/1", {
        method: 'DELETE',
        headers: headers,
    })
    .then(function(response) {
        if(response.status == '404'){
            return Promise.reject("Not found");
        }
        return response.json();
    })
    .then(callback)
    .catch(function(error) {
        console.log(error);
        return error;
    });
}

/*<GetMission_groups> array ========================================================================================================
Name                 Description                                                            Schema
guid    optional     The global id unique across robots that identifies this position       string
name    optional     The name of the position                                               string
url     optional     The URL of the resource                                                string

[
  {
    "url": "<string>",
    "guid": "<string>",
    "name": "<string>"
  }
]
*/
function getMissionGroupsAPI(){
    getAPI("/mission_groups", renderGetMissionGroups);
}

function renderGetMissionGroups(missionGroups){
    var listMissionGroups = document.getElementById("mission-groups-list");
    var htmls = missionGroups.map(function(missionGroup, index) {
        var name = missionGroup.username;
        var guid = missionGroup.id;
        return missionGroupListBtnHTML(name, guid, index);
    })
    listMissionGroups.innerHTML = htmls.join('');
}

function missionGroupListBtnHTML(name, guid, index){
    return `
        <option value="${name}">${name}</option>
    `;
}

/*<GetMissions> array: Retrieve the list of missions =====================================================================================
Name                 Description                                                            Schema
guid    optional     The global id unique across robots that identifies this mission        string
name    optional     The name of the mission                                                string
url     optional     The URL of the resource                                                string

[
  {
    "url": "<string>",
    "guid": "<string>",
    "name": "<string>"
  }
]
*/

function getMissionsAPI(){
    getAPI("/missions", renderGetMissions);
}

function renderGetMissions(missions){
    var listMissions = document.getElementById('mission-list');
    var htmls = missions.map(function(mission) {
        var name = mission.name;
        var guid = mission.id;
        return missionRowHTML(guid, name);
    })
    listMissions.innerHTML = htmls.join('');
}

/*<GetMission_queues> array: Retrieve the list of missions in the queue. Finished, failed, pending and executing missions will be
displayed here  ==========================================================================================================================
Name                 Description                                                Schema
id      optional     The id of the mission queue entry                          integer
state   optional     The end state after the mission was executed               string
url     optional     The URL of the resource string                             string

[
  {
    "url": "<string>",
    "id": "<integer>",
    "state": "<string>"
  }
]
*/

function getMissionQueuesAPI(){
    getAPI("/mission_queue", renderGetMissionQueues);
}

function renderGetMissionQueues(missionQueues){
    var listMissionQueues = document.getElementById('mission-queue-list');
    var htmls = missionQueues.map(function(missionQueue) {
        var name = missionQueue.name;
        var id = missionQueue.id;
        var state = missionQueue.state;
        return missionQueueHTML(name, id, state);
    })
    listMissionQueues.innerHTML = htmls.join('');
}


/*<GetMissions> array: Retrieve the list of missions  ====================================================================================
Name                 Description                                                            Schema
guid    optional     The global id unique across robots that identifies this mission        string
name    optional     The name of the mission                                                string
url     optional     The URL of the resource                                                string

[
  {
    "url": "<string>",
    "guid": "<string>",
    "name": "<string>"
  }
]
*/

function getMission(guid, groupId){
    getAPI("/missions/"+guid, function getGroupId(mission) {
        groupId = mission.name;
    });
}

/*GetGroup_action_definition: Retrieve the list of action definitions from the mission group with the specified mission group ID
{
  "help": "<string>",
  "mission_group_id": "<string>",
  "name": "<string>",
  "action_type": "<string>",
  "description": "<string>"
}
*/

function getMissionGroupActions(mission_group_id){
    getAPI("/mission_groups/"+mission_group_id+"/actions", function renderMissionGroupActions(missionGroupActions){  
        var missionGroup = document.getElementById(mission_group_id+"-actions-list");
        var htmls = missionGroupActions.map(function (missionGroupAction) {
            var name = missionGroupAction.name;
            var guid = missionGroupAction.id;
            return `
                <li class="flex row gap-5px nowrap pointer action-btn" onclick="postAction(${guid})">
                    <svg class="plus-btn-img" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 21.803 21.803" xml:space="preserve" fill="#000000" transform="matrix(-1, 0, 0, 1, 0, 0)">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                        <g id="SVGRepo_iconCarrier"> <g> <g> <path class="fill-color-btn" d="M18.374,16.605l-4.076-2.101l-1.107-1.773l-0.757-4.503l2.219,1.092l-0.375,1.494 c-0.13,0.519,0.185,1.041,0.699,1.17c0.077,0.021,0.157,0.03,0.235,0.03c0.432-0.002,0.823-0.293,0.935-0.729l0.565-2.25 c0.11-0.439-0.103-0.897-0.511-1.101c0,0-5.303-2.603-5.328-2.612c-0.406-0.188-0.868-0.267-1.342-0.198 c-0.625,0.088-1.158,0.407-1.528,0.86c-0.029,0.027-2.565,3.15-2.565,3.15l-1.95,0.525C2.974,9.8,2.67,10.327,2.809,10.843 c0.116,0.43,0.505,0.713,0.93,0.713c0.083,0,0.168-0.011,0.252-0.033l2.252-0.606c0.196-0.055,0.37-0.167,0.498-0.324L7.75,9.346 l0.725,4.026l-1.27,1.01c-0.379,0.304-0.541,0.802-0.411,1.269l1.469,5.271c0.148,0.532,0.633,0.881,1.16,0.881 c0.107,0,0.216-0.015,0.324-0.045c0.641-0.178,1.016-0.842,0.837-1.482L9.33,15.774l1.948-1.498l1.151,1.791 c0.115,0.186,0.277,0.334,0.471,0.436l4.371,2.25c0.177,0.092,0.363,0.135,0.552,0.135c0.438,0,0.856-0.238,1.072-0.653 C19.198,17.635,18.965,16.91,18.374,16.605z"/> <circle class="fill-color-btn" cx="8.602" cy="2.568" r="2.568"/> </g> </g> </g>
                    </svg>
                    ${name}
                </li>
            `;
        })
        missionGroup.innerHTML += htmls.join('<hr>');
        missionGroup.innerHTML += '<hr>';
    });
}

/*<GetGroup_missions> array: Retrieve the list of missions that belong to the group with the specified group ID

[
  {
    "url": "<string>",
    "guid": "<string>",
    "name": "<string>"
  }
]
*/

function getMissionGroupMissions(mission_group_id){
    getAPI("/mission_groups/"+mission_group_id+"/missions", function renderMissionGroupMissions(missionGroupMissions){  
        var missionGroup = document.getElementById(mission_group_id+"-actions-list");    
        var htmls = missionGroupMissions.map(function (missionGroupMission) {
            var name = missionGroupMission.name;
            return `
                <li class="flex row gap-5px nowrap pointer action-btn" onclick="postAction(${guid})">
                    <svg class="plus-btn-img" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="stroke-color-btn" d="M22.3 10.4V6.2L26.65 2L28.1 4.8L31 6.2L26.65 10.4H22.3ZM22.3 10.4L16.5 15.9999M31 16C31 23.7319 24.5081 30 16.5 30C8.49187 30 2 23.7319 2 16C2 8.26801 8.49187 2 16.5 2M23.75 16C23.75 19.866 20.504 23 16.5 23C12.4959 23 9.25 19.866 9.25 16C9.25 12.134 12.4959 9 16.5 9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${name}
                </li>
            `;
        })
        missionGroup.innerHTML += htmls.join('<hr>');
        missionGroup.innerHTML += '<hr>';
    });
}

/*<GetMaps> array: Retrieve the list of maps
displayed here  ==========================================================================================================================
Name                 Description                                                    Schema
guid      optional     The global id unique across robots that identifies this map  string
state   optional     The name of the map                                            string
url     optional     The URL of the resource string                                 string

[
  {
    "url": "<string>",
    "guid": "<string>",
    "name": "<string>"
  }
]
*/

function getMapsAPI(){
    getAPI("/maps", renderGetMaps);
}

function renderGetMaps(maps){
    var listMaps = document.getElementById('list-map');
    var htmls = maps.map(function(map) {
        var name = map.name;
        var id = map.id;
        var createdBy = map.createdBy;
        return mapHTML(name, id, createdBy);
    })
    listMaps.innerHTML = htmls.join('');
}

/*GetAction_definitions: Retrieve the details about the action. It displays the parameters of the action and the limits for the
values among others

/*PostMission_queues: Add a new mission to the mission queue. The mission will always go to the end of the queue =========================
Name                         Description                           Schema
message         optional     Max length: 200                       string
mission_id      required                                           string
parameters      optional                                           <object> array
priority        optional                                           integer (float)

Trả về: GetMission_queues
{
  "url": "<string>",
  "id": "<integer>",
  "state": "<string>"
}
*/

function postMissionQueues(guid){
    body = {
        'mission_id': guid
    }
    postAPI("/mission_queue", body, postMissionHTML);
}

function postMissionHTML(missionQueue) {
    var listMissionQueues = document.getElementById('mission-queue-list');
    listMissionQueues.innerHTML += missionQueueHTML('abc', missionQueue.id, missionQueue.state);
}

/*PostMissions: Add a new mission ========================================================================================================
Name                         Description                           Schema
created_by_id   optional                                           string
description     optional     Max length: 255                       string
group_id        required                                           string
guid            optional                                           string
hidden          optional                                           boolean
name            required     Min length: 1, Max length: 255        string
session_id      optional                                           string

Trả về: GetMissions
{
    "url": "<string>",
    "guid": "<string>",
    "name": "<string>"
}
*/

function postMission(){
    var name = document.getElementById('create-mission-name').value;
    var description = document.getElementById('create-mission-description').value;
    var groupName = document.getElementById('mission-groups-list').value;
    var groupId;
    getAPI("/mission_groups", function findMissionGroupId(missionGroups){
        var result = missionGroups.find(function(missionGroup) {
            return missionGroup.name == groupName;
        })
        
        window.open("/Mir/html/setup/missions/edit-mission.html", '_top');
        
        /*
        try{

            groupId = result.id;
            body = {
                'description': description,
                'group_id': groupId,
                'name': name

            }
            postAPI("/missions", body, function (){
                window.open("/Mir/html/setup/missions/edit-mission.html", '_top');
            });
        }
        catch (e){
            console.log(e)
        }
            */
    });
    
}

/*PostMission_actions: Add a new action to the mission with the specified mission ID
Name                        Description                         Schema
action_type     required    Min length: 1, Max length: 255      string
guid            optional                                        string
mission_id      required                                        string
parameters      required                                        < object > array
priority        required                                        integer (float)
scope_reference optional                                        string

Trả về: GetMission_actions
{
  "url": "<string>",
  "guid": "<string>",
  "action_type": "<string>",
  "priority": "<integer>",
  "mission_id": "<string>",
  "parameters": "<string>"
}
*/
function postAction(guid){
    body = {
        'action_type': guid,
        'mission_id': mission_id,
        'parameters': parameters,
        'priority': priority
    }
    postAPI("/mission_queue", body, postMissionHTML);
}

/*DeleteMission: Erase the mission with the specified GUID ===============================================================================
*/

function deleteMission(guid){
    deleteAPI("/missions/"+guid, function deleteMissionHTML(){
        document.getElementById('mission-'+guid).remove();
    });
}

/*DeleteMissionQueue :Abort the mission with the specified ID in the mission queue =======================================================
*/

function deleteMissionQueue(id){
    deleteAPI("/mission_queue/"+id, function deleteMissionQueueHTML(){
        document.getElementById('mission-queue-'+id).remove();
    });
}

/*PutMission: Modify the values of the mission with the specified GUID ===================================================================
Name                        Description                           Schema
description    optional     Max length: 255                       string
group_id       optional                                           string
hidden         optional                                           boolean
name           optional     Min length: 1, Max length: 255        string
session_id     optional                                           string
*/

/*PutMap: Modify the values of the map with the specified GUID ==================================================

*/
function putMap(url, body, callback) {
    putAPI(url, body, callback);
}

/*GetMap


*/
function getMap(url, callback) {
    getAPI(url, callback);
}


function getMaps(url, callback) {
    getAPI(url, callback);
}

