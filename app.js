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

var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + server.address().port);
});

// Socket.io
var io = require("socket.io")(server);

io.sockets.on("connection", function (socket) {
  // WebSocket Connection
  console.log("Usuario conectado");

  socket.send("Bienvenido");

  socket.on("pruebas", function (data) {
    console.log("pruebas");
    var datos = "";
    for (var i = 0; i < data.length; i++) {
      datos += data[i];
    }
    console.log(datos);
  });

  socket.on("luces", function (data) {
    console.log("evento luces: " + data);
    raspiloto.cambia_estado_luces(data);
  });

  socket.on("intermitentes", function (data) {
    console.log("evento intermitentes: " + data);
    raspiloto.cambia_estado_intermitentes(data);
  });

  socket.on("emergencias", function (data) {
    console.log("evento emergencias: " + data);
    raspiloto.cambia_estado_emergencias(data);
  });

  socket.on("claxon", function (data) {
    console.log("Evento claxon: " + data);
    raspiloto.cambia_estado_claxon(data);
  });

  socket.on("movimiento", function (data) {
    console.log("evento movimiento: " + data);
    raspiloto.cambia_estado_movimiento(data);
  });

  socket.on("disconnect", function (data) {
    console.log("conexion cerrada");
    raspiloto.desactivar_sistemas();
  });
});
