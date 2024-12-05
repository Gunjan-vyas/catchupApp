import http from "http";
import SocketService from "./services/socket";

async function init() {
  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  const socketService = new SocketService();

  //attaching socket service to http server
  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`HTTPS Server started at PORT : ${PORT}`);
  });

  socketService.initListeners();
}

init();
