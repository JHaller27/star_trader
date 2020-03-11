/**
 * Ship constraints - max investment, max cargo capacity, etc.
 */
class Ship {
    private credits: number;
    private readonly maxCapacity: number;
    private currentUnitCount: number;
    private readonly maxHops: number;

    constructor(initCredits: number, maxCapacity: number, maxHops: number) {
        this.credits = initCredits;
        this.maxCapacity = maxCapacity;
        this.currentUnitCount = 0;
        this.maxHops = maxHops;
    }

    public getMaxHops(): number {
        return this.maxHops;
    }
}
