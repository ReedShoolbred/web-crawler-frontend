import {addUrlToTable, outputUrl} from "./index.js"

//to test addUrlToTable
//get table from document
//run addUrlToTable() on table
//ensure that result is appropriate 
const table = document.getElementById("url-table");
const correctTable = document.getElementById("correct-url-table");
test("adds row to table", () => {
    addUrlToTable();
    expect(table).toBe(correctTable);
});



