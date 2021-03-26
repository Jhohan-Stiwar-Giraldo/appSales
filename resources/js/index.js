// mantenga siempre la consola del navegador activa
'use strict';

import Helpers from './helpers.js';
import Modal from './modal.js';
import CarritoDeCompras from './carrito-compras.js';
import Productos from './productos.js';
import Departamento from './departamentos.js';
import Ciudad from './ciudades.js';

document.addEventListener('DOMContentLoaded', async event => {
    Helpers.cargarPagina('#index-header', './resources/views/menu.html').then(gestionarOpciones).catch(
            error => Helpers.alertar('#index-contenido', 'Problemas al acceder al menú principal '));


    await Modal.crear();
    /* Modal.desplegar({
        titulo: 'bienvenido',
        contenido: 'haga sus compras'
    }); */
    
});

let gestionarOpciones = resultado => {
    let elemento = `#${resultado.id}`; // se asigna '#index-header'
    cargarContactenos(elemento);
    cargarQuienesSomos(elemento);
    cargarProductos(elemento);
    cargarCarrito(elemento);
    cargarActualizar(elemento);
    cargarContraseña(elemento);
}

let cargarCarrito = elemento => {
    let referencia = document.querySelector(`${elemento} a[id='menu-carrito']`);
    referencia.addEventListener('click', async (event) => {
        event.preventDefault();
        let carrito = await CarritoDeCompras.crear();
        carrito.gestionarVentas();
    });
}

let cargarContactenos = elemento => {
    let referencia = document.querySelector(`${elemento} a[id='menu-contactenos']`);
    referencia.addEventListener('click',(event) => {
        event.preventDefault();
        Helpers.cargarPagina('#index-contenido', './resources/views/contactenos.html').then(async () => {
            let paises = await Helpers.leerJSON('./data/paises.json')
            let paisesLista = '<option value="" selected disabled>Elija un país ...</option>'
            paises.forEach(pais => {
                paisesLista += `<option value="${pais.code}">${pais.name}</option>`
            });
            document.querySelector('#listapaises').innerHTML = paisesLista;

            document.querySelector('#listapaises').addEventListener('change', e => actualizarpais(e, paises));
        }).catch(error => {
            Helpers.alertar('#index-contenido', 'Problemas al acceder a contáctenos', error);
        })
    });
}

function actualizarpais(e, paises) {
    let value = e.target.dataset.indice;
    let item = paises.find(pais => pais.code === value);
    item = e.target.value;
    console.log(item);
}

let cargarQuienesSomos = elemento => {
    let referencia = document.querySelector(`${elemento} a[id='menu-quienes-somos']`);
    referencia.addEventListener('click', (event) => {
        event.preventDefault();
        Helpers.cargarPagina('#index-contenido', './resources/views/nosotros.html').catch(error => {
            Helpers.alertar('#index-contenido', 'Problemas al acceder a nosotros', error);
        })
    });
}

let cargarProductos = elemento => {
    let referencia = document.querySelector(`${elemento} a[id='menu-productos']`);
    referencia.addEventListener('click', async (event) => {
        event.preventDefault();
        let productos = await Productos.crear();
        productos.getTabla();

    });
}

let cargarActualizar = elemento => {
    let referencia = document.querySelector(`${elemento} a[id='usuario-actualizar']`);
    referencia.addEventListener('click', (event) => {
        event.preventDefault();
        Helpers.cargarPagina('#index-contenido', './resources/views/actualizar.html').then(() => {
            let dep = Departamento.getDepartamentos();
            
            let depLista = '<option value="" selected disabled>Elige ...</option>';
            
            dep.forEach(depar => {
                depLista += `<option value="${depar.codigo}">${depar.nombre}</option>`
            })

            document.querySelector('#departamentos').innerHTML = depLista;

            document.querySelector('#departamentos').addEventListener('change', e => actualizardepar(e, dep));

            document.querySelector('#btnActualizar').addEventListener('click', e => guardar(e))

        }).catch(error => {
            Helpers.alertar('#index-contenido', 'Problemas al acceder a carrito de compras', error);
        })
    });
}

function guardar(e){
    e.preventDefault();
    let contra1 = document.querySelector('#contra').value
    let contra2 = document.querySelector('#contraVerificacion').value
    let nombres = document.querySelector('#nombres').value
    let apellidos = document.querySelector('#apellidos').value

    if (nombres != '' && apellidos != '' && contra1 != '' && contra2 != '')
        if (contra1 === contra2){
            console.log('guardado')
        } else{
            console.log('Las contraseñas no son iguales');
        }
    else{
        console.log('Hay campos vacios')
    }
}

function actualizardepar(e, dep) {
    let value = e.target.dataset.indice;
    let item = dep.find(depar => depar.codigo === value);
    item = e.target.value;
    let city = Ciudad.filtrarLocalidades(item);
    
    let cityLista = '<option value="" selected disabled>Elige ...</option>';

    city.forEach(ciu => {
        cityLista += `<option value="${ciu.codigo}">${ciu.nombre}</option>`
    })

    document.querySelector('#ciudades').innerHTML = cityLista;

    document.querySelector('#ciudades').addEventListener('change', e => actualizarciudad(e, city));
}

function actualizarciudad(e, city) {
    let value = e.target.dataset.indice;
    let item = city.find(ciu => ciu.codigo === value);
    item = e.target.value;
    console.log(item);
}

let cargarContraseña = elemento => {
    let referencia = document.querySelector(`${elemento} a[id='usuario-contraseña']`)
    referencia.addEventListener('click', (event) => {
        event.preventDefault();
        Helpers.cargarPagina('#index-contenido', './resources/views/cambiarcontraseña.html').catch(error => {
            Helpers.alertar('#index-contenido', 'Problemas al acceder a carrito de compras', error);
        })
    });
}