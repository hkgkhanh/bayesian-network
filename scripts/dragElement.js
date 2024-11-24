const addNodeFormContainer = document.getElementById("addNodeFormContainer");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

addNodeFormContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - addNodeFormContainer.offsetLeft;
    offsetY = e.clientY - addNodeFormContainer.offsetTop;
    addNodeFormContainer.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    addNodeFormContainer.style.left = `${x}px`;
    addNodeFormContainer.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    addNodeFormContainer.style.cursor = "grab";
});