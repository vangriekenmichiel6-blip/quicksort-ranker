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

let totalPivots = 0;
let completedPivots = 0;

function hoare(myList, lo, hi){
    let i = lo
    let j = hi+1
    let v = myList[lo]
    while (true){
        while (true){
            i += 1
            if (i === hi) break
            if (compare(myList[i], v, true)) {break}
        }
        while (true){
            j -= 1
            if (j === lo) break
            if (compare(myList[j], v, false)) {break}
        }
        if (i >= j){break}
        [myList[i], myList[j]] = [myList[j], myList[i]]
    }
    [myList[lo], myList[j]] = [myList[j], myList[lo]]
    return j
}

async function partition(myList, lo, hi) {
  let pivot = myList[hi];
  let i = lo;

  for (let j = lo; j < hi; j++) {
    if (await compare(myList[j], pivot)) {
      [myList[i], myList[j]] = [myList[j], myList[i]];
      i++;
    }
  }

  [myList[i], myList[hi]] = [myList[hi], myList[i]];

  return i;
}

async function quickSort(myList, lo, hi) {
  if (lo >= hi) return;

  completedPivots++;
  updateProgress();

  let p = await partition(myList, lo, hi);
  await quickSort(myList, p + 1, hi);
  await quickSort(myList, lo, p - 1);
}

async function sort(myList) {
  shuffle(myList);
  await quickSort(myList, 0, myList.length - 1);
}

function compare(a, b) {
  return new Promise(resolve => {
    const comparisonDiv = document.getElementById("comparison");
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");

    comparisonDiv.style.display = "block";

    // clear previous content
    leftButton.innerHTML = "";
    rightButton.innerHTML = "";

    // add text
    const leftText = document.createElement("div");
    leftText.textContent = a.name;
    const rightText = document.createElement("div");
    rightText.textContent = b.name;

    leftButton.appendChild(leftText);
    rightButton.appendChild(rightText);

    // add image if exists
    if (a.image) {
      const img = document.createElement("img");
      img.src = a.image;
      img.style.maxWidth = "100px";
      img.style.display = "block";
      img.style.marginTop = "5px";
      leftButton.appendChild(img);
    }

    if (b.image) {
      const img = document.createElement("img");
      img.src = b.image;
      img.style.maxWidth = "100px";
      img.style.display = "block";
      img.style.marginTop = "5px";
      rightButton.appendChild(img);
    }

    leftButton.onclick = () => {
      comparisonDiv.style.display = "none";
      resolve(true);  // left item is better
    };
    rightButton.onclick = () => {
      comparisonDiv.style.display = "none";
      resolve(false); // right item is better
    };
  });
}

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

async function startSort(list) {
  document.getElementById("status").innerText = "Sorting...";

  totalPivots = list.length;
  completedPivots = 0;

  updateProgress();

  await sort(list); 

  displayList(list);
  saveRanking(list);
}

function displayList(list) {
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

function loadUnsortedMenu() {
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

function saveRanking(list, mode = "Ranking") {
  let title = prompt(`Enter a title for this ${mode}:`);
  if (!title) return;

  let ranking = {
    title: `${mode}: ${title}`,
    date: new Date().toLocaleString(),
    items: list
  };

  let all = JSON.parse(localStorage.getItem("rankings") || "[]");
  all.push(ranking);

  localStorage.setItem("rankings", JSON.stringify(all));

  loadSavedMenu();
}
    

function loadSavedMenu() {
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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

function deleteRanking(index) {
  let all = JSON.parse(localStorage.getItem("rankings") || "[]");

  let confirmDelete = confirm("Are you sure you want to delete this ranking?");
  if (!confirmDelete) return;

  all.splice(index, 1); // remove item

  localStorage.setItem("rankings", JSON.stringify(all));

  loadSavedMenu(); // refresh UI
}

function updateProgress() {
  document.getElementById("progress").innerText =
    `Progress: ${completedPivots} / ${totalPivots}`;

  let percent = (completedPivots / totalPivots) * 100;
  document.getElementById("progressBar").value = percent;
}

window.onload = function () {
  loadUnsortedMenu();
  loadSavedMenu();
};

function startBlind(list) {
  shuffle(list);

  const selected = list.slice(0, 10);
  const container = document.getElementById("blindContainer");
  const currentItemDiv = document.getElementById("currentItem");

  container.innerHTML = "";

  let slots = Array(10).fill(null);
  let currentIndex = 0;

  function updateCurrentItem() {
    if (currentIndex >= selected.length) {
      currentItemDiv.innerHTML = "<b>Done!</b>";
      return;
    }

    const item = selected[currentIndex];

    currentItemDiv.innerHTML = `
      <div><b>Place this item:</b></div>
      <div>${item.name}</div>
    `;

    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      currentItemDiv.appendChild(img);
    }
  }

  function render() {
    container.innerHTML = "";

    slots.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("blind-slot");

      if (item) {
        div.classList.add("blind-filled");

        div.innerHTML = `
          <div>${index + 1}. ${item.name}</div>
        `;

        if (item.image) {
          let img = document.createElement("img");
          img.src = item.image;
          img.style.maxWidth = "50px";
          div.appendChild(img);
        }
      } else {
        div.textContent = index + 1;
      }

      if (!item && currentIndex < selected.length) {
        div.onclick = () => {
          slots[index] = selected[currentIndex];
          currentIndex++;

          updateCurrentItem();
          render();

          if (currentIndex >= selected.length) {
            displayList(slots);
          }
        };
      }

      container.appendChild(div);
    });
  }

  updateCurrentItem(); // 🔥 initial item
  render();
}

function startKeepCut(list) {
  shuffle(list);

  let selected = list.slice(0, 10); // or 6
  showKeepCut(selected, 5); // keep 5
}

function showKeepCutAll(items, keepCount) {
  const comparisonDiv = document.getElementById("comparison");
  comparisonDiv.style.display = "block";

  let state = "keep";
  let kept = [];
  let cut = [];

  function render() {
    comparisonDiv.innerHTML = "";

    let title = document.createElement("h3");
    title.textContent =
      state === "keep" ? "Pick one to KEEP" : "Pick one to CUT";

    title.textContent += ` (${kept.length}/${keepCount} kept, ${cut.length}/${keepCount} cut)`;

    comparisonDiv.appendChild(title);

    const grid = document.createElement("div");
    grid.classList.add("keepcut-grid");

    items.forEach((item, index) => {
      const btn = document.createElement("button");

      const text = document.createElement("div");
      text.textContent = item.name;
      btn.appendChild(text);

      if (item.image) {
        let img = document.createElement("img");
        img.src = item.image;
        img.style.maxWidth = "60px";
        img.style.display = "block";
        img.style.margin = "5px auto 0";
        btn.appendChild(img);
      }

      // styling
      if (kept.includes(index)) {
        btn.style.background = "lightgreen";
        btn.disabled = true;
      }

      if (cut.includes(index)) {
        btn.style.background = "lightcoral";
        btn.disabled = true;
      }

      // click logic
      if (!kept.includes(index) && !cut.includes(index)) {
        btn.onclick = () => {
          if (state === "keep") {
            kept.push(index);
            state = "cut";
          } else {
            cut.push(index);
            state = "keep";
          }

          // done condition
          if (kept.length === keepCount && cut.length === keepCount) {
          let keptItems = items.filter((_, i) => kept.includes(i));
          let cutItems = items.filter((_, i) => cut.includes(i));

          displayKeepCutResult(keptItems, cutItems);

          saveKeepCut(keptItems, cutItems, "Halved List");   // 🔥 ADD THIS
          loadSavedMenu();       // (optional, but nice)

          return;
        }

          render();
        };
      }

      grid.appendChild(btn);
    });

    comparisonDiv.appendChild(grid);
  }

  render();
}

function startHalf(list) {
  shuffle(list);

  let keepCount = Math.floor(list.length / 2);
  showKeepCutAll(list, keepCount);
}

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
