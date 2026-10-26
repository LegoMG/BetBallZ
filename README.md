# BetBallZ – Casino Online con créditos virtuales (Tarea 2)

**Estudiante:** Diego Natera, Diego Ibarra
**Proyecto seleccionado:** Casino Online con créditos virtuales (temática Dragon Ball Z)

## 1. Descripción
BetBallZ es un casino ficticio donde se juega con **Zeni (créditos virtuales)**. No se usa dinero real ni se guarda información en ningún servidor.
En la Tarea 2 se amplió el sitio de la Tarea 1 con **Alpine.js** (estado e interacciones) y un archivo **JSON** (datos separados del HTML) cargado con `fetch()`.

## 2. Tecnologías y cómo se incorpora Alpine.js
- HTML5, CSS3, JavaScript, Bootstrap 5.3.8 (CDN) y Alpine.js 3.14.9 (CDN).
- Alpine se incluye al final de cada página con `<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js">`.
- `js/app.js` se carga **antes** que Alpine y contiene las funciones que devuelven el estado y los métodos de cada componente (`catalogoJuegos()`, `bovedaZeni()`, `formLogin()`, `formRegistro()`), más un *store* global (`Alpine.store('sesion')`) usado por la barra de navegación.
- En el HTML se conectan con `x-data="nombreFuncion()"`.

## 3. Estructura de carpetas
```
html/                    <- raíz del sitio (lo que se publica en el servidor)
├── index.html           Lobby (inicio)
├── Planeta.html         Planetas de Juegos: listado dinámico + búsqueda (JSON)
├── boveda.html          Bóveda de Zeni: formulario interactivo
├── Iniciar.html         Inicio de sesión (simulado)
├── Registrar.html       Registro (simulado)
├── style.css
├── js/app.js            Estado y lógica Alpine.js
├── datos/juegos.json    Datos (10 juegos ficticios)
└── Imagenes/            betballz.jpg, Logo.jpg
```
Todas las rutas son relativas.

## 4. Funcionalidades agregadas en la Tarea 2
| Requisito | Dónde está |
|---|---|
| Datos en JSON (10 registros con `id` único) | `datos/juegos.json` |
| `fetch()` al iniciar el componente | `catalogoJuegos().cargar()` en `js/app.js`, llamado desde `init()` |
| Listado con `x-for` y `:key="juego.id"` | `Planeta.html` |
| Búsqueda con `x-model` en tiempo real, sin distinguir mayúsculas/tildes | `Planeta.html` (campo "Buscar juego") + getter `filtrados` |
| Filtro por categoría (`x-model` en un `<select>`) | `Planeta.html` |
| Mostrar/ocultar ayuda con `x-show` | Botón "¿Cómo funciona?" en `Planeta.html` |
| Formulario con `x-model` + `@submit.prevent` + validaciones | `boveda.html` (también `Iniciar.html` y `Registrar.html`) |
| Estados: cargando / error / sin resultados | `Planeta.html` |
| Navegación entre vistas, sesión simulada con `Alpine.store` | Barra superior en todas las páginas |
| Buscador de la barra superior funcional | Envía a `Planeta.html?q=texto` y Alpine filtra |

Correcciones respecto a la Tarea 1: IDs duplicados en formularios, atributo `aria-label` roto, clase mal escrita (`btn-outline-ligth`), botones de redes sociales con íconos rotos (eliminados), y la página `Planeta.html` que estaba vacía.

## 5. Archivo JSON
Ubicación: `datos/juegos.json` (URL pública: `http://100.57.52.123/datos/juegos.json`).
Es una lista de objetos con esta estructura:
```json
{
  "id": 4,
  "nombre": "Tragamonedas Shenlong",
  "categoria": "Tragamonedas",
  "planeta": "Tierra",
  "apuestaMinima": 1,
  "estado": "Disponible",
  "descripcion": "Alinea siete esferas del dragón..."
}
```
Es un recurso estático de solo lectura: los datos son ficticios y públicos.

## 6. Flujo de carga y filtrado
1. Alpine crea el componente `catalogoJuegos()` y ejecuta `init()`.
2. `init()` llama a `cargar()`: pone `cargando = true` y hace `fetch('datos/juegos.json')`.
3. Si la respuesta no es correcta (`!res.ok`) o el JSON está mal formado (`res.json()` lanza error), se captura en `try/catch` y se muestra el mensaje en `error`.
4. Si todo sale bien, el arreglo se guarda en `juegos` (memoria) y `cargando = false`.
5. El getter `filtrados` recalcula la lista cada vez que cambia `busqueda` o `categoria` (variables ligadas con `x-model`). Normaliza a minúsculas sin tildes y filtra **sobre `juegos` en memoria**: no se vuelve a pedir el JSON.
6. `x-for` dibuja las tarjetas de `filtrados`. Si no hay ninguna, se muestra "Sin resultados".

## 7. Cómo probar
- **Listado:** abrir `Planeta.html`; deben verse 10 juegos.
- **Búsqueda:** escribir `ruleta` (2 resultados), `RULETA`, `capsula` (encuentra "Cápsula"), `zzzz` (sin resultados). Al borrar el texto vuelve el listado completo.
- **Ayuda (x-show):** botón "¿Cómo funciona?" / "Ocultar ayuda".
- **Formulario:** en `boveda.html`, enviarlo vacío (errores en rojo); luego completarlo (cuenta, correo, cantidad 1–1000, método, casilla) y enviarlo (mensaje de éxito sin recargar la página).
- **Estado de carga:** aparece brevemente al abrir `Planeta.html` (con conexión lenta, o limitando la red en DevTools → Network → "Slow 4G").

## 8. Cómo comprobar el estado de error
- Abrir `Planeta.html?simularError=1` (pide un archivo que no existe → error 404), o
- Renombrar temporalmente `datos/juegos.json` en el servidor, o
- Dañar el JSON (borrar una coma) para ver el error "mal escrito". Se puede reintentar con el botón "Reintentar".

## 9. Despliegue
Sitio: `http://100.57.52.123`
Datos: `http://100.57.52.123/datos/juegos.json`
Servidor web: Apache/Nginx en EC2, puerto 80 (HTTP), con Elastic IP asociada.

## 10. Limitaciones conocidas
- No hay backend ni base de datos: el formulario de la Bóveda, el registro y el inicio de sesión **solo simulan** la operación; la información ingresada **se pierde al recargar la página**.
- La "sesión" es solo una marca en `localStorage` de **este navegador** (no en el servidor). No es autenticación ni seguridad real.
- Ocultar elementos con Alpine.js no protege información: el JSON es público.
- Alpine.js y Bootstrap se cargan desde CDN, por lo que se necesita conexión a Internet.
