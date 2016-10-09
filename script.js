function Noticia(id, titulo, descripcion, imagen) {

    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.imagen = imagen;

}

var Diario = (function () {

    // Atributos privados
    var noticias = [];
	var claveLocalStorage = 'noticias';

    /*
        Permite precargar las noticias por localstorage
    */
    var precargarNoticias = function () {
		
        var datos = localStorage.getItem(claveLocalStorage);

        if (datos !== null && datos !== '') {

            noticias = JSON.parse(datos);
			
			for (i = 0; i < noticias.length; i++) {
				
				dibujarNoticia(noticias[i]);
				
			}

		}

	}

	/*
		Guarda el array de noticias en localstorage
	*/
	var guardarNoticias = function () {

		var datos = JSON.stringify(noticias);
		localStorage.setItem(claveLocalStorage, datos);

	}
	
	/*
		Agrega el texto al elemento utilizando un nodoTexto
		Retorna el elemento con el nodoTexto agregado
	 */
   /* var agregarTexto = function (elemento, texto) {

        var nodoTexto = document.createTextNode(texto);
        elemento.appendChild(nodoTexto);

        return elemento;

    }*/

    var modificarNoticia = function (noticia) {

   
  

    	$('#' + noticia.id + ' ' + 'h3').html(noticia.titulo);

    	$('#' + noticia.id + ' ' + 'img').attr('src', noticia.imagen);

    	$('#' + noticia.id + ' ' + 'p').html(noticia.descripcion);
 

  
    	guardarNoticias();
    	limpiarFormulario();
    	
    }

    var limpiarFormulario = function () {

		$('#boton').html('Agregar').on('click',crearNoticia).off('click',crearNoticia);
    	
		$('#titulo').val= '';
		$('#descripcion').val = '';
		$('#imagen').val = '';

    }

    var cargarNoticia = function (noticia) {
   
	   	
	   	$('#titulo').val(noticia.titulo);
	   	$('#descripcion').val(noticia.descripcion)  ;
	    $('#imagen').val(noticia.imagen) ;
	  


	   $('#boton')
									.html('Modificar')
									.on('click', function() 
	   		
	   		{
			noticia.titulo = $('#titulo').val();
	   		noticia.descripcion = $('#descripcion').val();
	   		noticia.imagen = $('#imagen').val();

	   		modificarNoticia(noticia);

		});
	}

	/*
		Dibuja en el DOM la noticia pasada como parametro
	 */
	var dibujarNoticia = function (noticia) {
	
		$('<li/>')
			.attr('id', noticia.id)
			.addClass('list-group-item')
			.appendTo('#noticias');

		var botonEliminar = $('<button/>')
									.addClass('btn btn-default btn-xs')
									.on('click', function () { eliminarNoticia(noticia.id); });
		var botonModificar = $('<button/>')
									.addClass('btn btn-default btn-xs')
									.on('click', function() { cargarNoticia(noticia); });

		$('<span/>')
			.addClass('glyphicon glyphicon-remove')
			.html('Borrar')
			.appendTo(botonEliminar);

		$('<span/>')
			.addClass('glyphicon glyphicon-pencil')
			.html('Modificar')
			.appendTo(botonModificar);

		botonEliminar.appendTo('#' + noticia.id);
		botonModificar.appendTo('#' + noticia.id);

		 $('<h3/>').html(noticia.titulo).appendTo('#' + noticia.id);
		 $('<p/>').html(noticia.descripcion).appendTo('#' + noticia.id);
		 $('<img/>').attr('src', noticia.imagen).appendTo('#' + noticia.id);

		

	}

    /*
		Borra del DOM la noticia pasada como parametro
	 */
    var borrarNoticiaDOM = function (id) {

       

        $('#'+id).remove();

    }

    // Si la noticia existe en el array de noticias devuelve la posicion donde se encuentra (0, 1, 2, etc.)
    // En caso contrario devuelve -1;
    var obtenerPosicionNoticia = function (id) {

        var posicion = -1; 
        
        // La condicion del for lee: 'Mientras haya elementos en el array de noticias por recorrer y la posicion sea -1
        for(i = 0; i < noticias.length && posicion === -1; i++) { 

            if (noticias[i].id === id) { 
                
                // Si los ids coinciden me guardo el contenido de la variable i en la variable posicion
                posicion = i; 

            }

        }

        return posicion;

    }

    var agregarNoticia = function (noticia) {

		noticias.push(noticia);

		guardarNoticias();

		dibujarNoticia(noticia);

		limpiarFormulario();
		
    }
	
    var eliminarNoticia = function (id) {

        var posicion = obtenerPosicionNoticia(id);

		// Borra 1 elemento desde la posicion
		noticias.splice(posicion, 1);

		guardarNoticias();

		borrarNoticiaDOM(id);

    }

       var limpiarNoticiasDOM = function ()  {
    	  
    	  $('#noticias').empty();

		}

    
	var limpiarDiario = function () {

		noticias = []
		localStorage.removeItem(claveLocalStorage);
		
		limpiarNoticiasDOM();

	}

	var construirComparador = function (atributo, ordenamientoAscendente) {

		return function (elementoA, elementoB) {

			var resultado;

			if (elementoA[atributo] > elementoB[atributo]) {

				resultado = 1;

			}

			if (elementoA[atributo] === elementoB[atributo]) {

				resultado = 0;

			}

			if (elementoA[atributo] < elementoB[atributo]) {

				resultado = -1;

			}

			if (ordenamientoAscendente === false) {

				resultado = -resultado;

			}

			return resultado;

		}

	}

	var ordenarNoticias = function (atributo, ordenamientoAscendente) {

		var comparador = construirComparador(atributo, ordenamientoAscendente);

		noticias.sort(comparador);

		guardarNoticias();
		limpiarNoticiasDOM();
		precargarNoticias();

	}

	/*

		Busca en el array de noticias la noticia con el id mas grande y devuelve ese id incrementado en una unidad.

	*/
	var generarNuevoId = function () {

		var id = 0;

		if (noticias.length !== 0) {
			
			var atributo = 'id';
			var ordenamientoAscendente = false;
			var comparador = construirComparador(atributo, ordenamientoAscendente);
			var copiaNoticias = noticias;

			copiaNoticias.sort(comparador);

			id = copiaNoticias[0].id + 1;

		}

		return id;
		
	}




	
	var mostrarOcultarListado = function () {

		$('#noticias').toggle(

		function () {

			if ($('#mostrarOcultarListado').text() === 'Ocultar Noticias') {

				$('#mostrarOcultarListado').text('Mostrar Noticias');

			} else {

				$('#mostrarOcultarListado').text('Ocultar Noticias');
			}

		
	
 		}
	
	)};

	

	var crearNoticia = function () {

		var id = generarNuevoId();
		//var titulo = document.getElementById("titulo").value;
		var titulo = $('#titulo').val();
		var imagen =  $('#imagen').val();
		var descripcion =$('#descripcion').val();
		

		var noticia = new Noticia(id, titulo, descripcion, imagen);

		agregarNoticia(noticia);

	}

	var vincularFormulario = function () {

		$('#boton').on('click',crearNoticia)

		//var boton = document.getElementById('boton');
		//boton.onclick = crearNoticia;

	}


		//var ordenarPorId = document.getElementById('id');
		//var ordenarPorAZ = document.getElementById('az');
		//var ordenarPorZA = document.getElementById('za');

	
	var vincularOrdenamientos = function () {
       
        $('#id').on('click',function(){
			
			var atributo = 'id';
			var ordenamientoAscendente = true;

			ordenarNoticias(atributo, ordenamientoAscendente);

			});


          $('#az').on('click',function() {
			
			var atributo = 'titulo';
			var ordenamientoAscendente = true;

			ordenarNoticias(atributo, ordenamientoAscendente);

		});

        
          $('#za').on('click',function(){
			
			var atributo = 'titulo';
			var ordenamientoAscendente = false;

			ordenarNoticias(atributo, ordenamientoAscendente);

		});

		
	}

	var vincularBotonListado = function () {

		$('#mostrarOcultarListado').on('click', function () { mostrarOcultarListado(); } )

	}

	var iniciar = function () {

		vincularFormulario();
		vincularOrdenamientos();
		vincularBotonListado();
		precargarNoticias();

	}

    // El 'agregarNoticia' de la izquierda es el nombre del atributo de nuestro objeto literal.
    // El 'agregarNoticia' de la derecha es el valor que tendra el atributo. Es la funcion que tenemos declarada

    // El 'eliminarNoticia' de la izquierda es el nombre del atributo de nuestro objeto literal.
    // El 'eliminarNoticia' de la derecha es el valor que tendra el atributo. Es la funcion que tenemos declarada
    return {

        /* Esto se hace ahora a traves de los eventos del formulario.
		agregarNoticia: agregarNoticia,
        eliminarNoticia: eliminarNoticia,*/
		limpiarDiario: limpiarDiario,
		iniciar: iniciar

    };

})()

// Para limpiar el diario pueden hacer lo siguiente:
// Esto borra el array de noticias, limpia localstorage y quita todas las noticias del DOM.
// Diario.limpiarDiario()

$(document).ready(function () {

		Diario.iniciar();

	}
);




//$(selector).val() recupera valor de input
//$(selector).val('demo')asigna el valor demo al input
//$(selector).remove()//borra el elemento del DOM
//$(selector).empty()borra todo el contenido del elemnto pero deja a este en el DOM
//$(selector).show() muestra el elemneto
//$(selector).hide() oculta el elemneto