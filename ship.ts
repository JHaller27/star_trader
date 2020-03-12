import { Commodity } from "./commodity";

/**
 * Ship constraints - max investment, max cargo capacity, etc.
 */
export class Ship {
    private readonly maxCapacity: number;
    private readonly maxHops: number;

    private credits: number;
    private curentCargo: Commodity | undefined;

    constructor(initCredits: number, maxCapacity: number, maxHops: number) {
        this.credits = initCredits;
        this.maxCapacity = maxCapacity;
        this.maxHops = maxHops;

        this.curentCargo = undefined;
    }

    public getMaxHops(): number {
        return this.maxHops;
    }

    public purchaseMaxUnitsOf(commodity: Commodity) {
        commodity.purchaseMaxUnits(this.credits, this.availableCargoSpace());
        this.curentCargo = commodity;
        this.credits -= commodity.getPrice();
    }

    private availableCargoSpace(): number {
        return this.curentCargo === undefined ? this.maxCapacity : this.maxCapacity - this.curentCargo.getUnits();
    }
}
