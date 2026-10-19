const usuariosLocales = [
  { id: 1, nombre: 'Ana Gómez', email: 'ana@ies.es' },
  { id: 2, nombre: 'Luis Martínez', email: 'luis@ies.es' }
];

// Tu código aquí abajo:
const contenedorUsuarios = document.createElement("div");
contenedorUsuarios.id = "contenedor-usuarios";
document.body.appendChild(contenedorUsuarios);

usuariosLocales.forEach((usuario) => {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("card-usuario");

  const nombre = document.createElement("h3");
  nombre.textContent = usuario.nombre;

  const correo = document.createElement("p");
  correo.textContent = usuario.email;

  tarjeta.appendChild(nombre);
  tarjeta.appendChild(correo);
  contenedorUsuarios.appendChild(tarjeta);
});
