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
    this.direction = 0;
    // intervalo para hacer parpadear los intermitentes
    var intervalId = setInterval(function () {}, 0);
    this.blinkInterval = [intervalId];
    clearInterval(this.blinkInterval[0]);
    // sistema de pines para la nueva libreria
    this.lights = hw.preparePINs([15, 16, 18, 22], "out");
    this.leftSigns = hw.preparePINs([37, 12], "out");
    this.rightSigns = hw.preparePINs([11, 13], "out");
    this.horn = hw.preparePINs([7], "out");
    // se necesita controlar la velocidad con un pwm
    this.motorL = hw.preparePINs([29, 31], "out");
    this.motorR = hw.preparePINs([38, 40], "out");
    // hacen falta 12 o 32 como pwm0 y 33 o 35 como pwm1
    this.motorLAcc = hw.preparePWM([32]);
    this.motorRAcc = hw.preparePWM([33]);
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

  updateSteer() {
    hw.setStatePins(this.motorL.concat(this.motorR), false);
    hw.setStatePins([this.motorL[this.direction]], true);
    hw.setStatePins([this.motorR[this.direction]], true);
    hw.setPWM(this.motorLAcc, Math.abs(this.statusSteer.left));
    hw.setPWM(this.motorRAcc, Math.abs(this.statusSteer.right));
  }
}

module.exports = Vehicle;
