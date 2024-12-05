// Dữ liệu ban đầu: Danh sách các node hiện có
const existingNodes = [];
var totalNodeCount = 0;

let BenhCumNode = new BNNode(1, "Bệnh cúm", ["có", "không", "không biết"], false, [2, 3]);
existingNodes.push(BenhCumNode);
totalNodeCount++;

let HoNode = new BNNode(2, "Ho", ["có", "không", "không biết"], false, []);
existingNodes.push(HoNode);
totalNodeCount++;

let khoThoNode = new BNNode(3, "Khó thở", ["có", "không", "không biết"], true, []);
existingNodes.push(khoThoNode);
totalNodeCount++;

document.getElementById("nodeDisplayContainer").innerHTML = "";
existingNodes.forEach(node => node.render());

const parentsSelect = document.getElementById("parents");
const selectedParentsList = document.getElementById("selectedParents");
const createNodeButton = document.getElementById("createNodeButton");

function clearDropdown() {
    parentsSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Chọn Node cha";
    parentsSelect.appendChild(defaultOption);
}

function populateDropdown() {
    clearDropdown();
    existingNodes.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.id;
        option.textContent = node.name;
        parentsSelect.appendChild(option);
    });
}

parentsSelect.addEventListener("change", () => {
    const selectedValue = parentsSelect.value;

    if ([...selectedParentsList.children].some((li) => li.dataset.value === selectedValue)) {
        alert("Node này đã được chọn!");
        return;
    }

    const listItem = document.createElement("li");
    listItem.dataset.value = selectedValue;

    const nodeName = document.createElement("span");
    const selectedNode = existingNodes.find(node => node.id === parseInt(selectedValue));

    if (selectedNode) {
        nodeName.textContent = selectedNode.name;
    } else {
        console.error("Không tìm thấy node với ID:", selectedValue);
    }

    const removeButton = document.createElement("button");
    removeButton.textContent = "×";
    removeButton.title = "Xóa Node này";
    removeButton.addEventListener("click", () => {
        listItem.remove();
    });

    listItem.appendChild(nodeName);
    listItem.appendChild(removeButton);
    selectedParentsList.appendChild(listItem);
});


function getSelectedParents() {
    return [...selectedParentsList.children].map((li) => parseInt(li.dataset.value));
}   

createNodeButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const statesInput = document.getElementById("states").value.trim();
    const parents = getSelectedParents();

    if (!name) {
        alert("Tên Node không được để trống!");
        return;
    }

    if (!statesInput) {
        alert("Trạng thái không được để trống!");
        return;
    }

    const states = statesInput.split(",").map((state) => state.trim());

    const statesSet = new Set(states);
    if (statesSet.size !== states.length) {
        alert("Có trạng thái trùng lặp! Vui lòng kiểm tra lại.");
        return;
    }

    const isDynamic = document.getElementById("dynamic").checked;
    totalNodeCount++;

    const newNode = new BNNode(totalNodeCount, name, states, isDynamic, parents);
    existingNodes.push(newNode);

    document.getElementById("nodeDisplayContainer").innerHTML = "";
    existingNodes.forEach(node => node.render());

    document.getElementById("name").value = "";
    document.getElementById("states").value = "";
    selectedParentsList.innerHTML = "";
    populateDropdown();
});

function assignNodeId() {
    for (let i = 0; i < existingNodes.length; i++) {
        existingNodes[i].id = i;
    }
}

populateDropdown();