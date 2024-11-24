// Dữ liệu ban đầu: Danh sách các node hiện có
const existingNodes = [];

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
    nodeName.textContent = existingNodes[selectedValue].name;

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
    return [...selectedParentsList.children].map((li) => li.dataset.value);
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

    // Tạo object Node
    const newNode = new Node(name, states, parents);
    console.log("Node mới được tạo:");
    newNode.displayNode();

    // Thêm node vào danh sách hiện có
    existingNodes.push(newNode);
    assignNodeId();

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

