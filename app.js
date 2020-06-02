"use strict";
//Selectors
const dateInput = document.querySelector(".date-input");
const submitWeightButton = document.querySelector(".submit-weight-button");
const weightInput = document.querySelector(".weight-input");
const caloriesInput = document.querySelector(".calories-input");
const todayDiv = document.querySelector(".today-date");
const totalLostU = document.querySelector(".total-lost");
const weekWeightTable = document.querySelector(".weight-table");

////////
// Create buttons and its event listners before buttons first display
let editWeightBtn = document.createElement("button");
editWeightBtn.classList = "edit-weight-btn";
editWeightBtn.innerText = "Edit";
editWeightBtn.addEventListener("click", editWeight);

let saveChangesBtn = document.createElement("button");
saveChangesBtn.classList = "save-btn";
saveChangesBtn.innerText = "Save";
saveChangesBtn.addEventListener("click", saveChanges);

let cancelChangesBtn = document.createElement("button");
cancelChangesBtn.classList = "cancel-btn";
cancelChangesBtn.innerText = "Cancel";
cancelChangesBtn.addEventListener("click", cancelChanges);
////////

//EventListners
document.addEventListener("DOMContentLoaded", showTodayDate);
document.addEventListener("DOMContentLoaded", showTotalLost);
submitWeightButton.addEventListener("click", saveEntryLocalStorage);
document.addEventListener("DOMContentLoaded", showWeekWeight);

//// temp
// document.addEventListener("DOMContentLoaded", temp);
////

function showTodayDate() {
  let today = new Date().toDateString();
  todayDiv.innerText = "Today: " + today;
}

function saveEntryLocalStorage() {
  let entry = transformEntryIntoArray();
  let weightEntries = takeWeightLocalStorage();
  let lastEntry;

  fillMissedEntries(weightEntries);

  if (weightEntries.length > 0) {
    lastEntry = weightEntries[weightEntries.length - 1];
  }
  if (weightEntries.length === 0 || lastEntry[0] !== entry[0]) {
    weightEntries.push(entry);
  } else {
    let isChanged = confirm(
      "You alredy have entered weight today! Wanna change it?"
    );
    if (isChanged) {
      weightEntries.pop();
      weightEntries.push(entry);
    }
  }

  localStorage.setItem("weightEntries", JSON.stringify(weightEntries));

  showTotalLost();
  clearWeekWeightTable();
  showWeekWeight();
}

function takeWeightLocalStorage() {
  let weightEntries = localStorage.getItem("weightEntries");
  if (weightEntries === null) {
    weightEntries = [];
  } else {
    weightEntries = JSON.parse(weightEntries);
  }

  return weightEntries;
}

function transformEntryIntoArray() {
  let entry = [];
  entry.push(new Date().toISOString().slice(0, 10));
  //  entry.push("2020-05-29"); /////////////
  if (weightInput.value !== "" && caloriesInput.value !== "") {
    entry.push(weightInput.value);
    entry.push(caloriesInput.value);
  } else {
    entry.push("0");
    entry.push("0");
  }
  return entry;
}

function showTotalLost() {
  let weightEntries = takeWeightLocalStorage();
  // let firstEntry = weightEntries[0];
  // let lastEntry = weightEntries[weightEntries.length - 1];
  let firstEntry;
  let lastEntry;
  let totalLost;

  if (weightEntries.length > 0) {
    firstEntry = weightEntries[0];
    lastEntry = weightEntries[weightEntries.length - 1];

    totalLost = firstEntry[1] - lastEntry[1];
  } else {
    totalLost = 0;
  }

  totalLostU.innerText = totalLost.toFixed(1);
}

function showWeekWeight() {
  let weightEntries = takeWeightLocalStorage();
  let weightEntriesLength = weightEntries.length;

  let tableHead = document.createElement("tr");
  tableHead.innerHTML = "<th>Date</th><th>Weight, kg</th><th>Calories</th>";
  weekWeightTable.append(tableHead);

  for (let i = 0; i < 7; i++) {
    let entryTr = document.createElement("tr");
    if (weightEntriesLength + i < 7) {
      entryTr.innerHTML = "<td>-</td><td>-</td><td>-</td>";
    } else {
      let currentEntryN = weightEntriesLength - 7 + i;
      let currentEntry = weightEntries[currentEntryN];
      entryTr.innerHTML =
        "<td>" +
        currentEntry[0] +
        "</td>" +
        "<td>" +
        currentEntry[1] +
        "</td>" +
        "<td>" +
        currentEntry[2] +
        "</td>";
    }
    weekWeightTable.append(entryTr);
  }
  addEditBtn();
}

function addEditBtn() {
  let buttonTr = document.createElement("tr");
  let buttonTd = document.createElement("td");
  buttonTd.setAttribute("colspan", "3");
  buttonTd.append(editWeightBtn);
  buttonTr.append(buttonTd);

  weekWeightTable.append(buttonTr);
}

function fillMissedEntries(weightEntries) {
  if (weightEntries.length > 0) {
    let lastEntry = weightEntries[weightEntries.length - 1];
    let lastEntryDate = Date.parse(lastEntry[0]); //miliseconds
    let todayString = new Date().toISOString().slice(0, 10); //"2020-mm-dd"
    let today = Date.parse(todayString); //miliseconds

    let missedDays = (today - lastEntryDate) / 86400000 - 1; //number

    if (missedDays > 0) {
      let newDateMillisec = lastEntryDate;
      for (let i = 0; i < missedDays; i++) {
        newDateMillisec = newDateMillisec + 86400000;
        let newDate = new Date(newDateMillisec).toISOString().slice(0, 10); //string
        let missedEntry = [newDate, "0", "0"];
        weightEntries.push(missedEntry);
      }
    }
  }
}

function editWeight() {
  clearWeekWeightTable();

  let weightEntries = takeWeightLocalStorage();
  let weightEntriesLength = weightEntries.length;

  let tableHead = document.createElement("tr");
  tableHead.innerHTML = "<th>Date</th><th>Weight, kg</th><th>Calories</th>";
  weekWeightTable.append(tableHead);

  for (let i = 0; i < 7; i++) {
    let entryTr = document.createElement("tr");
    if (weightEntriesLength + i < 7) {
      entryTr.innerHTML =
        "<td><input type='date' name='date' /></td>" +
        "<td><input type='number' name='weight' value='0' /></td>" +
        "<td><input type='number' name='calories' value='0' /></td>";
    } else {
      let currentEntryN = weightEntriesLength - 7 + i;
      let currentEntry = weightEntries[currentEntryN];
      entryTr.innerHTML =
        "<td><input type='date' name='date' value=" +
        currentEntry[0] +
        " /></td>" +
        "<td><input type='number' name='weight' value=" +
        currentEntry[1] +
        " /></td>" +
        "<td><input type='number' name='calories' value=" +
        currentEntry[2] +
        " /></td>";
    }
    weekWeightTable.append(entryTr);
  }
  addSaveCancelBtn();
}

function clearWeekWeightTable() {
  while (weekWeightTable.firstChild) {
    weekWeightTable.removeChild(weekWeightTable.firstChild);
  }
}

function addSaveCancelBtn() {
  let buttonTr = document.createElement("tr");
  // buttonTr.classList = "button-row";
  let emptyEntryTd = document.createElement("td");
  let saveBtnEntryTd = document.createElement("td");
  saveBtnEntryTd.append(saveChangesBtn);
  let cancelBtnEntryTd = document.createElement("td");
  cancelBtnEntryTd.append(cancelChangesBtn);
  buttonTr.append(emptyEntryTd);
  buttonTr.append(saveBtnEntryTd);
  buttonTr.append(cancelBtnEntryTd);

  weekWeightTable.append(buttonTr);
}

function temp() {
  //   const editWeightButton = document.querySelector(".edit-weight-btn");
  //   console.log(editWeightButton);
  //   console.log(document.querySelector(".edit-weight-btn"));
  console.log(weekWeightEntries);
}

function cancelChanges() {
  clearWeekWeightTable();
  showWeekWeight();
}

function saveChanges() {
  let trS = weekWeightTable.childNodes;
  let weekWeight = [];

  //writing changed data from "input" into the week weight table
  for (let i = 1; i < trS.length - 1; i++) {
    let weightData = [];
    let tdS = trS[i].childNodes;

    let date = tdS[0].firstChild.value;
    let weight = tdS[1].firstChild.value;
    let calories = tdS[2].firstChild.value;

    //adding data if user has changed date
    if (date != "") {
      weightData.push(date);
      weightData.push(weight);
      weightData.push(calories);

      weekWeight.push(weightData);
      weightData = [];
    }
  }

  //writing weight progress into local storage depending on quantity of entries
  //temp
  let weightLocalStorage = [];
  //temp
  if (weekWeight.length < 7) {
    localStorage.setItem("weightEntries", JSON.stringify(weekWeight));
  } else {
    // let
    weightLocalStorage = takeWeightLocalStorage();
    let weightLSLength = weightLocalStorage.length;
    weightLocalStorage.splice(
      weightLSLength - 7,
      weekWeight.length,
      weekWeight[0],
      weekWeight[1],
      weekWeight[2],
      weekWeight[3],
      weekWeight[4],
      weekWeight[5],
      weekWeight[6]
    );
    localStorage.setItem("weightEntries", JSON.stringify(weightLocalStorage));
  }

  showTotalLost();
  cancelChanges();

  // checkDateSequance(weightLocalStorage);
}

function checkDateSequance(weightTable) {
  for (let i = 0; i < weightTable.length - 1; i++) {
    console.log("checkDateSequance");
    let currentEntry = weightTable[i];
    // [0];
    let nextEntry = weightTable[i + 1];
    // [0];

    // currentDate

    console.log(currentEntry + " - " + nextEntry);
  }
}
