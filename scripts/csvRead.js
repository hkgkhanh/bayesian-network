let nodesData;

function convertToCSV(data) {
    return data.map(row => row.join(",")).join("\n");
}

function downloadCSVProcess(filename, csvContent) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.id = "csvTemplate";

    const label = document.createElement("label");
    label.htmlFor = "csvTemplate";
    label.className = "file-upload";
    label.innerHTML = "Tải template_data.csv"
    
    document.getElementById("inputDataContainer").insertBefore(label, document.getElementById("csvInputLabel"));
    document.getElementById("inputDataContainer").insertBefore(a, document.getElementById("csvInputLabel")) ;

    label.addEventListener("click", function (e) {
        a.click();
    });
}

function getAccurateDataNumber() {
    let dataLine = [];
    for (let i = 0; i < existingNodes.length; i++) {
        dataLine.push(Math.floor(Math.random() * existingNodes[i].states.length));
    }
    return dataLine;
}

document.getElementById('csvFileInput').addEventListener('input', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        let csvContent = e.target.result;
        
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        outputDiv.style.maxHeight = "300px";
        outputDiv.style.overflow = "auto";
        event.target.value = "";

        csvContent = csvContent.replace(/\r/g, '');
        const rows = csvContent.split('\n').filter(row => row.trim() !== '');

        const data = rows.map(row => row.split(',').map(cell => cell.trim()));
        nodesData = data;
        console.log(nodesData);

        let csvNodes = data[0];
        let netNodes = existingNodes.map(node => node.name);
        for (let i = 0; i < csvNodes.length; i++) {
            if (!netNodes.includes(csvNodes[i])) {
                document.getElementById("output").innerHTML = "Có node trong dữ liệu không tồn tại trong mạng mà bạn đã cài đặt.";
                return;
            }
        }

        for (let i = 0; i < netNodes.length; i++) {
            if (!csvNodes.includes(netNodes[i])) {
                document.getElementById("output").innerHTML = "Có node trong mạng không có dữ liệu";
                return;
            }
        }

        let existingStates = new Map();
        for (let i = 0; i < existingNodes.length; i++) {
            existingStates.set(existingNodes[i].name, existingNodes[i].states);
        }

        for (let i = 1; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (!existingStates.get(data[0][j]).includes(data[i][j])) {
                    document.getElementById("output").innerHTML = "Trạng thái có trong dữ liệu không trùng khớp với các trạng thái có trong mạng.";
                    return;
                }
            }
        }

        const table = document.createElement('table');
        table.style.width = '100%';
        table.setAttribute('border', '1');
        table.style.borderCollapse = "collapse";

        const headerRow = table.insertRow();
        headerRow.appendChild(document.createElement('th'));
        data[0].forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell;
            headerRow.appendChild(th);
        });

        for (let i = 1; i < data.length; i++) {
            const row = table.insertRow();
            let stttd = document.createElement('td');
            stttd.textContent = i;
            row.appendChild(stttd);
            data[i].forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });
        }

        outputDiv.appendChild(table);

        document.getElementById("numDatapoint").innerHTML = data.length - 1;
    };

    reader.readAsText(file);
});


/// lấy dữ liệu từ Bayesian benchmark dataset

document.getElementById('netInitInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const code = event.target.result;

        const lines = code.split("\n");
        const nodes = [];

        existingNodes = [];
        totalNodeCount = 0;

        // Tạo danh sách các node
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("variable")) {
                const name = lines[i].split(" ")[1];
                
                // Đọc dòng tiếp theo để lấy states
                const statesLine = lines[i + 1];
                const states = statesLine.match(/\{(.*?)\}/)[1].split(",").map(s => s.trim());
                
                count++;
                nodes.push({ count, name, states, parents: [], children: [] });
            }
        }

        // Xác định quan hệ cha con
        for (const line of lines) {
            if (line.startsWith("probability")) {
                const matches = line.match(/probability \( (.*?) \| (.*?) \)/);
                if (matches) {
                    const childName = matches[1].trim();
                    const parentNames = matches[2].trim().split(",").map(s => s.trim());

                    const childNode = nodes.find(node => node.name === childName);
                    parentNames.forEach(parentName => {
                        const parentNode = nodes.find(node => node.name === parentName);
                        if (childNode && parentNode) {
                        childNode.parents.push(parentNode.count);
                        parentNode.children.push(childNode.count);
                        }
                    });
                }
            }
        }

        console.log(nodes);
        for (let i = 0; i < nodes.length; i++) {
            let parentIds = [];
            for (let j = 0; j < nodes[i].parents.length; j++) {
                for (let k = 0; k < existingNodes.length; k++) {
                    if (existingNodes[k].name == nodes[i].parents[j].name) {
                        parentIds.push(existingNodes[k].id);
                    }
                }
            }
            existingNodes.push(new BNNode(totalNodeCount + 1, nodes[i].name, nodes[i].states, false, nodes[i].parents));
            totalNodeCount++;
        }

        console.log(existingNodes);

        document.getElementById("nodeDisplayContainer").innerHTML = "";
        existingNodes.forEach(node => node.render());
    };

    reader.readAsText(file);
});

document.getElementById('textFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0]; 

    if (file) {
        const reader = new FileReader();

        nodesData = [];
        let headerRow = [];
        for (let i = 0; i < existingNodes.length; i++) {
            headerRow.push(existingNodes[i].name);
        }
        nodesData.push(headerRow); // hàng đầu tiên là tên node

        reader.onload = (e) => {
            const fileContent = e.target.result;
            
            const lines = fileContent.split("\n");

            for (let i = 0; i < lines.length - 1; i++) {
                let dataLine = lines[i].split(/\s+/).map(Number);
                dataLine.pop();
                console.log(dataLine);
                // let dataLine = getAccurateDataNumber();

                let stateLine = [];
                for (let j = 0; j < dataLine.length - 1; j++) {
                    stateLine.push(existingNodes[j].states[dataLine[j]]);
                }

                nodesData.push(stateLine);
            }

            console.log(nodesData);
        };

        reader.readAsText(file); 
    } else {
        console.log("Không có file nào được chọn.");
    }
});