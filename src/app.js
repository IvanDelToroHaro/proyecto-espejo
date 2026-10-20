// 1. Estado de la aplicación (Datos iniciales que simulan venir de una base de datos)
let tareas = [
  { id: 1, titulo: 'Aprender la sintaxis de ES6', prioridad: 'Alta', completada: true },
  { id: 2, titulo: 'Dominar la asincronía y Fetch', prioridad: 'Media', completada: false },
  { id: 3, titulo: 'Migrar el proyecto a Angular', prioridad: 'Baja', completada: false }
];

// Estado del filtro activo actual ('Todas', 'Pendientes', 'Completadas')
let filtroActual = 'Todas';

// 2. Selectores del DOM principales
const formulario = document.querySelector('#form-tareas');
const inputTitulo = document.querySelector('#input-titulo');
const selectPrioridad = document.querySelector('#select-prioridad');
const listaContenedor = document.querySelector('#lista-tareas');
const loadingState = document.querySelector('#loading-state');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

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
    if (filtroActual === 'Pendientes') return !tarea.completada;
    if (filtroActual === 'Completadas') return tarea.completada;
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
      tareas = tareas.map(tareaActual => (
        tareaActual.id === tarea.id
          ? { ...tareaActual, completada: !tareaActual.completada }
          : tareaActual
      ));
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
  const prioridad = selectPrioridad.value;
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

// 6. MANEJO DE EVENTOS: Captura de botones de filtrado
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', (event) => {
    // Quitar clase active al botón anterior y ponérsela al pulsado
    document.querySelector('.btn-filtro.active').classList.remove('active');
    event.target.classList.add('active');

    // TODO: Actualizar la variable 'filtroActual' con el atributo 'data-filtro' del botón
    // TODO: Invocar pintarTareas() para refrescar la pantalla
  });
});

// Arrancar la aplicación
inicializarApp();