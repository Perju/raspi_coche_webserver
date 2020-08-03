const HwConfigurador = require("./hwconfigurador");
const hw = new HwConfigurador();
class Vehicle {
  constructor() {
    this.statusSignals = {
      light: false,
      leftSign: false,
      rightSign: false,
      hazard: false,
      horn: false,
    };
    this.oldLRLigths = { leftSign: false, rightSign: false, hazard: false };
    this.statusSteer = { left: 0, right: 0 };
    // pines para las luces y los intermitentes
    // TODO cambiar todos los numeros de los pines, no se pude congiurar un GND como salida.
    this.lights = hw.preparePINs([22, 23, 24, 25], "out");
    this.leftSigns = hw.preparePINs([26, 18], "out");
    this.rightSigns = hw.preparePINs([17, 27], "out");
    var intervalId = setInterval(function () {}, 0);
    this.blinkInterval = [intervalId];
    clearInterval(this.blinkInterval[0]);
    // motorA is Left or Izq
    this.motorL = hw.preparePINs([5, 6], "out");
    //motorB is Right of Der
    this.motorR = hw.preparePINs([20, 21], "out");
    //buzzer para el claxon
    this.horn = hw.preparePINs([4], "out");
  }

  updateSignals() {
    // luces
    hw.setStatePins(this.lights, this.statusSignals.light);
    // intermitentes newstate -> nst y oldState -> ost
    var st = this.statusSignals;
    var left = this.leftSigns;
    var right = this.rightSigns;
    if (st.hazard) {
      hw.stopBlink(right.concat(left), this.blinkInterval);
      hw.startBlink(right.concat(left), this.blinkInterval);
    }
    if (st.rightSign && !st.hazard) {
      hw.stopBlink(right.concat(left), this.blinkInterval);
      hw.startBlink(right, this.blinkInterval);
    }
    if (st.leftSign && !st.hazard) {
      hw.stopBlink(right.concat(left), this.blinkInterval);
      hw.startBlink(left, this.blinkInterval);
    }
    if (!st.leftSign && !st.rightSign && !st.hazard) {
      hw.stopBlink(right.concat(left), this.blinkInterval);
    }
    // claxon
    hw.setStatePins(this.horn, this.statusSignals.horn);
  }

  updateSteer(state) {
    // hw.switchOffPins(this.motorIzq.concat(this.motorDer));
    // if (estado == "Palante") {
    //   hw.switchOnPins([this.motorIzq[0], this.motorDer[0]]);
    // } else if (estado == "Patras") {
    //   hw.switchOnPins([this.motorIzq[1], this.motorDer[1]]);
    // } else if (estado == "Derecha") {
    //   hw.switchOnPins([this.motorIzq[0], this.motorDer[1]]);
    // } else if (estado == "Izquierda") {
    //   hw.switchOnPins([this.motorIzq[1], this.motorDer[0]]);
    // } else if (estado == "Parar") {
    //   console.log("no hago nada porque ya esta todo parado");
    // }
  }
}

module.exports = Vehicle;
