import { loadSavedMenu } from "./ui.js";

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

export function saveKeepCut(kept, cut, mode = "Keep/Cut") {
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

export function importRankings(event) {
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


// Export/import makes it possible to move saved rankings from the local
// Live Server address to the published website (each origin has separate storage).
export function exportRankings() {
  const rankings = JSON.parse(localStorage.getItem("rankings") || "[]");
  const blob = new Blob([JSON.stringify(rankings, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quicksort-rank-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}