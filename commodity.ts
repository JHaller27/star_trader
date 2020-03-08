import { IComparable, CompareResult } from './sorting';

export class Commodity implements IComparable {
    private readonly name: string;
    private readonly price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public toString(): string {
        return `${this.name}@${this.price} UEC`;
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
}
