  function loadSidebar(){
    document.getElementById("left-sidebar-list").innerHTML = sidebarHTML();
  }

  loadSidebar();

  function sidebarHTML() {
    return  `
      <li id="back-forward" class="back-forward-button">
          <img class="sidebar-btn-img" alt="Dashboards" src="/Mir/images/back-forward.svg" loading="lazy"/>
      </li>
      <li id="dashboards" class="sidebar-button" onClick ="loadDashboardSubsidebar()">
          <img class="sidebar-btn-img" alt="Dashboards" src="/Mir/images/dashboard.svg" loading="lazy"/>
          Dashboards
      </li>
      <li id="setup" class="sidebar-button" onClick ="loadSetupSubsidebar()">
          <img class="sidebar-btn-img" alt="Setup" src="/Mir/images/setup.svg" loading="lazy"/>
          Setup
      </li>               
      <li id="monitoring" class="sidebar-button" onClick ="loadMonitoringSubsidebar()">
          <img class="sidebar-btn-img" alt="Monitoring" src="/Mir/images/monitoring.svg" loading="lazy"/>
          Monitoring
      </li>
      <li id="system" class="sidebar-button" onClick ="loadSystemSubsidebar()">
          <img class="sidebar-btn-img" alt="System" src="/Mir/images/setting.svg" loading="lazy"/>
          System
      </li>
      <li id="help" class="sidebar-button" onClick ="loadHelpSubsidebar()">
          <img class="sidebar-btn-img" alt="Help" src="/Mir/images/help-circle.svg" loading="lazy"/>
          Help
      </li>
      <li id="signout" class="sidebar-button" onClick ="signoutClick()">
          <img class="sidebar-btn-img" alt="Sign out" src="/Mir/images/signout.svg" loading="lazy"/>
          Sign out
      </li>
  `;
  }

  function signoutClick(){
    deleteAPI('/users/auth', signOut);
  }

  function signOut(){
    window.open("/Mir/html/logins/login-by-pass.html", '_top');
  }
  
  function toggleHidden(elementId){
    var element = document.getElementById(elementId)
    if(element.classList.contains('hidden'))
      element.classList.remove('hidden');
    else {
        element.classList.add('hidden');
    }
  }

  function confirmDelete(str){
    var overlay = document.createElement('div');
    overlay.id = 'overlay';

    var confirmWindow = document.createElement('div');
    confirmWindow.id = 'confirmWindow';
    confirmWindow.innerHTML = `
      <div id="confirm-container" class="flex col width-30per radius-5px section-background-color">
        <div class="full-width flex row justify-right error-background-color padding-1025px">  
          <img class="img-35px pointer" onclick="closeConfirmWindow()" alt="Close" src="/Mir/images/x.svg" loading="lazy"/>
        </div>
        <div class="flex col padding-15px gap-15px">
          <div class="full-width flex row align-center justify-center gap-frame">             
            <svg class="img-60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="fill-error" d="M21.76 15.92L15.36 4.4C14.5 2.85 13.31 2 12 2C10.69 2 9.49998 2.85 8.63998 4.4L2.23998 15.92C1.42998 17.39 1.33998 18.8 1.98998 19.91C2.63998 21.02 3.91998 21.63 5.59998 21.63H18.4C20.08 21.63 21.36 21.02 22.01 19.91C22.66 18.8 22.57 17.38 21.76 15.92ZM11.25 9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9V14C12.75 14.41 12.41 14.75 12 14.75C11.59 14.75 11.25 14.41 11.25 14V9ZM12.71 17.71C12.66 17.75 12.61 17.79 12.56 17.83C12.5 17.87 12.44 17.9 12.38 17.92C12.32 17.95 12.26 17.97 12.19 17.98C12.13 17.99 12.06 18 12 18C11.94 18 11.87 17.99 11.8 17.98C11.74 17.97 11.68 17.95 11.62 17.92C11.56 17.9 11.5 17.87 11.44 17.83C11.39 17.79 11.34 17.75 11.29 17.71C11.11 17.52 11 17.26 11 17C11 16.74 11.11 16.48 11.29 16.29C11.34 16.25 11.39 16.21 11.44 16.17C11.5 16.13 11.56 16.1 11.62 16.08C11.68 16.05 11.74 16.03 11.8 16.02C11.93 15.99 12.07 15.99 12.19 16.02C12.26 16.03 12.32 16.05 12.38 16.08C12.44 16.1 12.5 16.13 12.56 16.17C12.61 16.21 12.66 16.25 12.71 16.29C12.89 16.48 13 16.74 13 17C13 17.26 12.89 17.52 12.71 17.71Z"/>
            </svg>                
            <div class="flex col align-center padding-15px gap-15px">
              <h3>Delete ${str}</h3>
              <p>You are about to delete the ${str}.</p>
            </div>
          </div>
              
          <div class="flex row justify-center gap-frame">
            <button class="del-btn padding-1025px"">Delete</button>
            <button class="outline-btn padding-1025px" onclick="closeConfirmWindow()">Cancel</button>        
          </div>
        </div>
      </div>
    `
    document.body.appendChild(overlay);
    document.body.appendChild(confirmWindow);
  }

  function closeConfirmWindow(){
    var overlay = document.getElementById('overlay');
    var confirmWindow = document.getElementById('confirmWindow');
    document.body.removeChild(overlay);
    document.body.removeChild(confirmWindow);
  }

  function goBack(){
    history.back();
  }

  function openWindow(url){
    window.open(url, '_self');
  }
