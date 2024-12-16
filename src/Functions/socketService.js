import { io } from "socket.io-client";
class SocketService {
  constructor() {
    if (!SocketService.instance) {
      this.socket = null;
      this.registeredEvents = new Set();
      SocketService.instance = this;
    }
    return SocketService.instance;
  }

  connect(userId) {
    if (!this.socket) { 
      this.socket = io("http://localhost:5000", {
        query: { userId },
        withCredentials: true,
        transports: ["websocket"],
      });
      this.socket.on("connect", () => console.log("Socket connected:", this.socket.id));
      this.socket.on("disconnect", () => console.log("Socket disconnected"));
    } else {
      console.log("Socket already connected");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("Socket disconnected!");
      this.socket = null;
      this.registeredEvents.clear();
    }
  }

  on(event, callback) {
    if (this.socket && !this.registeredEvents.has(event)) {
      this.socket.on(event, callback);
      this.registeredEvents.add(event);
    }
  }

  off(event) {
    if (this.socket && this.registeredEvents.has(event)) {
      this.socket.off(event);
      this.registeredEvents.delete(event);
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
