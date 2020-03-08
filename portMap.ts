import { Port, TradeInfo } from "./port";
import { Commodity } from "./commodity";

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

    public isBuying(port: Port, commodity: Commodity): boolean {
        const tradeInfo = this.portCommoditiesMap.get(port);
        return tradeInfo !== undefined && tradeInfo.isBuying(commodity);
    }

    public isSelling(port: Port, commodity: Commodity): boolean {
        const tradeInfo = this.portCommoditiesMap.get(port);
        return tradeInfo !== undefined && tradeInfo.isSelling(commodity);
    }

    private ensurePortExists(port: Port) {
        if (!this.portCommoditiesMap.has(port)) {
            this.portCommoditiesMap.set(port, new TradeInfo());
        }
    }
}
