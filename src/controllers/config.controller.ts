import * as fs from 'fs';
import * as path from 'path';

import { IBuilding, IConfig } from '../interfaces/config.interface';

export default class Config {
    path: string;

    constructor(file: string) {
        this.path = path.join(__dirname, '../..', file);

        const initialConfigStructure: IConfig = {
            buildings: []
        };

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify(initialConfigStructure));
        }
    }

    addBuilding(newBuilding: IBuilding) {
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

    getConfig() {
        const config: string = fs.readFileSync(this.path).toString();
        return JSON.parse(config);
    }
}