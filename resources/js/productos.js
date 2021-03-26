import Helpers from './helpers.js';
import Modal from './modal.js';

export default class Productos {

    #productos; 
    #formulario;

    constructor() {
        this.#productos = [];
    }

    static async crear() {  
        const instancia = new Productos();
        await Helpers.cargarPagina(
            '#index-contenido', './resources/views/productos.html'
        ).then(() => instancia.#formulario = document.querySelector('#bloque-edicion').innerHTML
        ).catch(error =>
            Helpers.alertar(
                '#index-contenido', 'Problemas al acceder a Productos', error)
        );
        instancia.#productos = await Helpers.leerJSON('./data/productos.json').catch(error =>
            Helpers.alertar('#index-contenido', 'Problemas al acceder a los productos', error)
        );
        return instancia;
    }

    getTabla() {
        let filas = '';

        this.#productos.forEach((producto, indice) => {

            filas += `
                <tr flex id="producto-fila-${indice}">
                    <td class="border px-4 py-2">
                        <img src="./resources/assets/images/${producto.imagen}" alt="" class="w-40 h-32 rounded-full">
                    </td>
                    <td class="border px-4 py-2">${producto.referencia}</td>
                    <td class="border px-4 py-2">${producto.disponible}</td>
                    <td class="border px-4 py-2">$${producto.precio}</td>
                    <td class="border px-4 py-2">${producto.resumen}
                    <button id="producto-btndetalles-${indice}" class="modal-open text-blue-700 hover:bg-blue-100 px-2 text-sm">ver mas...</button> 
                    </td>
                    <td class="border px-4 py-2">
                    <button id="producto-btneditar-${indice}" class="modal-open button-small ml-2 fa fa-edit focus:outline-none "></button> 
                    <button id="producto-btneliminar-${indice}" class="button button-small ml-2 fa fa-trash focus:outline-none"></button> 
                    </td> 
                </tr>
            `;
        });

        let table = `
            <table class="table-auto">
                <thead>
                    <tr>
                        <th class="border font-bold px-4 py-2">Imagen</th>
                        <th class="border font-bold px-4 py-2">Referencia</th>
                        <th class="border font-bold px-4 py-2">Disponibles</th>
                        <th class="border font-bold px-4 py-2">Precio</th>
                        <th class="border font-bold px-4 py-2">Resumen</th>
                        <th class="border font-bold px-4 py-2">Accion</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
            `;

        document.querySelector('#tproductos').insertAdjacentHTML('beforeend', table)
        

        for (let i = 0; i < this.#productos.length; i++) {
            document.querySelector(`#producto-btndetalles-${i}`).addEventListener('click', e => this.verDetalles(e, i));

            document.querySelector(`#producto-btneditar-${i}`).addEventListener('click', e => this.editarFila(e, i));

            document.querySelector(`#producto-btneliminar-${i}`).addEventListener('click', e => this.eliminarFila(e, i));
        }

        document.querySelector('#productos-btnAgregar').addEventListener('click', e => this.agregarProd(e))
    }

    editarFila(event, i) {
        event.preventDefault();
        Modal.desplegar({
            titulo: `Editar ${this.#productos[i].referencia}`,
            contenido: this.formEditar(i),
            botones: [
                {
                    id: `btn-guardar-editar`,
                    clase: 'modal-close px-4 bg-green-800 p-3 m-2 rounded-lg text-white hover:bg-green-400',
                    titulo: 'Guardar',
                    callBack: () => this.guardarEditar(i)
                },
                {
                    id: `btn-cerrar-editar`,
                    clase: 'modal-close px-4 bg-red-800 p-3 m-2 rounded-lg text-white hover:bg-red-400',
                    titulo: 'Cerrar'
                }
            ]
        });
    }
    
    guardarEditar(i){
        let id = document.querySelector('.modal-container #id').value;
        let referencia = document.querySelector('.modal-container #referencia').value;
        let disponible = document.querySelector('.modal-container #disponible').value;
        let precio = document.querySelector('.modal-container #precio').value;
        let resumen = document.querySelector('.modal-container #resumen').value;
        let detalles = document.querySelector('.modal-container #detalles').value;
        
        this.#productos[i].id  = id;
        this.#productos[i].referencia = referencia;
        this.#productos[i].disponible = disponible;
        this.#productos[i].precio = precio;
        this.#productos[i].resumen = resumen;
        this.#productos[i].detalles = detalles;

        document.querySelector('.table-auto').innerHTML = this.getTabla();
    }

    agregarProd(event){
        event.preventDefault();
        Modal.desplegar({
            titulo: `Agregar Producto`,
            contenido: this.formAgregar(),
            botones: [
                {
                    id: `btn-guardar-agregar`,
                    clase: 'modal-close px-4 bg-green-800 m-2 p-3 rounded-lg text-white hover:bg-green-400',
                    titulo: 'Guardar',
                    callBack: () => this.guardarAgregar()
                },
                {
                    id: `btn-cerrar-agregar`,
                    clase: 'modal-close px-4 bg-red-800 p-3 m-2 rounded-lg text-white hover:bg-red-400',
                    titulo: 'Cerrar'
                }
            ]
        });
    }

    guardarAgregar(){
        let id = document.querySelector('.modal-container #id').value;
        let referencia = document.querySelector('.modal-container #referencia').value;
        let disponible = document.querySelector('.modal-container #disponible').value;
        let precio = document.querySelector('.modal-container #precio').value;
        let resumen = document.querySelector('.modal-container #resumen').value;
        let detalles = document.querySelector('.modal-container #detalles').value;
        let imagen = "noimage.jpg"
        this.#productos.push({id, referencia, disponible, precio, resumen, detalles, imagen})
        document.querySelector('.table-auto').innerHTML = this.getTabla();
    }

    verDetalles(event, i) {
        event.preventDefault();
        Modal.desplegar({
            titulo: `Caracteristicas ${this.#productos[i].referencia}`,
            contenido: this.#productos[i].detalles,
            botones: [{
                id: 'btn-cerrar-infoproductos',
                titulo: 'Cerrar',
                clase: 'modal-close px-4 bg-red-800 p-3 rounded-lg text-white hover:bg-red-400'
            }]
        });
    }

    eliminarFila(event, i) {
        event.preventDefault();
        this.#productos.splice(i, 1)
        document.querySelector(`#producto-fila-${i}`).innerHTML = '';
        console.log(this.#productos);
    }

    formAgregar() {
        this.#formulario = this.#formulario.replace('productos-edicion', 'producto-agregar');
        const busqueda = ['$id', '$referencia', '$disponible', '$precio','$resumen', '$detalles', '$imagen'];
        const reemplazo = ['', '', '', '', '', '', ''];
        return this.#formulario.replaceArray(busqueda, reemplazo);
    }

    formEditar(i) {
        this.#formulario = this.#formulario.replace('productos-edicion', `producto-edicion${i}`);
        const busqueda = ['$id', '$referencia', '$disponible', '$precio','$resumen', '$detalles', '$imagen'];
        const actualizar = Object.values(this.#productos[i]);
        return this.#formulario.replaceArray(busqueda, actualizar);
    }
}