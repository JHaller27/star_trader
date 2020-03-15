import { Commodity } from "./commodity";

export interface ConfigSettings {
    maxHops: number,
    maxChildren?: number,
    splitDepth?: number,
    allowHidden?: boolean,
    excludeCommodities?: string[],
}

export class Config {
    private static instance: Config | undefined;

    private readonly maxHops: number;
    private readonly maxChildren: number | undefined;
    private readonly splitDepth: number | undefined;
    private readonly allowHidden: boolean;
    private readonly excludeCommodities: string[];

    private constructor(settings: ConfigSettings) {
        this.maxHops = settings.maxHops;
        this.maxChildren = settings.maxChildren;
        this.splitDepth = settings.splitDepth;
        this.allowHidden = settings.allowHidden !== undefined && settings.allowHidden;
        this.excludeCommodities = settings.excludeCommodities === undefined ? [] : settings.excludeCommodities;
    }

    private static getInstance(): Config {
        if (this.instance === undefined) {
            throw new Error('Configuration uninitialized');
        }

        return this.instance;
    }

    public static initialize(settings: ConfigSettings): void {
        this.instance = new Config(settings);
    }

    public static getMaxHops(): number {
        return this.getInstance().maxHops;
    }

    public static getMaxChildren(): number | undefined {
        return this.getInstance().maxChildren;
    }

    public static shouldSplit(depth: number): boolean {
        const splitDepth = this.getInstance().splitDepth;

        return splitDepth !== undefined && depth % splitDepth === 0;
    }

    public static allowHidden(): boolean {
        return this.getInstance().allowHidden;
    }

    public static getExcludedCommodities(): string[] {
        return this.getInstance().excludeCommodities;
    }
}
