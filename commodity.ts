import { IComparable, CompareResult } from './sorting';

export class TradeInfo {
    private readonly buying: Map<string, Commodity>;
    private readonly selling: Map<string, Commodity>;

    constructor() {
        this.buying = new Map();
        this.selling = new Map();

        // There always exists the option to trade nothing
        this.addBuying(Commodity.NewNothing());
        this.addSelling(Commodity.NewNothing());
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

    public getBuying(): IterableIterator<Commodity> {
        return this.buying.values();
    }

    public getSelling(): IterableIterator<Commodity> {
        return this.selling.values();
    }

    public findBuying(commodity: Commodity): Commodity | undefined {
        return this.buying.get(commodity.hash());
    }

    public findSelling(commodity: Commodity): Commodity | undefined {
        return this.selling.get(commodity.hash());
    }
}

export class Commodity implements IComparable {
    private static readonly NOTHING = 'nothing';

    private readonly name: string;
    private price: number;
    private units: number;

    private absolutePrice: boolean;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
        this.units = 0;

        this.absolutePrice = false;
    }

    public static NewNothing(): Commodity {
        return new Commodity(Commodity.NOTHING, 0);
    }

    public hash(): string {
        return this.name;
    }

    public toString(): string {
        if (this.name === Commodity.NOTHING) {
            return `${Commodity.NOTHING}`;
        }

        const units = this.absolutePrice ? 'UEC' : 'UEC/unit';
        return `${this.name}@${this.price} ${units}`;
    }

    public comparePrice(other: Commodity): number {
        return this.price - other.price;
    }

    public compareTo(other: Commodity): CompareResult {
        if (this.price < other.price) {
            return CompareResult.LessThan;
        }
        else if (this.price > other.price) {
            return CompareResult.GreaterThan;
        }
        else {
            return CompareResult.EqualTo;
        }
    }

    public equals(other: Commodity): boolean {
        return this.name === other.name;
    }

    public ppu2Absolute(units: number) {
        this.assertAbsolutePrice();

        this.units = units;
        this.price = this.price * this.units;
        this.absolutePrice = true;
    }

    public purchaseMaxUnits(investment: number, unitCapacity: number): void {
        const maxUnits = this.getMaxUnits(investment, unitCapacity);
        this.ppu2Absolute(maxUnits);
    }

    private assertAbsolutePrice(): void {
        if (this.absolutePrice) {
            throw new Error('Commodity already an absolute price');
        }
    }

    private assertPerUnitPrice(): void {
        if (!this.absolutePrice) {
            throw new Error('Commodity should be an absolute price');
        }
    }

    private getMaxUnits(investment: number, unitCapacity: number): number {
        this.assertPerUnitPrice();

        // ($)/($/unit) = unit
        const unitsByInvestment =  Math.floor(investment / this.price);
        return Math.min(unitsByInvestment, unitCapacity);
    }
}
