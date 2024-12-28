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
        }
    }

    for (let i = 1; i < nodesData.length; i++) {
        if (nodesData[i][parentIndex] == parentState && nodesData[i][nodeIndex] == nodeState) {
            stateCount++;
        }
    }

    if (numDataPoint == 0) return "divided by 0";

    return stateCount / numDataPoint;
}

// hàm tính xác suất của những node động
function getProbDynamic(nodeIndex, currState, prevState) {
    let numDataPoint = 0;
    let stateCount = 0;

    for (let i = 1; i < nodesData.length - 1; i++) {
        if (nodesData[i][nodeIndex] == prevState) {
            numDataPoint++;
        }
    }

    for (let i = 2; i < nodesData.length; i++) {
        if (nodesData[i][nodeIndex] == currState && nodesData[i - 1][nodeIndex] == prevState) {
            stateCount++;
        }
    }

    return stateCount / numDataPoint;
}

function calcSpecificProb(nodeID, conditions) {
    let nodeState = conditions[0];
    let nodeIndexInExistingNodes = existingNodes.findIndex(node => node.id === nodeID);
    let nodeIndex = nodesData[0].indexOf(existingNodes[nodeIndexInExistingNodes].name);

    let stateCount = 0;
    let numDataPoint = 0;

    if (conditions.length - existingNodes[nodeIndexInExistingNodes].parentNodes.length == 2) { // isDynamic == true
        let interestedPrevState = conditions[1];

        for (let i = 2; i < nodesData.length; i++) {
            if (interestedPrevState != "" && nodesData[i - 1][nodeIndex] != interestedPrevState) continue;
            let isValid = true;

            for (j = 2; j < conditions.length; j++) {
                let parentID = existingNodes[nodeIndexInExistingNodes].parentNodes[j - 2];
                let parentIndexInExistingNodes = existingNodes.findIndex(node => node.id === parentID);
                let parentIndex = nodesData[0].indexOf(existingNodes[parentIndexInExistingNodes].name);

                if (conditions[j] == "") continue;

                if (nodesData[i][parentIndex] != conditions[j]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                numDataPoint++;
    
                if (nodesData[i][nodeIndex] == nodeState) stateCount++;
            }
        }
    } else { // isDynamic == false
        for (let i = 1; i < nodesData.length; i++) {
            let isValid = true;

            for (j = 1; j < conditions.length; j++) {
                let parentID = existingNodes[nodeIndexInExistingNodes].parentNodes[j - 1];
                let parentIndexInExistingNodes = existingNodes.findIndex(node => node.id === parentID);
                let parentIndex = nodesData[0].indexOf(existingNodes[parentIndexInExistingNodes].name);

                if (conditions[j] == "") continue;

                if (nodesData[i][parentIndex] != conditions[j]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                numDataPoint++;
    
                if (nodesData[i][nodeIndex] == nodeState) stateCount++;
            }
        }
    }

    if (numDataPoint == 0) return "Không có điều kiện thỏa mãn";
    return stateCount / numDataPoint;
}

function backwardCalcSpecificProb(nodeID, conditions) {
    let nodeState = conditions[0];
    let nodeIndexInExistingNodes = existingNodes.findIndex(node => node.id === nodeID);
    let nodeIndex = nodesData[0].indexOf(existingNodes[nodeIndexInExistingNodes].name);

    let stateCount = 0;
    let numDataPoint = 0;

    if (existingNodes[nodeIndex].isDynamic) { // isDynamic == true
        let interestedPrevState = conditions[1];

        for (let i = 1; i < nodesData.length - 1; i++) {
            if (interestedPrevState != "" && nodesData[i + 1][nodeIndex] != interestedPrevState) continue;
            let isValid = true;

            for (j = 2; j < conditions.length; j++) {
                let childID = -1;
                let childIndex = -1;
                for (let k = 0; k < existingNodes.length; k++) {
                    if (existingNodes[k].parentNodes.includes(nodeID)) {
                        childID = existingNodes[k].id;
                        childIndex = k;
                        break;
                    }
                }

                if (conditions[j] == "") continue;

                if (nodesData[i][childIndex] != conditions[j]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                numDataPoint++;
    
                if (nodesData[i][nodeIndex] == nodeState) stateCount++;
            }
        }
    } else { // isDynamic == false
        for (let i = 1; i < nodesData.length; i++) {
            let isValid = true;

            for (j = 1; j < conditions.length; j++) {
                let childID = -1;
                let childIndex = -1;
                for (let k = 0; k < existingNodes.length; k++) {
                    if (existingNodes[k].parentNodes.includes(nodeID)) {
                        childID = existingNodes[k].id;
                        childIndex = k;
                        break;
                    }
                }

                if (conditions[j] == "") continue;

                if (nodesData[i][childIndex] != conditions[j]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                numDataPoint++;
    
                if (nodesData[i][nodeIndex] == nodeState) stateCount++;
            }
        }
    }

    if (numDataPoint == 0) return "Không có điều kiện thỏa mãn";
    return stateCount / numDataPoint;
}

function forwardCalc() {
    document.getElementById("selectProbContainer").innerHTML = "<br><br>Tính toán xuôi:<br><br>P(";

    let select = document.createElement("select");
    select.id = "nodeSelectElement";
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Chọn 1 node";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    for (let i = 0; i < existingNodes.length; i++) {
        let option = document.createElement("option");
        option.value = existingNodes[i].id;
        option.textContent = existingNodes[i].name;
        select.appendChild(option);
    }

    document.getElementById("selectProbContainer").appendChild(select);
    let spanPlaceholder = document.createElement("span");
    spanPlaceholder.innerHTML = ")";
    document.getElementById("selectProbContainer").appendChild(spanPlaceholder);

    select.addEventListener("change", function (e) {
        spanPlaceholder.innerHTML = "=";
        
        let nodeID = parseInt(select.value);
        let nodeIndex = existingNodes.findIndex(node => node.id === nodeID);

        // chọn state cần tính xác suất
        let stateSelect = document.createElement("select");
        for (let i = 0; i < existingNodes[nodeIndex].states.length; i++) {
            let option = document.createElement("option");
            option.value = existingNodes[nodeIndex].states[i];
            option.textContent = existingNodes[nodeIndex].states[i];
            stateSelect.appendChild(option);

            if (i == 0) option.selected = true;
        }
        spanPlaceholder.appendChild(stateSelect);
        spanPlaceholder.innerHTML += " | ";

        // chọn điều kiện từ node động
        if (existingNodes[nodeIndex].isDynamic) {
            spanPlaceholder.innerHTML += existingNodes[nodeIndex].name + "(t-1)=";

            let prevStateSelect = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Tùy ý";
            defaultOption.selected = true;
            prevStateSelect.appendChild(defaultOption);

            for (let i = 0; i < existingNodes[nodeIndex].states.length; i++) {
                let option = document.createElement("option");
                option.value = existingNodes[nodeIndex].states[i];
                option.textContent = existingNodes[nodeIndex].states[i];
                prevStateSelect.appendChild(option);
            }
            spanPlaceholder.appendChild(prevStateSelect);
        }

        if (existingNodes[nodeIndex].isDynamic && existingNodes[nodeIndex].parentNodes.length > 0) {
            spanPlaceholder.innerHTML += ", ";
        }

        // chọn điều kiện từ node cha
        for (let i = 0; i < existingNodes[nodeIndex].parentNodes.length; i++) {
            let parentID = existingNodes[nodeIndex].parentNodes[i];
            let parentIndex = existingNodes.findIndex(node => node.id === parentID);

            spanPlaceholder.innerHTML += existingNodes[parentIndex].name + "=";

            let parentStateSelect = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Tùy ý";
            defaultOption.selected = true;
            parentStateSelect.appendChild(defaultOption);

            for (let i = 0; i < existingNodes[parentIndex].states.length; i++) {
                let option = document.createElement("option");
                option.value = existingNodes[parentIndex].states[i];
                option.textContent = existingNodes[parentIndex].states[i];
                parentStateSelect.appendChild(option);
            }
            spanPlaceholder.appendChild(parentStateSelect);

            if (i < existingNodes[nodeIndex].parentNodes.length - 1) spanPlaceholder.innerHTML += ", ";
        }

        spanPlaceholder.innerHTML += ") = ";

        const selects = spanPlaceholder.querySelectorAll('select');
        let selectsValues = Array.from(selects).map(select => select.value);

        let resultSpan = document.createElement("span");
        resultSpan.innerHTML = calcSpecificProb(parseInt(select.value), selectsValues); // các phần tử theo thứ tự đầu tiên là giá trị của node cần tính, sau đó là node dynamic nếu có, sau đó là các node cha theo thứ tự trong thuộc tính parentNodes
        spanPlaceholder.appendChild(resultSpan);

        // đặt event listener cho các tag select
        for (let i = 0; i < selects.length; i++) {
            selects[i].addEventListener("change", function (e) {
                const selects = spanPlaceholder.querySelectorAll('select');
                let selectsValues = Array.from(selects).map(select => select.value);
                resultSpan.innerHTML = calcSpecificProb(parseInt(select.value), selectsValues);
            });
        }
    });
}

function backwardCalc() {
    document.getElementById("backwardSelectProbContainer").innerHTML = "<br><br>Tính toán ngược:<br><br>P(";

    let select = document.createElement("select");
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Chọn 1 node";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    for (let i = 0; i < existingNodes.length; i++) {
        let option = document.createElement("option");
        option.value = existingNodes[i].id;
        option.textContent = existingNodes[i].name;
        select.appendChild(option);
    }

    document.getElementById("backwardSelectProbContainer").appendChild(select);
    let spanPlaceholder = document.createElement("span");
    spanPlaceholder.innerHTML = ")";
    document.getElementById("backwardSelectProbContainer").appendChild(spanPlaceholder);

    select.addEventListener("change", function (e) {
        spanPlaceholder.innerHTML = "=";
        
        let nodeID = parseInt(select.value);
        let nodeIndex = existingNodes.findIndex(node => node.id === nodeID);

        // chọn state cần tính xác suất
        let stateSelect = document.createElement("select");
        for (let i = 0; i < existingNodes[nodeIndex].states.length; i++) {
            let option = document.createElement("option");
            option.value = existingNodes[nodeIndex].states[i];
            option.textContent = existingNodes[nodeIndex].states[i];
            stateSelect.appendChild(option);

            if (i == 0) option.selected = true;
        }
        spanPlaceholder.appendChild(stateSelect);
        spanPlaceholder.innerHTML += " | ";

        // chọn điều kiện từ node động
        if (existingNodes[nodeIndex].isDynamic) {
            spanPlaceholder.innerHTML += existingNodes[nodeIndex].name + "(t+1)=";

            let prevStateSelect = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Tùy ý";
            defaultOption.selected = true;
            prevStateSelect.appendChild(defaultOption);

            for (let i = 0; i < existingNodes[nodeIndex].states.length; i++) {
                let option = document.createElement("option");
                option.value = existingNodes[nodeIndex].states[i];
                option.textContent = existingNodes[nodeIndex].states[i];
                prevStateSelect.appendChild(option);
            }
            spanPlaceholder.appendChild(prevStateSelect);

            spanPlaceholder.innerHTML += ", ";
        }

        let childID = -1;
        let childIndex = -1;
        for (let i = 0; i < existingNodes.length; i++) {
            if (existingNodes[i].parentNodes.includes(nodeID)) {
                childID = existingNodes[i].id;
                childIndex = i;
                break;
            }
        }

        if (childIndex != -1) {

            spanPlaceholder.innerHTML += existingNodes[childIndex].name + "=";

            let childStateSelect = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Tùy ý";
            defaultOption.selected = true;
            childStateSelect.appendChild(defaultOption);

            for (let i = 0; i < existingNodes[childIndex].states.length; i++) {
                let option = document.createElement("option");
                option.value = existingNodes[childIndex].states[i];
                option.textContent = existingNodes[childIndex].states[i];
                childStateSelect.appendChild(option);
            }
            spanPlaceholder.appendChild(childStateSelect);
        }

        spanPlaceholder.innerHTML += ") = ";

        const selects = spanPlaceholder.querySelectorAll('select');
        let selectsValues = Array.from(selects).map(select => select.value);

        let resultSpan = document.createElement("span");
        resultSpan.innerHTML = backwardCalcSpecificProb(parseInt(select.value), selectsValues); // các phần tử theo thứ tự đầu tiên là giá trị của node cần tính, sau đó là node dynamic nếu có, sau đó là các node cha theo thứ tự trong thuộc tính parentNodes
        spanPlaceholder.appendChild(resultSpan);

        // đặt event listener cho các tag select
        for (let i = 0; i < selects.length; i++) {
            selects[i].addEventListener("change", function (e) {
                const selects = spanPlaceholder.querySelectorAll('select');
                let selectsValues = Array.from(selects).map(select => select.value);
                resultSpan.innerHTML = backwardCalcSpecificProb(parseInt(select.value), selectsValues);
            });
        }
    });
}

// tạo các bảng CPD (Conditional Probability Distribution)
function processCalcProbs() {
    document.getElementById("resultDisplayContainer").innerHTML = "";
    location.href = "#";
    location.href = "#resultDisplayContainer";
    for (let i = 0; i < existingNodes.length; i++) {

        if (existingNodes[i].isDynamic == true) {
            let table = document.createElement("table");
            table.setAttribute('border', '1');
            table.style.borderCollapse = "collapse";
            table.style.textAlign = "center";
            table.style.margin = "10px";

            const headerRow = table.insertRow();
            headerRow.appendChild(document.createElement('th'));
            existingNodes[i].states.forEach(state => {
                const th = document.createElement('th');
                th.textContent = existingNodes[i].name + "(t) = " + state;
                th.style.padding = "10px";
                headerRow.appendChild(th);
            });

            // duyệt qua từng state của parent
            let prevStates = existingNodes[i].states;
            prevStates.forEach(prevState => {
                let row = table.insertRow();
                let prevStateCell = document.createElement('td');
                prevStateCell.textContent = existingNodes[i].name + "(t-1) = " + prevState;
                prevStateCell.style.padding = "10px";
                row.appendChild(prevStateCell);

                existingNodes[i].states.forEach(currState => {
                    const td = document.createElement('td');
                    td.textContent = getProbDynamic(i, currState, prevState);
                    td.style.padding = "10px";
                    row.appendChild(td);
                });
            });

            document.getElementById("resultDisplayContainer").appendChild(table);
        }

        if (existingNodes[i].parentNodes.length == 0) {
            let table = document.createElement("table");
            table.setAttribute('border', '1');
            table.style.borderCollapse = "collapse";
            table.style.textAlign = "center";
            table.style.margin = "10px";

            const headerRow = table.insertRow();
            existingNodes[i].states.forEach(state => {
                const th = document.createElement('th');
                th.textContent = existingNodes[i].name + " = " + state;
                th.style.padding = "10px";
                headerRow.appendChild(th);
            });

            let row = table.insertRow();
            existingNodes[i].states.forEach(state => {
                let td = document.createElement('td');
                td.textContent = getProbNoCond(existingNodes[i].name, state);
                td.style.padding = "10px";
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
            table.style.margin = "10px";

            const headerRow = table.insertRow();
            headerRow.appendChild(document.createElement('th'));
            existingNodes[i].states.forEach(state => {
                const th = document.createElement('th');
                th.textContent = existingNodes[i].name + " = " + state;
                th.style.padding = "10px";
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
                parentStateCell.style.padding = "10px";
                row.appendChild(parentStateCell);

                existingNodes[i].states.forEach(state => {
                    const td = document.createElement('td');
                    td.textContent = getProbWithCond(existingNodes[i].name, state, existingNodes[parentNodeIndex].name, parentState);
                    td.style.padding = "10px";
                    row.appendChild(td);
                });
            });

            document.getElementById("resultDisplayContainer").appendChild(table);
        }
    }

    //// SELECT ĐỂ XEM XÁC SUẤT CỦA 1 SỰ KIỆN CỤ THỂ
    forwardCalc();
    backwardCalc();
}