/**
 * URL de la imagen de una pregunta.
 * Las importadas desde un ZIP vienen ya incrustadas (data:…); las del proyecto son
 * rutas dentro de public/ (img/Examen37_P12_pag261.png).
 */
export function urlImagen(imagen: string): string {
  return /^(data:|blob:|https?:)/.test(imagen) ? imagen : import.meta.env.BASE_URL + imagen;
}

/**
 * Ruta de la versión para tema oscuro: mismo nombre terminado en _dark.
 * img/Examen37_P12_pag261.png → img/Examen37_P12_pag261_dark.png
 * Las imágenes incrustadas (importadas) no tienen versión oscura.
 */
export function versionOscura(imagen: string): string | null {
  if (/^(data:|blob:|https?:)/.test(imagen)) return null;
  return imagen.replace(/(\.[a-z0-9]+)$/i, "_dark$1");
}

/** Nombre del archivo para los mensajes: Examen37_P12_pag261.png */
export function nombreArchivo(imagen: string): string {
  return imagen.startsWith("data:") ? "(imagen importada)" : (imagen.split("/").pop() ?? imagen);
}
