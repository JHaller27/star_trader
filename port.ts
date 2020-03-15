export class Port {
    private readonly locationPath: string[];
    private readonly hidden: boolean;

    constructor(locationPath: string[]) {
        this.locationPath = locationPath;
        this.hidden = locationPath.findIndex(s => s.includes('Hidden')) !== -1;
    }

    public isHidden(): boolean {
        return this.hidden;
    }

    public toString(): string {
        return this.locationPath.join(' > ');
    }

    public equals(other: Port): boolean {
        if (this.locationPath.length !== other.locationPath.length) {
            return false;
        }

        for (let idx = 0; idx < this.locationPath.length; idx++) {
            if (this.locationPath[idx] !== other.locationPath[idx]) {
                return false;
            }
        }

        return true;
    }

    public hash(): string {
        return this.toString();
    }
}
