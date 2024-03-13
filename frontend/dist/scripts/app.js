// TEMPORARY - NEEDS API CONNECTION
const imgs = [
    './frontend/dist/images/fewd.png',
    './frontend/dist/images/fsjs.png',
    './frontend/dist/images/wd.png',
    './frontend/dist/images/python.png',
    './frontend/dist/images/dataanalysis.png',
    './frontend/dist/images/ux.png',
];


/**
 * loader logic
 *
 * This is the logic behind how the loader looks and appears.
 * Looping over all iterations of <div class="loader"></div> in the
 * markup and adding attributes, loader text, and number of dots in
 * each iteration of the loader.
 *
 * loader color comes from current value of var(--td-accent) css variable
 *
 * loader needs to be initialized in scss with @mixin loader($dot-size,$font-size)
 * in its respective container.
 *
 */

const loaderDots = 3;
const loaders = document.querySelectorAll('.loader');
loaders.forEach((loader => {
    loader.parentNode.style.position = 'relative';
    loader.setAttribute('data-loader', '');
    let p = document.createElement('p');
    p.textContent = 'loading..';
    loader.appendChild(p);
    for (i = 0; i < loaderDots; i ++) {
        let span = document.createElement('span');
        loader.appendChild(span);
    }
}));




/**
 *
 * Project files
 *
 */
const carousel = document.querySelector('[data-carousel]');
const projectFilesContainer = document.querySelector('.project-files-container');
projectFilesContainer.addEventListener('click', e => {
    if (e.target.classList.contains('mockup-type') || e.target.parentNode.classList.contains('mockup-type')) {
        toggleCarousel();
    }
});

carousel.addEventListener('click', e => {
    if (e.target.classList.contains('overlay_projectFiles')) {
        toggleCarousel();
    }
})

function toggleCarousel() {
    carousel.classList.toggle('show');
}






/**
 *
 * handle light/dark theme for tool
 *
 * First checks for if defaultToolTheme exists in localStorage and if
 * not, adds it and sets it to 'light'. When a user makes a theme
 * selection, the new selection is then set as the 'defaultToolTheme' in
 * localStorage.
 *
 */

if (!localStorage.defaultToolTheme) {
    localStorage.setItem('defaultToolTheme', 'light');
} else {
    document.body.classList = localStorage.getItem('defaultToolTheme');
}

const tdName = document.querySelectorAll('[data-td-name]');
tdName.forEach(name => {
    name.textContent = 'Choose a Techdegree'
});
const lightTheme = document.getElementById('light');
const darkTheme = document.getElementById('dark');
lightTheme.addEventListener('click', () => {
    document.body.classList = 'light';
    localStorage.setItem('defaultToolTheme', 'light');
});
darkTheme.addEventListener('click', () => {
    document.body.classList = 'dark';
    localStorage.setItem('defaultToolTheme', 'dark');
});





/**
 * Populating left panel with data from API
 * 1. Techdegree Header
 * 2. Techdegree List (dropdown)
 */

// variables
const techdegreePanel = document.getElementById('techdegreePanel');
const techdegreeHeader = document.getElementById('techdegreeHeader');
const techdegreeDropdown = document.getElementById('techdegreeDropdown');
const dropdownLoader = techdegreeDropdown.querySelector('.loader');
const panelToggle = document.querySelectorAll('[data-panel-toggle]');
let isPanelHidden = false;

panelToggle.forEach(toggle => {
    toggle.addEventListener('click', () => {
        togglePanel();
    })
});

function togglePanel() {
    if (!isPanelHidden) {
        isPanelHidden = true;
    } else {
        isPanelHidden = false;
    }
    const toggleList = document.querySelectorAll('[data-toggle]');

    techdegreePanel.classList.toggle('hide');

    toggleList.forEach(item => {
        item.classList.toggle('active');
    });
}

// panelToggle.addEventListener('click', () => {
//     techdegreePanel.classList.toggle('show');
//     panelToggle.querySelector('i').classList.toggle('rotate');
// })

/*  initially, the dropdown is hidden (closed) so calling this function
    on page-load gives a subtle animation of the dropdown opening */
toggleDropdown();

let TDS_QUERY = encodeURIComponent('*[_type == "techdegree"]');

let TDS_URL = `https://supw1mz3.api.sanity.io/v2021-10-21/data/query/production?query=${TDS_QUERY}`;

fetch(TDS_URL)
    .then(response => response.json())
    .then(data => loadTechdegrees(data.result));

// ** event listeners **

techdegreeDropdown.addEventListener('click', e => {
    let tds = document.querySelectorAll('[data-dropdown-td-name]');
    tds.forEach(td => {
        if (e.target == td) {
            let span = td.querySelector('span');
            let id = span.getAttribute('data-td-list-item-id');
            if (document.querySelector('.td-project-list .loader')) {
                document.querySelector('.td-project-list .loader').style.display = 'block';
            }
            loadProjectList(id);
            hideViews();
            document.querySelector('[data-project-name]').textContent = '';
        }
    })
})

function toggleDropdown() {
    if (techdegreeDropdown.hasAttribute('active')) {
        techdegreeDropdown.removeAttribute('active');
        techdegreeDropdown.style.animation = 'bounceOutUp 1s ease-in-out forwards'
        setTimeout(() => {
            techdegreeDropdown.style.display = 'none';
        }, 600)
    } else {
        techdegreeDropdown.setAttribute('active', '');
        techdegreeDropdown.style.display = 'block';
        techdegreeDropdown.style.animation = 'bounceInDown 1s ease-out forwards'
    }
}

function loadTechdegrees(data) {
    dropdownLoader.style.display = 'none';
    const ul = document.createElement('ul');
    document.getElementById('techdegreeDropdown').appendChild(ul);
    data.forEach(td => {
        let li = document.createElement('li');
        li.setAttribute('data-dropdown-td-name', '');
        let span = document.createElement('span');
        span.setAttribute('data-td-list-item-id', td._id);
        span.textContent = td.name;
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-star';
        li.appendChild(span);
        li.appendChild(icon);
        ul.appendChild(li);
    })
}

function loadProjectList(id) {
    const projList = document.getElementById('tdProjectList');

    let PROJECTS_QUERY = encodeURIComponent(`
    *[_type == "techdegree" && _id == "${id}"]{
        _id,
        color,
        name,
        "projects": *[_type == "project" && references(^._id)] | order(projectNumber){
            title,
            _id
        },
        resources[]->{
            title,
            description,
            link
        }
    }[0]
    `);
    let PROJECTS_URL = `https://supw1mz3.api.sanity.io/v2021-10-21/data/query/production?query=${PROJECTS_QUERY}`
    fetch(PROJECTS_URL)
    .then(response => response.json())
    .then(data => {
        populate(data.result, id)
    })

    function populate(data, id) {
        if (document.querySelector('.td-project-list .loader')) {
            document.querySelector('.td-project-list .loader').style.display = 'none';
            views.classList.add('disabled');
        }
        resetProgressBar();
        // update accent color
        document.body.style.setProperty('--td-accent', data.color);
        // update logo (HARDCODED)
        document.querySelector('[data-td-logo]').src = imgs[id -1];
        document.querySelector('[data-td-logo]').style.filter = 'brightness(1)';
        // update td name in left panel
        document.querySelector('[data-td-name]').textContent = data.name;
        // update project list
        projList.innerHTML = '';
        let animationDelayTimer = 100;
        if (!data.projects?.length) {
            let li = document.createElement('li');
            li.classList.add('error');
            li.textContent = '🙁 Something went wrong.';
            projList.appendChild(li);
            document.querySelector('[data-project-name]').textContent = '';
            requirementList.innerHTML = '<p class="no-data-message">There is no data for this Techdegree.</p>'
        } else {
            // toggleDropdown();
            requirementList.innerHTML = '';
            data.projects.forEach((proj, index) => {
                let li = document.createElement('li');
                li.setAttribute('data-project-id', proj._id);
                li.setAttribute('data-project', '')
                li.style.animationDelay = `${animationDelayTimer}ms`;
                let spanNum = document.createElement('span');
                spanNum.classList = 'proj-num';
                spanNum.textContent = index + 1;
                let spanName = document.createElement('span');
                spanName.textContent = proj.title;
                li.appendChild(spanNum);
                li.appendChild(spanName);
                animationDelayTimer += 100;
                projList.appendChild(li);
            })
        }

        let resourceList = document.getElementById('resourceList');
        resourceList.innerHTML = '';

        if (data.resources) {
            data.resources.forEach(res => {
                let li = document.createElement('li');
                li.setAttribute('title', res.description)
                let a = document.createElement('a');
                a.setAttribute('href', res.link);
                a.setAttribute('target', '_blank');
                let icon = document.createElement('i');
                icon.classList = 'fa-solid fa-link';
                a.appendChild(icon);
                let group = document.createElement('div');
                group.classList = 'group';
                let title = document.createElement('p');
                title.textContent = res.title;
                let link = document.createElement('p');
                link.textContent = res.link;
                group.appendChild(title);
                group.appendChild(link);
                a.appendChild(group);
                li.appendChild(a);
                resourceList.appendChild(li);
            })
        }
    }
}



/**
 *
 * views (requirements)
 * vars
 * funcs
 */


const tdList = document.getElementById('tdProjectList');
const views = document.querySelector('.views');
tdList.addEventListener('click', e => {
    let projects = document.querySelectorAll('[data-project]');
    if (document.querySelector('.views .loader')) {
        document.querySelector('.views .loader').parentNode.style.display = 'flex';
        views.scrollTop = '0';
        views.classList.add('disabled');
    }
    projects.forEach(proj => {
        if (e.target === proj) {
            resetProgressBar();
            for(i = 0; i < projects.length; i++) {
                projects[i].classList = 'inactive';
            }
            proj.classList = 'active';

            let id = e.target.getAttribute('data-project-id');
            let SINGLE_PROJECT_QUERY = encodeURIComponent(`
            *[_type == "project" && _id == "${id}"]{
                _id,
                title,
                studyGuide,
                mobileMockup,
                tabletMockup,
                desktopMockup,
                activeMockup,
                "gradingSections": *[_type == "gradingSection" && references(^._id)]|order(order){
                    title,
                    _id,
                    "requirements": *[_type == "requirement" && references(^._id)]|order(order){
                        title,
                        _id,
                        isExceeds,
                    }
                },
                notes[]->
            }[0]
            `);
            let SINGLE_PROJECT_URL = `https://supw1mz3.api.sanity.io/v2021-10-21/data/query/production?query=${SINGLE_PROJECT_QUERY}`
            fetch(SINGLE_PROJECT_URL)
            .then(response => response.json())
            .then(data => {
                loadProjectRequirements(data.result);
            })
        }
    })
});

// grading requirements
const requirementList = document.getElementById('requirementList');
requirementList.addEventListener('click', e => {
    let btns = document.querySelectorAll('button.grading-btn');
    btns.forEach(btn => {
        if (e.target === btn) {
            handleGrading(e);
            btn.classList.add('active');
        }
    });
});

function handleGrading(e) {
    let parent = e.target.parentNode.parentNode;
    let btns = parent.querySelectorAll('button');
    let currentTextarea = e.target.parentNode.parentNode.querySelector('textarea');
    btns.forEach(btn => {
        btn.classList.remove('active');
        if (e.target === btn) {
            btn.classList.add('active');
        }
    });
    if (parent.classList.contains('exceeds-item')) {
        checkBtn(e);
        if (e.target.classList.contains('correct')) {
            currentTextarea.classList.remove('show');
            currentTextarea.value = '';
        } else
        if (e.target.classList.contains('error') || e.target.classList.contains('question')) {
            currentTextarea.classList.add('show');
        }

    } else
    if (e.target.classList.contains('correct')) {
        checkBtn(e);
        currentTextarea.classList.remove('show');
        currentTextarea.value = '';
    } else
    if (e.target.classList.contains('question')) {
        checkBtn(e);
        currentTextarea.classList.add('show');
    } else
    if (e.target.classList.contains('error')) {
        checkBtn(e);
        currentTextarea.classList.add('show');
    }
}

function checkBtn(e) {
    let parent = e.target.parentNode.parentNode;
    let correctBtns = document.querySelectorAll('button.correct');
    let questionBtns = document.querySelectorAll('button.question');
    let errorBtns = document.querySelectorAll('button.error');

    let currentRedoBtn = parent.querySelector('.redo');
    currentRedoBtn.classList.add('show');
    let currentTextarea = e.target.parentNode.parentNode.querySelector('textarea');
    currentRedoBtn.addEventListener('click', () => {
        currentRedoBtn.classList.remove('show');
        currentRedoBtn.parentNode.parentNode.classList.remove('graded');
        currentRedoBtn.parentNode.parentNode.classList.remove('error');
        currentRedoBtn.parentNode.parentNode.classList.remove('correct');
        currentRedoBtn.parentNode.parentNode.classList.remove('question');
        currentRedoBtn.parentNode.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
            currentTextarea.classList.remove('show');
            currentTextarea.value = '';
        });
        updateProgressBar();
    })

    if (parent.classList.contains('exceeds-item')) {
        parent.classList = 'exceeds-item graded';
    } else {
        parent.classList = 'graded';
    }

    correctBtns.forEach(btn => {
        if (e.target === btn) {
            parent.classList.add('correct');
        }
    });
    questionBtns.forEach(btn => {
        if (e.target === btn) {
            parent.classList.add('question')
        }
    });
    errorBtns.forEach(btn => {
        if (e.target === btn) {
            parent.classList.add('error');
        }
    })
    updateProgressBar()
}

function loadProjectRequirements(data) {
    showReqView();
    if (document.querySelector('.views .loader')) {
        document.querySelector('.views .loader').parentNode.style.display = 'none';
        views.classList.remove('disabled');
    }
    // project name in view header
    document.querySelector('[data-project-name]').textContent = data.title;
    const requirementList = document.getElementById('requirementList');
    requirementList.innerHTML = '';
    if (!data.gradingSections?.length) {
        requirementList.innerHTML = '<p class="no-data-message">Oops! There is no data for this project.</p>'
    } else {
        data.gradingSections.forEach((section, sectionIndex) => {
            const ulParent = document.createElement('ul');
            ulParent.classList.add('requirement');
            const liHeader = document.createElement('li');
            const titleGroup = document.createElement('div');
            titleGroup.classList.add('title-group');
            const span = document.createElement('span');
            span.classList.add('badge');
            span.textContent = sectionIndex + 1;
            const requirementTitle = document.createElement('p');
            requirementTitle.classList.add('requirement-title');
            requirementTitle.textContent = section.title;

            // create top level requirement header
            titleGroup.appendChild(span);
            titleGroup.appendChild(requirementTitle);
            liHeader.appendChild(titleGroup);
            ulParent.appendChild(liHeader);
            requirementList.appendChild(ulParent);

            // create sub requirements
            const subRequirementParent = document.createElement('ul');
            subRequirementParent.classList.add('sub-requirements');

            section.requirements.forEach(req => {
                const li = document.createElement('li');
                li.setAttribute('data-requirement', '');
                if (req.isExceeds) {
                    const exceedsIcon = document.createElement('i');
                    exceedsIcon.classList = "fa-solid fa-star exceedsicon";
                    exceedsIcon.setAttribute('title', 'Exceeds requirement');
                    li.classList.add('exceeds-item');
                    li.appendChild(exceedsIcon);
                }
                const subReqTitle = document.createElement('p');
                subReqTitle.classList = 'sub-requirements-title';
                subReqTitle.textContent = req.title;
                const textarea = document.createElement('textarea');
                textarea.setAttribute('placeholder', 'Optional - write a helpful message about your grade selection.')
                const btnGroup = document.createElement('div');
                btnGroup.classList.add('req-btn-group');

                const correctBtn = document.createElement('button');
                correctBtn.classList = 'correct grading-btn';
                const correctIcon = document.createElement('i');
                correctIcon.classList = 'fa-solid fa-check';
                correctBtn.appendChild(correctIcon);

                const questionBtn = document.createElement('button');
                questionBtn.classList = 'question grading-btn';
                const questionIcon = document.createElement('i');
                questionIcon.classList = 'fa-solid fa-question';
                questionBtn.appendChild(questionIcon)

                const errorBtn = document.createElement('button');
                errorBtn.classList = 'error grading-btn';
                const errorIcon = document.createElement('i');
                errorIcon.classList = 'fa-solid fa-xmark';
                errorBtn.appendChild(errorIcon);

                const redoBtn = document.createElement('button');
                redoBtn.classList = 'redo';
                const redoIcon = document.createElement('i');
                redoIcon.classList = 'fa-solid fa-arrow-rotate-right';
                redoBtn.appendChild(redoIcon);

                btnGroup.appendChild(correctBtn);
                btnGroup.appendChild(questionBtn);
                btnGroup.appendChild(errorBtn);
                btnGroup.appendChild(redoBtn);


                li.appendChild(subReqTitle);
                li.appendChild(textarea);
                li.appendChild(btnGroup);

                subRequirementParent.appendChild(li);

                ulParent.appendChild(subRequirementParent);
            });
            reqFooter.classList.remove('disabled');
        });
        // createReqFooter();
    }

    // load project files

    let projectFileData = {
        mockups: {},
        currentMocks: []
    }

    let mockupIconContainer = document.getElementById('mockupTypeContainer');
    mockupIconContainer.innerHTML = '';

    if (data.mobileMockup) {
        projectFileData.mockups.mobile = data.mobileMockup
        projectFileData.currentMocks.push(data.mobileMockup)

        let li = document.createElement('li');
        li.classList = 'mockup-type';
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-mobile-screen-button';
        let name = document.createElement('span')
        name.textContent = 'mobile';
        li.appendChild(icon);
        li.appendChild(name);

        mockupIconContainer.appendChild(li)
    }

    if (data.tabletMockup) {
        projectFileData.mockups.tablet = data.tabletMockup
        projectFileData.currentMocks.push(data.tabletMockup)

        let li = document.createElement('li');
        li.classList = 'mockup-type';
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-tablet-screen-button';
        let name = document.createElement('span')
        name.textContent = 'tablet';
        li.appendChild(icon);
        li.appendChild(name);

        mockupIconContainer.appendChild(li)
    }

    if (data.desktopMockup) {
        projectFileData.mockups.desktop = data.desktopMockup
        projectFileData.currentMocks.push(data.desktopMockup)

        let li = document.createElement('li');
        li.classList = 'mockup-type';
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-desktop';
        let name = document.createElement('span')
        name.textContent = 'desktop';
        li.appendChild(icon);
        li.appendChild(name);

        mockupIconContainer.appendChild(li)
    }

    if (!data.mobileMockup && !data.tabletMockup && !data.desktopMockup) {

        let li = document.createElement('li');
        li.classList.add('disabled');
        li.textContent = 'There are no mockups for this project.';
        mockupIconContainer.append(li)
    }

    let mockupIcons = document.querySelectorAll('li.mockup-type');
    const gallery = document.getElementById('galleryContainer');

    currentIndex = '';

    mockupIcons.forEach((icon, index) => {
        icon.setAttribute('data-mockup-index', index);

        icon.addEventListener('click', e => {
            gallery.innerHTML = '';
            currentIndex = e.target.getAttribute('data-mockup-index');
            let currentMock = projectFileData.currentMocks[currentIndex];
            let img = document.createElement('img');
            img.src = currentMock;
            gallery.appendChild(img);
        })
    });

    // carousel logic
    const controls = document.getElementById('controls');
    let prevArrow = document.querySelector('[data-prev-image]')
    let nextArrow = document.querySelector('[data-next-image]')

    controls.addEventListener('click', e => {
        if (e.target === prevArrow) {
            if (currentIndex == 0) {
                currentIndex = projectFileData.currentMocks.length -1;
            } else {
                currentIndex -= 1;
            }
        }
        if (e.target === nextArrow) {
            if (currentIndex == projectFileData.currentMocks.length -1) {
                currentIndex = 0;
            } else {
                currentIndex ++;
            }
        }

        gallery.innerHTML = '';
        let currentMock = projectFileData.currentMocks[currentIndex];
        let img = document.createElement('img');
        img.src = currentMock;
        gallery.appendChild(img);
    });
}

function updateProgressBar() {
    let reqs = document.querySelectorAll('[data-requirement]');
    let gradedReqs = document.querySelectorAll('.graded');
    const progressBar = document.querySelector('[data-progress-bar]');
    let progress = gradedReqs.length / reqs.length * 100;

    progressBar.style.setProperty('--req-progress', `${progress}%`)
}

function resetProgressBar() {
    const progressBar = document.querySelector('[data-progress-bar]');
    progressBar.style.setProperty('--req-progress', '0%');
}








/**
 *
 * final output window
 * vars
 * funcs
 *
 */

// views

const reqFooter = document.querySelector('.req-footer');
const reqView = document.querySelector('.view.requirement-list');
const outputView = document.querySelector('.view.finished-output-list');
const finishReview = document.querySelector('[data-finish-review]');
const backToReview = document.querySelector('[data-back-btn]');

const correctItemsList = document.querySelector('.correct-items-container');
const questionItemsList = document.querySelector('.questioned-items-container');
const incorrectItemsList = document.querySelector('.incorrect-items-container');


// default to show reqView
reqView.style.display = 'block';

// show ReqView
function showReqView() {
    reqView.style.display = 'block';
    reqFooter.style.display = 'block';
    outputView.style.display = 'none';
    clearGradedData();
}

function clearGradedData() {
    gradedData.correctItems.meets = [];
    gradedData.correctItems.exceeds = [];
    gradedData.questionableItems = [];
    gradedData.incorrectItems = [];

    correctItemsList.innerHTML = '';
    questionItemsList.innerHTML = '';
    incorrectItemsList.innerHTML = '';
}

// show OutputView
function showOutputView() {
    reqView.style.display = 'none';
    reqFooter.style.display = 'none';
    outputView.style.display = 'block';
}

// hide all views
function hideViews() {
    reqView.style.display = 'none';
    reqFooter.style.display = 'none';
    outputView.style.display = 'none';
}


let gradedData = {
    correctItems: {
        meets: [],
        exceeds: [],
    },
    questionableItems: [],
    incorrectItems: [],
}

function buildReview() {
    let correct = document.querySelectorAll('.graded.correct');
    let questioned = document.querySelectorAll('.graded.question');
    let incorrect = document.querySelectorAll('.graded.error');


    correct.forEach(item => {
        if (item.classList.contains('exceeds-item')) {
            gradedData.correctItems.exceeds.push(item)
        } else {
            gradedData.correctItems.meets.push(item)
        }
    });

    questioned.forEach(item => {
        let customText = item.querySelector('textarea').value;
        gradedData.questionableItems.push({ req: item, text: customText });
    });

    incorrect.forEach(item => {
        let customText = item.querySelector('textarea').value;
        gradedData.incorrectItems.push({ req: item, text: customText });
    });



    // building correct items
    gradedData.correctItems.meets.forEach(item => {
        let li = document.createElement('li');
        li.classList.add('correct');
        let div = document.createElement('div');
        div.className = 'icon-container';
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-check';
        div.appendChild(icon);
        li.appendChild(div);
        let req = document.createElement('span');
        req.textContent = item.textContent;
        li.appendChild(req);
        correctItemsList.appendChild(li);
    });
    gradedData.correctItems.exceeds.forEach(item => {
        let li = document.createElement('li');
        li.classList = 'correct exceeds';
        let div = document.createElement('div');
        div.classList.add('icon-container');
        let icon1 = document.createElement('i');
        let icon2 = document.createElement('i');
        icon1.classList = 'fa-solid fa-check';
        icon2.classList = 'fa-solid fa-check';
        div.appendChild(icon1);
        div.appendChild(icon2);
        li.appendChild(div);
        let req = document.createElement('span');
        const requirement = item.querySelector('.sub-requirements-title');
        req.textContent = requirement.textContent;
        li.appendChild(req);
        correctItemsList.appendChild(li);
    });

    // building questionable items
    gradedData.questionableItems.forEach(item => { 
        let li = document.createElement('li');
        li.classList = 'questioned';
        const div1 = document.createElement('div');
        div1.classList.add('icon-container');
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-question';
        div1.appendChild(icon);
        li.appendChild(div1);
        const div2 = document.createElement('div2');
        div2.classList.add('req-content');
        let req = document.createElement('span');
        const requirement = item.req.querySelector('.sub-requirements-title');
        req.textContent = requirement.textContent;
        div2.appendChild(req);
        if (item.text !== '') {
            let customText = document.createElement('p');
            customText.textContent = item.text;
            div2.appendChild(customText);
        }
        li.appendChild(div2);
        questionItemsList.appendChild(li);
    })

    // building incorrect items
    gradedData.incorrectItems.forEach(item => {
        let li = document.createElement('li');
        li.classList = 'incorrect';
        const div1 = document.createElement('div');
        div1.classList.add('icon-container');
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-xmark';
        div1.appendChild(icon);
        li.appendChild(div1);
        const div2 = document.createElement('div2');
        div2.classList.add('req-content');
        let req = document.createElement('span');
        const requirement = item.req.querySelector('.sub-requirements-title');
        req.textContent = requirement.textContent;
        div2.appendChild(req);
        if (item.text !== '') {
            let customText = document.createElement('p');
            customText.textContent = item.text;
            div2.appendChild(customText);
        }
        li.appendChild(div2);
        incorrectItemsList.appendChild(li);
    })



}

// finish and and back buttons
finishReview.addEventListener('click', () => {
    showOutputView();
    buildReview();
});

backToReview.addEventListener('click', showReqView);



/**
 *
 * utility panel logic
 * * vars
 * * opening panel
 * * closing panel
 * * funcs
 *
 */

// vars
const utilityIcon = document.querySelectorAll('[data-toggle-util]');
const offScreenPanel = document.getElementById('off-screen-panel');
const closeUtilityPanelBtn = document.getElementById('close-util-panel-btn');
const utilitySections = document.querySelectorAll('[data-util-section]');
const utilitySectionTitles = document.querySelectorAll('[data-util-section-title]');

// opening panel
utilityIcon.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        openUtilityPanel();
        handleActiveUtility(index);
    });
});
// closing panel
closeUtilityPanelBtn.addEventListener('click', () => {
    closeUtilityPanel();
});

// funcs
// closing utility panel
function closeUtilityPanel() {
    closeUtilityPanelBtn.parentNode.parentNode.classList.remove('show');
    utilitySections.forEach(section => {
        section.classList.remove('show');
    });
    utilityIcon.forEach(icon => {
        icon.classList.remove('active');
    });
    utilitySectionTitles.forEach(title => {
        title.classList.remove('active');
    })
}
// opening utility panel
function openUtilityPanel() {
    offScreenPanel.classList.add('show');
}
// handling active utility section
function handleActiveUtility(index) {
    for (let i = 0; i < utilitySections.length; i++) {
        utilitySections[i].classList.remove('show');
        utilitySectionTitles[i].classList.remove('active');
    }
    utilityIcon.forEach(icon => {
        icon.classList.remove('active');
    });
    utilitySections[index].classList.add('show');
    utilityIcon[index].classList.add('active');
    utilitySectionTitles[index].classList.add('active');
}






/**
 *
 * final output view
 *
 *
 */


const reviewHeader = document.getElementById('review-header');
const reviewHeader_toggle_correct = document.querySelector('[data-show-correct]');
const reviewHeader_toggle_question = document.querySelector('[data-show-question]');
const reviewHeader_toggle_wrong = document.querySelector('[data-show-wrong]');

reviewHeader.addEventListener('click', e => {

    handleReviewToggles(e);
});

function handleReviewToggles(e) {

    const correctItemsParent = document.querySelector('.correct-items-container');
    const questionedItemsParent = document.querySelector('.questioned-items-container');
    const incorrectItemsParent = document.querySelector('.incorrect-items-container');

    if (e.target === reviewHeader_toggle_correct) {
        e.target.classList.toggle('active');
        if (!e.target.classList.contains('active')) {
            correctItemsParent.style.display = 'none';
            correctItemsParent.style.animationDelay = '0s';
        } else {
            correctItemsParent.style.display = 'block';
        }
    }
    if (e.target === reviewHeader_toggle_question) {
        e.target.classList.toggle('active');
        if (!e.target.classList.contains('active')) {
            questionedItemsParent.style.display = 'none';
            questionedItemsParent.style.animationDelay = '0s';
        } else {
            questionedItemsParent.style.display = 'block';
        }
    }
    if (e.target === reviewHeader_toggle_wrong) {
        e.target.classList.toggle('active');
        if (!e.target.classList.contains('active')) {
            incorrectItemsParent.style.display = 'none';
            incorrectItemsParent.style.animationDelay = '0s';
        } else {
            incorrectItemsParent.style.display = 'block';
        }
    }
}

/**
 *
 *
 * copying slack message
 */
const secretTextarea = document.querySelector('[data-secret-textarea]');
const copyBtn = document.querySelector('[data-copy-review]');

const toggle_correct = document.querySelector('[data-show-correct]');
const toggle_question = document.querySelector('[data-show-question]');
const toggle_wrong = document.querySelector('[data-show-wrong]');



copyBtn.addEventListener('click', copySlackMessage);

function copySlackMessage() {

    if (toggle_correct.classList.contains('active')) {
        gradedData.correctItems.meets.forEach(item => {
            const requirement = item.querySelector('.sub-requirements-title');
            secretTextarea.value += `:meets: ${requirement.textContent}\n`
        });
        gradedData.correctItems.exceeds.forEach(item => {
            const requirement = item.querySelector('.sub-requirements-title');
            secretTextarea.value += `:meets: :exceeds: ${requirement.textContent}\n`
        })
        secretTextarea.value += `\n`
    }
    if (toggle_question.classList.contains('active')) {
        gradedData.questionableItems.forEach(item => {
            const requirement = item.req.querySelector('.sub-requirements-title');
            const isExceeds = item.req.classList.contains('exceeds-item');
            secretTextarea.value += `:questioned: ${isExceeds ? ":exceeds:" : ''} ${requirement.textContent}\n> ${item.text}\n`
        })
        secretTextarea.value += `\n`
    }
    if (toggle_wrong.classList.contains('active')) {
        gradedData.incorrectItems.forEach(item => {
            const requirement = item.req.querySelector('.sub-requirements-title');
            const isExceeds = item.req.classList.contains('exceeds-item');
            secretTextarea.value += `:needs-work: ${isExceeds ? ":exceeds:" : ''} ${requirement.textContent}\n> ${item.text}\n`
        })
    }

    copyBtn.textContent = 'Copied! 🚀'

    setTimeout(() => {
        copyBtn.textContent = 'Self Destructing in 5...'
        copyBtn.classList.add('self-destruct');




        document.querySelectorAll('p').forEach(item => {
            let ranDur = Math.floor(Math.random() * 1000)
            let ranDel = Math.floor(Math.random() * 1000)
            let pos = ['X', 'Y'];
            let ranPos = Math.floor(Math.random() * pos.length)
            // item.style.animation = `shake${pos[ranPos]} ${ranDur}ms ${ranDel}ms ease infinite`
            item.style.animation = `pulse ${ranDur}ms ${ranDel}ms ease infinite`
        })
        document.querySelectorAll('button').forEach(item => {
            let ranDur = Math.floor(Math.random() * 1000)
            let ranDel = Math.floor(Math.random() * 1000)
            let pos = ['X', 'Y'];
            let ranPos = Math.floor(Math.random() * pos.length)
            // item.style.animation = `shake${pos[ranPos]} ${ranDur}ms ${ranDel}ms ease infinite`
            item.style.animation = `pulse ${ranDur}ms ${ranDel}ms ease infinite`
        })
        document.querySelectorAll('li').forEach(item => {
            let ranDur = Math.floor(Math.random() * 1000)
            let ranDel = Math.floor(Math.random() * 1000)
            let pos = ['X', 'Y'];
            let ranPos = Math.floor(Math.random() * pos.length)
            // item.style.animation = `shake${pos[ranPos]} ${ranDur}ms ${ranDel}ms ease infinite`
            item.style.animation = `pulse ${ranDur}ms ${ranDel}ms ease infinite`
        })


        setTimeout(() => {
            copyBtn.textContent = 'Self Destructing in 4...'
            document.getElementById('overlay').classList.add('show');
            setTimeout(() => {
                copyBtn.textContent = 'Self Destructing in 3...'
                setTimeout(() => {
                    copyBtn.textContent = 'Self Destructing in 2...'
                    setTimeout(() => {
                        copyBtn.textContent = 'Self Destructing in 1...'
                        setTimeout(() => {
                            location.reload();
                        }, 2000)
                    }, 1000)
                }, 1000)
            }, 1000)
        }, 1000)
    }, 1300)

    secretTextarea.select();
    document.execCommand("copy");

    secretTextarea.value = '';
}





/**
 *
 * admin panel
 *
 */

const accessBtn = document.querySelector('[data-login-access-btn]');
const adminForm = document.querySelector('.admin-container form');

accessBtn.addEventListener('animationend', () => {
    accessBtn.style.animation = 'none';
})

adminForm.addEventListener('submit', e => {
    const errorMsg = document.querySelector('.admin-error-message');
    errorMsg.classList.add('show');
    errorMsg.textContent = 'This functionality is not available yet.'
    accessBtn.classList.add('error')
    e.preventDefault();
});






/**
 *
 * notes panel
 *
 */

const initNewNoteBtn = document.querySelector('[data-init-new-note]');
const newNoteForm = document.querySelector('form.new-note-form');
const cancelNewNoteBtn = document.querySelector('[data-cancel-new-note');
const noteForm_title = document.querySelector('form.new-note-form #title');
const noteForm_author = document.querySelector('form.new-note-form #author');
const noteForm_contents = document.querySelector('form.new-note-form #noteContents');

const noteContainer = document.querySelector('[data-notes-container]');

initNewNoteBtn.addEventListener('click', () => {
    newNoteForm.classList.add('show');
    initNewNoteBtn.style.display = 'none';
});

noteContainer.addEventListener('click', e => {
    if (e.target.classList.contains('fa-xmark')) {
        e.target.parentNode.remove();
    }
})

newNoteForm.addEventListener('submit', e => {
    e.preventDefault();

    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    today = mm + '/' + dd + '/' + yyyy;

    let title = noteForm_title.value;
    let author = noteForm_author.value;
    let text = noteForm_contents.value;

    let li = document.createElement('li');
    let icon = document.createElement('i');
    icon.classList = 'fa-solid fa-xmark';
    let noteTitle = document.createElement('p');
    noteTitle.classList = 'note-title';
    noteTitle.textContent = title;
    let note = document.createElement('p');
    note.classList = 'note';
    note.textContent = text;
    let noteInfo = document.createElement('p');
    noteInfo.classList = 'note-info';
    let authorSpan = document.createElement('span');
    authorSpan.textContent = author;
    let noteDateSpan = document.createElement('span');
    noteDateSpan.textContent = today;

    noteInfo.innerHTML = `-${authorSpan.innerHTML} on ${noteDateSpan.innerHTML}`

    li.appendChild(icon);
    li.appendChild(noteTitle);
    li.appendChild(note);
    li.appendChild(noteInfo);

    noteContainer.appendChild(li);

    noteForm_title.value = '';
    noteForm_author.value = '';
    noteForm_contents.value = '';
    newNoteForm.classList.remove('show');
    initNewNoteBtn.style.display = 'block';

});

cancelNewNoteBtn.addEventListener('click', () => {
    noteForm_title.value = '';
    noteForm_author.value = '';
    noteForm_contents.value = '';
    newNoteForm.classList.remove('show');
    initNewNoteBtn.style.display = 'block';
})
