import { Commodity } from './commodity';

export class TradeInfo {
    private readonly buying: Map<string, Commodity>;
    private readonly selling: Map<string, Commodity>;

    constructor() {
        this.buying = new Map();
        this.selling = new Map();
    }

    public addBuying(commodity: Commodity): void {
        this.buying.set(commodity.hash(), commodity);
    }

    public addSelling(commodity: Commodity): void {
        this.selling.set(commodity.hash(), commodity);
    }

    public isBuying(commodity: Commodity): boolean {
        return this.buying.has(commodity.hash());
    }

    public isSelling(commodity: Commodity): boolean {
        return this.selling.has(commodity.hash());
    }
}

export class Port {
    private readonly star: string;
    private readonly satellite: string;
    private readonly port: string;

    constructor(star: string, satellite: string, port: string) {
        this.star = star;
        this.satellite = satellite;
        this.port = port;
    }

    public toString(): string {
        return `${this.star} ${this.satellite} ${this.port}`;
    }
}
