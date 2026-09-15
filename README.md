# BetBallZ - Casino online de apuestas
Integrantes:
-Diego Natera
-Diego Ibarra

#Descripcion del projecto:
"BetBallZ" es la primera versión funcional de la interfaz de usuario para un Casino online con créditos virtuales (Zeni), ambientado en el universo de Dragon Ball. Esta etapa inicial consiste en un sitio web estático responsivo, diseñado para presentar el propósito del sistema, permitir la navegación entre secciones y simular interacciones básicas antes de las futuras implementaciones del backend y de la base de datos.

#Tecnologias utilizadas
-HTML5, CSS y JavaScript.
-Bootstrap v5.3.8
-Amazon Web Service (AWS) - Instancia EC2.

#Estructura de los archivos y carpetas:
-Index.html = Lobby principal y (futuro) catalogo de juegos.
-Iniciar.html = Formulario de inicio de sesión.
-Registrar.html = Formulario de registro de nuevas cuentas.
-Bodega.html = Interfaz para la simulación de recarga de créditos (zeni).
-Planeta.html = Futuro catalogo de juegos (En progreso).
-Style.css = Hojas de estilos personalizados.
-Imágenes/ = Directorio de recursos gráficos

#Descripcion de funciones principales
-Validación de formularios: El sistema verifica que los espacios para el correo electronico y la contraseña no se encuentren vacios antes de permitir el acceso, mostrando una ventana de alerta en el caso de la falta de algun dato.
-Cambio de estado y Mostrar/Ocultar: Utilizando LocalStorage (JavaScript), el sistema detecta si hay alguna sesion iniciada. Si la hay, oculta los botones de IniciarSesion/registrarse, y muestra el perfil del usuario (En este caso, un mensaje de bienvenida) tanto en el Navbar principal como en el menú lateral.
-Cálculos Dinámicos: Permite al usuario ingresar una cantidad de créditos (Zeni) y calcular en tiempo real el costo total en pesos chilenos (500 pesos por zeni), actualizando el texto en la interfaz.
-Modales de confirmación: Al finalizar una simulación de compra, se despliega un Modal de Bootstrap indicando el éxito de la transacción sin recargar la pagina.

#Link pagina con IP elástica:
http://18.205.210.9
