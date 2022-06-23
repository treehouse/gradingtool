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
 */
const loaderDots = 3;
const loaders = document.querySelectorAll('.loader');
loaders.forEach((loader => {
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
 * handle light/dark theme for tool
 * 
 */

const tdName = document.querySelectorAll('[data-td-name]');
tdName.forEach(name => {
    name.textContent = 'Treehouse Grading Tool'
});
const lightTheme = document.getElementById('light');
const darkTheme = document.getElementById('dark');
lightTheme.addEventListener('click', () => {
    document.body.classList = '';
});
darkTheme.addEventListener('click', () => {
    document.body.classList = 'dark';
});





/**
 * 
 * techdegree panel (left panel)
 * * vars
 * * opening dropdown
 * * closing dropdown
 * * funcs
 * 
 */

// vars
const techdegreeHeader = document.getElementById('techdegreeHeader');
const techdegreeDropdown = document.getElementById('techdegreeDropdown');
const techdegreeDropdownArrow = techdegreeHeader.querySelector('i');
const dropdownLoader = techdegreeDropdown.querySelector('.loader');

// if (!localStorage.favoritedTd) {
//     toggleDropdown();
// }

toggleDropdown();


fetch('https://grading-tool-api.herokuapp.com/api/techdegrees')
  .then(response => response.json())
  .then(data => loadTechdegrees(data));

techdegreeHeader.addEventListener('click', () => {
    toggleDropdown();
});

techdegreeDropdown.addEventListener('click', e => {
    let tds = document.querySelectorAll('[data-dropdown-td-name]');
    tds.forEach(td => {
        if (e.target == td) {
            let span = td.querySelector('span');
            let id = span.getAttribute('data-td-list-item-id');
            loadProjectList(id);
        }
    })
})

// funcs
function toggleDropdown() {
    if (techdegreeDropdown.hasAttribute('active')) {
        techdegreeDropdown.removeAttribute('active');
        techdegreeDropdown.style.animation = 'bounceOutUp 1s ease-in-out forwards'
        techdegreeDropdownArrow.style.transform = 'rotate(0deg)'
        setTimeout(() => {
            techdegreeDropdown.style.display = 'none';
        }, 600)
    } else {
        techdegreeDropdown.setAttribute('active', '');
        techdegreeDropdown.style.display = 'block';
        techdegreeDropdown.style.animation = 'bounceInDown 1s ease-out forwards'
        techdegreeDropdownArrow.style.transform = 'rotate(180deg)'
    }
}

function loadTechdegrees(data) {
    setTimeout(() => {
        dropdownLoader.style.display = 'none';
        const ul = document.createElement('ul');
        document.getElementById('techdegreeDropdown').appendChild(ul);
        data.forEach(td => {
            let li = document.createElement('li');
            li.setAttribute('data-dropdown-td-name', '');
            let span = document.createElement('span');
            span.setAttribute('data-td-list-item-id', td.id);
            span.textContent = td.name;
            let icon = document.createElement('i');
            icon.classList = 'fa-solid fa-star';
            li.appendChild(span);
            li.appendChild(icon);
            ul.appendChild(li);
        })
    }, 1000)
}

function loadProjectList(id) {
    const projList = document.getElementById('tdProjectList');
    fetch(`https://grading-tool-api.herokuapp.com/api/techdegrees/${id}`)
        .then(response => response.json())
        .then(data => populate(data, id))
        
    function populate(data, id) {
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
        if (data.projects.length === 0) {
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
                li.setAttribute('data-project-id', proj.id);
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
    }
    
}





/**
 * 
 * views (requirements)
 * vars
 * funcs
 */


const tdList = document.getElementById('tdProjectList');
tdList.addEventListener('click', e => {
    let projects = document.querySelectorAll('[data-project]');
    projects.forEach(proj => {
        if (e.target === proj) {
            resetProgressBar();
            for(i = 0; i < projects.length; i++) {
                projects[i].classList = 'inactive';
            }
            proj.classList = 'active';

            let id = e.target.getAttribute('data-project-id');
            fetch(`https://grading-tool-api.herokuapp.com/api/projects/${id}`)
                .then(response => response.json())
                .then(data => loadProjectRequirements(data))
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
    // project name in view header
    document.querySelector('[data-project-name]').textContent = data.title;
    const requirementList = document.getElementById('requirementList');
    requirementList.innerHTML = '';
    if (data.gradingSections.length === 0) {
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
                subReqTitle.textContent = req.description;
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
        });
        createReqFooter();
    }
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

function createReqFooter() {
    const requirementList = document.getElementById('requirementList');
    const reqFooter = document.createElement('div');
    reqFooter.classList = 'req-footer';
    const btnGroup = document.createElement('div');
    btnGroup.classList = 'btn-group';
    let finishBtn = document.createElement('button');
    finishBtn.setAttribute('data-finish-review', '');
    finishBtn.textContent = 'Finish Review';
    let clearBtn = document.createElement('button');
    clearBtn.setAttribute('data-clear-review', '');
    clearBtn.textContent = 'Clear Review';
    btnGroup.appendChild(finishBtn);
    btnGroup.appendChild(clearBtn);
    reqFooter.appendChild(btnGroup);
    requirementList.appendChild(reqFooter);

}








/**
 * 
 * final output window
 * vars
 * funcs
 * 
 */

// views

const reqView = document.querySelector('.view.requirement-list');
const outputView = document.querySelector('.view.finished-output-list');

 function showView(view) {
    view.style.display = 'block';
}

// const finishReviewBtn = document.querySelector('[data-finish-review]');
// const backToReviewBtn = document.querySelector('');
// const clearReviewBtn = document.querySelector('');

showView(reqView);



// document.querySelector('[data-finish-review]').addEventListener('click', () => {
//     alert();
// })




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