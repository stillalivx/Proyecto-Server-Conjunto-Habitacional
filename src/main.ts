import SocketIO from './controllers/socket.controller';
import Arduino from './controllers/arduino.controller';
import File from './controllers/file.controller';
import Config from './controllers/config.controller';


const file = new File('water_data.json');
const config = new Config('config.json')
const socket = new SocketIO(3459, file, config);

// new Arduino(socket, file,{
//     baudRate: 38400,
//     path: 'COM5'
// });