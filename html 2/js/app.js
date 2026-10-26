function leerLocal(clave) {
  try { return localStorage.getItem(clave); } catch (e) { return null; }
}
function guardarLocal(clave, valor) {
  try { localStorage.setItem(clave, valor); } catch (e) { /* se ignora */ }
}
function borrarLocal(clave) {
  try { localStorage.removeItem(clave); } catch (e) { /* se ignora */ }
}
// Así la búsqueda no distingue mayúsculas ni tildes.
function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function formatoCLP(numero) {
  return '$' + Number(numero || 0).toLocaleString('es-CL');
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener('alpine:init', () => {
  Alpine.store('sesion', {
    activa: leerLocal('sesionIniciada') === 'si',
    nombre: leerLocal('nombreUsuario') || 'Guerrero Z',

    iniciar(nombre) {
      this.activa = true;
      this.nombre = nombre || 'Guerrero Z';
      guardarLocal('sesionIniciada', 'si');
      guardarLocal('nombreUsuario', this.nombre);
    },
    cerrar() {
      this.activa = false;
      borrarLocal('sesionIniciada');
      borrarLocal('nombreUsuario');
    }
  });
});

function catalogoJuegos() {
  return {
    // --- estado ---
    juegos: [],            // registros cargados desde el JSON
    busqueda: '',          // texto del buscador (x-model)
    categoria: 'todas',    // filtro extra por categoría (x-model)
    cargando: true,        // true mientras fetch() no termina
    error: '',             // mensaje si algo falla ('' = sin error)
    ayudaVisible: false,   // controla la sección de ayuda (x-show)

    init() {
      // Si venimos del buscador de la barra superior: Planeta.html?q=ruleta
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) this.busqueda = q;
      this.cargar();
    },

    async cargar() {
      this.cargando = true;
      this.error = '';
      const simular = new URLSearchParams(window.location.search).has('simularError');
      const url = simular ? 'datos/archivo-que-no-existe.json' : 'datos/juegos.json';

      try {
        const respuesta = await fetch(url);              // pide el archivo
        if (!respuesta.ok) {                            
          throw new Error('El servidor respondió ' + respuesta.status + ' al pedir ' + url + '.');
        }
        const datos = await respuesta.json();            // texto -> objetos JS
        if (!Array.isArray(datos)) {
          throw new Error('El JSON no tiene el formato esperado (debía ser una lista de juegos).');
        }
        this.juegos = datos;                             // se guarda en el estado
      } catch (e) {
        this.juegos = [];
        this.error = (e instanceof SyntaxError)
          ? 'El archivo JSON está mal escrito y no se pudo interpretar.'
          : (e.message.startsWith('El ') ? e.message : 'No se pudo conectar para obtener los juegos.');
      } finally {
        this.cargando = false;                           // pase lo que pase, termina la carga
      }
    },

    // getters: se recalculan solos cuando cambia busqueda o categoria 
    get categorias() {
      return [...new Set(this.juegos.map(j => j.categoria))].sort();
    },
    get filtrados() {
      const texto = normalizar(this.busqueda);
      return this.juegos.filter(j => {
        const coincideCategoria = this.categoria === 'todas' || j.categoria === this.categoria;
        const coincideTexto = texto === '' ||
          normalizar(j.nombre).includes(texto) ||
          normalizar(j.categoria).includes(texto) ||
          normalizar(j.planeta).includes(texto) ||
          normalizar(j.descripcion).includes(texto);
        return coincideCategoria && coincideTexto;
      });
    },

    limpiarFiltros() {
      this.busqueda = '';
      this.categoria = 'todas';
    },
    formatoCLP
  };
}

/* ---------- Componente: Bóveda de Zeni (boveda.html) ---------------- */
function bovedaZeni() {
  const PRECIO_ZENI = 500;
  return {
    // estado del formulario (cada campo se vincula con x-model)
    cuenta: '',
    correo: '',
    cantidad: '',
    metodo: '',
    acepta: false,
    // estado de la respuesta
    errores: {},
    enviado: false,
    resumen: null,

    get total() {
      const c = Number(this.cantidad);
      return c > 0 ? c * PRECIO_ZENI : 0;
    },

    validar() {
      const e = {};
      if (this.cuenta.trim().length < 3) e.cuenta = 'Escribe tu nombre de cuenta (mínimo 3 caracteres).';
      if (!EMAIL_VALIDO.test(this.correo.trim())) e.correo = 'Ingresa un correo válido, por ejemplo guerrero@correo.com.';
      const c = Number(this.cantidad);
      if (!this.cantidad || !Number.isInteger(c) || c < 1 || c > 1000) e.cantidad = 'La cantidad debe ser un número entero entre 1 y 1000 Zeni.';
      if (!this.metodo) e.metodo = 'Elige un método de pago.';
      if (!this.acepta) e.acepta = 'Debes aceptar que esta es una simulación con créditos virtuales.';
      this.errores = e;
      return Object.keys(e).length === 0;
    },

    enviar() {
      this.enviado = false;
      if (!this.validar()) return;
      this.resumen = {
        cuenta: this.cuenta.trim(),
        cantidad: Number(this.cantidad),
        total: this.total,
        metodo: this.metodo
      };
      this.enviado = true;
      this.cuenta = ''; this.correo = ''; this.cantidad = ''; this.metodo = ''; this.acepta = false;
      this.errores = {};
    },
    formatoCLP
  };
}

/* ---------- Componente: Iniciar sesión ------------------------------ */
function formLogin() {
  return {
    correo: '',
    clave: '',
    error: '',
    enviar() {
      if (!EMAIL_VALIDO.test(this.correo.trim())) { this.error = 'Ingresa un correo válido.'; return; }
      if (this.clave.length < 1) { this.error = '¡Ki insuficiente! Debes ingresar tu contraseña.'; return; }
      this.error = '';
      // Sesión SIMULADA: solo se guarda una marca en este navegador. No es autenticación real.
      Alpine.store('sesion').iniciar(this.correo.split('@')[0]);
      window.location.href = 'index.html';
    }
  };
}

/* ---------- Componente: Registro ------------------------------------ */
function formRegistro() {
  return {
    correo: '', cuenta: '', clave: '', nacimiento: '',
    errores: {}, exito: false,

    esMayorDeEdad(fecha) {
      const nac = new Date(fecha);
      if (isNaN(nac)) return false;
      const hoy = new Date();
      let edad = hoy.getFullYear() - nac.getFullYear();
      const m = hoy.getMonth() - nac.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
      return edad >= 18;
    },

    enviar() {
      this.exito = false;
      const e = {};
      if (!EMAIL_VALIDO.test(this.correo.trim())) e.correo = 'Ingresa un correo válido.';
      if (this.cuenta.trim().length < 3) e.cuenta = 'El nombre de cuenta debe tener al menos 3 caracteres.';
      if (this.clave.length < 6) e.clave = 'La contraseña debe tener al menos 6 caracteres.';
      if (!this.nacimiento) e.nacimiento = 'Indica tu fecha de nacimiento.';
      else if (!this.esMayorDeEdad(this.nacimiento)) e.nacimiento = 'Debes ser mayor de 18 años para registrarte.';
      this.errores = e;
      if (Object.keys(e).length === 0) {
     
        this.exito = true;
        this.correo = ''; this.cuenta = ''; this.clave = ''; this.nacimiento = '';
      }
    }
  };
}
