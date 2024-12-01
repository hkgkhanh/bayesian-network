// hàm tính xác suất của những node không có node cha
function getProbNoCond(nodeName, state) {
    let numDataPoint = nodesData.length - 1; // vì phần tử đầu tiên là mảng tên của các node
    let stateCount = 0;
    let nodeIndex = nodesData[0].indexOf(nodeName);

    for (let i = 1; i < nodesData.length; i++) {
        if (nodesData[i][nodeIndex] == state) {
            stateCount++;
        }
    }

    return stateCount / numDataPoint;
}

// hàm tính xác suất của những node có node cha
function getProbWithCond(nodeName, nodeState, parentName, parentState) {
    let numDataPoint = 0;
    let stateCount = 0;
    let parentIndex = nodesData[0].indexOf(parentName);
    let nodeIndex = nodesData[0].indexOf(nodeName);

    for (let i = 1; i < nodesData.length; i++) {
        if (nodesData[i][parentIndex] == parentState) {
            numDataPoint++;
            continue;
        }
        if (nodesData[i][nodeIndex] == nodeState) stateCount++;
    }

    return stateCount / numDataPoint;
}

// tạo các bảng CPD (Conditional Probability Distribution)
function processCalcProbs() {
    document.getElementById("resultDisplayContainer").innerHTML = "";
    for (let i = 0; i < existingNodes.length; i++) {

        if (existingNodes[i].parentNodes.length == 0) {
            let table = document.createElement("table");
            table.setAttribute('border', '1');
            table.style.borderCollapse = "collapse";
            table.style.textAlign = "center";

            // Tạo bảng tiêu đề (dòng đầu tiên)
            const headerRow = table.insertRow();
            existingNodes[i].states.forEach(state => {
                const th = document.createElement('th');
                th.textContent = existingNodes[i].name + " = " + state;
                headerRow.appendChild(th);
            });

            let row = table.insertRow();
            existingNodes[i].states.forEach(state => {
                let td = document.createElement('td');
                td.textContent = getProbNoCond(existingNodes[i].name, state);
                row.appendChild(td);
            });

            document.getElementById("resultDisplayContainer").appendChild(table);

            continue;
        }

        for (let j = 0; j < existingNodes[i].parentNodes.length; j++) {
            let table = document.createElement("table");
            table.setAttribute('border', '1');
            table.style.borderCollapse = "collapse";
            table.style.textAlign = "center";

            // Tạo bảng tiêu đề (dòng đầu tiên)
            const headerRow = table.insertRow();
            headerRow.appendChild(document.createElement('th'));
            existingNodes[i].states.forEach(state => {
                const th = document.createElement('th');
                th.textContent = existingNodes[i].name + " = " + state;
                headerRow.appendChild(th);
            });

            // từ ID để tìm ra index của parentNode trong existingNodes
            let parentNodeId = existingNodes[i].parentNodes[j];
            let parentNodeIndex = 0;
            for (let k = 0; k < existingNodes.length; k++) {
                if (existingNodes[k].id == parentNodeId) {
                    parentNodeIndex = k;
                    break;
                }
            }

            // duyệt qua từng state của parent
            let statesOfParent = existingNodes[parentNodeIndex].states;
            statesOfParent.forEach(parentState => {
                let row = table.insertRow();
                let parentStateCell = document.createElement('td');
                parentStateCell.textContent = existingNodes[parentNodeIndex].name + " = " + parentState;
                row.appendChild(parentStateCell);

                existingNodes[i].states.forEach(state => {
                    const td = document.createElement('td');
                    td.textContent = getProbWithCond(existingNodes[i].name, state, existingNodes[parentNodeIndex].name, parentState);
                    row.appendChild(td);
                });
            });

            document.getElementById("resultDisplayContainer").appendChild(table);
        }
    }
}