import { Commodity } from "./commodity";

/**
 * Ship constraints - max investment, max cargo capacity, etc.
 */
export class Ship {
    private readonly initialCredits: number ;
    private readonly maxCapacity: number;
    private readonly maxHops: number;

    private credits: number;
    private curentCargo: Commodity | undefined;

    constructor(initCredits: number, maxCapacity: number, maxHops: number) {
        this.initialCredits = initCredits;
        this.maxCapacity = maxCapacity;
        this.maxHops = maxHops;

        this.credits = this.initialCredits;
        this.curentCargo = undefined;
    }

    public reset(): void {
        this.credits = this.initialCredits;
        this.emptyCargo();
    }

    public getMaxHops(): number {
        return this.maxHops;
    }

    public trade(buy: Commodity, sell: Commodity): number {
        this.purchaseMaxUnitsOf(buy);
        this.sellAllUnitsAt(sell);

        return this.credits;
    }

    private purchaseMaxUnitsOf(commodity: Commodity): void {
        const myCommodity = commodity.purchaseMaxUnits(this.credits, this.availableCargoSpace());

        this.addToCargo(myCommodity);
        this.credits -= myCommodity.getPrice();
    }

    private sellAllUnitsAt(commodity: Commodity): void {
        const myCargo = this.emptyCargo();
        if (myCargo === undefined) {
            throw new Error('No Commodities stored in Ship to sell')
        }

        const revenue = myCargo.sellAllUnitsAt(commodity);

        this.credits += revenue;
    }

    private availableCargoSpace(): number {
        return this.curentCargo === undefined ? this.maxCapacity : this.maxCapacity - this.curentCargo.getUnits();
    }

    private addToCargo(commodity: Commodity): void {
        this.curentCargo = commodity;
    }

    private emptyCargo(): Commodity | undefined {
        const cargo = this.curentCargo;
        this.curentCargo = undefined;

        return cargo;
    }
}
