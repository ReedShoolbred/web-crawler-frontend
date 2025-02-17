const table = document.getElementById("url-table");
const searchBar = document.getElementById("search-bar");
const searchFilter = document.getElementById("search-filter");
let selectedRow = '';

/**
 * Add each URL element from urlArray to the table after clearning any old data from table
 * @param {*} urlArray - array of JSON objects representing a URL
 */
function addUrlToTable(urlArray) {
    const tableBody = document.createElement("tbody");
    clearTableBody(tableBody);

    //create a new entry for each element in urlArray
    for (let i = 0; i < urlArray.length; i++) {
        //instantiate a new row element
        const row = document.createElement("tr");
        let id = "row" + urlArray[i].id;
        row.setAttribute("id", id);
        row.setAttribute("onclick", "selectRow(\'" + id + "\')");

        //add scheme to row
        schemeCell = document.createElement("td");
        schemeText = document.createTextNode(urlArray[i].scheme);
        schemeCell.appendChild(schemeText);
        row.append(schemeCell);

        //add domain to row
        domainCell = document.createElement("td");
        domainText = document.createTextNode(urlArray[i].domain);
        domainCell.appendChild(domainText);
        row.append(domainCell);

        //add port to row
        portCell = document.createElement("td");
        portText = document.createTextNode(urlArray[i].port);
        portCell.appendChild(portText);
        row.append(portCell);

        //add path to row
        pathCell = document.createElement("td");
        pathText = document.createTextNode(urlArray[i].path);
        pathCell.appendChild(pathText);
        row.append(pathCell);

        //add parameter to row
        parameterCell = document.createElement("td");
        parameterText = document.createTextNode(urlArray[i].parameter);
        parameterCell.appendChild(parameterText);
        row.append(parameterCell);

        //add fragment to row
        fragmentCell = document.createElement("td");
        fragmentText = document.createTextNode(urlArray[i].fragment);
        fragmentCell.appendChild(fragmentText);
        row.append(fragmentCell);

        //append the row to the table
        tableBody.appendChild(row);
    }
}

/**
 * Extract the Id number from the rowID string
 * @param {*} rowId - string with format "row<Id>" where <Id> represents the Id number of the element
 * @returns Id number of the element as an int
 */
function getIdNum(rowId) {
    return rowId.substring(3, rowId.length);
}

function selectRow(rowId) {
    const deleteUrlButton = document.getElementById("delete-selected-button");
    deleteUrlButton.style.backgroundColor = "red";
    deleteUrlButton.disabled = false;

    //deselect the previously selected row
    if (selectedRow != '') {
        let oldSelectedRow = document.getElementById(selectedRow);
        oldSelectedRow.style.backgroundColor = "white";
    }

    //select the row that was clicked
    selectedRow = rowId;
    console.log(selectedRow);
    let row = document.getElementById(selectedRow);

    //set background color of row to show it was selected
    row.style.backgroundColor = "#89b2f5";
}

/**
 * Clear the tbody element from the table so that it can be updated 
 * @param {*} newTableBody - tbody element that will replace the old tbody
 */
function clearTableBody(newTableBody) {
    const oldTableBody = table.getElementsByTagName("tbody")[0];
    if (oldTableBody != undefined) {
        table.replaceChild(newTableBody, oldTableBody);
    }
    else table.appendChild(newTableBody);
}

/**
 * 
 * @returns the value of the input-url element
 */
function getUrl() {
    return document.getElementById("input-url").value;
}

/**
 * POST request to crawl the given URL and store the results to the database
 */
async function crawlUrl() {
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "text/plain");

    try {
        const response = await fetch("http://localhost:8080/api/crawl", {
            method: "POST",
            body: getUrl(),
            headers: myHeaders,
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * Disable or enable the Stored URLs search box based on whether "no filter" is selected or not
 */
function setInput() {
    if (searchFilter.value == "none") {
        searchBar.disabled = true;
    }
    else searchBar.disabled = false;
}

/**
 * Delegate to appropriate method to perform database query 
 */
async function searchWithFilter() {
    const filterSetting = document.getElementById("search-filter").value;
    const searchBar = document.getElementById("search-bar").value;


    switch (filterSetting) {
        case "domain":
            queryByDomain(searchBar);
            break;
        case "scheme":
            queryByScheme(searchBar);
            break;
        default:
            queryAll();
    }
}

/**
 * Send GET request to get all URLs from database that match the given domain
 * @param {*} searchBarInput - user input domain from the search bar
 */
async function queryByDomain(searchBarInput) {
    try {
        const response = await fetch("http://localhost:8080/api/querybydomain/" + searchBarInput);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        addUrlToTable(json);
    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * Send GET request to get all URLs from database that match the given scheme
 * @param {*} searchBarInput - user input scheme from the search bar
 */
async function queryByScheme(searchBarInput) {

    try {
        const response = await fetch("http://localhost:8080/api/querybyscheme/" + searchBarInput);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        addUrlToTable(json);
    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * Send GET request to get all URLs from database 
 */
async function queryAll() {
    try {
        const response = await fetch("http://localhost:8080/api/queryall");

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        addUrlToTable(json);
    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * GET request to delete all URLs from the database
 */
async function deleteAll() {
    try {
        const response = await fetch("http://localhost:8080/api/deleteall");

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * POST request to delete the specified URL from the database
 */
async function deleteUrl() {
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "text/plain");

    try {
        const response = await fetch("http://localhost:8080/api/delete", {
            method: "POST",
            body: getIdNum(selectedRow),
            headers: myHeaders,
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

    }
    catch (error) {
        console.error(error.message);
    }

    removeElementFromTable();    
    selectedRow = '';
}

function removeElementFromTable() {
    const tableBody = table.getElementsByTagName("tbody")[0];
    tableBody.removeChild(document.getElementById(selectedRow));
}



