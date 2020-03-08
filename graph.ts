import { Port, TradeInfo } from "./port";

export class PortNode {
    private readonly port: Port;
    private readonly tradeInfo: TradeInfo;
    private readonly routes: Route[];

    constructor(port: Port, tradeInfo: TradeInfo) {
        this.port = port;
        this.tradeInfo = tradeInfo;
        this.routes = [];
    }
}

export class Route {
    private readonly destination: PortNode;
    private readonly commodityName: string;

    constructor(destination: PortNode, commodityName: string) {
        this.destination =  destination;
        this.commodityName = commodityName;
    }
}
