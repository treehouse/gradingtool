const projectsAPI="https://grading-tool-api.herokuapp.com/api/projects";fetch(projectsAPI).then((e=>e.json())).then((e=>console.log(e)));const appData={defaulttd:"fewd",favtd:"",techdegrees:[{shortName:"fewd",fullName:"Frontend Web Development",color:"#5FCF80"},{shortName:"fsjs",fullName:"Full Stack JavaScript",color:"#3289F5"},{shortName:"wd",fullName:"Web Development",color:"#00AB9E"},{shortName:"python",fullName:"Python Data",color:"#009AC4"},{shortName:"dataanalysis",fullName:"Data Analysis",color:"#D5609A"},{shortName:"ux",fullName:"UX",color:"#9080FF"}]},leftPanel={handleDropdown:()=>{const e=document.getElementById("left-panel-header"),t=document.getElementById("left-panel-dropdown"),a=document.getElementById("header-dropdown-carret");e.addEventListener("click",(()=>{t.classList.toggle("show"),a.classList.toggle("rotate")}))},handleProjectSelection:()=>{const e=document.getElementById("project-list");e.addEventListener("click",(()=>{let t=e.querySelectorAll("li");t.forEach((e=>{e.addEventListener("click",(()=>{for(let e=0;e<t.length;e++)t[e].classList.remove("active");e.classList.add("active")}))}))}))},build:()=>{},events:()=>{leftPanel.handleDropdown(),leftPanel.handleProjectSelection()}},middle={events:()=>{}},rightPanel={events:()=>{}},ls={checkAndSet:()=>{localStorage.favtd||localStorage.setItem("favtd",appData.defaulttd),appData.favtd=localStorage.getItem("favtd");const e=localStorage.getItem("favtd");document.getElementById("td-logo").src=`./frontend/dist/images/${e}.png`,appData.techdegrees.forEach((t=>{t.shortName===e&&document.body.style.setProperty("--accent",t.color)}))}},application={runEventListeners:()=>{leftPanel.events(),middle.events(),rightPanel.events()},handleLocalStorage:()=>{ls.checkAndSet()},build:()=>{}};application.runEventListeners(),application.handleLocalStorage();