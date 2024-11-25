class BNNode {
    constructor(id, name, states, isDynamic, parents) {
        this.id = id;
        this.name = name;
        this.states = states;
        this.isDynamic = isDynamic;
        this.parentNodes = parents;
        this.x = 50;
        this.y = 50;
        this.d = 70;
    }

    // Phương thức để vẽ node dưới dạng hình tròn
    render() {
        const nodeCircle = document.createElement("div");
        nodeCircle.classList.add("node-circle");
        nodeCircle.textContent = this.name + (this.isDynamic ? " (d)" : "");

        nodeCircle.style.left = `${this.x}px`;
        nodeCircle.style.top = `${this.y}px`;
        nodeCircle.style.width = `${this.d}px`;
        nodeCircle.style.height = `${this.d}px`;

        // Cho phép kéo thả
        // nodeCircle.setAttribute("draggable", "true");
        
        nodeCircle.addEventListener("mousedown", (event) => {
            // Lưu lại vị trí con trỏ chuột khi bắt đầu kéo
            const offsetX = event.clientX - nodeCircle.offsetLeft;
            const offsetY = event.clientY - nodeCircle.offsetTop;
        
            // Di chuyển node khi kéo
            const onMouseMove = (event) => {
                this.x = event.clientX - offsetX; // Cập nhật vị trí x của node
                this.y = event.clientY - offsetY; // Cập nhật vị trí y của node
                nodeCircle.style.left = `${this.x}px`; // Di chuyển node
                nodeCircle.style.top = `${this.y}px`; // Di chuyển node

                // Cập nhật lại các mũi tên sau khi kéo
                this.updateArrows();
            };
        
            // Dừng việc di chuyển khi thả chuột
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };
        
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Thêm node vào container
        const container = document.getElementById("nodeDisplayContainer");
        container.appendChild(nodeCircle);

        // Vẽ mũi tên từ parent đến node này
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
            arrow.style.pointerEvents = "none"; // Đảm bảo mũi tên không bị che khuất

            // Tính toán các tọa độ của các node cha và node con
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

            // Vẽ mũi tên từ parent đến child
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", startPointX);
            line.setAttribute("y1", startPointY);
            line.setAttribute("x2", endPointX);
            line.setAttribute("y2", endPointY);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "2");

            // Tạo hai đoạn thẳng ngắn (đầu mũi tên) thay vì một polygon
            const arrowLength = 10; // Độ dài của mỗi đoạn thẳng mũi tên
            const arrowAngle = Math.PI / 6; // Góc tạo bởi mũi tên (30 độ)

            // Tính toán điểm kết thúc của các đoạn thẳng mũi tên
            const arrowLine1X = endPointX - arrowLength * Math.cos(angle - arrowAngle);
            const arrowLine1Y = endPointY - arrowLength * Math.sin(angle - arrowAngle);

            const arrowLine2X = endPointX - arrowLength * Math.cos(angle + arrowAngle);
            const arrowLine2Y = endPointY - arrowLength * Math.sin(angle + arrowAngle);

            // Tạo 2 đoạn thẳng ngắn làm mũi tên
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

            // Thêm các phần tử vào SVG
            arrow.setAttribute("width", "100%");
            arrow.setAttribute("height", "100%");
            arrow.style.position = "absolute";
            arrow.style.pointerEvents = "none"; // Đảm bảo mũi tên không bị che khuất
            arrow.appendChild(line);
            arrow.appendChild(arrowLine1);
            arrow.appendChild(arrowLine2);

            // Thêm SVG vào container
            container.appendChild(arrow);
        });
    }

    // Phương thức cập nhật mũi tên khi di chuyển node
    updateArrows() {
        // Xóa tất cả mũi tên trước đó
        const arrows = document.querySelectorAll("svg");
        arrows.forEach(arrow => arrow.remove());

        // Vẽ lại tất cả mũi tên cho tất cả các node
        existingNodes.forEach(node => node.drawArrow());
    }
}
