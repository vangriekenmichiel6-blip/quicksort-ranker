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