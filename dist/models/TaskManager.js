const CLAVE_ALMACENAMIENTO = 'devtask-tareas';
export class TaskManager {
    tareas;
    filtroActual = 'Todas';
    formulario;
    inputTitulo;
    selectPrioridad;
    listaContenedor;
    loadingState;
    filtrosContenedor;
    constructor() {
        this.formulario = this.obtenerElemento('#form-tareas');
        this.inputTitulo = this.obtenerElemento('#input-titulo');
        this.selectPrioridad = this.obtenerElemento('#select-prioridad');
        this.listaContenedor = this.obtenerElemento('#lista-tareas');
        this.loadingState = this.obtenerElemento('#loading-state');
        this.filtrosContenedor = this.obtenerElemento('.filter-section');
        this.tareas = this.cargarTareas();
        if (!this.filtrosContenedor.querySelector('.btn-filtro')) {
            throw new Error('No se encontraron botones de filtrado.');
        }
        this.registrarEventos();
        void this.inicializar();
    }
    agregarTarea(titulo, prioridad) {
        const tituloLimpio = titulo.trim();
        if (!tituloLimpio) {
            throw new Error('El título de la tarea no puede estar vacío.');
        }
        const nuevaTarea = {
            id: this.generarId(),
            titulo: tituloLimpio,
            prioridad,
            completada: false
        };
        const tareasActualizadas = [...this.tareas, nuevaTarea];
        this.guardarTareas(tareasActualizadas);
        this.tareas = tareasActualizadas;
        this.pintarTareas();
    }
    pintarTareas() {
        const tareasVisibles = this.tareas.filter(tarea => {
            if (this.filtroActual === 'Pendientes')
                return !tarea.completada;
            if (this.filtroActual === 'Completadas')
                return tarea.completada;
            return true;
        });
        this.listaContenedor.innerHTML = '';
        tareasVisibles.forEach(tarea => {
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
            this.listaContenedor.appendChild(elementoTarea);
        });
    }
    cambiarEstado(id) {
        const tareaEncontrada = this.tareas.find(tarea => tarea.id === id);
        if (!tareaEncontrada) {
            throw new Error(`No se encontró una tarea con el identificador "${id}".`);
        }
        const tareasActualizadas = this.tareas.map(tarea => (tarea.id === id
            ? { ...tarea, completada: !tarea.completada }
            : tarea));
        this.guardarTareas(tareasActualizadas);
        this.tareas = tareasActualizadas;
        this.pintarTareas();
    }
    async inicializar() {
        await new Promise(resolve => window.setTimeout(resolve, 1500));
        this.loadingState.style.display = 'none';
        this.pintarTareas();
    }
    cargarTareas() {
        const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
        if (datosGuardados === null) {
            return [
                { id: 1, titulo: 'Aprender la sintaxis de ES6', prioridad: 'Alta', completada: true },
                { id: 2, titulo: 'Dominar la asincronía y Fetch', prioridad: 'Media', completada: false },
                { id: 3, titulo: 'Migrar el proyecto a Angular', prioridad: 'Baja', completada: false }
            ];
        }
        const tareasGuardadas = JSON.parse(datosGuardados);
        if (!Array.isArray(tareasGuardadas) || !tareasGuardadas.every(TaskManager.esTarea)) {
            throw new Error('Los datos guardados de las tareas no tienen un formato válido.');
        }
        const ids = new Set();
        for (const tarea of tareasGuardadas) {
            if (ids.has(tarea.id)) {
                throw new Error(`El identificador "${tarea.id}" está duplicado en los datos guardados.`);
            }
            ids.add(tarea.id);
        }
        return tareasGuardadas;
    }
    guardarTareas(tareas) {
        localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(tareas));
    }
    generarId() {
        let id = Date.now();
        while (this.tareas.some(tarea => tarea.id === id)) {
            id += 1;
        }
        return id;
    }
    registrarEventos() {
        this.formulario.addEventListener('submit', event => {
            event.preventDefault();
            const titulo = this.inputTitulo.value.trim();
            if (!titulo) {
                this.inputTitulo.setCustomValidity('Escribe un título para la tarea.');
                this.inputTitulo.reportValidity();
                return;
            }
            const prioridad = this.selectPrioridad.value;
            if (!TaskManager.esPrioridad(prioridad)) {
                throw new Error(`La prioridad "${prioridad}" no es válida.`);
            }
            this.agregarTarea(titulo, prioridad);
            this.formulario.reset();
        });
        this.formulario.addEventListener('input', event => {
            if (event.target === this.inputTitulo) {
                this.inputTitulo.setCustomValidity('');
            }
        });
        this.filtrosContenedor.addEventListener('click', event => {
            if (!(event.target instanceof Element))
                return;
            const boton = event.target.closest('.btn-filtro');
            if (!(boton instanceof HTMLButtonElement) || !this.filtrosContenedor.contains(boton))
                return;
            const filtro = boton.dataset.filtro;
            if (!TaskManager.esFiltro(filtro)) {
                throw new Error(`El filtro "${filtro}" no es válido.`);
            }
            this.filtrosContenedor.querySelectorAll('.btn-filtro')
                .forEach(botonFiltro => botonFiltro.classList.remove('active'));
            boton.classList.add('active');
            this.filtroActual = filtro;
            this.pintarTareas();
        });
        this.listaContenedor.addEventListener('click', event => {
            if (!(event.target instanceof Element))
                return;
            const boton = event.target.closest('button');
            if (!boton || !this.listaContenedor.contains(boton))
                return;
            const elementoTarea = boton.closest('li.item-tarea');
            if (!(elementoTarea instanceof HTMLLIElement) || elementoTarea.parentElement !== this.listaContenedor)
                return;
            const idTarea = Number(elementoTarea.dataset.id);
            if (!Number.isFinite(idTarea)) {
                throw new Error('No se encontró un identificador válido para la tarea.');
            }
            this.cambiarEstado(idTarea);
        });
    }
    obtenerElemento(selector) {
        const elemento = document.querySelector(selector);
        if (!elemento) {
            throw new Error(`No se encontró el elemento "${selector}".`);
        }
        return elemento;
    }
    static esTarea(valor) {
        if (typeof valor !== 'object' || valor === null)
            return false;
        return 'id' in valor
            && typeof valor.id === 'number'
            && Number.isFinite(valor.id)
            && 'titulo' in valor
            && typeof valor.titulo === 'string'
            && 'prioridad' in valor
            && typeof valor.prioridad === 'string'
            && TaskManager.esPrioridad(valor.prioridad)
            && 'completada' in valor
            && typeof valor.completada === 'boolean';
    }
    static esPrioridad(valor) {
        return valor === 'Alta' || valor === 'Media' || valor === 'Baja';
    }
    static esFiltro(valor) {
        return valor === 'Todas' || valor === 'Pendientes' || valor === 'Completadas';
    }
}
