var Gpio = require('onoff').Gpio;

class HwConfigurador{
    // preparar leds
    static preparePINs(pins, tipo){
	var pinsPreparados = [];
	for(var i=0 ; i<pins.length; i++){
	    pinsPreparados.push(new Gpio(pins[i], tipo));
	}
	return pinsPreparados;
    }
    
    // parpadear leds
    static blinkPins(pins){
	for(var i=0;i<pins.length; i++){
	    if(pins[i].readSync() != 0){
		pins[i].writeSync(0);
	    } else {
		pins[i].writeSync(1);
	    }
	}
    }
    
    // encender leds
    static switchOnPins(pins){
	for(var i=0;i<pins.length; i++){
            pins[i].writeSync(1);
	}
    }
    
    // apagar leds
    static switchOffPins(pins){
	for(var i=0;i<pins.length; i++){
            pins[i].writeSync(0);
	}
    }
    static setStatePins(pins, state){
	for (var i = 0; i < pins.length; i++) {
	    state == true
		? pins[i].writeSync(1)
		: pins[i].writeSync(0);
	}
    }
    // apagar y finalizar leds
    static shutdownPins(pins) {
	for(var i=0;i<pins.length; i++){
	    pins[i].writeSync(0);
	    pins[i].unexport();
	}
    }
    
    static startBlink(LEDs, blinkInterval){
	//console.log("Empiza a parpadear -> blinkInterval ");
	//console.log(LEDs);
	if(blinkInterval[0]._idleTimeout==-1){
	    blinkInterval[0] = setInterval(this.blinkPins, 500, LEDs );
	}
    }
    
    static stopBlink(LEDs, blinkInterval){
	// console.log("Terminal de parpadear");
	clearInterval(blinkInterval[0]);
	for(var i=0;i<LEDs.length; i++){
	    LEDs[i].writeSync(0);
	}
    }
}

module.exports.HwConfigurador = HwConfigurador;
