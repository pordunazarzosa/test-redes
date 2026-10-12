/**
 * URL de la imagen de una pregunta.
 * Las importadas desde un ZIP vienen ya incrustadas (data:…); las del proyecto son
 * rutas dentro de public/ (img/Examen37_P12_pag261.png).
 */
export function urlImagen(imagen: string): string {
  return /^(data:|blob:|https?:)/.test(imagen) ? imagen : import.meta.env.BASE_URL + imagen;
}
