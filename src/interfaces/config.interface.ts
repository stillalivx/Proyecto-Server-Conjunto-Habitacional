export interface IConfig {
    buildings: IBuilding[];
    tankers: ITanker[]
    ia: IIA;
}

export interface IBuilding {
    id: number;
    alias: string;
    residents: number;
    pins: {
        pump: number;
        sensor: number;
    };
    capacity: number;
}

export interface ITanker {
    id: number;
    alias: string;
    capacity: number;
}

export interface IIA {
    trainingWeeks: number;
    timeFill: string;
    extraPercent: number;
}