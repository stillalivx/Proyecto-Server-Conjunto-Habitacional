import { Server as IOServer, Socket } from "socket.io";
import { createServer, Server } from "http";
import File from "./file.controller";
import Config from './config.controller';
import { IBuilding } from '../interfaces/config.interface';

export default class SocketIO {
    private readonly server: Server;
    public readonly io: IOServer;

    constructor(
        port: number,
        private readonly file: File,
        private readonly config: Config
    ) {
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
        });
    }
}