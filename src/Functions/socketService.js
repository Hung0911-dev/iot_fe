import { io } from "socket.io-client";
class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io("http://localhost:5000", {
        query: { userId },
        withCredentials: true,
        transports: ["websocket"],
      });
      console.log("Socket connected!");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("Socket disconnected!");
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

const socketService = new SocketService();
export default socketService;
