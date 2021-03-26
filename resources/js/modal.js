import Helpers from './helpers.js';

export default class Modal{

    static async crear() {
        await Helpers.cargarPagina('#index-modal', './resources/views/modal.html'
        ).catch(error => console.error(error));
    }
    
    static desplegar({ titulo, contenido, botones = [] }) {
        document.querySelector('.modal-container #titulo').innerHTML = titulo;
        document.querySelector('.modal-container main').innerHTML = contenido;

        let footer = document.querySelector('.modal-content #modal-footer');
        footer.innerHTML = '';
        
        botones.forEach((boton) => {
            let htmlBtn = `
                <button id="${boton.id}" class="${boton.clase}"> ${boton.titulo}</button>
            `
            footer.insertAdjacentHTML('beforeend', htmlBtn);
            let button = document.querySelector(`.modal-content #${boton.id}`);
            if (typeof(boton.callBack) === 'function') {
                button.addEventListener('click', e => boton.callBack(e));
            }
        });
        Modal.asignarEventos();
        Modal.toggle();
    }

    static asignarEventos() {
        const overlay = document.querySelector('.modal-overlay');
        overlay.addEventListener('click', Modal.toggle);

        let closeModals = document.querySelectorAll('.modal-close');
        closeModals.forEach(closeModal => closeModal.addEventListener('click', Modal.toggle))

        document.onkeydown = evt => {
            let isEscape = false;

            if ("key" in evt){
                isEscape = (evt.key === "Escape" || evt.key === "Esc")
            } else {
                isEscape = (evt.key === 27)
            }

            if (isEscape && document.body.classList.contains('modal-active')) {
                Modal.toggle()
            }
        }
    }

    static toggle(){
        const body = document.querySelector('body');
        const modal = document.querySelector('.modal');
        modal.classList.toggle('opacity-0');
        modal.classList.toggle('pointer-events-none');
        body.classList.toggle('modal-active');
    }
}