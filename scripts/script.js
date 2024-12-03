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


// Hiển thị các node dưới dạng hình tròn
document.getElementById("nodeDisplayContainer").innerHTML = "";
existingNodes.forEach(node => node.render());

// Khởi tạo các thành phần
const parentsSelect = document.getElementById("parents");
const selectedParentsList = document.getElementById("selectedParents");
const createNodeButton = document.getElementById("createNodeButton");

// Hàm làm trống danh sách dropdown
function clearDropdown() {
    parentsSelect.innerHTML = ""; // Xóa tất cả các tùy chọn
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Chọn Node cha";
    parentsSelect.appendChild(defaultOption);
}

// Tải các node vào dropdown
function populateDropdown() {
    clearDropdown();
    existingNodes.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.id;
        option.textContent = node.name;
        parentsSelect.appendChild(option);
    });
}

// Thêm node cha đã chọn vào danh sách
parentsSelect.addEventListener("change", () => {
    const selectedValue = parentsSelect.value;

    // Kiểm tra nếu node đã được chọn trước đó
    if ([...selectedParentsList.children].some((li) => li.dataset.value === selectedValue)) {
        alert("Node này đã được chọn!");
        return;
    }

    // Tạo item danh sách hiển thị
    const listItem = document.createElement("li");
    listItem.dataset.value = selectedValue;

    const nodeName = document.createElement("span");
    // nodeName.textContent = existingNodes[selectedValue].name;
    const selectedNode = existingNodes.find(node => node.id === parseInt(selectedValue));

    if (selectedNode) {
        // Cập nhật nội dung text cho nodeName
        nodeName.textContent = selectedNode.name;
    } else {
        console.error("Không tìm thấy node với ID:", selectedValue);
    }

    const removeButton = document.createElement("button");
    removeButton.textContent = "×"; // Nút nhỏ để xóa
    removeButton.title = "Xóa Node này";
    removeButton.addEventListener("click", () => {
        listItem.remove(); // Xóa node khỏi danh sách
    });

    listItem.appendChild(nodeName);
    listItem.appendChild(removeButton);
    selectedParentsList.appendChild(listItem);
});


// Lấy danh sách các node cha đã chọn
function getSelectedParents() {
    return [...selectedParentsList.children].map((li) => parseInt(li.dataset.value));
}   

// Xử lý khi nhấn nút "Tạo Node"
createNodeButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const statesInput = document.getElementById("states").value.trim();
    const parents = getSelectedParents();

    // Kiểm tra dữ liệu đầu vào
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
    totalNodeCount++; // sẽ trở thành id của Node

    // Tạo object Node
    const newNode = new BNNode(totalNodeCount, name, states, isDynamic, parents);
    existingNodes.push(newNode);
    // assignNodeId();

    // Hiển thị các node dưới dạng hình tròn
    document.getElementById("nodeDisplayContainer").innerHTML = "";
    existingNodes.forEach(node => node.render());

    // Reset form sau khi tạo thành công
    document.getElementById("name").value = "";
    document.getElementById("states").value = "";
    selectedParentsList.innerHTML = ""; // Xóa danh sách node cha đã chọn
    populateDropdown(); // Chạy hàm khởi tạo dropdown
});

function assignNodeId() {
    for (let i = 0; i < existingNodes.length; i++) {
        existingNodes[i].id = i;
    }
}

// Chạy hàm khởi tạo dropdown
populateDropdown();