import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(" Client connected:", socket.id);
});

/* ✅ THIS ROUTE IS REQUIRED */
app.post("/emit", (req, res) => {
    console.log(" Emitting:", req.body);

    io.emit("whatsapp_event", req.body);

    res.json({ success: true });
});

server.listen(4000, () => {
    console.log(" Socket server running on http://localhost:4000");
});
