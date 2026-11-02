
import {shuffle} from "./basics.js";

export function startKeepCut(list) {
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