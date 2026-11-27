# 📚 Biblioteca Digital Escolar

Plataforma web de lectura para una escuela primaria (1.º a 7.º grado). Tiene cuentas para cada alumno, progreso de lectura guardado en una base de datos, un lector con animación 3D de apertura y de paso de páginas, cuestionarios de comprensión, logros, un panel para docentes y un panel de administración.

La biblioteca tiene **43 libros completos**: 14 en El Bosque de los Cuentos, 16 en La Isla de los Aventureros y 13 en El Observatorio. Hay 23 obras originales escritas para este proyecto y 20 adaptaciones de clásicos de dominio público (Esopo, Perrault, los hermanos Grimm, Andersen, Carroll, Collodi, Barrie, Conan Doyle, Verne, Wilde, Stevenson, Quiroga, Poe, Mary Shelley, Stoker y H. G. Wells), indicadas como tales en la ficha de cada libro. Todos tienen portada ilustrada, capítulos con ilustraciones y un cuestionario.

## 🌐 Probarla sin instalar nada

Abrí `index.html` en el navegador. Es la versión de un solo archivo: funciona sin servidor y guarda las cuentas y el progreso en ese navegador. Si el repositorio está publicado con GitHub Pages, también se puede abrir directamente desde la web.

---

## 🚀 Cómo ejecutarlo

Necesitás **Node.js 22.13 o superior** (se recomienda la versión 24 LTS). No hace falta instalar ninguna base de datos.

```bash
npm install
npm start
```

Después, abrí **http://localhost:3000** en el navegador.

La primera vez que arranca, la aplicación crea sola la base de datos (`data/biblioteca.db`) y carga los 43 libros y las cuentas de demostración. Si agregás libros nuevos en `server/content/`, se incorporan solos la próxima vez que arranca, sin borrar los datos existentes.

### Cuentas de demostración

| Rol            | Usuario   | Contraseña    |
|----------------|-----------|---------------|
| Alumno (4.º)   | `alumno`  | `alumno1`     |
| Docente        | `docente` | `Docente2026` |
| Administración | `admin`   | `Admin2026`   |

> Si la plataforma se usa de verdad en una escuela, cambiá estas contraseñas (ver *Configuración*) o desactivá las cuentas de demostración.

Para volver al estado inicial: `npm run reset-db` y después `npm start`.

---

## 🗂️ Organización de la biblioteca

| Sección | Grados | Identidad visual | Libros |
|---|---|---|---|
| 🌳 **El Bosque de los Cuentos** | 1.º, 2.º y 3.º | Verde y amarillo, letra redondeada, sin sangría y con más espacio entre párrafos | *Pipo y las burbujas de colores* (fantasía y valores) · *Lía y la luna escondida* (fases de la luna) · *Tomi y la semilla impaciente* (cómo crecen las plantas) · *Coral, la tortuguita que buscaba el mar* (cuidado del océano) |
| 🏝️ **La Isla de los Aventureros** | 4.º y 5.º | Naranja y turquesa, títulos en mayúsculas | *El caso del reloj detenido* (policial) · *Misión: Estación Cóndor* (ciencia ficción sobre Marte) · *Diario de la Antártida* (exploración) · *La mochila del tiempo* (historia: Revolución de Mayo) |
| 🔭 **El Observatorio** | 6.º y 7.º | Violeta y azul noche, tipografía con serifa | *Cuentos para leer con la luz encendida* (terror) · *El enigma de la Biblioteca Ameghino* (misterio con códigos para descifrar) · *Cuando ARIA despertó* (ciencia ficción y ética) · *Los náufragos de Isla Quemada* (novela de aventuras) |

---

## ✨ Funciones

**Lectura**
- Al tocar un libro, la portada reacciona, la biblioteca se acerca como si una cámara viajara hacia el libro, el libro vuela al centro, se abre hacia la izquierda y aparece el interior.
- El texto se pagina según la pantalla: doble página en computadoras y tablets apaisadas, una página en celulares. Las hojas giran en 3D.
- Desde el lector se puede ver el índice, ir a cualquier capítulo, avanzar y retroceder con flechas, teclado, deslizando el dedo o tocando los bordes de la página, y saltar con la barra de progreso.
- También hay ficha del libro, favorito, tamaño de letra, temas Papel, Sepia y Noche, pantalla completa y "Empezar de nuevo".
- Si el sistema tiene activado "reducir movimiento", las animaciones se simplifican.

**Progreso (guardado en la base de datos)**
- Se guarda el capítulo, el párrafo exacto, la página y el porcentaje, además del tiempo real de lectura (sólo cuenta con la pestaña visible y con actividad).
- Al volver, aunque sea desde otro dispositivo o después de cerrar sesión, el libro se abre y pasa solo a la página donde quedó el alumno. Como la posición se guarda por párrafo, funciona aunque la pantalla sea de otro tamaño.
- El perfil muestra lo que el alumno está leyendo, sus libros terminados, sus favoritos, su historial con fechas, sus cuestionarios y la actividad de los últimos 14 días.

**Aprendizaje y motivación**
- Cada libro tiene un cuestionario de comprensión. Se corrige en el servidor y muestra explicaciones.
- Hay 14 logros: rachas de lectura, libros terminados, géneros explorados, cuestionarios perfectos y otros.
- Las recomendaciones son personalizadas según el grado, los géneros favoritos y la popularidad, y cada una dice por qué se recomienda.
- El inicio tiene novedades, destacados, "Seguí leyendo" y un buscador con filtros por género, grado y orden.

**Docentes** (`docente`)
- Resumen general: alumnos activos, libros terminados, tiempo de lectura, promedio de los cuestionarios, libros más leídos, lectura por grado, géneros preferidos y actividad diaria.
- Lista de alumnos con filtros y la ficha de cada uno: lecturas, cuestionarios, logros y actividad. Desde ahí se puede restablecer la contraseña de un alumno.
- Pueden publicar libros nuevos con el editor (portada, capítulos con ilustración y cuestionario) y editar o borrar los que publicaron.

**Administración** (`admin`)
- Todo lo que pueden hacer los docentes, más la edición de cualquier libro y la opción de marcarlo como destacado.
- Gestión de cuentas: crear docentes, administradores o alumnos, cambiar roles y grados, restablecer contraseñas y eliminar cuentas.

---

## 🏗️ Arquitectura

```
Navegador (SPA, JavaScript con módulos ES, sin compilación)
   │   fetch JSON + cookie de sesión httpOnly
   ▼
Servidor Node.js + Express 5  ──►  SQLite (node:sqlite, archivo data/biblioteca.db)
```

| Capa | Tecnología | Por qué |
|---|---|---|
| Servidor | Node.js + Express 5 | Simple, conocido y con manejo de errores asincrónicos incorporado |
| Base de datos | SQLite con el módulo nativo `node:sqlite` | Es persistente y transaccional, y no necesita instalar un servidor ni compilar dependencias nativas |
| Interfaz | HTML, CSS y JavaScript moderno (módulos ES) | No necesita compilación, carga rápido y el código es fácil de leer para evaluar |
| Animaciones | Transformaciones CSS 3D y Web Animations API | Fluidas, aceleradas por la placa de video y controlables desde el código |
| Ilustraciones | SVG vectorial propio, generado por código | Se ven nítidas en cualquier pantalla, pesan poco y no dependen de imágenes externas |
| Tipografías | Fredoka, Nunito y Literata, servidas localmente | Funcionan sin internet externa y no se envían datos a terceros |

### Estructura de carpetas

```
server/
  index.js            Arranque, rutas y archivos estáticos
  db.js               Esquema de la base y helpers (transacciones)
  auth.js             Contraseñas (scrypt), sesiones, roles y limitador de intentos
  security.js         Cabeceras de seguridad (CSP), protección CSRF y manejo de errores
  util.js             Validación de formularios y constantes (géneros, ilustraciones)
  books.js            Repositorio de libros (listar, validar y guardar)
  achievements.js     Estadísticas, rachas y logros
  recommend.js        Motor de recomendaciones
  seed.js / reset.js  Carga inicial y reinicio de la base
  content/            Los 12 libros originales (texto completo y cuestionarios)
  routes/             auth · me (perfil) · library (catálogo y progreso) · staff (docentes y administración)
public/
  index.html
  css/                base · components · views · reader
  js/
    main.js           Enrutador, estructura y acciones globales
    api.js store.js ui.js components.js art.js (ilustraciones, avatares e íconos)
    views/            auth · home · catalog · profile · panel · editor
    reader/           reader.js (paginación y paso de páginas) · opening.js (animación) · quiz.js
```

### Modelo de datos

`users` · `sessions` · `books` · `chapters` · `quiz_questions` · `progress` (posición por usuario y libro) · `favorites` · `reading_days` (minutos por día, para rachas y gráficos) · `quiz_attempts` · `achievements`

---

## 🔒 Seguridad y protección de datos de los alumnos

- **Contraseñas** con `scrypt` y una sal aleatoria por usuario. Nunca se guardan en texto plano.
- **Sesiones del lado del servidor**: el navegador sólo guarda un token aleatorio en una cookie `HttpOnly` y `SameSite=Lax` (`Secure` en producción). La base guarda el hash del token. Cerrar sesión o cambiar la contraseña invalida las sesiones.
- **Permisos por rol** (alumno, docente, administración), verificados en cada ruta del servidor. Por ejemplo, un alumno que intenta usar la API docente recibe 403, y un visitante sin sesión recibe 401.
- **Límite de intentos** de inicio de sesión y de registro.
- **Validación** de todos los formularios en el navegador y otra vez en el servidor, con mensajes por campo.
- **Protección CSRF**: se exige JSON, una cabecera propia y que el `Origin` coincida.
- **Content Security Policy** estricta, sin scripts en línea, y todo el texto escapado para evitar XSS.
- **Mínimos datos personales**: no se pide email ni apellido. El progreso de un alumno sólo lo ven sus docentes y la administración. Las respuestas correctas de los cuestionarios nunca se envían al navegador antes de corregir.

---

## ⚙️ Configuración (variables de entorno)

| Variable | Uso |
|---|---|
| `PORT` | Puerto (por defecto 3000) |
| `DB_PATH` | Ruta del archivo de la base |
| `ADMIN_PASSWORD`, `TEACHER_PASSWORD`, `STUDENT_PASSWORD` | Contraseñas iniciales de las cuentas de demostración (sólo se usan al crear la base) |
| `SEED_DEMO_USERS=false` | No crear las cuentas de demostración |
| `SHOW_DEMO_ACCOUNTS=false` | Ocultar el cuadro "Cuentas de demostración" en la pantalla de ingreso |
| `SCHOOL_CODE` | Si se define, pide un código de la escuela para registrarse |
| `ALLOW_REGISTRATION=false` | Desactiva el registro libre (las cuentas las crea la administración) |
| `NODE_ENV=production` | Activa las cookies `Secure` (usar con HTTPS) |
| `TRUST_PROXY=1` | Si el servidor está detrás de un proxy inverso |
| `APP_TZ` | Zona horaria para las rachas (por defecto `America/Argentina/Buenos_Aires`) |

---

## ➕ Agregar libros

- **Desde la plataforma**: con la cuenta docente o de administración, entrá a *Panel → Libros → Publicar un libro*.
- **Desde el código**: agregá un archivo en `server/content/` con el mismo formato que los existentes. Se carga cuando la base está vacía (`npm run reset-db`).

Si se incorporan obras de dominio público, conviene indicar la fuente y la licencia en el campo `license` del libro.

---

## 📄 Versión de un solo archivo (.html / artifact)

`npm run build:html` genera `dist/biblioteca-digital-escolar.html`: un único archivo con los libros, los estilos y el código. En esa versión, el "servidor" corre dentro de la página (`public/js/local/`) con las mismas rutas, validaciones, permisos, logros y estadísticas.

- **Publicada como artifact en claude.ai**: las cuentas, el progreso y los libros nuevos se guardan en la base de datos compartida del artifact. Cualquier persona con acceso de Colaborador o superior puede usarla desde cualquier dispositivo.
- **Abierta como archivo suelto**: todo se guarda en el navegador de esa computadora. Al abrirla por primera vez se crean las cuentas de demostración.

Límite de seguridad: en la versión de un solo archivo, el inicio de sesión se verifica en el navegador. Las contraseñas se guardan cifradas (PBKDF2), pero quien tenga acceso al artifact podría leer la base de datos. Para proteger datos reales de alumnos, usá la versión con servidor (`npm start`).

---

## ⚖️ Derechos de autor de los libros

- **Obras originales:** fueron escritas para este proyecto. Los nombres de autor que figuran en ellas son seudónimos inventados.
- **Clásicos adaptados:** son obras de dominio público tanto en Argentina (70 años después de la muerte del autor, Ley 11.723) como en Estados Unidos (publicadas antes de 1931), que es donde está GitHub. Los textos de este repositorio son **adaptaciones propias en español**: no copian ninguna traducción publicada que tenga derechos vigentes.
- **Sin elementos de películas:** se siguen las obras originales, no sus versiones de cine. Por ejemplo, en *Pinocho* está el "Grillo Parlante" y el "Terrible Tiburón" del libro de Collodi. Las ilustraciones son dibujos vectoriales originales del proyecto.

| Obra | Autor | Publicación | Murió en |
|---|---|---|---|
| Fábulas | Esopo | Siglo VI a. C. | — |
| El gato con botas, Caperucita Roja | Charles Perrault | 1697 | 1703 |
| Caperucita Roja (versión) | Hermanos Grimm | 1812 | 1859 / 1863 |
| El patito feo | Hans Christian Andersen | 1843 | 1875 |
| Alicia en el País de las Maravillas | Lewis Carroll | 1865 | 1898 |
| Las aventuras de Pinocho | Carlo Collodi | 1883 | 1890 |
| Peter Pan (novela *Peter y Wendy*) | J. M. Barrie | 1911 | 1937 |
| La guerra de los yacarés, La tortuga gigante, Las medias de los flamencos, El almohadón de plumas | Horacio Quiroga | 1907 y 1918 | 1937 |
| La liga de los pelirrojos | Arthur Conan Doyle | 1891 | 1930 |
| Viaje al centro de la Tierra, Veinte mil leguas de viaje submarino | Julio Verne | 1864 y 1870 | 1905 |
| El fantasma de Canterville | Oscar Wilde | 1887 | 1900 |
| La isla del tesoro, El extraño caso del Dr. Jekyll y Mr. Hyde | R. L. Stevenson | 1883 y 1886 | 1894 |
| El corazón delator, La máscara de la Muerte Roja | Edgar Allan Poe | 1842 y 1843 | 1849 |
| Frankenstein | Mary Shelley | 1818 | 1851 |
| Drácula | Bram Stoker | 1897 | 1912 |
| La máquina del tiempo | H. G. Wells | 1895 | 1946 |

**Una obra que no se incluyó a propósito:** *El principito* (Saint-Exupéry, que murió en 1944) es de dominio público en Argentina desde 2015, pero en Estados Unidos sigue protegido hasta 2039 y en Francia hasta 2032. Además, su nombre y sus dibujos son marcas registradas. Por eso no se puede publicar en un repositorio de GitHub.

*Esta información es una guía general y no reemplaza el asesoramiento de un abogado.*
