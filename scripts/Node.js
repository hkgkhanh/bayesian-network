class Node {
    constructor(name, states, parents) {
        this.id = 0;
        this.name = name;
        this.states = states;
        this.parentNodes = parents;
        this.x = 50;
        this.y = 50;
        this.r = 50;
    }

    displayNode() {
        // Lấy tên của các node cha từ danh sách đối tượng
        const parentNames = this.parentNodes.map(parentId => existingNodes[parentId].name).join(", ");
        console.log(`Node: ${this.name}`);
        console.log(`States: ${this.states.join(", ")}`);
        console.log(`Parents: ${parentNames || "Không có node cha"}`);
    }
}