import { IReader, InputData } from "./reader";
import { RouteMap } from "./graph";
import { PortMap } from "./portMap";
import { Port } from "./port";
import { Commodity } from "./commodity";

export class RouteMapGenerator {
    private readonly reader: IReader;
    private data: InputData | undefined;
    private portMap: PortMap | undefined;

    constructor(reader: IReader) {
        this.reader = reader;
    }

    public getRouteMap(): RouteMap {
        this.data = this.reader.getData();
        this.data2PortMap();

        if (this.portMap === undefined) {
            throw new Error('Failed to create PortMap');
        }

        return this.portMap.asRouteMap();
    }

    private data2PortMap(): void {
        if (this.data === undefined) {
            return;
        }

        this.portMap = new PortMap();

        for (const rawPort of this.data) {
            const port: Port = new Port(
                rawPort.location.star,
                rawPort.location.satellite,
                rawPort.location.port
            );

            for (const rawCommodity of rawPort.commodities) {
                if (rawCommodity.buy !== null) {
                    const buyCommodity: Commodity = new Commodity(
                        rawCommodity.name,
                        rawCommodity.buy
                    );

                    this.portMap.addBuying(port, buyCommodity);
                }

                if (rawCommodity.sell !== null) {
                    const sellCommodity: Commodity = new Commodity(
                        rawCommodity.name,
                        rawCommodity.sell
                    );

                    this.portMap.addSelling(port, sellCommodity);
                }
            }
        }
    }
}