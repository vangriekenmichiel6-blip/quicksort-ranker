
import {startSort} from "./quicksort.js";
import {startBlind} from "./blindranking.js";
import {startKeepCut} from "./keepcut.js";
import {startHalf} from "./halflist.js";
import {loadUnsortedMenu} from "./ui.js";
import {loadSavedMenu} from "./ui.js";

document.getElementById("startButton").addEventListener("click", start);

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

function saveKeepCut(kept, cut, mode = "Keep/Cut") {
  let title = prompt(`Enter a title for this ${mode}:`);
  if (!title) return;

  let data = {
    title: `${mode}: ${title}`,
    date: new Date().toLocaleString(),
    kept: kept,
    cut: cut
  };

  let all = JSON.parse(localStorage.getItem("rankings") || "[]");
  all.push(data);

  localStorage.setItem("rankings", JSON.stringify(all));

  loadSavedMenu();
}

function displayKeepCutGrid(kept, cut) {
  const container = document.getElementById("resultList");
  container.innerHTML = "";

  // 🔥 WRAPPER to match game layout
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";

  const grid = document.createElement("div");
  grid.classList.add("keepcut-grid");

  let all = [
    ...kept.map(i => ({...i, status: "keep"})),
    ...cut.map(i => ({...i, status: "cut"}))
  ];

  all.forEach(item => {
    const box = document.createElement("div");

    box.style.padding = "10px";
    box.style.border = "1px solid #ccc";
    box.style.borderRadius = "8px";
    box.style.textAlign = "center";
    box.style.width = "100%"; // 🔥 important for grid consistency

    box.textContent = item.name;

    if (item.image) {
      let img = document.createElement("img");
      img.src = item.image;
      img.style.maxWidth = "70px";
      img.style.display = "block";
      img.style.margin = "5px auto 0";
      box.appendChild(img);
    }

    box.style.background =
      item.status === "keep" ? "lightgreen" : "lightcoral";

    grid.appendChild(box);
  });

  wrapper.appendChild(grid);
  container.appendChild(wrapper);
}

// Export/import makes it possible to move saved rankings from the local
// Live Server address to the published website (each origin has separate storage).
function exportRankings() {
  const rankings = JSON.parse(localStorage.getItem("rankings") || "[]");
  const blob = new Blob([JSON.stringify(rankings, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quicksort-rank-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importRankings(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported) || !imported.every(entry =>
        entry && typeof entry.title === "string" && Array.isArray(entry.items || entry.kept || [])
      )) {
        throw new Error("This doesn't look like a Quicksort Rank backup.");
      }

      const current = JSON.parse(localStorage.getItem("rankings") || "[]");
      const replace = confirm(
        `Found ${imported.length} saved ranking(s).\\n` +
        `Choose OK to replace your current ${current.length} ranking(s), or Cancel to add them.`
      );

      const combined = replace ? imported : current.concat(imported);
      localStorage.setItem("rankings", JSON.stringify(combined));
      loadSavedMenu();
      alert(`Imported ${imported.length} ranking(s).`);
    } catch (error) {
      alert("Could not import this backup: " + error.message);
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}
