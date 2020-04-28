import axios from 'axios';
import Swal from 'sweetalert2';

const nave = document.querySelector('.img-header');


document.addEventListener('DOMContentLoaded', () => {



    window.onscroll = function() {
        // Obtenemos la posicion del scroll en pantalla
        let scroll = document.documentElement.scrollTop || document.body.scrollTop;

        // Realizamos alguna accion cuando el scroll este entre la posicion 300 y 400
        if (scroll > 0) {
            if (nave) {
                nave.classList.add('animated-nave');
            }
        }
    }

    const skills = document.querySelector('.lista-conocimientos');

    // Limpiar las alertas
    let alertas = document.querySelector('.alertas');

    if (alertas) {
        limpiarAlertas();
    }

    if (skills) {
        skills.addEventListener('click', agregarSkills);

        // una vez que estamos en editar llamar la funcion
        skillsSelecionados();
    }


    const vacantesListado = document.querySelector('.panel-administracion');

    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
});

const skills = new Set(); // Set no agrega elementos repetidos al array
const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            // Quitarlo del set y quitar la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            // Agregarlo al set y agregar la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSelecionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    });

    // Inyectarlo en el input hidden
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');

    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
}

// Eliminar Vacantes
const accionesListado = e => {
    e.preventDefault();

    if (e.target.dataset.eliminar) {
        // eliminar por medio de axios
        Swal.fire({
            title: 'Estas seguro?',
            text: "No podras recuperar la vacante una vez eliminada!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si eliminar!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.value) {


                // Enviar peticion con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                // enviar peticion axios para eliminar la vacante 
                axios.delete(url, { params: { url } })
                    .then(res => {
                        if (res.status === 200) {
                            // console.log(res);
                            Swal.fire(
                                'Eliminada!',
                                res.data,
                                'success'
                            );
                            // TODO: Eliminar del DOM
                            e.target.parentElement.parentElement.parentElement.removeChild(
                                e.target.parentElement.parentElement
                            );
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ha ocurrido un error',
                            text: 'Eliminacion Fallida!',
                        })
                    });
            }
        })
    } else if (e.target.tagName === 'A') {
        window.location.href = e.target.href;
    }
}