export class Port {
    private readonly star: string;
    private readonly satellite: string;
    private readonly port: string;

    constructor(star: string, satellite: string, port: string) {
        this.star = star;
        this.satellite = satellite;
        this.port = port;
    }

    public toString(): string {
        return `${this.star} > ${this.satellite} > ${this.port}`;
    }
}
