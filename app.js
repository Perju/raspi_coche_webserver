var express = require("express");
var path = require("path");
var ejs = require("ejs");

var Raspiloto = require("./raspiloto");
var raspiloto = new Raspiloto();

// Express
var app = express();

app.set("port", process.env.PORT || 3000);

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("client", { status: raspiloto.status });
});

var server = require("http").createServer(app);

// Socket.io
var io = require("socket.io")(server);

io.on("connection", function (socket) {
  // WebSocket Connection
  console.log("Usuario conectado");

  socket.send("Bienvenido");

  socket.on("steer", (data) => {
    // console.log(`Steer: ${data}`);
    raspiloto.cambia_estado_movimiento(data);
  });

  socket.on("signal", (data) => {
    var dataToSend = { type: data.type, state: data.state };
    socket.emit("signal", dataToSend);
    // console.log(dataToSend);

    switch (data.type) {
      case "horn":
        raspiloto.cambia_estado_claxon(data.state);
        break;
      case "light":
        raspiloto.cambia_estado_luces(data.state);
        break;
      case "leftSign":
        raspiloto.cambia_estado_intermitentes("left", data.state);
        break;
      case "rightSign":
        raspiloto.cambia_estado_intermitentes("right", data.state);
        break;
      case "hazard":
        raspiloto.cambia_estado_emergencias(data.state);
        break;
    }
    raspiloto.vehicle.updateSignals();
  });

  socket.on("steer", function (data) {
    // console.log("pruebas: ", data);
    raspiloto.cambia_estado_movimiento(data);
    raspiloto.vehicle.updateSteer();
  });

  socket.on("disconnect", function (data) {
    console.log("conexion cerrada");
    raspiloto.detener_sistemas();
  });
});

server.listen(app.get("port"), function () {
  console.log("Express server listening on port " + server.address().port);
});
