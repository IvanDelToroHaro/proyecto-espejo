"use strict";
function procesarRespuesta(res) {
    if (res.status === 'success') {
        res.data?.forEach(texto => console.log(texto));
        return;
    }
    console.error(res.mensajeError);
}
class ServicioDatos {
    endpoint;
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    conectar() {
        console.log('Conectando a ' + this.endpoint);
    }
}
class ServicioUsuarios extends ServicioDatos {
    entidad = 'usuarios';
    constructor(endpoint) {
        super(endpoint);
    }
}
const usuarioValido = {
    id: 1,
    username: 'ana',
    email: 'ana@example.com',
    rol: 'alumno',
    token: 'token-de-prueba'
};
const usuarioInvalido = {
    id: 2,
    username: 'invitado',
    email: 'invitado@example.com',
    // @ts-expect-error El tipo UsuarioAPI no permite el rol "invitado".
    rol: 'invitado'
};
class ProductComponent {
    nombreProducto;
    precioBase;
    iva = 0.21;
    constructor(nombreProducto, precioBase) {
        this.nombreProducto = nombreProducto;
        this.precioBase = precioBase;
    }
    obtenerPrecioFinal() {
        return this.precioBase * (1 + this.iva);
    }
}
const producto = new ProductComponent('Teclado', 50);
if (false) {
    // @ts-expect-error precioBase es privado y no puede modificarse desde fuera de la clase.
    producto.precioBase = 100;
}
console.log(`${producto.nombreProducto}: ${producto.obtenerPrecioFinal()} €`);
const misTareas = [
    { id: 1, titulo: 'Aprender TypeScript', prioridad: 'Alta', completada: false },
    { id: 2, titulo: 'Practicar interfaces', prioridad: 'Media', completada: false },
    { id: 3, titulo: 'Crear un componente', prioridad: 'Baja', completada: false }
];
function completarTarea(lista, idBuscar) {
    return lista.map(tarea => (tarea.id === idBuscar
        ? { ...tarea, completada: true }
        : tarea));
}
function esPrioridad(valor) {
    return valor === 'Alta' || valor === 'Media' || valor === 'Baja';
}
function esFiltro(valor) {
    return valor === 'Todas' || valor === 'Pendientes' || valor === 'Completadas';
}
function obtenerElemento(selector) {
    const elemento = document.querySelector(selector);
    if (!elemento) {
        throw new Error(`No se encontró el elemento "${selector}".`);
    }
    return elemento;
}
// 1. Estado de la aplicación (Datos iniciales que simulan venir de una base de datos)
let tareas = [
    { id: 1, titulo: 'Aprender la sintaxis de ES6', prioridad: 'Alta', completada: true },
    { id: 2, titulo: 'Dominar la asincronía y Fetch', prioridad: 'Media', completada: false },
    { id: 3, titulo: 'Migrar el proyecto a Angular', prioridad: 'Baja', completada: false }
];
// Estado del filtro activo actual ('Todas', 'Pendientes', 'Completadas')
let filtroActual = 'Todas';
// 2. Selectores del DOM principales
const formulario = obtenerElemento('#form-tareas');
const inputTitulo = obtenerElemento('#input-titulo');
const selectPrioridad = obtenerElemento('#select-prioridad');
const listaContenedor = obtenerElemento('#lista-tareas');
const loadingState = obtenerElemento('#loading-state');
const botonesFiltro = document.querySelectorAll('.btn-filtro');
if (botonesFiltro.length === 0) {
    throw new Error('No se encontraron botones de filtrado.');
}
// 3. FUNCIÓN ASÍNCRONA (AJAX simulado): Debe ejecutarse al arrancar la web
async function inicializarApp() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    loadingState.style.display = 'none';
    pintarTareas();
}
// 4. FUNCIÓN DE RENDERIZADO: Encargada de pintar los nodos en el HTML
function pintarTareas() {
    listaContenedor.innerHTML = '';
    const tareasFiltradas = tareas.filter(tarea => {
        if (filtroActual === 'Pendientes')
            return !tarea.completada;
        if (filtroActual === 'Completadas')
            return tarea.completada;
        return true;
    });
    tareasFiltradas.forEach(tarea => {
        const elementoTarea = document.createElement('li');
        elementoTarea.className = `item-tarea ${tarea.prioridad}${tarea.completada ? ' completada' : ''}`;
        const tituloTarea = document.createElement('span');
        tituloTarea.textContent = tarea.titulo;
        elementoTarea.appendChild(tituloTarea);
        const botonEstado = document.createElement('button');
        botonEstado.type = 'button';
        botonEstado.textContent = tarea.completada ? 'Marcar pendiente' : 'Completar';
        botonEstado.addEventListener('click', () => {
            tareas = tareas.map(tareaActual => (tareaActual.id === tarea.id
                ? { ...tareaActual, completada: !tareaActual.completada }
                : tareaActual));
            pintarTareas();
        });
        elementoTarea.appendChild(botonEstado);
        listaContenedor.appendChild(elementoTarea);
    });
}
// 5. MANEJO DE EVENTOS: Captura de formulario
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const titulo = inputTitulo.value.trim();
    if (!titulo) {
        inputTitulo.setCustomValidity('Escribe un título para la tarea.');
        inputTitulo.reportValidity();
        return;
    }
    const prioridad = selectPrioridad.value;
    if (!esPrioridad(prioridad)) {
        throw new Error(`La prioridad "${prioridad}" no es válida.`);
    }
    const nuevaTarea = {
        id: Date.now(),
        titulo,
        prioridad,
        completada: false
    };
    tareas = [...tareas, nuevaTarea];
    pintarTareas();
    formulario.reset();
});
inputTitulo.addEventListener('input', () => {
    inputTitulo.setCustomValidity('');
});
// 6. MANEJO DE EVENTOS: Captura de botones de filtrado
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        // Quitar clase active al botón anterior y ponérsela al pulsado
        const filtro = boton.dataset.filtro;
        if (!esFiltro(filtro)) {
            throw new Error(`El filtro "${filtro}" no es válido.`);
        }
        botonesFiltro.forEach(botonFiltro => botonFiltro.classList.remove('active'));
        boton.classList.add('active');
        filtroActual = filtro;
        pintarTareas();
    });
});
// Arrancar la aplicación
inicializarApp();
