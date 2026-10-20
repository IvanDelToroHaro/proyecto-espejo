const stock = [
  { id: 1, nombre: "Ratón óptico", precio: 25, categoria: "perifericos" },
  { id: 2, nombre: "Memoria RAM 16GB", precio: 85, categoria: "componentes" },
  { id: 3, nombre: "Monitor 4K", precio: 320, categoria: "perifericos" },
  { id: 4, nombre: "Disco SSD 1TB", precio: 65, categoria: "componentes" },
];

// Tu código aquí abajo:
const productosFiltrados = stock.filter(
  (producto) => producto.categoria === "componentes" && producto.precio > 50
);
