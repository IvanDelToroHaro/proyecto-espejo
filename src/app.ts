type Prioridad = 'Alta' | 'Media' | 'Baja';
type Filtro = 'Todas' | 'Pendientes' | 'Completadas';

interface RespuestaServidor {
  status: 'success' | 'error';
  data?: string[];
  mensajeError?: string;
}

function procesarRespuesta(res: RespuestaServidor): void {
  if (res.status === 'success') {
    res.data?.forEach(texto => console.log(texto));
    return;
  }

  console.error(res.mensajeError);
}

class ServicioDatos {
  constructor(public endpoint: string) {}

  conectar(): void {
    console.log('Conectando a ' + this.endpoint);
  }
}

class ServicioUsuarios extends ServicioDatos {
  public entidad = 'usuarios';

  constructor(endpoint: string) {
    super(endpoint);
  }
}

interface UsuarioAPI {
  id: number;
  username: string;
  email: string;
  rol: 'admin' | 'editor' | 'alumno';
  token?: string;
}

const usuarioValido: UsuarioAPI = {
  id: 1,
  username: 'ana',
  email: 'ana@example.com',
  rol: 'alumno',
  token: 'token-de-prueba'
};

const usuarioInvalido: UsuarioAPI = {
  id: 2,
  username: 'invitado',
  email: 'invitado@example.com',
  // @ts-expect-error El tipo UsuarioAPI no permite el rol "invitado".
  rol: 'invitado'
};

class ProductComponent {
  private iva = 0.21;

  constructor(
    public nombreProducto: string,
    private precioBase: number
  ) {}

  obtenerPrecioFinal(): number {
    return this.precioBase * (1 + this.iva);
  }
}

const producto = new ProductComponent('Teclado', 50);

if (false) {
  // @ts-expect-error precioBase es privado y no puede modificarse desde fuera de la clase.
  producto.precioBase = 100;
}

console.log(`${producto.nombreProducto}: ${producto.obtenerPrecioFinal()} €`);

interface Tarea {
  id: number;
  titulo: string;
  prioridad: Prioridad;
  completada: boolean;
}

const misTareas: Tarea[] = [
  { id: 1, titulo: 'Aprender TypeScript', prioridad: 'Alta', completada: false },
  { id: 2, titulo: 'Practicar interfaces', prioridad: 'Media', completada: false },
  { id: 3, titulo: 'Crear un componente', prioridad: 'Baja', completada: false }
];

function completarTarea(lista: Tarea[], idBuscar: number): Tarea[] {
  return lista.map(tarea => (
    tarea.id === idBuscar
      ? { ...tarea, completada: true }
      : tarea
  ));
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

// Copia independiente de los datos que se muestran en la interfaz.
let listaEspejo: Tarea[] = [];

// Estado del filtro activo actual ('Todas', 'Pendientes', 'Completadas')
let filtroActual: Filtro = 'Todas';

// 2. Selectores del DOM principales
const formulario = obtenerElemento<HTMLFormElement>('#form-tareas');
const formularioContenedor = obtenerElemento<HTMLElement>('.form-section');
const inputTitulo = obtenerElemento<HTMLInputElement>('#input-titulo');
const selectPrioridad = obtenerElemento<HTMLSelectElement>('#select-prioridad');
const listaContenedor = obtenerElemento<HTMLUListElement>('#lista-tareas');
const loadingState = obtenerElemento<HTMLDivElement>('#loading-state');
const filtrosContenedor = obtenerElemento<HTMLElement>('.filter-section');

if (!filtrosContenedor.querySelector('.btn-filtro')) {
  throw new Error('No se encontraron botones de filtrado.');
}

// 3. FUNCIÓN ASÍNCRONA (AJAX simulado): Debe ejecutarse al arrancar la web
async function inicializarApp() {
  await new Promise(resolve => setTimeout(resolve, 1500));
  loadingState.style.display = 'none';
  actualizarVista();
}

function actualizarListaEspejo() {
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtroActual === 'Pendientes') return !tarea.completada;
    if (filtroActual === 'Completadas') return tarea.completada;
    return true;
  });

  listaEspejo = tareasFiltradas.map(tarea => ({ ...tarea }));
}

// 4. FUNCIÓN DE RENDERIZADO: pinta la copia de los datos en el HTML
function pintarTareas() {
  listaContenedor.innerHTML = '';

  listaEspejo.forEach(tarea => {
    const elementoTarea = document.createElement('li');
    elementoTarea.className = `item-tarea ${tarea.prioridad}${tarea.completada ? ' completada' : ''}`;
    elementoTarea.dataset.id = String(tarea.id);

    const tituloTarea = document.createElement('span');
    tituloTarea.textContent = tarea.titulo;
    elementoTarea.appendChild(tituloTarea);

    const botonEstado = document.createElement('button');
    botonEstado.type = 'button';
    botonEstado.textContent = tarea.completada ? 'Marcar pendiente' : 'Completar';
    elementoTarea.appendChild(botonEstado);

    listaContenedor.appendChild(elementoTarea);
  });
}

function actualizarVista() {
  actualizarListaEspejo();
  pintarTareas();
}

// 5. MANEJO DE EVENTOS: Captura de formulario
formularioContenedor.addEventListener('submit', (event) => {
  if (event.target !== formulario) return;

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
  actualizarVista();
  formulario.reset();
});

formulario.addEventListener('input', (event) => {
  if (event.target !== inputTitulo) return;

  inputTitulo.setCustomValidity('');
});

// 6. MANEJO DE EVENTOS: Captura de botones de filtrado
filtrosContenedor.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const boton = event.target.closest('.btn-filtro');
  if (!(boton instanceof HTMLButtonElement) || !filtrosContenedor.contains(boton)) return;

  const filtro = boton.dataset.filtro;
  if (!esFiltro(filtro)) {
    throw new Error(`El filtro "${filtro}" no es válido.`);
  }

  filtrosContenedor.querySelectorAll<HTMLButtonElement>('.btn-filtro')
    .forEach(botonFiltro => botonFiltro.classList.remove('active'));
  boton.classList.add('active');

  filtroActual = filtro;
  actualizarVista();
});

listaContenedor.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const boton = event.target.closest('button');
  if (!boton || !listaContenedor.contains(boton)) return;

  const elementoTarea = boton.closest('li.item-tarea');
  if (!elementoTarea || elementoTarea.parentElement !== listaContenedor) return;

  const idTarea = Number(elementoTarea.dataset.id);
  if (!Number.isFinite(idTarea)) {
    throw new Error('No se encontró un identificador válido para la tarea.');
  }

  tareas = tareas.map(tarea => (
    tarea.id === idTarea
      ? { ...tarea, completada: !tarea.completada }
      : tarea
  ));
  actualizarVista();
});

// Arrancar la aplicación
inicializarApp();