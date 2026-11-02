
import {shuffle} from "./basics.js";
import { saveKeepCut } from "./storage.js";
import { loadSavedMenu } from "./ui.js";

export function startKeepCut(list) {
  shuffle(list);

  let selected = list.slice(0, 10); // or 6
  showKeepCut(selected, 5); // keep 5
}

export function showKeepCut(items, keepCount) {
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

          displayKeepCutGrid(keptItems, cutItems);

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

export function displayKeepCutGrid(kept, cut) {
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
