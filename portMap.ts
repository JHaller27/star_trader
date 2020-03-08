import { Port } from "./port";
import { Commodity, TradeInfo } from "./commodity";
import { PortNode, RouteMap } from "./graph";

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

    public asRouteMap(): RouteMap {
        const routeMap = new RouteMap();

        // Add Ports to RouteMap
        for (const [port, tradeInfo] of this.portCommoditiesMap.entries()) {
            routeMap.addPort(port, tradeInfo);
        }

        // Link Ports via Routes
        for (const originPort of this.portCommoditiesMap.keys()) {
            const destinationPortMap = this.findTradeToPorts(originPort);

            if (destinationPortMap === undefined) {
                continue;
            }

            for (const [destinationPort, commodities] of destinationPortMap.entries()) {
                for (const commodity of commodities) {
                    routeMap.addRoute(originPort, destinationPort, commodity);
                }
            }
        }

        return routeMap;
    }

    private findTradeToPorts(port: Port): Map<Port, Commodity[]> | undefined {
        const tradeInfo: TradeInfo | undefined = this.portCommoditiesMap.get(port);
        if (tradeInfo === undefined) {
            return undefined;
        }

        const ports: Map<Port, Commodity[]> = new Map();

        const sellingCommodities = tradeInfo.getSelling();
        for (const commodity of sellingCommodities) {
            const buyingPorts: Port[] = this.findPortsBuying(commodity);

            for (const buyingPort of buyingPorts) {
                if (!ports.has(buyingPort)) {
                    ports.set(buyingPort, []);
                }

                ports.get(buyingPort)?.push(commodity);
            }
        }

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
