import {shuffle} from "./basics.js";
import {displayList} from "./ui.js";

export function startBlind(list) {
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