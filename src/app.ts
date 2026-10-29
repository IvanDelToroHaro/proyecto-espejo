import { TaskManager } from './models/TaskManager.js';

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

new TaskManager();