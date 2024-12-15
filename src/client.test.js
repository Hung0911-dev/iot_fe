// client.test.js
const io = require("socket.io-client");

describe("Socket.IO Client Tests", () => {
  let clientSocket;

  test("Client should connect to server and communicate", (done) => {
    // Connect client to server
    clientSocket = io("http://localhost:5000");

    clientSocket.on("connect", () => {
      console.log("Client connected to test server");

      // Emit a test event
      clientSocket.emit("test-event", { message: "Hello, server!" });
    });

    // Listen for the response
    clientSocket.on("test-response", (response) => {
      expect(response.success).toBe(true);
      expect(response.data.message).toBe("Hello, server!");
      done();
    });
  });
});
