import { Server as IOServer, Socket } from "socket.io";
import { createServer, Server } from "http";
import File from "./file.controller";
import Config from './config.controller';
import { IBuilding, IIA, ITanker } from '../interfaces/config.interface';
import { IRegister } from '../interfaces/register.interface';

export default class SocketIO {
    private readonly server: Server;
    public readonly io: IOServer;
    private date: Date;

    constructor(
        port: number,
        private readonly fileBuildings: File,
        private readonly fileTanker: File,
        private readonly config: Config
    ) {
        const allStoredData = this.fileBuildings.getAll();
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

            socket.emit('get-all', this.fileBuildings.getAll());
            socket.emit('get-all-tanker', this.fileTanker.getAll());
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

                this.io.emit('get-required-all', this.fileBuildings.getAll());
            });

            socket.on('update-ia-config', (updatedData: IIA) => {
                console.log('UPDATING IA CONFIG');

                const updatedIA = this.config.setIAConfig(updatedData);

                this.io.emit('update-ia-confirmation', updatedIA);
            });

            socket.on('update-tanker', (tanker: ITanker) => {
                console.log('CREATE TANKER');

                const updatedTanker = this.config.updateTanker(tanker);

                this.io.emit('update-tanker-confirmation', updatedTanker);
            });

            socket.on('hello_word', (data) => {
                console.log('Hello World');
                console.log(data);
            });
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

            const registerTanker = {
                level: Math.floor(Math.random() * config.tanker.capacity),
                date: this.date.toISOString()
            };

            this.io.emit('append-new-data', newRegisters);
            this.io.emit('append-new-data-tanker', registerTanker);

            this.fileBuildings.write(newRegisters);
            this.fileTanker.write(registerTanker);
            this.date.setHours(this.date.getHours() + 1);
        }, 60000);
    }
}