var HwConfigurador = require('./hwconfigurador').HwConfigurador;

class Raspiloto {
    
    constructor(){
	// estructura de datos para gestionar los eventos de forma mas avanzada
	this.status={'luces':'off',
		     'intermitentes':'off',
		     'emergencias':'off',
		     'movimiento':'reposo'};
	// pines para las luces y los intermitentes
	// TODO cambiar todos los numeros de los pines, no se pude congiurar un GND como salida.
	this.luces = HwConfigurador.preparePINs([22,23,24,25],'out');
	this.intermitentesDer = HwConfigurador.preparePINs([26,18],'out');
	this.intermitentesIzq = HwConfigurador.preparePINs([17,27],'out');
	this.blinkInterval = [setInterval(function(){},0)];
	clearInterval(this.blinkInterval[0]);
	// motorA is Left or Izq
	this.motorIzq = HwConfigurador.preparePINs([5,6],'out');
	//motorB is Right of Der
	this.motorDer = HwConfigurador.preparePINs([20,21], 'out');
	//buzzer para el claxon
	this.claxon = HwConfigurador.preparePINs([4],'out');
    }
    
    cambia_estado_luces(estado){
	if(estado=="on"){
            HwConfigurador.switchOnPins(this.luces);
	}else if(estado=="off"){
            HwConfigurador.switchOffPins(this.luces);
	}
    }
    
    cambia_estado_intermitentes(estado){
	console.log("cambia estado intermitentes: "+estado);
      if(estado=="Derecho"){
	  HwConfigurador.stopBlink(this.intermitentesIzq, this.blinkInterval);
	  HwConfigurador.startBlink(this.intermitentesDer, this.blinkInterval);
      }else if(estado=="Izquierdo"){
	  HwConfigurador.stopBlink(this.intermitentesDer, this.blinkInterval);
	  HwConfigurador.startBlink(this.intermitentesIzq, this.blinkInterval);
      }else if(estado=="Reposo"){
	  HwConfigurador.stopBlink(this.intermitentesDer, this.blinkInterval);
	  HwConfigurador.stopBlink(this.intermitentesIzq, this.blinkInterval);
      }
    }
    
    cambia_estado_emergencias(estado){
	if(estado=="on"){
	    HwConfigurador.startBlink(this.intermitentesDer.concat(this.intermitentesIzq), this.blinkInterval);
	}else if(estado=="off"){
	    HwConfigurador.stopBlink(this.intermitentesDer.concat(this.intermitentesIzq), this.blinkInterval);
	}
    }
    
    cambia_estado_movimiento(estado){
	HwConfigurador.switchOffPins(this.motorIzq.concat(this.motorDer));
	if(estado=="Palante"){
	    HwConfigurador.switchOnPins([this.motorIzq[0],this.motorDer[0]]);
	}else if(estado=="Patras"){
	    HwConfigurador.switchOnPins([this.motorIzq[1],this.motorDer[1]]);
	}else if(estado=="Derecha"){
	    HwConfigurador.switchOnPins([this.motorIzq[0],this.motorDer[1]]);
	}else if(estado=="Izquierda"){
	    HwConfigurador.switchOnPins([this.motorIzq[1],this.motorDer[0]]);
	}else if(estado=="Parar"){
	    console.log("no hago nada porque ya esta todo parado");
	}
    }
    
    cambia_estado_claxon(estado){
	if(estado==true){
	    HwConfigurador.switchOnPins(this.claxon);
	}else if(estado==false){
	    HwConfigurador.switchOffPins(this.claxon);
	}
    }
    
    desactivar_sistemas(){
	HwConfigurador.stopBlink(this.intermitentesDer.concat(this.intermitentesIzq), this.blinkInterval);
	HwConfigurador.switchOffPins(this.intermitentesIzq.concat(this.intermitentesDer));
	HwConfigurador.switchOffPins(this.luces);
	HwConfigurador.switchOffPins(this.motorIzq);
	HwConfigurador.switchOffPins(this.motorDer);
    }
    
}

module.exports.Raspiloto = Raspiloto;
