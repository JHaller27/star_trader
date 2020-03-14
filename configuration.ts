export interface ConfigSettings {
    maxHops: number,
    maxChildren?: number,
}

export class Config {
    private static instance: Config | undefined;

    private readonly maxHops: number;
    private readonly maxChildren: number | undefined;

    private constructor(settings: ConfigSettings) {
        this.maxHops = settings.maxHops;
        this.maxChildren = settings.maxChildren;
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
}
