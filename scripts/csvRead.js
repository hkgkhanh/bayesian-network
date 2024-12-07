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