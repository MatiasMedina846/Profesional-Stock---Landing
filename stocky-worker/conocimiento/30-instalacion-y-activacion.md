# Instalación y activación

## Requisitos

Computadora con **Windows 10 o superior**. Internet para descargar el instalador y para activar la cuenta. Después funciona sin conexión.

## Descargar e instalar

1. Descargar el instalador desde la página oficial (botón **Probar gratis 15 días** o la página **descargar.html**). El archivo se llama `ProfesionalStock-3.0.80.exe` y pesa 83,5 MB.
2. Abrir el archivo descargado y seguir el instalador.
3. Abrir Profesional Stock.

Desde el celular no se puede instalar: en ese caso la página ofrece pedir el link por WhatsApp para abrirlo después en la PC.

## Aviso de Windows SmartScreen ("Windows protegió su PC")

La versión actual no tiene firma digital, por eso Windows puede mostrar ese aviso. Es normal.

1. Verificar que el archivo se descargó de la página oficial.
2. Opcional, para mayor seguridad: verificar la huella SHA-256. En PowerShell, desde la carpeta del archivo: `Get-FileHash ProfesionalStock-3.0.80.exe -Algorithm SHA256`. Tiene que dar `BD0BEFF4D664229CC9FAFA8EAD398EACA5E2B17F603900BCA624FFB67DCA1DE9`.
3. En el aviso, tocar **Más información** y después **Ejecutar de todas formas**.

Si el hash no coincide o no está seguro de dónde salió el archivo, que **no lo ejecute** y lo derive al equipo.

## Primer inicio y activación de la prueba de 15 días

Al abrir el programa por primera vez hay que aceptar los Términos y Condiciones. Después se abre la pestaña **Crear cuenta**, con tres pasos:

1. **Usuario**: elegir un usuario y un **PIN de 4 a 6 números** (como la clave del cajero). Con eso se entra todos los días. No hay contraseña.
2. **Negocio**: nombre del negocio, CUIT (o CUIL) y email. El email es solo para la licencia; no se usa para entrar. Tocar **Mandarme el código**. Hace falta internet en ese momento.
3. **Código**: escribir el código que llega por email (revisar el correo no deseado; se puede pedir otro al minuto y **Cambiar el email** corrige la dirección). Con eso empiezan los 15 días gratis.

Al final se muestra un resumen (usuario, negocio, email y hasta qué día es la prueba) y el **código de recuperación** de 16 letras y números, que se muestra una sola vez: conviene copiarlo o imprimirlo, porque sirve para volver a entrar si se olvida el PIN, aun sin internet. Si toca **Lo hago después**, el Inicio se lo recuerda.

Si no tiene internet en ese momento, puede tocar **Hacerlo más tarde**: el usuario queda guardado y el programa queda en solo lectura hasta activarlo en **Sistema > Licencia**.

Al activar se envían solamente el email, el nombre del negocio, el CUIT y un código generado para esa computadora. Las ventas, los productos y los clientes no se envían.

Si la persona **ya tiene una cuenta** (por ejemplo, reinstaló el programa o compró la licencia), tiene que elegir la pestaña **Ya tengo cuenta**, escribir su email y el código que le llega: el programa trae solo el negocio y la licencia, y crea su usuario y PIN en esa computadora. Los datos de ventas y productos no viajan: se traen con una copia de seguridad.

Casos al activar: si esa PC ya tiene otra cuenta, **Usar otro email**; si el email ya usó su prueba, hay que comprar la licencia; si la licencia está en otra computadora, **Pasarla a esta PC**; si no se pudo conectar, revisar internet y **Reintentar**.

Hay una guía con capturas en la página **prueba.html** ("Cómo activar").
