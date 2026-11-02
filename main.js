
import {startSort} from "./quicksort.js";
import {startBlind} from "./blindranking.js";
import {startKeepCut} from "./keepcut.js";
import {startHalf} from "./halflist.js";
import {loadUnsortedMenu} from "./ui.js";
import {loadSavedMenu} from "./ui.js";
import { exportRankings } from "./storage.js";
import { importRankings } from "./storage.js";

document.getElementById("startButton").addEventListener("click", start);
document.getElementById("exportBut").addEventListener("click", exportRankings);

const importFile = document.getElementById("importFile");
document.getElementById("importBut").addEventListener("click", () => {
    importFile.click();
});

importFile.addEventListener("change", (event) => {
    importRankings(event);
});

async function start() {
  let mode = document.getElementById("mode").value;

  let rawLines = document.getElementById("inputList").value
    .split("\n")
    .filter(item => item.trim() !== "");

  let list = rawLines.map(line => {
    let parts = line.split(",");
    return {
      name: parts[0].trim(),
      image: parts[1] ? parts[1].trim() : null
    };
  });

  if (mode === "sort") {
    await startSort(list);
  }

  if (mode === "blind") {
    startBlind(list);
  }

  if (mode === "keepcut") {
    startKeepCut(list);
  }

  if (mode === "half") {
    startHalf(list);
  }
}

function toColumns(list, columns) {
  let result = [];
  let rows = Math.ceil(list.length / columns);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let index = c * rows + r;
      if (index < list.length) {
        result.push(list[index]);
      }
    }
  }
  return result;
}

window.onload = function () {
  loadUnsortedMenu();
  loadSavedMenu();
};
