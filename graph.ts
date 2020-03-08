import { Port } from "./port";
import { Commodity } from "./commodity";

class PortNode {
    private readonly portMap: Map<Port, Route>;

    constructor() {
        this.portMap = new Map<Port, Route>();
    }
}

class Route {
    private readonly destination: Port;
    private readonly commodity: Commodity;  // commodity.price is the profit

    constructor(destination: Port, commodityProfit: Commodity) {
        this.destination = destination;
        this.commodity = commodityProfit;
    }
}
