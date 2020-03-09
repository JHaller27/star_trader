import { Port } from "./port";
import { TradeInfo, Commodity } from "./commodity";

export class RouteMap {
    private readonly portMap: Map<Port, PortNode>;

    constructor() {
        this.portMap = new Map();
    }

    public addPort(port: Port, tradeInfo: TradeInfo): void {
        const node = new PortNode(port, tradeInfo);
        this.portMap.set(port, node);
    }

    public addRoute(origin: Port, destination: Port, commodity: Commodity): void {
        const originNode = this.portMap.get(origin);
        const destinationNode = this.portMap.get(destination);

        if (originNode === undefined) {
            throw new Error(`Origin port ${origin.toString()} not found. Make sure to add Port to RouteMap first.`);
        }
        if (destinationNode === undefined) {
            throw new Error(`Destination port ${destination.toString()} not found. Make sure to add Port to RouteMap first.`);
        }

        const route = new Route(destinationNode, commodity.hash());
        originNode.addRoute(route);
    }

    public toString(): string {
        let s: string = '';

        for (const portNode of this.portMap.values()) {
            s += `${portNode.toString()}`;
        }

        return s;
    }
}

export class PortNode {
    private readonly port: Port;
    private readonly tradeInfo: TradeInfo;
    private readonly routes: Route[];

    constructor(port: Port, tradeInfo: TradeInfo) {
        this.port = port;
        this.tradeInfo = tradeInfo;
        this.routes = [];
    }

    public addRoute(route: Route): void {
        this.routes.push(route);
    }

    public toString(): string {
        let s: string = `${this.port.toString()}\n`;

        for (const route of this.routes) {
            s += `\t${route.toString()}\n`;
        }

        return s;
    }
}

export class Route {
    private readonly destination: PortNode;
    private readonly commodityName: string;

    constructor(destination: PortNode, commodityName: string) {
        this.destination =  destination;
        this.commodityName = commodityName;
    }

    public toString(): string {
        return `${this.commodityName} -> ${this.destination}`;
    }
}
