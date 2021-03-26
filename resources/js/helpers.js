
export default class Helpers {

    /**
     * Carga en elemento el recurso html obtenido de una URL
     * @param {String} elemento el ID de un elemento HTML (se tiene
                       en cuenta la sintaxis de los selectores CSS)
     * @param {String} url la dirección local o remota del recurso
                       del que se obtiene el código html.
     */
    static async cargarPagina(elemento, url) {
        let respuesta = await fetch(url);

        if (respuesta.ok) {
            const contenedor = document.querySelector(elemento);
            contenedor.innerHTML = await respuesta.text();
            return contenedor;
        }

        // si algo falla se lanza una excepción
        throw `error ${respuesta.status} -
                     ${respuesta.statusText}`;
    }

    static alertar(elemento, mensaje, error = 'Error técnico sin reportar', atencion = '¡Santo cielo!') {
        document.querySelector(elemento).insertAdjacentHTML('afterbegin', `
            <div id="alerta" class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                <p class="font-bold">${atencion}</p>
                <p>${mensaje}</p>
            </div>`
        );

        setTimeout(() => document.querySelector('#alerta')
            .style.display = 'none', 3000);

        if (error) {
            console.error(`Houston, tenemos un problema: ${error}`);
        }
    }

    static leerJSON = async (url, opciones = {}) => {
        let respuesta = await fetch(url);
        if (respuesta.ok) {
            return respuesta.json();
        }
        throw new Error(`error ${respuesta.status} - ${respuesta.statusText}`);
    }

    static getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static existeElemento(idElemento) {
        let elemento = document.querySelector(idElemento);
        return (typeof (elemento) != 'undefined' && elemento != null);
    }
}

String.prototype.replaceArray = function (find, replace) {
    let replaceString = this;
    for (let i = 0; i < find.length; i++) {
        replaceString = replaceString.replace(find[i], replace[i]);
    }
    return replaceString;
};