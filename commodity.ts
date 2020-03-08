export class Commodity {
    private readonly name: string;
    private readonly price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public toString(): string {
        return `${this.name}@${this.price} UEC`;
    }
}
