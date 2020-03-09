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

        const originCommodity: Commodity = originNode.getSellingCommodity(commodity);
        const destinationCommodity: Commodity = destinationNode.getBuyingCommodity(commodity);

        const route = new Route(destinationNode, originCommodity, destinationCommodity);
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

    public getBuyingCommodity(commodity: Commodity): Commodity {
        const buying = this.tradeInfo.findBuying(commodity);
        if (buying === undefined) {
            throw new Error(`Commodity ${commodity} not available for buying`);
        }
        return buying;
    }

    public getSellingCommodity(commodity: Commodity): Commodity {
        const selling = this.tradeInfo.findSelling(commodity);
        if (selling === undefined) {
            throw new Error(`Commodity ${commodity} not available for selling`);
        }
        return selling;
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

    public toShallowString(): string {
        return this.port.toString();
    }
}

export class Route {
    private readonly destination: PortNode;
    private readonly sourceCommodity: Commodity;
    private readonly destinationCommodity: Commodity;

    constructor(destination: PortNode, sourceCommodity: Commodity, destinationCommodity: Commodity) {
        this.destination =  destination;
        this.sourceCommodity = sourceCommodity;
        this.destinationCommodity = destinationCommodity;
    }

    public toString(): string {
        return `Buy ${this.sourceCommodity} -> Sell ${this.destinationCommodity} in '${this.destination.toShallowString()}'`;
    }
}
