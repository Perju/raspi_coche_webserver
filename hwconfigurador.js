const raspi = require("raspi");
const gpio = require("raspi-gpio");
const pwm = require("raspi-pwm");

class HwConfigurador {
  constructor() {
    raspi.init(() => {
      console.log("Motres iniciados: raspi.init");
    });
  }
  // preparar leds
  preparePINs(nPins, tipo) {
    return nPins.map((n) => {
      const pin = new gpio.DigitalOutput(`P1-${n}`);
      pin.write(gpio.LOW);
      return pin;
    });
  }

  // parpadear leds
  toggleState(pins) {
    pins.forEach((pin) => {
      pin.write(pin.value === gpio.LOW ? gpio.HIGH : gpio.LOW);
    });
  }

  setStatePins(pins, state) {
    pins.forEach((pin) => {
      pin.write(state === true ? gpio.HIGH : gpio.LOW);
    });
  }
  // apagar y finalizar leds
  shutdownPins(pins) {
    pins.forEach((pin) => {
      pin.write(gpio.LOW);
    });
  }

  startBlink(LEDs, blinkInterval) {
    if (blinkInterval[0]._idleTimeout == -1) {
      clearInterval(blinkInterval[0]);
      blinkInterval[0] = setInterval(this.toggleState, 500, LEDs);
    }
  }

  stopBlink(LEDs, blinkInterval) {
    clearInterval(blinkInterval[0]);
    this.shutdownPins(LEDs);
  }

  preparePWM(nPin) {
    const pin = new pwm.PWM(`P1-${nPin}`);
    pin.write(0.0);
    return pin;
  }

  setPWM(pin, duty) {
    pin.write(duty);
  }
}

module.exports = HwConfigurador;
