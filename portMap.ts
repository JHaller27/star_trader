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

    public findPortsBuying(commodity: Commodity): Port[] {
        const ports = this.findPorts((port: Port, tradeInfo: TradeInfo) => {
            return tradeInfo.isBuying(commodity);
        });

        return ports;
    }

    public findPortsSelling(commodity: Commodity): Port[] {
        const ports = this.findPorts((port: Port, tradeInfo: TradeInfo) => {
            return tradeInfo.isSelling(commodity);
        });

        return ports;
    }

    private findPorts(filterFunc: (p: Port, ti: TradeInfo) => boolean): Port[] {
        const ports: Port[] = [];

        for (const kvp of this.portCommoditiesMap.entries()) {
            if (filterFunc(kvp[0], kvp[1])) {
                ports.push(kvp[0]);
            }
        }

        return ports;
    }

    private ensurePortExists(port: Port) {
        if (!this.portCommoditiesMap.has(port)) {
            this.portCommoditiesMap.set(port, new TradeInfo());
        }
    }
}
