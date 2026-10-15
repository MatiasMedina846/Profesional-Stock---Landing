# Instalación y activación

## Requisitos

Computadora con **Windows 10 o superior**. Internet para descargar el instalador y para activar la cuenta. Después funciona sin conexión.

## Descargar e instalar

1. Descargar el instalador desde la página oficial (botón **Probar gratis 15 días** o la página **descargar.html**). El archivo se llama `ProfesionalStock-3.0.51.exe` y pesa 93 MB.
2. Abrir el archivo descargado y seguir el instalador.
3. Abrir Profesional Stock.

Desde el celular no se puede instalar: en ese caso la página ofrece pedir el link por WhatsApp para abrirlo después en la PC.

## Aviso de Windows SmartScreen ("Windows protegió su PC")

La versión actual no tiene firma digital, por eso Windows puede mostrar ese aviso. Es normal.

1. Verificar que el archivo se descargó de la página oficial.
2. Opcional, para mayor seguridad: verificar la huella SHA-256. En PowerShell, desde la carpeta del archivo: `Get-FileHash ProfesionalStock-3.0.51.exe -Algorithm SHA256`. Tiene que dar `83BECCEA0CE04C7B026FA2127170190565E70238328D27000F7252D99FE26A68`.
3. En el aviso, tocar **Más información** y después **Ejecutar de todas formas**.

Si el hash no coincide o no está seguro de dónde salió el archivo, que **no lo ejecute** y lo derive al equipo.

## Primer inicio: asistente de datos del negocio

Al abrir el programa por primera vez aparece un asistente ("Paso 1 de 4: Datos del negocio") que pide nombre del negocio, CUIT, domicilio, teléfono y email. Se puede completar o saltear; el nombre del negocio y el CUIT se piden igual al activar.

## Activar la prueba de 15 días

1. Cuando aparece el aviso de programa sin activar, tocar **Activar ahora**. También se llega desde **Sistema > Licencia**.
2. En la ventana "Active su prueba gratis", elegir **Crear una cuenta nueva**.
3. Completar email, contraseña (mínimo 8 caracteres), repetir la contraseña, nombre del negocio y CUIT.
4. Tocar **Continuar**. Hace falta internet en ese momento.

Al activar se envían solamente el email, el nombre del negocio, el CUIT y un código generado para esa computadora. Las ventas, los productos y los clientes no se envían.

Si la persona **ya tiene una cuenta** (por ejemplo, reinstaló el programa o compró la licencia), en esa misma ventana tiene que elegir **Ya tengo cuenta** e ingresar con su email y contraseña.

Hay una guía con capturas en la página **prueba.html** ("Cómo activar").
