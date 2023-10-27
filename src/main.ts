import SocketIO from "./controllers/socket.controller";
import Arduino from "./controllers/arduino.controller";
import File from "./controllers/file.controller";


const file = new File("water_data.json");
const socket = new SocketIO(3456);

const arduino = new Arduino(socket, file,{
    baudRate: 38400,
    path: 'COM5'
});