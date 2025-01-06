const table = document.getElementById("url-table");

function addUrlToTable() {
    //instantiate a new row element
    let row = document.createElement("tr");
    //declare cell and text node to be added to the row
    let cell;
    let node;
    
    //create a new cell and text node for each column in the table
    for (let i = 0; i < 6; i++) {
        cell = document.createElement("td");
        node = document.createTextNode("example");
        
        //append the text node to the cell and the then cell to the row
        cell.appendChild(node);
        row.appendChild(cell);
    }
    //append the row to the table
    table.appendChild(row);
}

function getUrl() {
    return document.getElementById("input-url").value;
}

function outputUrl() {
    console.log(getUrl());
}

async function crawlUrl() {
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "text/plain");

    const response = await fetch("http://localhost:8080/api/crawl", {
        method: "POST",
        body: getUrl(),
        headers: myHeaders,
        mode: "no-cors"
    }).response;

    console.log(response);
}

