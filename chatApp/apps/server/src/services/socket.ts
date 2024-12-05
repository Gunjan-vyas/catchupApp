import { Server } from "socket.io";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
class SocketService {
  private _io: Server;

  constructor() {
    console.log("init socket server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log(" init Listeners ");

    io.on("connect", (socket) => {
      console.log("New socket connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message received", message);

        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
