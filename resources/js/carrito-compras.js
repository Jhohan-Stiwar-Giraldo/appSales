import Helpers from './helpers.js';

export default class CarritoDeCompras {

    #productos;
    #porComprar;
    #descuento;

    constructor() {
        this.#productos = [];
        this.#porComprar = [];
        this.#descuento = 15;
    }

    static async crear() {
        const instancia = new CarritoDeCompras();

        await Helpers.cargarPagina(
            '#index-contenido', './resources/views/carrito.html'
        ).catch(error =>
            Helpers.alertar(
                '#index-contenido', 'Problemas al acceder al carrito de compras', error)
        );
        console.log('Cargada la página del carrito');

        instancia.#productos = await Helpers.leerJSON('./data/productos.json').catch(error =>
            Helpers.alertar('#index-contenido', 'Problemas al acceder a los productos', error)
        );
        console.log('Cargados los productos', instancia.#productos);

        return instancia;
    }

    gestionarVentas() {
        this.#productos.forEach((producto, indice) => {
            let idEnlace = `carrito-producto-${indice}`;
            let fichaProducto = `
                <div class="w-full flex flex-col p-3">
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
                    <img src="./resources/assets/images/${producto.imagen}" alt="" class="w-full h-64">
                        <div class="p-4 flex-1 flex flex-col" style="">
                        <h3 class="mb-4 font-bold text-2x1">${producto.referencia} - $${producto.precio}</h3>
                            <div class="mb-4 text-black text-sm flex-1">
                                <p>${producto.resumen}</p>
                            </div>
                            <a id="${idEnlace}" data-indice="${indice}" href="#" 
                            class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none
                            focus:shadow-outline text-center" style="">
                                Agregar al Carrito
                            </a>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector('#carrito-disponibles').insertAdjacentHTML('beforeend', fichaProducto);
            document.querySelector(`#${idEnlace}`).addEventListener('click', e => {
                this.agregarAlCarrito(e.target.dataset.indice);
            })
        });
        let btnPagar = document.querySelector('#carrito-btnpagar');
        btnPagar.style.display = 'none'; //visible si hay elementos en el carrito
        btnPagar.addEventListener('click', event => this.procesarPago())

        let btnVaciar = document.querySelector('#carrito-btnvaciar');
        btnVaciar.style.display = 'none'; //visible si hay elementos en el carrito
        btnVaciar.addEventListener('click', event => this.vaciarCarrito())
        this.getCupon();
        this.getCarousel();
    }

    agregarAlCarrito(indice) {

        let idBtnEliminar = `carrito-btneliminar-${indice}`;
        let idLista = `lstcantidad-${indice}`;
        let disponibles = this.#productos[indice].disponible;
        let item = this.#porComprar.find(producto => producto.indice === indice);

        if (item) {
            document.querySelector(`#carrito-venta-${item.indice}`).scrollIntoView();
            document.querySelector(`#lstcantidad-${item.indice}`).focus();
            return;
        }

        document.querySelector('#carrito-confirmacion').innerHTML = '';

        if (disponibles > 0){
            this.#porComprar.push({
                indice,
                cantidad: 1
            });
        }

        let elementosLista = '<option>1</option>';
        for (let i = 2; i <= disponibles; i++) {
            elementosLista += `<option>${i}</option>`;
        }

        let producto = `
            <div id="carrito-venta-${indice}"
                class="border w-full rounded mt-5 flex p-4 justify-between items-center flex-wrap">
                <div class="w-2/4">
                    <h3 class="text-lg font-sans">${this.#productos[indice].referencia}</h3>
                    <h4 class="text-red-700 text-xs mt-1">Sólo quedan ${disponibles} en stock </h4>
                </div>
                <div>
                    <h5 id="precio-prod-${indice}" class="text-2xl font-sans">
                        <sup class="text-lg text-teal-600">$</sup>
                        ${this.#productos[indice].precio}
                    </h5>
                    <h5 class="text-sm font-bold text-teal-800">Descuento ${this.#descuento}%</h5>
                </div>
                <div class="w-full flex justify-between mt-4">

                    <button id="${idBtnEliminar}" data-indice="${indice}" 
                        class="text-red-700 hover:bg-red-100 px-2">ELIMINAR</button>

                    <label class="block uppercase tracking-wide text-gray-700" for="grid-first-name">
                        UNIDADES
                        <select id="${idLista}" data-indice="${indice}"
                            class="ml-3 text-sm bg-teal-700 border border-teal-200 text-white p-2 rounded leading-tight">
                            ${elementosLista}
                        </select>
                    </label>
                </div>
            </div>
        `;

        document.querySelector('#carrito-elegidos').insertAdjacentHTML('beforeend', producto);
        document.querySelector('#carrito-btnpagar').style.display = '';
        document.querySelector('#carrito-btnvaciar').style.display = '';

        document.querySelector(`#${idBtnEliminar}`).addEventListener('click', e => this.eliminarDelCarrito(e.target.dataset.indice));
        document.querySelector('#carrito-btnvaciar').addEventListener('click', e => this.vaciarCarrito());
        document.querySelector(`#${idLista}`).addEventListener('change', e => this.actualizarCantCompra(e));
    }

    actualizarCantCompra(e) {
        let indice = e.target.dataset.indice;
        let item = this.#porComprar.find(producto => producto.indice === indice);
        item.cantidad = parseInt(e.target.value);
        let precio = this.#productos[indice].precio * item.cantidad;
        document.querySelector(`#precio-prod-${indice}`).innerHTML = precio;
        
    }

    getCupon() {
        let num1 = Helpers.getRandomInt(1, 10);
        let num2 = Helpers.getRandomInt(1, 10);
        let num3 = Helpers.getRandomInt(1, 10);
        let cupon = `
            <div class="w-full bg-orange-200 text-yellow-900 px-4 py-2 flex items-center">
                <img src="https://svgsilh.com/svg/151889.svg" class="w-10 block pr-2">
                <div class="text-sm font-bold">
                    Felicitaciones usted ha sido elegido para un <b>cupón de descuento</b> en este pedido
                </div>
            </div>
        `;
        console.log(num1, num2, num3);
        if (num1 == num2 && num1 == num3 && num2 == num3) {
            document.querySelector('#carrito-Cupon').insertAdjacentHTML('beforebegin', cupon)
        }
    }

    getCarousel() {
        
        let carousel = '';
        let carouseli = '';
        
        this.#productos.forEach((producto, indice) => {
            if (producto.disponible < 6) {
                carousel += `
                    <div class="snap-start w-full h-full flex items-center justify-between text-black text-4xl flex-shrink-0" 
                        style="background-image: url()" id="slide-${indice}">
                        <div class="m-2">
                            <p>${producto.referencia} </p>
                        </div>
                        <div class="m-2">
                            <p> Precio: $${producto.precio}  </p>
                        </div>
                        <div class="m-2">
                            <p> Unidades Disponibles: ${producto.disponible}</p>
                        </div>
                        <div class="m-2">
                            <img src="./resources/assets/images/${producto.imagen}" alt="" class="w-44 h-56">
                        </div>
                    </div>
                    `;
                carouseli += `
                    <a class="w-8 mr-1 h-8 text-black rounded-full bg-green-700 text-white flex justify-center items-center" 
                    href="#slide-${indice}">${indice}</a>
                `;
            }
        })
        document.querySelector('#carritoCarousel').insertAdjacentHTML('beforeend', carousel)
        document.querySelector('#carouselindice').insertAdjacentHTML('beforeend', carouseli)
    }

    eliminarDelCarrito(indice) {
        // eliminar la ficha de la lista de compras
        let elemento = document.querySelector(`#carrito-venta-${indice}`);
        elemento.parentNode.removeChild(elemento); // distinto a dejarlo vacío

        // eliminar el elemento del array de los productos a comprar 
        let item = this.#porComprar.find(
            producto => producto.indice === indice
        );
        let i = this.#porComprar.indexOf(item);
        this.#porComprar.splice(i, 1);

        // si no quedan elementos por comprar ocultar el botón de pago
        if (this.#porComprar.length === 0) {
            document.querySelector('#carrito-btnpagar').style.display = 'none';
            document.querySelector('#carrito-btnvaciar').style.display = 'none';
        }
    }

    vaciarCarrito() {
        let indice = 0;
        this.#porComprar.forEach(producto => indice = producto.indice);
        this.eliminarDelCarrito(indice);
    }

    procesarPago() {
        let total = 0;
        this.#porComprar.forEach(producto => {
            const totalLinea = this.#productos[producto.indice].precio * producto.cantidad;
            this.#productos[producto.indice].disponible -= producto.cantidad;
            total += totalLinea
        });
        const iva = total * 0.19;
        const descuento = total * (this.#descuento / 100);
        const totalPago = iva + total - descuento;
        let pago = `
            <div class="bg-white rounded shadow p-2 w-full ">
                <div class="w-full bg-orange-200 px-8 py-6">
                    <h3 class="text-2xl mt-4 font-bold">Resumen del pago</h3>
                    <div class="flex justify-between mt-3">
                       <div class="text-xl text-orange-900 font-bold">Valor</div>
                       <div class="text-xl text-right font-bold">$${total}</div>
                    </div>
                    <div class="flex justify-between mt-3">
                        <div class="text-xl text-orange-900 font-bold">
                             IVA (19%)
                        </div>
                        <div class='text-xl text-right font-bold'>$${iva}</div>
                    </div>
                    <div class="bg-orange-300 h-1 w-full mt-3"></div>
                    <div class="flex justify-between mt-3">
                        <div class="text-xl text-orange-900 font-bold">
                             Total a pagar
                        </div>
                        <div class="text-2xl text-orange-900 font-bold">
                             $${totalPago}
                        </div>
                    </div>
                    <button id="carrito-btnconfirmar"
                        class="px-2 py-2 bg-teal-600 text-white w-full mt-3
                        rounded shadow font-bold hover:bg-teal-800">
                        CONFIRMAR
                    </button>
                </div>
            </div>
        `;
        document.querySelector('#carrito-confirmacion').innerHTML = pago;
        document.querySelector('#carrito-btnconfirmar').addEventListener('click', event => this.confirmarPago())
    }

    confirmarPago() {

        if (Helpers.existeElemento('#carrito-orden-envio')) return;

        this.#porComprar = [];
        document.querySelector('#carrito-btnpagar').style.display = 'none';
        document.querySelector('#carrito-btnconfirmar').style.display = 'none';
        document.querySelector('#carrito-btnvaciar').style.display = 'none';
        document.querySelector('#carrito-elegidos').innerHTML = ``;

        let nroOrden = Helpers.getRandomInt(10000, 9999999);

        let confirmacion = `
            <div id="carrito-orden-envio"
                class="bg-white rounded shadow px-10 py-6 w-full mt-4
                       flex flex-wrap justify-center ">

                <div class="pr-8">
                    <h3 class="text-2xl mt-4 font-bold
                        text-teal-900">Gracias por su compra
                    </h3>

                    <h4 id="carrito-nro-orden" class="text-sm
                            text-gray-600 font-bold">
                        ORDEN DE ENVÍO #${nroOrden}</h4>
                </div>

                <img src="https://image.flaticon.com/icons/svg/1611/1611768.svg"
                     alt="" class="w-24">
            </div>
        `;
        document.querySelector('#carrito-confirmacion').insertAdjacentHTML('beforeend', confirmacion);
    }


}