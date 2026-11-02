export function saveRanking(list, mode = "Ranking") {
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

export function deleteRanking(index) {
  let all = JSON.parse(localStorage.getItem("rankings") || "[]");

  let confirmDelete = confirm("Are you sure you want to delete this ranking?");
  if (!confirmDelete) return;

  all.splice(index, 1); // remove item

  localStorage.setItem("rankings", JSON.stringify(all));

  loadSavedMenu(); // refresh UI
}

