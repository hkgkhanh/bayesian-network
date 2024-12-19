const existingNodes = [];
var totalNodeCount = 0;

function testCase1() {
    let envNode = new BNNode(1, "Môi trường", ["ẩm ướt", "khô ráo"], false, []);
    existingNodes.push(envNode);
    totalNodeCount++;

    let exposureNode = new BNNode(2, "Tiếp xúc mầm bệnh", ["có", "không", "không biết"], false, [1]);
    existingNodes.push(exposureNode);
    totalNodeCount++;

    let immunityNode = new BNNode(3, "Miễn dịch", ["tốt", "tệ"], false, []);
    existingNodes.push(immunityNode);
    totalNodeCount++;

    let diseaseNode = new BNNode(4, "Bị bệnh", ["có", "không", "không biết"], false, [2, 3]);
    existingNodes.push(diseaseNode);
    totalNodeCount++;

    let feverNode = new BNNode(5, "Sốt", ["có", "không"], true, [4]);
    existingNodes.push(feverNode);
    totalNodeCount++;

    let coughNode = new BNNode(6, "Ho", ["có", "không"], true, [4]);
    existingNodes.push(coughNode);
    totalNodeCount++;

    let fatigueNode = new BNNode(7, "Mệt mỏi", ["có", "không"], true, [4]);
    existingNodes.push(fatigueNode);

    let diagnosisNode = new BNNode(8, "Chẩn đoán", ["bị bệnh", "không bị bệnh"], false, [4, 5, 6, 7]);
    existingNodes.push(diagnosisNode);
    totalNodeCount++;

    document.getElementById("nodeDisplayContainer").innerHTML = "";
    existingNodes.forEach(node => node.render());
}

function testCase2() {
    
}

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