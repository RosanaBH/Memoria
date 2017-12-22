
var app = {
	nivel: 0,
	max_nivel:3,
	num_aciertos:0,
	tiempo: 60,
	retardo: 800,
	par:0,
	idPar:0,
	noClick:false,
	ancho: "400px",
        dimension_img: "80px",
	idTimer:false,
	lista: new Array(1,2,3,4,5,6,1,2,3,4,5,6),
        umbral:12,

	inicio: function () {
		if (app.idTimer){
                    clearInterval(app.idTimer);
                    document.getElementById("crono").innerHTML="0:"+app.tiempo;
                    app.idTimer=false;
                }
		app.num_aciertos=0;
		app.par=0;
						
		if(!app.nivel){
                    app.mensaje("Elegir con sabidur&iacute;a debes,<br><b>"+(app.lista.length/2) +" parejas</b> encontrar tienes!"); 
                    document.getElementById("crono").innerHTML="0:"+app.tiempo;
                    app.nivel=1;
                    document.getElementById("jugar").addEventListener('click',function(){app.inicio();});
                    app.vigilaSensores();
                }else{
                    app.configurarNivel();
                    app.dibujarParejas();
                    app.dibujarCrono();
                }
                app.dibujarNivel(); 
	},
        vigilaSensores: function () {
            function onError() {
                console.log('Error');
            }
            function onSuccess(datosAceleracion) {
                app.detectaAgitacion(datosAceleracion);
            }
            navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 250});
        },
        detectaAgitacion: function (datosAceleracion) {
            var acX = datosAceleracion.x > app.umbral;
            var acY = datosAceleracion.y > app.umbral;
            var acZ = datosAceleracion.z > app.umbral;
            if (acX || acY || acZ ) {
                navigator.vibrate(250);
                app.mostrarTodo();               
                
            }
        },
        mostrarTodo: function (){
            for(var i =0; i <(app.lista.length); i++) document.getElementById(i).style.opacity=1;
            if (app.idTimer){
                    clearInterval(app.idTimer);
                    document.getElementById("crono").innerHTML="0:"+app.tiempo;
                    app.idTimer=false;
                }
	     
        },
        configurarNivel: function(){
            //se configura el nivel de dificultad
		if (app.nivel==2){
			app.lista= new Array(1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10);
			app.ancho="500px";
			app.retardo=700;
			app.tiempo=90;
                        app.dimension_img="70px";
		}
		else if (app.nivel==3){
			app.lista= new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20);
			app.ancho="800px";
			app.retardo=600;
			app.tiempo=180;
                        app.dimension_img="60px";
		}
                else if(app.nivel > app.max_nivel){
                        app.lista= new Array(1,2,3,4,5,6,1,2,3,4,5,6);
			app.ancho="400px";
			app.retardo=800;
			app.tiempo=60;
                        app.dimension_img="80px";
                }
                
                if (document.styleSheets[0].cssRules){
                    var clase1=document.styleSheets[0].cssRules[0];
                    var clase2=document.styleSheets[0].cssRules[1];
                }else if (document.styleSheets[0].rules){
                    var clase1=document.styleSheets[0].rules[0];
                    var clase2=document.styleSheets[0].cssRules[1];
                }
                clase1.style.height=app.dimension_img; //img-tarjeta
                clase1.style.width=app.dimension_img;
                clase2.style.height=app.dimension_img; //tarjeta
                clase2.style.width=app.dimension_img;
                
        },
	dibujarCrono: function(){
		var segundero = app.tiempo;
		if ((!app.idTimer)&& app.nivel<3){
		app.idTimer = setInterval( 
		function() {
			--segundero;
			
			if (segundero >= 10){
				document.getElementById("crono").innerHTML=segundero+":"+app.tiempo;
			} else {
				document.getElementById("crono").innerHTML="0"+segundero+":"+app.tiempo;
			}
			if (segundero == 0){
				document.getElementById("crono").innerHTML="0:"+app.tiempo;
				clearInterval(app.idTimer); 
			    app.inicio();
			}
			
		}, 600);
		}
                if(app.nivel==3)document.getElementById("crono").innerHTML="-:-";
	},
	dibujarNivel: function(){
		document.getElementById("nivel").innerHTML="Nivel <b>"+ app.nivel+"</b>";
	},
	mensaje: function(msj){
		var contenido="";
		document.getElementById("parejas").style.maxWidth="1200px";
		document.getElementById("parejas").style.backgroundColor="white";
		document.getElementById("parejas").style.border="thin";
		contenido="<img id='yoda' src='img/yoda_msj.png'><div class='mensaje'>"+msj+"</div>";
		//<button class='bt-play' onclick='app.dibujarParejas();'><span>Jugar</span></button>";
		document.getElementById('parejas').innerHTML=contenido;
	},
	
	dibujarParejas: function(){
		app.lista = app.lista.sort(function() {return Math.random() - 0.5});
		document.getElementById("parejas").style.maxWidth=app.ancho;
		document.getElementById("parejas").style.backgroundColor="lightgrey";
		document.getElementById("parejas").style.border="hidden";
		document.getElementById('parejas').innerHTML="";
		
		for(var i =0; i <(app.lista.length); i++) {
			document.getElementById('parejas').innerHTML+=
			"<div class='tarjeta' id='div"+i+"'><img id='"+i
			+"' class='img-tarjeta' src='img/"+app.lista[i]
			+"SW.jpg' onclick='if(!app.noClick)app.visualizarTarjeta("+i+");'></div>";
		}
		
	},
	
	visualizarTarjeta: function(iTarjeta){
		if(!app.noClick){
			document.getElementById(iTarjeta).style.opacity=1;
			if (app.par){
				if (app.lista[iTarjeta] != app.lista[app.idPar]){
					app.noClick=true;
					setTimeout(function(){document.getElementById(iTarjeta).style.opacity=0;
					document.getElementById(app.idPar).style.opacity=0;app.noClick=false;},app.retardo);
				}
				else{
					app.num_aciertos+=1;
                                        navigator.vibrate(250);
					if((app.lista.length/2)==app.num_aciertos){
                                            if (app.idTimer) clearInterval(app.idTimer);
                                            app.nivel+=1;
                                            navigator.vibrate(1500);
                                            app.configurarNivel();
                                            if(app.nivel <= app.max_nivel){
                                                app.dibujarNivel();
                                                app.mensaje("Acertado t&uacute; has!En <b>Nivel "+app.nivel+"</b> est&aacute;s,<br><b>"+(app.lista.length/2) +" parejas</b> a encontrar vas!");
                                            }else{
                                                app.mensaje("Enhorabuena joven Padawan!<br><b>Jedi eres ya!</b>");
                                                app.nivel=0;
                                            }                                         
					}
				}
				app.par=0;
			}
			else{
			 	app.idPar=iTarjeta;
				 app.par=1;
			}
		}
	}
}//final objeto app


if ('addEventListener' in document) {
    document.addEventListener('deviceready',
            function () {  app.inicio();},
            false);
}
//Se inicializa el juego cuando el contenido está cargado
/*if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', 
		function () { app.inicio();},
		 false);
}*/