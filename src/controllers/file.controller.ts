import * as fs from "fs";
import * as path from 'path';

import IRegister from "../interfaces/register.interface";

export default class File {
    path: string;

    constructor(
        file: string
    ) {
        this.path = path.join(__dirname, '../..', file);

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "[]");
        }
    }

    write(register: IRegister) {
        const file: string = fs.readFileSync(this.path).toString();
        const data: IRegister[] = JSON.parse(file);

        data.push(register);

        console.log(`WRITING DATA: ${JSON.stringify(register)}`);

        fs.writeFileSync(this.path, JSON.stringify(data));
    }

    getAll(): IRegister[] {
        const file: string = fs.readFileSync(this.path).toString();
        return JSON.parse(file);
    }
}