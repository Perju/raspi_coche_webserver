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

  cambia_estado_movimiento(estado) {}

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
