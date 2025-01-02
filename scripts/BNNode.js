let mouseDownTime = 0;

class BNNode {
    constructor(id, name, states, isDynamic, parents) {
        this.id = id;
        this.name = name;
        this.states = states;
        this.isDynamic = isDynamic;
        this.parentNodes = parents;
        this.x = 50 + ((id % 10) * 80);
        this.y = 50 + (Math.floor((id - 1) / 10) * 80);
        this.d = 40;
    }

    render() {
        const nodeCircle = document.createElement("div");
        nodeCircle.classList.add("node-circle");
        nodeCircle.textContent = this.name + (this.isDynamic ? " (d)" : "");

        nodeCircle.style.left = `${this.x}px`;
        nodeCircle.style.top = `${this.y}px`;
        nodeCircle.style.width = `${this.d}px`;
        nodeCircle.style.height = `${this.d}px`;
        
        nodeCircle.addEventListener("mousedown", (event) => {
            const offsetX = event.clientX - nodeCircle.offsetLeft;
            const offsetY = event.clientY - nodeCircle.offsetTop;
            mouseDownTime = Date.now();
        
            const onMouseMove = (event) => {
                this.x = event.clientX - offsetX;
                this.y = event.clientY - offsetY;
                nodeCircle.style.left = `${this.x}px`;
                nodeCircle.style.top = `${this.y}px`;

                this.updateArrows();
            };
        
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                let mouseUpTime = Date.now();
                let mouseHoldDuration = mouseUpTime - mouseDownTime;

                if (mouseHoldDuration < 100) {
                    const quickClickEvent = new CustomEvent("quickClick", {
                    detail: {duration: mouseHoldDuration},
                    });
                    nodeCircle.dispatchEvent(quickClickEvent);
                }
            };
        
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // hiển thị hộp thoại edit node khi click vào node
        nodeCircle.addEventListener("quickClick", function (e) {
            document.getElementById("addNodeFormContainer").style.display = "none";
            const editNodeForm = document.getElementById("editNodeFormContainer");
            editNodeForm.style.display = "inline-block";

            const nodeName = this.innerHTML.replace(" (d)", "");
            const nodeData = existingNodes.find(node => node.name === nodeName);
            const nodeId = nodeData.id;

            if (!nodeData) {
                console.error("Không tìm thấy node!");
                return;
            }

            document.getElementById("editname").value = nodeData.name;
            document.getElementById("editstates").value = nodeData.states.join(", ");
            document.getElementById("editdynamic").checked = nodeData.isDynamic;

            const editselectedParents = document.getElementById("editselectedParents");
            editselectedParents.innerHTML = "";
            nodeData.parentNodes.forEach(parentId => {
                const parentNode = existingNodes.find(node => node.id === parentId);
                if (parentNode) {
                    const listItem = document.createElement("li");
                    listItem.dataset.value = parentNode.id;

                    const nodeName = document.createElement("span");
                    const selectedNode = existingNodes.find(node => node.id === parseInt(parentNode.id));

                    if (selectedNode) {
                        nodeName.textContent = selectedNode.name;
                    } else {
                        console.error("Không tìm thấy node với ID:", parentNode.id);
                    }

                    const removeButton = document.createElement("button");
                    removeButton.textContent = "×";
                    removeButton.title = "Xóa Node này";
                    removeButton.addEventListener("click", () => {
                        listItem.remove();
                    });

                    listItem.appendChild(nodeName);
                    listItem.appendChild(removeButton);
                    editselectedParents.appendChild(listItem);
                }
            });

            const editparentsSelect = document.getElementById("editparents");
            editparentsSelect.innerHTML = '<option value="" disabled selected>Chọn Node cha</option>';
            existingNodes.forEach(node => {
                if (node.id !== nodeId) {
                    const option = document.createElement("option");
                    option.value = node.id;
                    option.textContent = node.name;
                    editparentsSelect.appendChild(option);
                }
            });

            editparentsSelect.addEventListener("change", () => {
                const selectedValue = editparentsSelect.value;
            
                if ([...editselectedParents.children].some((li) => li.dataset.value === selectedValue)) return;
            
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
                editselectedParents.appendChild(listItem);
            });

            const editButton = document.getElementById("editNodeButton");
            editButton.onclick = () => {
                const updatedName = document.getElementById("editname").value;
                const updatedStates = document.getElementById("editstates").value.split(",").map(s => s.trim());
                const isDynamic = document.getElementById("editdynamic").checked;

                nodeData.name = updatedName;
                nodeData.states = updatedStates;
                nodeData.isDynamic = isDynamic;
                this.innerHTML = nodeData.name + (nodeData.isDynamic ? " (d)" : "");

                nodeData.parentNodes = [...editselectedParents.children].map((li) => parseInt(li.dataset.value));

                editNodeForm.style.display = "none";
                document.getElementById("addNodeFormContainer").style.display = "inline-block";
                nodeData.drawArrow();
            };
        });

        const container = document.getElementById("nodeDisplayContainer");
        container.appendChild(nodeCircle);

        this.drawArrow();
    }

    drawArrow() {
        const container = document.getElementById("nodeDisplayContainer");
        this.parentNodes.forEach(parentNodeId => {
            const parentNode = existingNodes.find(node => node.id === parentNodeId);
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            arrow.setAttribute("width", "100%");
            arrow.setAttribute("height", "100%");
            arrow.style.position = "absolute";
            arrow.style.pointerEvents = "none";

            let startX = parentNode.x + parentNode.d / 2;
            let startY = parentNode.y + parentNode.d / 2;
            let endX = this.x + this.d / 2;
            let endY = this.y + this.d / 2;

            const dist = Math.sqrt((endY - startY) * (endY - startY) + (endX - startX) * (endX - startX));
            const angle = Math.atan2(endY - startY, endX - startX);

            const startPointX = parentNode.x + parentNode.d / 2 + (parentNode.d / 2) * Math.cos(angle);
            const startPointY = parentNode.y + parentNode.d / 2 + (parentNode.d / 2) * Math.sin(angle);
            const endPointX = this.x + this.d / 2 - (this.d / 2) * Math.cos(angle);
            const endPointY = this.y + this.d / 2 - (this.d / 2) * Math.sin(angle);

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", startPointX);
            line.setAttribute("y1", startPointY);
            line.setAttribute("x2", endPointX);
            line.setAttribute("y2", endPointY);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "2");

            const arrowLength = 10;
            const arrowAngle = Math.PI / 6;

            const arrowLine1X = endPointX - arrowLength * Math.cos(angle - arrowAngle);
            const arrowLine1Y = endPointY - arrowLength * Math.sin(angle - arrowAngle);

            const arrowLine2X = endPointX - arrowLength * Math.cos(angle + arrowAngle);
            const arrowLine2Y = endPointY - arrowLength * Math.sin(angle + arrowAngle);

            const arrowLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            arrowLine1.setAttribute("x1", endPointX);
            arrowLine1.setAttribute("y1", endPointY);
            arrowLine1.setAttribute("x2", arrowLine1X);
            arrowLine1.setAttribute("y2", arrowLine1Y);
            arrowLine1.setAttribute("stroke", "black");
            arrowLine1.setAttribute("stroke-width", "2");

            const arrowLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            arrowLine2.setAttribute("x1", endPointX);
            arrowLine2.setAttribute("y1", endPointY);
            arrowLine2.setAttribute("x2", arrowLine2X);
            arrowLine2.setAttribute("y2", arrowLine2Y);
            arrowLine2.setAttribute("stroke", "black");
            arrowLine2.setAttribute("stroke-width", "2");

            arrow.setAttribute("width", "100%");
            arrow.setAttribute("height", "100%");
            arrow.style.position = "absolute";
            arrow.style.pointerEvents = "none";
            arrow.appendChild(line);
            arrow.appendChild(arrowLine1);
            arrow.appendChild(arrowLine2);

            container.appendChild(arrow);
        });
    }

    updateArrows() {
        const arrows = document.querySelectorAll("svg");
        arrows.forEach(arrow => arrow.remove());

        existingNodes.forEach(node => node.drawArrow());
    }
}
