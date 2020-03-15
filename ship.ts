import { Commodity } from "./commodity";
import { IMomentable } from "./momento";

const UNITS_PER_SCU = 1000;

export class Ship implements IMomentable<ShipMomento> {
    private static instance: Ship | undefined;

    private readonly initialCredits: number ;
    private readonly maxCapacity: number;

    private credits: number;
    private curentCargo: Commodity | undefined;

    private constructor(initCredits: number, maxSCU: number) {
        this.initialCredits = initCredits;
        this.maxCapacity = maxSCU * UNITS_PER_SCU;

        this.credits = this.initialCredits;
        this.curentCargo = undefined;
    }

    public createSnapshot(): ShipMomento {
        return {
            credits: this.credits
        };
    }

    public restore(momento: ShipMomento): void {
        this.credits = momento.credits;
    }

    public reset(): void {
        this.credits = this.initialCredits;
        this.emptyCargo();
    }

    public getProfit(): number {
        return this.credits - this.initialCredits;
    }

    public trade(buy: Commodity, sell: Commodity): void {
        this.purchaseMaxUnitsOf(buy);
        this.sellAllUnitsAt(sell);
    }

    public toString(): string {
        return `Wallet: ${this.credits} UEC | Max Cargo: ${this.maxCapacity}`;
    }

    public static initialize(initCredits: number, maxCapacity: number) {
        Ship.instance = new Ship(initCredits, maxCapacity);
    }

    public static getInstance(): Ship {
        if (Ship.instance === undefined) {
            throw new Error('Ship instance has not yet been initialized');
        }

        return Ship.instance;
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

export interface ShipMomento {
    credits: number;
}
