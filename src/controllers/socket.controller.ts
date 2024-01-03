import { Server as IOServer, Socket } from "socket.io";
import { createServer, Server } from "http";
import File from "./file.controller";
import Config from './config.controller';
import { IBuilding } from '../interfaces/config.interface';
import IRegister from '../interfaces/register.interface';

export default class SocketIO {
    private readonly server: Server;
    public readonly io: IOServer;
    private date: Date;

    constructor(
        port: number,
        private readonly file: File,
        private readonly config: Config
    ) {
        const allStoredData = this.file.getAll();
        const lastDate = allStoredData[allStoredData.length - 1].date;

        this.date = new Date(lastDate);
        this.date.setHours(this.date.getHours() + 1);

        this.server = createServer();
        this.io = new IOServer(this.server, {
            cors: {}
        });

        this.setListeners();

        this.server.listen(port);

        console.log(`🚀 Server listening on: http://localhost:${ port }`);
    }

    private setListeners() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`NEW_CONNECTION: ${socket.id}`);

            socket.emit('get-all', this.file.getAll())
            socket.emit('get-config', this.config.getConfig());

            socket.on('new-building', (data: IBuilding) => {
                console.log('ADDING NEW BUILDING');

                const newBuilding = this.config.addBuilding(data);

                this.io.emit('append-building', newBuilding);
            });

            socket.on('delete-building', (id: number) => {
                console.log(`REMOVING BUILDING WITH ID '${ id }'`);

                const buildingDeletedId = this.config.deleteBuilding(id);

                this.io.emit('delete-building-confirmation', buildingDeletedId);
            })

            socket.on('update-building', (updateData: IBuilding) => {
                console.log(`UPDATING BUILDING WITH ID '${ updateData.id }'`);

                const updatedBuilding = this.config.updateBuilding(updateData);

                this.io.emit('update-building-confirmation', updatedBuilding);
            });

            socket.on('requiere-all', () => {
                console.log(`REQUIERE ALL DATA FROM ID ${socket.id}`);

                this.io.emit('get-required-all', this.file.getAll());
            });

            setInterval(() => {
                console.log('NEW DATA GENERATED');

                const config = this.config.getConfig();
                const buildings = config.buildings;
                const newRegisters: IRegister[] = [];

                for (const building of buildings) {
                    const register: IRegister = {
                        waterTank: building.id,
                        level: Math.floor(Math.random() * building.capacity),
                        date: this.date.toISOString()
                    };

                    newRegisters.push(register);
                }

                socket.emit('append-new-data', newRegisters);

                this.file.write(newRegisters);
                this.date.setHours(this.date.getHours() + 1);
            }, 60000)
        });
    }
}