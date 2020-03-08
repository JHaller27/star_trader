import { Commodity } from './commodity';

export class TradeInfo {
    private readonly buying: Commodity[];
    private readonly selling: Commodity[];

    constructor() {
        this.buying = [];
        this.selling = [];
    }

    public addBuying(commodity: Commodity): void {
        this.buying.push(commodity);
    }

    public addSelling(commodity: Commodity): void {
        this.selling.push(commodity);
    }

    public isBuying(commodity: Commodity): boolean {
        return this.buying.includes(commodity);
    }

    public isSelling(commodity: Commodity): boolean {
        return this.selling.includes(commodity);
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
