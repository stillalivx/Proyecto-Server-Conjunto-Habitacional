import { IConfig } from './interfaces/config.interface';
import { IRegister } from './interfaces/register.interface';
import * as fs from 'fs';

const registers = [];

const config: IConfig = {
  buildings: [
    {
      id: 0,
      alias: 'Edificio A',
      capacity: 1000,
      pins: {
        pump: 1,
        sensor: 2
      },
      residents: 10
    },
    {
      id: 1,
      alias: 'Edificio B',
      capacity: 1000,
      pins: {
        pump: 3,
        sensor: 4
      },
      residents: 23
    },
    {
      id: 2,
      alias: 'Edificio C',
      capacity: 1000,
      pins: {
        pump: 5,
        sensor: 6
      },
      residents: 31
    },
  ],
  tanker: {
    capacity: 10000
  },
  ia: {
    trainingWeeks: 3,
    extraPercent: 3,
    timeFill: 3
  }
};

let date = new Date();

for (let i = 0; i < config.ia.trainingWeeks; i++) {
  for (let j = 0; j < 24 * 7 * 4 * 6; j++) {
    date.setHours(date.getHours() + 1);

    for (const building of config.buildings) {
      const newRegister: IRegister = {
        waterTank: building.id,
        date: date.toISOString(),
        level: Math.floor(Math.random() * building.capacity)
      };

      registers.push(newRegister);
    }
  }
}

fs.writeFileSync('../water_data.json', JSON.stringify(registers));
fs.writeFileSync('../config.json', JSON.stringify(config));