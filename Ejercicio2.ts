const carritoOriginal = [
  { id: 101, articulo: "Teclado", precio: 45, cantidad: 1 },
  { id: 102, articulo: "Cable HDMI", precio: 12, cantidad: 1 },
];

// Tu código aquí abajo (recuerda que carritoOriginal debe quedar intacto):
const carritoActualizado = carritoOriginal.map((producto) =>
  producto.id === 102 ? { ...producto, cantidad: 3 } : producto
);