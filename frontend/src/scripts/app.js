const api = {
    techdegrees: '',
    
}

// left panel
const leftPanel = {
    init: {
        data: [],
        getData: () => {
            fetch('http://example.com/movies.json')
            .then(response => response.json())
            .then(data => console.log(data));
        }

    },
    update: () => {

    }
}

// middle
const middle = {
    init: {

    },
    update: () => {

    }
}

// right panel
const rightPanel = {
    init: {

    },
    update: () => {
        
    }
}
