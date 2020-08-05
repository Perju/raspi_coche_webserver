const Vehicle = require("./vehicle.js");
class Raspiloto {
  constructor() {
    this.vehicle = new Vehicle();
  }

  cambia_estado_luces(state) {
    this.vehicle.statusSignals.light = state;
  }

  cambia_estado_intermitentes(side, state) {
    if (side == "right") {
      this.vehicle.statusSignals.rightSign = state;
      this.vehicle.statusSignals.leftSign = false;
    } else if (side == "left") {
      this.vehicle.statusSignals.leftSign = state;
      this.vehicle.statusSignals.rightSign = false;
    }
  }

  cambia_estado_emergencias(state) {
    this.vehicle.statusSignals.hazard = state;
  }

  cambia_estado_movimiento(data) {
    var stL = 0;
    var stR = 0;
    var fb = Math.cos(data.degree * (Math.PI / 180));
    var lr = Math.sin(data.degree * (Math.PI / 180));
    console.log("Palante:", fb, "Izquierda:", lr);

    stL = fb;
    stR = fb;
    if (fb > 0) {
      if (lr > 0) {
        stR -= Math.abs(lr);
      } else {
        stL -= Math.abs(lr);
      }
    } else {
      if (lr > 0) {
        stR += Math.abs(lr);
      } else {
        stL += Math.abs(lr);
      }
    }
    stL *= data.factor;
    stR *= data.factor;
    this.vehicle.statusSteer.left = stL;
    this.vehicle.statusSteer.right = stR;
  }

  cambia_estado_claxon(state) {
    this.vehicle.statusSignals.horn = state;
  }

  detener_sistemas() {
    this.vehicle.statusSignals.horn = false;
    this.vehicle.statusSignals.hazard = false;
    this.vehicle.statusSignals.light = false;
    this.vehicle.statusSignals.leftSign = false;
    this.vehicle.statusSignals.rightSign = false;
  }
}

module.exports = Raspiloto;
