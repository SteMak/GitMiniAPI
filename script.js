var goodCardsData;

const getGoodCardsData = () => {
    return goodCardsData;    
}

var userQuery = {
    filter: {
        starsCount: null,
        language: null,
        dateUpdate: null,
        type: null,
        hasTopics: false,
        hasOpenIssues: false
    },
    offset: 0,
    limit: 6,
    filedSort: 'name',
    inverseSort: false
};

const app = function () {
    const formSignin = document.querySelector('.form-signin');

    function reuestProjects(owner) {
        const link = 'https://api.github.com/users/' + owner + '/repos';
        let result;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', link, false);
        xhr.send();
        if (xhr.status != 200) {
            result = xhr.status + ': ' + xhr.statusText;
        } else {
            result = JSON.parse(xhr.responseText);
        }
        return result;
    };

    function prepareCardsData(falseData) {
        return falseData.map(function (item) {
            return {
                name: item.name,
                description: item.description,
                fork: item.fork ? 'Fork': 'Source',
                type: item.fork ? 'fork': 'source',
                starsCount: item.stargazers_count,
                language: item.language,
                dateUpdate: item.updated_at,
                openIssues: item.open_issues_count,
                hasOpenIssues: item.open_issues_count > 0,
                // TODO search topics
                hasTopics: true
            };
        });
    }
    
    /**
     * Ordering data by field.
     * 
     * @param {arrary} data 
     * @param {string} field - 'name', 'dateUpdate', 'starsCount', 'issuesCount' 
     * @param {boolean} inverse
     */
    function orderByField(data, field, inverse) {
        var result = data.sort(function(a, b) {
            var aN, bN;

            if (typeof a[field] == 'string') {
                aN = a[field].toUpperCase();
                bN = b[field].toUpperCase();
            }   else {
                aN = a[field];
                bN = b[field];
            }

            if (aN > bN) {
                return !inverse ? 1 : -1;
            }   else if (aN < bN) {
                return !inverse ? -1 : 1;
            }   else {
                return 0;
            }
        });

        return result;
    }

    function handlerFilter(event) {
        userQuery.filter[event.target.name] = event.target.type == 'checkbox' ? event.target.checked: event.target.value; 
        cardsCreating();
    }

    function handlerSorting(event) {
        if(event.target.type == 'checkbox') {
            userQuery.inverseSort = event.target.checked;            
        }   else {
            userQuery.filedSort = event.target.value;
        }
        cardsCreating();
    }

    function handlerPagination(event) {
        event.preventDefault();
        var data = event.target.dataset;
        console.log(data.num);
        //userQuery.offset = event;
    }

    function pageCardsCreating() {
        const target = document.querySelector('#content');    
        target.innerHTML = pageCardsTemplate();
        target.querySelector('.filter').onchange = handlerFilter;
        target.querySelector('.sorting').onchange = handlerSorting;
    }

    function applyUserQuery() { 
        var result = getGoodCardsData();

// TODO filter dateUpdate
        if(userQuery.filter.dateUpdate) {
            result = result.filter(function(item) {
                return item.dateUpdate;
            });
        }
       
        if(userQuery.filter.starsCount) {
            result = result.filter(function(item) {
                return item.starsCount >= userQuery.filter.starsCount;
            });
        }

        if(userQuery.filter.type) {
            result = result.filter(function(item) {
                return item.type == userQuery.filter.type;
            });
        }

        if(userQuery.filter.hasTopics) {
            result = result.filter(function(item) {
                return item.hasTopics == userQuery.filter.hasTopics;
            });
        }

        if(userQuery.filter.hasOpenIssues) {
            result = result.filter(function(item) {
                return item.hasOpenIssues == userQuery.filter.hasOpenIssues;
            });
        }

        if(userQuery.filter.language) {
            result = result.filter(function(item) {
                return item.language == userQuery.filter.language;
            });
        }
        
        if(userQuery.filedSort) {
            result = orderByField(result, userQuery.filedSort, userQuery.inverseSort);
        }
        // TODO add limit and apply userQuery.offset

        return result;
    }

    function cardsCreating() {
        const data = applyUserQuery();
        const target = document.querySelector('#cards');    
        target.innerHTML = cardsTemplate(data);
        const nav = document.querySelector('#nav');    
        nav.innerHTML = pagTemplate(data.length);
        nav.onclick = handlerPagination; 
    }

// TODO delete message if new one
    function errorMessage(message) {
        const target = document.querySelector('#content');
        const error = document.createElement("div");
        error.innerHTML = errorTemplate(message);    
        target.appendChild(error);
    };

    formSignin.addEventListener('submit', function(event) {
        event.preventDefault();
        const input = this.querySelector('input[name=login]');
        
// TODO result to Array

        const result = reuestProjects(input.value);

        if (Array.isArray(result)) {
            goodCardsData = prepareCardsData(result);

            pageCardsCreating();
            cardsCreating();
        } else {
            errorMessage(result);
        }
    });
};

document.addEventListener('DOMContentLoaded', app);