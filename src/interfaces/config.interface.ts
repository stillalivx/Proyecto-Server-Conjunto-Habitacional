export interface IConfig {
    buildings: IBuilding[];
}

export interface IBuilding {
    id: number;
    alias: string;
    residents: number;
    pins: {
        pump: number;
        sensor: number;
    }
}