const projectsAPI = 'https://grading-tool-api.herokuapp.com/api/projects';
fetch(projectsAPI)
  .then(response => response.json())
  .then(data => console.log(data));

const appData = {
    defaulttd: 'fewd',
    favtd: '',
    techdegrees: [
        {shortName: 'fewd', fullName: 'Frontend Web Development', color: '#5FCF80'},
        {shortName: 'fsjs', fullName: 'Full Stack JavaScript', color: '#3289F5'},
        {shortName: 'wd', fullName: 'Web Development', color: '#00AB9E'},
        {shortName: 'python', fullName: 'Python Data', color: '#009AC4'},
        {shortName: 'dataanalysis', fullName: 'Data Analysis', color: '#D5609A'},
        {shortName: 'ux', fullName: 'UX', color: '#9080FF'},
    ]
}

const leftPanel = {
    // left panel header
    handleDropdown: () => {
        const header = document.getElementById('left-panel-header');
        const dropdown = document.getElementById('left-panel-dropdown');
        const arrow = document.getElementById('header-dropdown-carret');
        header.addEventListener('click', () => {
            dropdown.classList.toggle('show');
            arrow.classList.toggle('rotate');
        });
    },
    // left panel project list
    handleProjectSelection: () => {
        const projectList = document.getElementById('project-list');
        projectList.addEventListener('click', () => {
            let projects = projectList.querySelectorAll('li');
            projects.forEach((project => {
                project.addEventListener('click', () => {
                    for (let i = 0; i < projects.length; i++) {
                        projects[i].classList.remove('active')
                    }
                    project.classList.add('active');
                });
            }))
        })
    },
    // left panel event listeners (above methods)
    build: () => {

    },
    events:() => {
        leftPanel.handleDropdown();
        leftPanel.handleProjectSelection();
    }
}

const middle = {
    events: () => {

    }
}


const rightPanel = {
    events: () => {

    }
}

const ls = { 
    checkAndSet: () => {
        if (localStorage.favtd) {
            appData.favtd = localStorage.getItem('favtd');
        } else {
            localStorage.setItem('favtd', appData.defaulttd);
            appData.favtd = localStorage.getItem('favtd');;
        }
        const currenttd = localStorage.getItem('favtd');
        const tdLogo = document.getElementById('td-logo');
        tdLogo.src = `./frontend/dist/images/${currenttd}.png`;
        appData.techdegrees.forEach(td => {
            if (td.shortName === currenttd) {
                document.body.style.setProperty('--accent', td.color)
            }
        })
    }
 }
// application object
const application = {
    runEventListeners: () => {
        leftPanel.events();
        middle.events();
        rightPanel.events();
    },
    handleLocalStorage: () => {
        ls.checkAndSet();
    },
    build: () => {
        
    }
}


application.runEventListeners();
application.handleLocalStorage();
