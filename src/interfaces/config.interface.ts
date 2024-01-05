export interface IConfig {
    buildings: IBuilding[];
    tanker: ITanker
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
    capacity: number;
}

export interface IIA {
    trainingWeeks: number;
    timeFill: number;
    extraPercent: number;
}