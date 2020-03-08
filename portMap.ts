import { Port } from "./port";
import { Commodity } from "./commodity";

/**
 * A geographical-esque map (not a HashMap etc.) of ports and their commodities.
 * Used as a first step when importing data.
 */
class PortMap {
    private readonly portCommoditiesMap: Map<Port, Commodity[]>;

    constructor() {
        this.portCommoditiesMap = new Map();
    }

    public add(port: Port, commodity: Commodity): void {
        if (this.portCommoditiesMap.has(port)) {
            this.portCommoditiesMap.get(port)?.push(commodity);
        }
        else {
            this.portCommoditiesMap.set(port, [commodity]);
        }
    }
}
