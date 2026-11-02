import {shuffle} from "./basics.js";

let totalPivots = 0;
let completedPivots = 0;

export async function startSort(list) {
  document.getElementById("status").innerText = "Sorting...";

  totalPivots = list.length;
  completedPivots = 0;

  updateProgress();

  await sort(list); 

  displayList(list);
  saveRanking(list);
}

async function sort(myList) {
  shuffle(myList);
  await quickSort(myList, 0, myList.length - 1);
}

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

function updateProgress() {
  document.getElementById("progress").innerText =
    `Progress: ${completedPivots} / ${totalPivots}`;

  let percent = (completedPivots / totalPivots) * 100;
  document.getElementById("progressBar").value = Number.isFinite(percent) ? percent : 0;
}