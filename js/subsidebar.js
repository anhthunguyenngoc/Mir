  const url = new Map();
  url.set('dashboard', '../../../html/dashboards/default-dashboard/dashboard.html');

  url.set('mission', '../../../html/setup/missions/mission.html');
  url.set('edit-mission', '../../../html/setup/missions/edit-mission.html');
  url.set('create-mission', '../../../html/setup/missions/create-mission.html');

  url.set('io-module', '../../../html/setup/io-modules/io-module.html');
  url.set('edit-io-module', '../../../html/setup/io-modules/edit-io-module.html');
  url.set('create-io-module', '../../../html/setup/io-modules/create-io-module.html');

  url.set('map', '../../../html/setup/maps/map.html');
  url.set('edit-map', '../../../html/setup/maps/edit-map.html');
  url.set('create-map', '../../../html/setup/maps/create-map.html');

  url.set('sound', '../../../html/setup/sounds/sound.html');
  url.set('edit-sound', '../../../html/setup/sounds/edit-sound.html');
  url.set('transition', '../../../html/setup/transitions/transition.html');

  url.set('edit-transition', '../../../html/setup/transitions/edit-transition.html');
  url.set('create-transition', '../../../html/setup/transitions/create-transition.html');
  url.set('delete-transition', '../../../html/setup/transitions/delete-transition.html');

  url.set('user-group', '../../../html/setup/user-groups/user-group.html');
  url.set('edit-user-group', '../../../html/setup/user-groups/edit-user-group.html');
  url.set('create-user-group', '../../../html/setup/user-groups/create-user-group.html');
  url.set('delete-user-group', '../../../html/setup/user-groups/delete-user-group.html');
  url.set('set-permission', '../../../html/setup/user-groups/set-permission.html');

  url.set('user', '../../../html/setup/users/user.html');
  url.set('edit-user', '../../../html/setup/users/edit-user.html');
  url.set('create-user', '../../../html/setup/users/create-user.html');
  url.set('delete-user', '../../../html/setup/users/delete-user.html');
  
  url.set('analytic', '../../../html/monitoring/analytics/analytic.html');
  url.set('mission-log', '../../../html/monitoring/mission-log/mission-log.html');
  url.set('system-log', '../../../html/monitoring/system-log/system-log.html');
  url.set('error-log', '../../../html/monitoring/error-logs/error-log.html');
  url.set('safety-system', '../../../html/monitoring/safety-system/safety-system.html');
  url.set('hardware-health', '../../../html/monitoring/hardware-health/hardware-health.html');

  function getURLForItemID(itemID) {
    return url.get(itemID);
  }
  
  var subsidebarBtns = document.querySelectorAll('.subsidebar-button');
  subsidebarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".subsidebar-button.selected").classList.remove(".selected");
      btn.classList.add("selected");
    });
  });

  function subSidebarHTML(title, btnArr, btnClick, btnId) {
    return `
          <!-- Tiêu đề của subtitle -->
          <li class="subsidebar-title">
              <h2>${title}</h2>
          </li>

          <!-- Danh sách các subtitle button -->
          `+
          addButton(btnArr, btnClick, btnId)
    ;

  }

  function addButton(btnArr, btnId){
    let html = ``;
    for(let i=0; i<btnArr.length; i++){
        html += `
        <li id="${btnId[i]}" class="subsidebar-button">
            ${btnArr[i]}
        </li>
        `
    }
    return html;
  }

  function loadSubsidebar(title, btnArr, btnClick, btnId){
    document.getElementById("left-subsidebar-list").innerHTML = subSidebarHTML(title, btnArr, btnClick, btnId);

    document.querySelectorAll('.subsidebar-button').forEach(function(subsidebarBtn) {  
      subsidebarBtn.addEventListener('click', function(){
          id = subsidebarBtn.id;
          openWindow(getURLForItemID(id));
      });
    })  
  }
  
  document.querySelectorAll('.href-btn').forEach(function(hrefBtn){
    hrefBtn.addEventListener('click', function() {
      openWindow(getURLForItemID(hrefBtn.id));
    })
  })

  function loadDashboardSubsidebar(){
    loadSubsidebar("Dashboards", ['Default Dashboard'], ['dashboard']);
  }
  
  function loadSetupSubsidebar(){
    loadSubsidebar("Setup", ['Missions', 'Maps', 'Sounds', 'Transitions', 'I/O modules', 'Users', 'User groups', 'Paths', 'Path guides'],
       ['mission', 'map', 'sound', 'transition', 'io-module', 'user', 'user-group', 'path', 'path-guide']
     );
  }

  function loadMonitoringSubsidebar(){
    loadSubsidebar("Monitoring", 
      ['Analytics', 'System log', 'Error logs', 'Hardware health', 'Safety system', 'Mission log'],
       ['analytic', 'system-log', 'error-log', 'hardware-health', 'safety-system', 'mission-log']
     );
  }

  function loadSystemSubsidebar(){
    loadSubsidebar("System", ['Missions', 'Maps', 'Sounds', 'Transitions', 'I/O modules', 'Users', 'User groups', 'Paths', 'Path guides'],
       ['mission', 'map', 'sound', 'transition', 'io-module', 'user', 'user-group', 'path', 'path-guide']
     );
  }
  
  function loadHelpSubsidebar(){
    loadSubsidebar("Help", ['Missions', 'Maps', 'Sounds', 'Transitions', 'I/O modules', 'Users', 'User groups', 'Paths', 'Path guides'],
       ['mission', 'map', 'sound', 'transition', 'io-module', 'user', 'user-group', 'path', 'path-guide']
     );
  }