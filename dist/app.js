import { TaskManager } from './models/TaskManager.js';
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
new TaskManager();
