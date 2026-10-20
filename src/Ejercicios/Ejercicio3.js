// Tu código aquí abajo:
async function obtenerPostPorUsuario(userId: number): Promise<void> {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }

    const posts: { userId: number; title: string }[] = await respuesta.json();
    const postsDelUsuario = posts.filter((post) => post.userId === userId);

    postsDelUsuario.forEach((post) => console.log(post.title));
  } catch (error) {
    console.error("No se pudieron obtener los posts:", error);
  }
}

// Ejecución de prueba:
obtenerPostPorUsuario(2);