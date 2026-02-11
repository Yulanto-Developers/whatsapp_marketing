import { Server } from "socket.io";

let io;

export function initIO(server) {
    if (!io) {
        io = new Server(server, {
            path: "/api/socket",
            cors: { origin: "*" },
        });
    }
    return io;
}

export function getIO() {
    return io;
}
