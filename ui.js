const unsortedFiles = [
  { name: "Pixar Movies", file: "lists/pixar.txt" },
  { name: "Pokemon Gen 1", file: "lists/pokemonGen1.txt" },
  { name: "KUL Vakken", file: "lists/kulvakken.txt"},
  { name: "MG Galaxies", file: "lists/mariogalaxies.txt"},
  { name: "MG Stars", file: "lists/galaxystars.txt"},
  { name: "SOAD Songs", file: "lists/soadsongs.txt"},
  { name: "Platen", file: "lists/platen.txt"},
  { name: "CD's + Platen", file: "lists/platenencds.txt"},
  { name: "Dieren", file: "lists/animals.txt"},
  { name: "R6 Ops", file: "lists/r6ops.txt"},
  { name: "R6 Attackers", file: "lists/r6att.txt"},
  { name: "R6 Defenders", file: "lists/r6def.txt"},
  { name: "MCU", file: "lists/MCUprojects.txt"},
  { name: "PZ1 Animals", file: "lists/pz1allanimals.txt"},
  { name: "Marvel", file: "lists/marvel.txt"},
];

export function displayList(list) {
    const resultContainer = document.getElementById("resultList");
    resultContainer.innerHTML = "";

    const columns = 3;
    const rows = Math.ceil(list.length / columns);

    resultContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    resultContainer.style.gridTemplateRows = `repeat(${rows}, auto)`;
    resultContainer.style.gridAutoFlow = "row";

    list.forEach((item, index) => {
        const li = document.createElement("li");

        const nameDiv = document.createElement("div");
        nameDiv.textContent = `${index + 1}. ${item.name}`;
        li.appendChild(nameDiv);

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.style.maxWidth = "100px";
            img.style.display = "block";
            img.style.marginTop = "5px";
            li.appendChild(img);
        }

        resultContainer.appendChild(li);
    });
}

export function loadSavedMenu() { // shows saved rankings buttons
  const menu = document.getElementById("savedMenu");
  menu.innerHTML = "";

  let all = JSON.parse(localStorage.getItem("rankings") || "[]");

  menu.style.width = "100%";
  menu.style.minWidth = "0";

  all.forEach((ranking, index) => {
    const container = document.createElement("div");

    // Force a horizontal layout
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.alignItems = "center";
    container.style.width = "100%";
    container.style.gap = "6px";
    container.style.marginBottom = "8px";

    // LOAD BUTTON
    const loadBtn = document.createElement("button");
    loadBtn.textContent = `${ranking.title} (${ranking.date})`;

    loadBtn.style.flex = "1 1 0";
    loadBtn.style.width = "0";
    loadBtn.style.minWidth = "0";
    loadBtn.style.boxSizing = "border-box";
    loadBtn.style.textAlign = "left";
    loadBtn.style.overflowWrap = "anywhere";
    loadBtn.style.margin = "0";

    loadBtn.onclick = () => {
      let all = JSON.parse(localStorage.getItem("rankings") || "[]");
      let data = all[index];

      if (data.items) {
        displayList(data.items);
      } 
      else if (data.kept && data.cut) {
        displayKeepCutGrid(data.kept, data.cut);
      }
    };

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";

    deleteBtn.style.flex = "0 0 42px";
    deleteBtn.style.width = "42px";
    deleteBtn.style.minWidth = "42px";
    deleteBtn.style.boxSizing = "border-box";
    deleteBtn.style.margin = "0";
    deleteBtn.style.padding = "8px 4px";

    deleteBtn.onclick = () => {
      deleteRanking(index);
    };

    container.appendChild(loadBtn);
    container.appendChild(deleteBtn);
    menu.appendChild(container);
  });
}

export function loadUnsortedMenu() { //shows possible rankings buttons
  const menu = document.getElementById("unsortedMenu");
  menu.innerHTML = "";

  unsortedFiles.forEach(entry => {
    const btn = document.createElement("button");
    btn.textContent = entry.name;

    btn.onclick = async () => {
      let response = await fetch(entry.file);
      let text = await response.text();

      document.getElementById("inputList").value = text;
    };

    menu.appendChild(btn);
  });
}