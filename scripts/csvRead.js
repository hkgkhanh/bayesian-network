let nodesData;

document.getElementById('csvFileInput').addEventListener('input', function (event) {
    const file = event.target.files[0]; // Lấy tệp CSV
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        let csvContent = e.target.result;
        
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = ''; // Xóa nội dung cũ
        outputDiv.style.maxHeight = "300px";
        outputDiv.style.overflow = "auto";
        event.target.value = "";

        // Loại bỏ \r và tách các hàng
        csvContent = csvContent.replace(/\r/g, '');
        const rows = csvContent.split('\n').filter(row => row.trim() !== ''); // Loại bỏ hàng rỗng

        // Chia từng hàng thành mảng
        const data = rows.map(row => row.split(',').map(cell => cell.trim())); // Trim dữ liệu từng ô
        nodesData = data;
        // console.log(data); // Mảng 2 chiều từ CSV

        // kiểm tra dữ liệu có khớp với cấu hình mạng Bayes không
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
        // console.log(existingStates);

        for (let i = 1; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                // console.log(existingStates.get(data[0][j]));
                if (!existingStates.get(data[0][j]).includes(data[i][j])) {
                    document.getElementById("output").innerHTML = "Trạng thái có trong dữ liệu không trùng khớp với các trạng thái có trong mạng.";
                    return;
                }
            }
        }

        // Hiển thị dữ liệu dưới dạng bảng
        const table = document.createElement('table');
        table.style.width = '100%';
        table.setAttribute('border', '1');
        table.style.borderCollapse = "collapse";

        // Tạo bảng tiêu đề (dòng đầu tiên)
        const headerRow = table.insertRow();
        headerRow.appendChild(document.createElement('th'));
        data[0].forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell;
            headerRow.appendChild(th);
        });

        // Tạo các dòng dữ liệu
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

        // Đưa bảng vào giao diện
        outputDiv.appendChild(table);

        document.getElementById("numDatapoint").innerHTML = data.length - 1;
    };

    reader.readAsText(file); // Đọc tệp dưới dạng text
});
