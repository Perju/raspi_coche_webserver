var HwConfigurador = require('./hwconfigurador').HwConfigurador;

class Raspiloto {
    
    constructor(){
	// estructura de datos para gestionar los eventos de forma mas avanzada
	this.currentStatus={'luces':'off',
			    'intermitentes':'reposo',
			    'emergencias':'off',
			    'movimiento':'reposo'};
	this.newStatus={'luces':'off',
			    'intermitentes':'reposo',
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

    updateState(){
	// Estado de las luces
	if(this.newStatus.luces!=this.currentStatus.luces){
	    if(this.newStatus.luces=="on"){
		HwConfigurador.switchOnPins(this.luces);
	    }else if(this.newStatus.luces=="off"){
		HwConfigurador.switchOffPins(this.luces);
	    }
	}
	// Estado de los intermitenes
	if(this.newStatus.intermitentes!=this.currentStatus.intermitentes){
	    if(this.newStatus.intermitentes=="Derecho"){
		HwConfigurador.stopBlink(this.intermitentesIzq, this.blinkInterval);
		HwConfigurador.startBlink(this.intermitentesDer, this.blinkInterval);
	    }else if(this.newStatus.intermitentes=="Izquierdo"){
		HwConfigurador.stopBlink(this.intermitentesDer, this.blinkInterval);
		HwConfigurador.startBlink(this.intermitentesIzq, this.blinkInterval);
	    }else if(this.newStatus.intermitentes=="Reposo"){
		HwConfigurador.stopBlink(this.intermitentesDer, this.blinkInterval);
		HwConfigurador.stopBlink(this.intermitentesIzq, this.blinkInterval);
	    }
	}
	// Estado de las luces de emergencia
	if(this.newStatus.emergencias!=this.currentStatus.emergencias){
	    if(newStatus.emergencias=="on"){
		HwConfigurador.startBlink(this.intermitentesDer.concat(this.intermitentesIzq), this.blinkInterval);
	    }else if(estado=="off"){
		HwConfigurador.stopBlink(this.intermitentesDer.concat(this.intermitentesIzq), this.blinkInterval);
	    }
	}
	// Estado de los motores
	if(this.newStatus.movimiento!=this.currentStatus.emergencias){
	    HwConfigurador.switchOffPins(this.motorIzq.concat(this.motorDer));
	    if(this.newStatus.movimiento=="Palante"){
		HwConfigurador.switchOnPins([this.motorIzq[0],this.motorDer[0]]);
	    }else if(this.newStatus.movimiento=="Patras"){
		HwConfigurador.switchOnPins([this.motorIzq[1],this.motorDer[1]]);
	    }else if(this.newStatus.movimiento=="Derecha"){
		HwConfigurador.switchOnPins([this.motorIzq[0],this.motorDer[1]]);
	    }else if(this.newStatus.movimiento=="Izquierda"){
		HwConfigurador.switchOnPins([this.motorIzq[1],this.motorDer[0]]);
	    }else if(this.newStatus.movimiento=="Parar"){
		// Se para en caso de indicar algun movimiento
	    }
	}
	// Estado del claxon
	if(this.newStatus.claxon!=this.currentStatus.claxon){
	    if(this.newStatus.claxon==true){
		HwConfigurador.switchOnPins(this.claxon);
	    }else if(this.newStatus==false){
		HwConfigurador.switchOffPins(this.claxon);
	    }	    
	}
	this.currentStatus=this.newStatus.s;
    }
    
    cambia_estado_luces(isOn){
	this.newStatus.luces=isOn;
    }
    
    cambia_estado_intermitentes(strIntermitentes){
	console.log("Param estado: "+strIntermitentes);
	this.newStatus.intermitentes=strIntermitentes;
    }
    
    cambia_estado_emergencias(isOn){
	this.newStatus.emergencias=isOn;
    }
    
    cambia_estado_movimiento(strMovimiento){
	this.newStatus.movimiento=strMovimiento;
    }
    
    cambia_estado_claxon(isOn){
	this.newStatus.claxon=isOn;
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
