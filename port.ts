export class Port {
    private readonly locationPath: string[];

    constructor(star: string, satellite: string, port: string) {
        this.locationPath = [
            star,
            satellite,
            port,
        ];
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
}
