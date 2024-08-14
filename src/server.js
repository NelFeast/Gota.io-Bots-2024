const WebSocket = require('ws');
const Helper = require('./utils/Helper.js');
const config = require('./config/config.js');
const Logger = require('./utils/Logger.js');
const Module = require('./utils/Module.js');

const server = Helper.createServer();
const wss = new WebSocket.Server({ server: server });

server.listen(config.server.port, async() => {
    Logger.info(`Running version ${config.server.version} on port ${config.server.port}`);
    await Helper.initializeProxies();
});

wss.on('connection', (ws) => {
    const module = new Module(ws);
    Logger.info(`User Connected`);
    ws.on('message', (message) => {
        module.handleMessage(message);
    });
    ws.on('close', () => {
        module.stopBots();
        Logger.warn("User Disconnected!");
    });
    ws.on('error', () => {
        module.stopBots();
    });
});
