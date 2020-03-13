import fs from 'fs';

export interface IReader {
    getData: () => InputData;
}

export interface Commodity {
    name: string,
    buying: number | null,
    selling: number | null
}

export interface Location {
    star: string,
    satellite: string,
    port: string
}

export interface Port {
    location: string[],
    commodities: Commodity[]
}

export type InputData = Port[];

export class JSONReader implements IReader {
    private readonly filePath: string;

    constructor(path: string) {
        this.filePath = path;
    }

    public getData(): InputData {
        const rawData = fs.readFileSync(this.filePath, 'utf8');
        const data: InputData = JSON.parse(rawData);
        return data;
    }
}
