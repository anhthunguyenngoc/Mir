  const url = new Map();
  url.set('dashboard', '/Mir/html/dashboards/dashboard.html');

  url.set('mission', '/Mir/html/setup/missions/mission.html');
  url.set('edit-mission', '/Mir/html/setup/missions/edit-mission.html');
  url.set('create-mission', '/Mir/html/setup/missions/create-mission.html');

  url.set('io-module', '/Mir/html/setup/io-modules/io-module.html');
  url.set('edit-io-module', '/Mir/html/setup/io-modules/edit-io-module.html');
  url.set('create-io-module', '/Mir/html/setup/io-modules/create-io-module.html');

  url.set('map', '/Mir/html/setup/maps/map.html');
  url.set('edit-map', '/Mir/html/setup/maps/edit-map.html');
  url.set('create-map', '/Mir/html/setup/maps/create-map.html');

  url.set('sound', '/Mir/html/setup/sounds/sound.html');
  url.set('edit-sound', '/Mir/html/setup/sounds/edit-sound.html');
  url.set('transition', '/Mir/html/setup/transitions/transition.html');

  url.set('edit-transition', '/Mir/html/setup/transitions/edit-transition.html');
  url.set('create-transition', '/Mir/html/setup/transitions/create-transition.html');
  url.set('delete-transition', '/Mir/html/setup/transitions/delete-transition.html');

  url.set('user-group', '/Mir/html/setup/user-groups/user-group.html');
  url.set('edit-user-group', '/Mir/html/setup/user-groups/edit-user-group.html');
  url.set('create-user-group', '/Mir/html/setup/user-groups/create-user-group.html');
  url.set('delete-user-group', '/Mir/html/setup/user-groups/delete-user-group.html');
  url.set('set-permission', '/Mir/html/setup/user-groups/set-permission.html');

  url.set('user', '/Mir/html/setup/users/user.html');
  url.set('edit-user', '/Mir/html/setup/users/edit-user.html');
  url.set('create-user', '/Mir/html/setup/users/create-user.html');
  url.set('delete-user', '/Mir/html/setup/users/delete-user.html');
  
  url.set('analytic', '/Mir/html/monitoring/analytics/analytic.html');
  url.set('mission-log', '/Mir/html/monitoring/mission-log/mission-log.html');
  url.set('system-log', '/Mir/html/monitoring/system-log/system-log.html');
  url.set('error-log', '/Mir/html/monitoring/error-logs/error-log.html');
  url.set('safety-system', '/Mir/html/monitoring/safety-system/safety-system.html');
  url.set('hardware-health', '/Mir/html/monitoring/hardware-health/hardware-health.html');

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