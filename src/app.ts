type Prioridad = 'Alta' | 'Media' | 'Baja';
type Filtro = 'Todas' | 'Pendientes' | 'Completadas';

interface Tarea {
  id: number;
  titulo: string;
  prioridad: Prioridad;
  completada: boolean;
}

function esPrioridad(valor: string): valor is Prioridad {
  return valor === 'Alta' || valor === 'Media' || valor === 'Baja';
}

function esFiltro(valor: string | undefined): valor is Filtro {
  return valor === 'Todas' || valor === 'Pendientes' || valor === 'Completadas';
}

function obtenerElemento<T extends Element>(selector: string): T {
  const elemento = document.querySelector<T>(selector);
  if (!elemento) {
    throw new Error(`No se encontró el elemento "${selector}".`);
  }
  return elemento;
}

// 1. Estado de la aplicación (Datos iniciales que simulan venir de una base de datos)
let tareas: Tarea[] = [
  { id: 1, titulo: 'Aprender la sintaxis de ES6', prioridad: 'Alta', completada: true },
  { id: 2, titulo: 'Dominar la asincronía y Fetch', prioridad: 'Media', completada: false },
  { id: 3, titulo: 'Migrar el proyecto a Angular', prioridad: 'Baja', completada: false }
];

// Estado del filtro activo actual ('Todas', 'Pendientes', 'Completadas')
let filtroActual: Filtro = 'Todas';

// 2. Selectores del DOM principales
const formulario = obtenerElemento<HTMLFormElement>('#form-tareas');
const inputTitulo = obtenerElemento<HTMLInputElement>('#input-titulo');
const selectPrioridad = obtenerElemento<HTMLSelectElement>('#select-prioridad');
const listaContenedor = obtenerElemento<HTMLUListElement>('#lista-tareas');
const loadingState = obtenerElemento<HTMLDivElement>('#loading-state');
const botonesFiltro = document.querySelectorAll<HTMLButtonElement>('.btn-filtro');

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