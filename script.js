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
        order: {
            repoName: false,
            starsCount: false,
            openIssues: false,
            dateUpdate: false
        },
        offset: 0,
        limit: 6
};

function tt(e) {
    console.log(e);
}
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
     * @param {string} direct - 'ascending' or 'descending' 
     */
    function orderByField(data, field, direct) {
        var result = data.sort(function(a, b) {
            if (a[field].toLowerCase() > b[field].toLowerCase()) {
                return 1;
            }   else if (a[field].toLowerCase() < b[field].toLowerCase()) {
                return -1;
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
        // TODO getting filed name and update userQuery.filedSort
        // TODO getting direct sort and update userQuery.directSort
        userQuery.order[event.target.name] = event.target.checked;
        cardsCreating();
    }

    function pageCardsCreating() {
        const target = document.querySelector('#content');    
        target.innerHTML = pageCardsTemplate();
        target.querySelector('.filter').onchange = handlerFilter;
        target.querySelector('.sorting').onchange = handlerSorting; 
        // TODO add prepare user click pagination and update userQuery.offset  
        //target.querySelector('.pagination').onclick = handlerPagination; 
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
        
        // TODO apply userQuery.filedSort and userQuery.directSort use function orderByField
        // TODO add limit and apply userQuery.offset

        return result;
    }

    function cardsCreating() {
        const data = applyUserQuery();
        const target = document.querySelector('#cards');    
        target.innerHTML = cardsTemplate(data);
        const nav = document.querySelector('#nav');    
        nav.innerHTML = pagTemplate(data.length);
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