import { Port } from "./port";
import { Commodity } from "./commodity";

export class TradeInfo {
    private readonly buying: Commodity[];
    private readonly selling: Commodity[];

    constructor() {
        this.buying = [];
        this.selling = [];
    }

    public addBuying(commodity: Commodity) {
        this.buying.push(commodity);
    }

    public addSelling(commodity: Commodity) {
        this.selling.push(commodity);
    }
}

export class PortMap {
    private readonly portCommoditiesMap: Map<Port, TradeInfo>;

    constructor() {
        this.portCommoditiesMap = new Map();
    }

    public addBuying(port: Port, commodity: Commodity): void {
        this.ensurePortExists(port);
        this.portCommoditiesMap.get(port)?.addBuying(commodity);
    }

    public addSelling(port: Port, commodity: Commodity): void {
        this.ensurePortExists(port);
        this.portCommoditiesMap.get(port)?.addSelling(commodity);
    }

    private ensurePortExists(port: Port) {
        if (!this.portCommoditiesMap.has(port)) {
            this.portCommoditiesMap.set(port, new TradeInfo());
        }
    }
}
