import SocketIO from "./socket.controller";
import {ReadlineParser, SerialPort, SerialPortOpenOptions} from "serialport";
import { AutoDetectTypes } from "@serialport/bindings-cpp";

import File from "./file.controller";
import IRegister from "../interfaces/register.interface";

export default class Arduino {
    serialPort: SerialPort;
    parser: ReadlineParser;

    constructor(
        private readonly socket: SocketIO,
        private readonly file: File,
        private readonly options: SerialPortOpenOptions<AutoDetectTypes>
    ) {
        this.serialPort = new SerialPort(this.options);
        this.parser = new ReadlineParser({ delimiter: "\n" });

        this.serialPort.pipe(this.parser);

        this.setListener();
    }

    private setListener() {
        this.serialPort.open(e => {
            if (e) {
                console.log(e);
            }
        });

        this.parser.on('data', data => {
            try {
                const register: IRegister = JSON.parse(data);

                console.log(`NEW DATA: ${data}`);

                register.date = new Date().toISOString();

                this.file.write(register);
                this.socket.io.emit('data', register);
            } catch (e) {
                console.log(`ERROR: ${e}`);
            }
        });
    }
}