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

    public matchesName(term: string): boolean {
        const thisPortName = Port.toSearchableName(this.locationPath[this.locationPath.length - 1]);
        const searchTerms = term.split(',').map(t => Port.toSearchableName(t));
        const searchRegex = new RegExp(searchTerms.join('.*'));

        return searchRegex.test(thisPortName);
    }

    private static toSearchableName(name: string): string {
        return name.toLowerCase().replace(/\s+/, '');
    }
}
