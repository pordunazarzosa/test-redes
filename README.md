# Test Redes II

Simulador de exámenes tipo test para preparar la asignatura **Redes II**. Contiene las 768 preguntas distintas de los exámenes de 2012 a 2026, repartidas en 20 temas. Sirve para hacer simulacros en las mismas condiciones que el examen real, practicar por temas, repasar las preguntas falladas y seguir el progreso.

La app funciona en el navegador, se puede instalar como aplicación (PWA) y sigue funcionando sin conexión. No necesita servidor ni cuenta: los datos se guardan en tu propio navegador.

Es un **proyecto de aprendizaje**: el objetivo era desarrollar, con tecnologías actuales, una app sencilla que ayude a estudiar una asignatura concreta.

> **Demo:** https://test-redesii.netlify.app/

---

## Cómo usarla

### 1. Hacer un simulacro
1. En **Inicio**, pulsa **Nuevo examen**.
2. Ajusta el **Tiempo** (de 5 a 120 minutos; por defecto, 120).
3. Pulsa **Empezar simulacro**. Se generan 20 preguntas repartidas por temas como en el examen real.

### 2. Durante el examen
- Contesta pulsando una opción. Puedes cambiarla o usar **Dejar en blanco**.
- Muévete libremente entre las 20 preguntas con los números de la parte inferior y usa **Marcar para revisar** en las que quieras volver a mirar.
- El reloj se pone en rojo en los últimos 5 minutos. Al llegar a cero, el examen se entrega solo.
- Si cierras o recargas la página, el examen se recupera tal como estaba, incluido el tiempo.
- Pulsa **Entregar** cuando termines (en práctica, el botón se llama **Terminar**).

### 3. Ver los resultados
Al entregar verás la nota sobre 10, los aciertos, fallos y blancos, el desglose por tema y la revisión pregunta a pregunta con la explicación. La puntuación es la del examen real:

| Respuesta | Puntos |
|---|---|
| Correcta | +0,5 |
| Incorrecta | −0,1667 (−0,5 / 3) |
| En blanco | 0 |

Responder al azar da, de media, 0 puntos. La nota máxima es 20 × 0,5 = 10.

### 4. Practicar por temas
En **Nuevo examen → Práctica por temas**, marca uno o varios temas, el número de preguntas y, si quieres, **Con temporizador**. Pulsa **Empezar práctica**. Cada respuesta se corrige al momento y muestra la explicación.

### 5. Repasar las falladas
En **Inicio**, el botón **Repasar falladas** (entre paréntesis, cuántas hay) crea una práctica con las preguntas que fallaste la última vez que te salieron.

### 6. Consultar el historial
En **Historial** verás todos tus intentos (fecha, modo, nota y duración) y el porcentaje de aciertos por tema. Desde ahí puedes:
- **Exportar copia**: guarda el historial y las preguntas importadas en un archivo JSON.
- **Restaurar copia**: recupera los datos desde ese archivo.
- **Borrar historial**: elimina todos los intentos, tras pedir confirmación.

### 7. Importar preguntas
En **Importar** puedes añadir preguntas desde un `.json` o desde un `.zip` con imágenes (ver [Formato de las preguntas](#formato-de-las-preguntas)). La app valida el archivo y muestra los errores en español.

### 8. Otras opciones
- **Tema claro, oscuro o del sistema**: botón de la barra superior (cambia en ese orden). Se recuerda entre visitas.
- **Instalar la app**: en Chrome o Edge, usa el icono de instalar de la barra de direcciones; en el móvil, **Añadir a pantalla de inicio**. Una vez instalada, funciona sin conexión.

---

## Funcionalidades

- **Simulacro de 20 preguntas** de 4 opciones con una sola correcta y reparto por temas según los porcentajes de `examen.config.json` (ver [Reparto de preguntas](#reparto-de-preguntas-por-tema)).
- **Orden aleatorio** de preguntas y opciones. Las opciones tipo «Ninguna de las otras» o «Todas las anteriores» se quedan siempre al final.
- **Temporizador** con entrega automática.
- **Modo práctica** con corrección inmediata y **repaso de falladas**.
- **Progreso**: en Inicio, último examen, media de los últimos 5 simulacros y tema más flojo; en Historial, gráfico y tabla por tema.
- **Copia de seguridad** y **borrado del historial**.
- **Importación** de preguntas desde JSON o ZIP.
- **11 preguntas con figura** (temas 4 y 5), cada una con su versión para el tema oscuro (`_dark`). Si falta la versión oscura, se usa la clara y aparece el aviso «Dark image not found»; si falta la imagen, aparece «Image not found».
- **Matrices** (por ejemplo, las de Walsh) dibujadas con corchetes en lugar de texto plano.
- **Tema claro, oscuro o del sistema**, y diseño adaptado a móvil, tableta y ordenador.
- **App instalable** que funciona sin conexión.

---

## Tecnologías

| Pieza | Tecnología |
|---|---|
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) 6 |
| Interfaz | [React](https://react.dev/) 19 + [Vite](https://vite.dev/) 8 |
| Estilos y componentes | [Tailwind CSS](https://tailwindcss.com/) 4 + [shadcn/ui](https://ui.shadcn.com/) (Radix UI, estilo Nova) |
| Navegación | [React Router](https://reactrouter.com/) 8 (`HashRouter`) |
| Estado del examen en curso | [Zustand](https://zustand.docs.pmnd.rs/) 5, persistido en `localStorage` |
| Validación de datos | [Zod](https://zod.dev/) 4, con mensajes en español |
| Base de datos local | IndexedDB con [Dexie.js](https://dexie.org/) 4 |
| Importación de ZIP | [JSZip](https://stuk.github.io/jszip/) 3 |
| Tests | [Vitest](https://vitest.dev/) 5 |
| App instalable / sin conexión | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) 2 |
| Iconos | [Lucide](https://lucide.dev/) |
| Conversión inicial de datos | Python 3 + [python-docx](https://python-docx.readthedocs.io/) |

---

## Desarrollo

### Requisitos
- [Node.js](https://nodejs.org/) en versión LTS (22 o superior).
- [Git](https://git-scm.com/).
- Python 3.10 o superior, solo si quieres usar el script de conversión.

### Instalación

```bash
git clone https://github.com/pordunazarzosa/test-redes.git
cd test-redes
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente `http://localhost:5173`).

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca la app en modo desarrollo (se recarga al guardar). |
| `npm test` | Ejecuta los tests y se queda vigilando cambios. `npm test -- --run` los ejecuta una vez. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run build` | Genera la versión final en `dist/`. |
| `npm run preview` | Sirve la versión final para probarla, incluida la instalación como PWA. |

### Estructura del proyecto

```
test-redes/
├─ public/
│  ├─ img/                     ← figuras de las preguntas y sus versiones _dark
│  └─ icon-192.png, icon-512.png
├─ scripts/
│  └─ docx_a_json.py           ← conversión inicial del documento Word a JSON
├─ src/
│  ├─ content/
│  │  ├─ examen.config.json    ← nº de preguntas, puntuación, tiempo y reparto por tema
│  │  └─ preguntas/            ← un JSON por tema (tema-1_introduccion.json …)
│  ├─ domain/                  ← lógica pura, sin React (con tests)
│  │  ├─ pregunta.ts           ← esquema Zod y tipos
│  │  ├─ corregir.ts           ← cálculo de la nota
│  │  ├─ sorteo.ts             ← reparto por temas y barajado
│  │  └─ repaso.ts             ← preguntas falladas
│  ├─ data/                    ← carga del banco, base de datos, importación y copias
│  ├─ store/examen.ts          ← examen en curso (Zustand)
│  ├─ hooks/
│  │  ├─ useCuentaAtras.ts     ← temporizador
│  │  └─ useTemaOscuro.ts      ← detecta si está activo el tema oscuro
│  ├─ lib/                     ← tema claro/oscuro, imágenes, orden de temas, matrices
│  ├─ components/
│  │  ├─ Layout.tsx            ← barra de navegación y botón de tema
│  │  ├─ ImagenPregunta.tsx    ← figura con versión oscura y avisos si falta
│  │  ├─ OpcionTexto.tsx       ← texto de opción; dibuja las matrices
│  │  └─ ui/                   ← componentes de shadcn/ui
│  └─ pages/                   ← Inicio, Configurar, Examen, Resultados, Historial, Importar
└─ vite.config.ts
```

La lógica del examen (`src/domain`) no depende de React, así que se puede probar con tests sin abrir el navegador.

---

## Formato de las preguntas

Cada archivo de `src/content/preguntas/` es una lista de preguntas:

```json
[
  {
    "id": "E01-P08",
    "tema": "Tema 1",
    "enunciado": "¿Qué tipo de configuración de línea caracteriza a la topología bus?",
    "opciones": ["punto a punto con el concentrador", "multipunto uno a uno de enlace dedicado.", "multipunto", "punto primario-secundario"],
    "correcta": 2,
    "explicacion": "En la topología en bus todos los dispositivos comparten un único cable troncal.",
    "origen": { "examen": 1, "pregunta": 8, "paginaPdf": 2 }
  }
]
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Identificador único. |
| `tema` | Sí | Nombre del tema, por ejemplo `"Tema 3"`. |
| `enunciado` | Sí | Texto de la pregunta. |
| `opciones` | Sí | Exactamente 4 opciones. |
| `correcta` | Sí | Posición de la correcta: 0 = A, 1 = B, 2 = C, 3 = D. |
| `imagen` | No | Ruta dentro de `public/` o, en un ZIP importado, dentro del ZIP. |
| `explicacion` | No | Se muestra al corregir. |
| `origen` | No | Examen, pregunta y página del PDF original. |

Al arrancar, la app valida todas las preguntas con Zod. Las que no cumplen el formato no se usan, y la pantalla de Inicio indica cuáles son y por qué.

### Matrices
Una opción con el formato `[a b ; c d]` se dibuja como matriz: los espacios separan columnas y `;` separa filas. Por ejemplo, `"[1 −1 ; 1 −1]"` se muestra como una matriz 2 × 2.

### Imágenes y tema oscuro
Para cada imagen puedes añadir una versión para el tema oscuro con el mismo nombre terminado en `_dark`. Por ejemplo, `img/Examen37_P12_pag261.png` y `img/Examen37_P12_pag261_dark.png`. Si no existe, se usa la clara.

### Importar desde la app
En **Importar** puedes cargar:
- un `.json` con una lista de preguntas;
- un `.zip` con `preguntas.json` y una carpeta `img/` con las imágenes.

Las preguntas importadas se guardan en el navegador (IndexedDB). Si una tiene el mismo `id` que una del proyecto, la sustituye.

---

## Reparto de preguntas por tema

`src/content/examen.config.json` define el peso de cada tema en el simulacro (cantidades o porcentajes):

```json
"reparto": { "Tema 1": 3.4, "Tema 2": 2.2, "Tema 3": 14.8, "…": "…" }
```

Con 20 preguntas, muchos temas tienen derecho a una fracción de pregunta (por ejemplo, 0,44). Por eso el reparto se hace en dos pasos:

1. Cada tema recibe la parte entera que le corresponde.
2. Las preguntas que sobran se sortean con **muestreo sistemático** sobre las partes decimales. Un tema con 0,44 preguntas recibe una extra en el 44 % de los simulacros.

Así cada examen tiene siempre 20 preguntas, todos los temas pueden salir y, a la larga, se respetan los porcentajes. Un test simula 20 000 exámenes para comprobarlo.

---

## Datos y privacidad

- No hay servidor ni cuentas: el historial, las preguntas importadas y el examen en curso se guardan **solo en tu navegador**.
- Si borras los datos del sitio, o usas otro navegador u otro dispositivo, no los verás. Usa **Historial → Exportar copia** para guardarlos.

---

## Tests

```bash
npm test -- --run
```

| Archivo | Qué comprueba |
|---|---|
| `corregir.test.ts` | La puntuación (+0,5 / −0,1667 / 0). |
| `sorteo.test.ts` | Reparto exacto de 20 preguntas, porcentajes a la larga y barajado de opciones. |
| `repaso.test.ts` | Selección de preguntas falladas. |
| `importar.test.ts` | Validación de preguntas importadas. |
| `matriz.test.ts` | Lectura de opciones con formato de matriz. |

---

## Publicación

El proyecto se publica en [Netlify](https://www.netlify.com/):

1. En Netlify, **Add new project → Import an existing project** y elige el repositorio de GitHub.
2. Comando de compilación: `npm run build`. Carpeta de publicación: `dist`. Netlify suele detectar ambos solo, porque es un proyecto Vite.
3. Pulsa **Deploy**. Desde entonces, cada `git push` publica la nueva versión.

Al usar `HashRouter`, la app no necesita reglas de redirección y funciona en cualquier alojamiento estático.

---

## Uso de inteligencia artificial

Este proyecto se ha desarrollado **con ayuda de inteligencia artificial**, en concreto Claude, de Anthropic. Lo explico aquí por transparencia.

**Con qué ha ayudado la IA:**
- **Datos de partida:** transcripción del PDF escaneado de exámenes (394 páginas) mediante OCR y revisión página a página, eliminación de preguntas duplicadas, recorte de las figuras e identificación de su examen y pregunta.
- **Planificación:** elección de tecnologías y un plan de desarrollo paso a paso.
- **Código:** apoyo al escribir el código, revisión y corrección de errores, y redacción de los tests.
- **Documentación:** redacción de este README.

**Lo que he hecho yo:**
- Definir los requisitos y tomar las decisiones del proyecto.
- Montar el entorno y el repositorio, y escribir parte del código siguiendo el plan, corrigiendo los errores con ayuda de la IA.
- Ejecutar y probar la app.
- Aportar la clasificación de las preguntas por temas y los porcentajes del reparto.
- Seleccionar y preparar las imágenes de las preguntas.

El contenido generado o transcrito con IA puede contener errores. Si encuentras una pregunta mal transcrita o una solución incorrecta, abre un *issue*.

---

## Estado y pendientes

- [ ] Publicar en Netlify y añadir aquí el enlace.
- [ ] Añadir las versiones `_dark` de las 11 imágenes.
- [ ] `npm audit` muestra avisos que vienen de la herramienta de línea de comandos de `shadcn`, no de la app publicada. Desaparecerán al actualizar `shadcn`.
- [ ] `npm run lint` muestra 3 avisos de *fast refresh* en componentes generados por shadcn (`badge`, `button`, `tabs`). No afectan al funcionamiento.

---

## Autor

[pordunazarzosa](https://github.com/pordunazarzosa)
