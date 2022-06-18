// data
const api = {
    techdegrees: 'https://grading-tool-api.herokuapp.com/api/techdegrees',
}

/**
 * inital data loading
 * 
 * 1. LEFT PANEL
 * 2. MIDDLE (REQUIREMENTS)
 * 3. RIGHT PANEL
 * 
 */

// 1
const leftPanelDropdown = document.getElementById('left-panel-dropdown')
const leftPanelDropdown_list = document.querySelector('#left-panel-dropdown ul');

// leftPanelDropdown.classList.add('show');

fetch(api.techdegrees)
  .then(response => response.json())
  .then(data => buildDropdownContent(data))

function buildDropdownContent(data) {
    data.forEach(techdegree => {
        let li = document.createElement('li');
        li.setAttribute("data-td-id", techdegree.id);
        li.setAttribute("data-td-list-item", 'data-td-list-item');
        let span = document.createElement('span');
        span.textContent = techdegree.name;
        let icon = document.createElement('i');
        icon.classList = 'fa-solid fa-star';
        li.appendChild(span);
        li.appendChild(icon)
        leftPanelDropdown_list.appendChild(li);
    });
    checkLocalStorageForFavoriteTechdegree(data, 0);
}

function checkLocalStorageForFavoriteTechdegree(data, index) {
    // if there is no favorite selected, default to first techdegree from API
    if (!localStorage.favoriteTechdegree) {
        localStorage.setItem('favoriteTechdegree', JSON.stringify(data[index]));
    }
}

// function setFavoriteTechdegreeInLocalStorage(data, index) {
//     if (!localStorage.favoriteTechdegree) {
//         localStorage.setItem('favoriteTechdegree', JSON.stringify(data[index]))
//     }
//     let favoriteTechdegree = localStorage.getItem('favoriteTechdegree');
//     let favoriteTechdegreeParsed = JSON.parse(favoriteTechdegree);
//     setFavoriteTechdegreeUI(favoriteTechdegreeParsed.id - 1);
// }

// function setFavoriteTechdegreeUI(index) {
//     const dropdownItems = document.querySelectorAll('[data-td-list-item]')
//     dropdownItems[index].classList.add('favorite');
// }

// //  changing favorite techdegree
// const dropdown = document.getElementById('left-panel-dropdown');

// dropdown.addEventListener('click', () => {
//     const dropdownItems = document.querySelectorAll('[data-td-list-item]');
//     dropdownItems.forEach(item => {
//         item.addEventListener('click', () => {
//             let id = item.getAttribute('data-td-id') - 1;
//             setFavoriteTechdegreeUI(id);
//         })
//     })
// })
