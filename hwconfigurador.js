var Gpio = require("onoff").Gpio;

class HwConfigurador {
  // preparar leds
  preparePINs(pins, tipo) {
    var pinsPreparados = [];
    for (var i = 0; i < pins.length; i++) {
      pinsPreparados.push(new Gpio(pins[i], tipo));
    }
    return pinsPreparados;
  }

  // parpadear leds
  static toggleState(pins) {
    for (var i = 0; i < pins.length; i++) {
      var state = pins[i].readSync() != 0 ? 0 : 1;
      pins[i].writeSync(state);
    }
  }

  static setStatePins(pins, state) {
    for (var i = 0; i < pins.length; i++) {
      state == true ? pins[i].writeSync(1) : pins[i].writeSync(0);
    }
  }
  // apagar y finalizar leds
  static shutdownPins(pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].writeSync(0);
      pins[i].unexport();
    }
  }

  static startBlink(LEDs, blinkInterval) {
    if (blinkInterval[0]._idleTimeout == -1) {
      blinkInterval[0] = setInterval(this.toggleState, 500, LEDs);
    }
  }

  static stopBlink(LEDs, blinkInterval) {
    clearInterval(blinkInterval[0]);
    for (var i = 0; i < LEDs.length; i++) {
      LEDs[i].writeSync(0);
    }
  }
}

module.exports = HwConfigurador;
