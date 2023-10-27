import { Server, Socket } from "socket.io";

export default class SocketIO {
    public readonly io: Server;

    constructor(port: number) {
        this.io = new Server();

        this.setListeners();

        this.io.listen(port);
    }

    private setListeners() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`NEW_CONNECTION: ${socket.id}`);
        });
    }
}