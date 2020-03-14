export interface ConfigSettings {
    maxHops: number,
}

export class Config {
    private static instance: Config | undefined;

    private readonly maxHops: number;

    private constructor(settings: ConfigSettings) {
        this.maxHops = settings.maxHops;
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
}
