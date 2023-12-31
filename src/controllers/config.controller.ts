import * as fs from 'fs';
import * as path from 'path';

import { IBuilding, IConfig } from '../interfaces/config.interface';

export default class Config {
    path: string;

    constructor(file: string) {
        this.path = path.join(__dirname, '../..', file);

        const initialConfigStructure: IConfig = {
            buildings: [],
            tankers: [],
            ia: {
                trainingWeeks: 3,
                timeFill: '07:00',
                extraPercent: 3
            }
        };

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify(initialConfigStructure));
        }
    }

    addBuilding(newBuilding: IBuilding): IBuilding {
        if (!newBuilding.alias) {
            throw new Error('No se ha asignado un alias al nuevo edificio');
        }

        if (!newBuilding.pins || !newBuilding.pins.pump || !newBuilding.pins.sensor) {
            throw new Error('Es necesario asignar todos los pines para un buen funcionamiento');
        }

        if (!newBuilding.residents) {
            throw new Error('No se han especificado el número de habitantes');
        }

        const file: string = fs.readFileSync(this.path).toString();
        const config: IConfig = JSON.parse(file);

        const buildings = config.buildings.sort((a, b) => {
            return a.id - b.id;
        });

        newBuilding.id = buildings.length == 0 ? 1 : buildings[buildings.length - 1].id + 1;

        config.buildings.push(newBuilding);

        console.log(`UPDATING DATA: ${JSON.stringify(newBuilding)}`);

        fs.writeFileSync(this.path, JSON.stringify(config));

        return newBuilding;
    }

    deleteBuilding(id: number): number {
        if (!id) throw new Error('No se ha especificado el id del edificio que se desea eliminar');

        const config: IConfig = this.getConfig();

        config.buildings = config.buildings.filter(b => b.id !== id);

        console.log(`DELETE DATA: ${id}`);

        fs.writeFileSync(this.path, JSON.stringify(config));

        return id;
    }

    updateBuilding(building: IBuilding): IBuilding {
        if (!building.id) throw new Error('No se ha especificado el id del edificio que se desea eliminar');

        const config = this.getConfig();
        const idxBuildingToUpdate = config.buildings.findIndex(b => b.id === building.id);

        if (idxBuildingToUpdate < 0) throw new Error('No se ha encontrad el edificio que se desea actualizar');

        config.buildings[idxBuildingToUpdate] = building;

        fs.writeFileSync(this.path, JSON.stringify(config));

        return building;
    }

    getConfig(): IConfig {
        const config: string = fs.readFileSync(this.path).toString();
        return JSON.parse(config);
    }
}