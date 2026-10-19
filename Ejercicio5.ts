// Tu código aquí abajo:
async function buscarPostPorId(postId: number): Promise<void> {
  const contenedor = document.getElementById("resultado-busqueda");

  try {
    const respuesta = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }

    const post: { title: string; body: string } = await respuesta.json();
    if (contenedor) {
      contenedor.innerHTML = `
        <h2>${post.title.toUpperCase()}</h2>
        <p>${post.body}</p>
      `;
    }
  } catch {
    if (contenedor) {
      contenedor.innerHTML = "No se ha podido recuperar el post solicitado";
    }
  }
}