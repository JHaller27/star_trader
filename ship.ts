/**
 * Ship constraints - max investment, max cargo capacity, etc.
 */
class Ship {
    private credits: number;
    private readonly maxCapacity: number;
    private currentUnitCount: number;

    constructor(initCredits: number, maxCapacity: number) {
        this.credits = initCredits;
        this.maxCapacity = maxCapacity;
        this.currentUnitCount = 0;
    }
}
