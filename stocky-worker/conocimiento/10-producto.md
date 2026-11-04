# El producto

Profesional Stock es un sistema de gestión y punto de venta para comercios que venden productos. Es un programa que se instala en una computadora con **Windows 10 o superior**. No es una página web ni una app de celular.

- Una vez activado, **funciona sin internet**. Internet solo hace falta para activar la cuenta y para la licencia.
- Los datos del negocio (ventas, productos, clientes, caja) se guardan en una **base local en la computadora**. No se envían al servidor de Profesional Stock.
- Versión actual del instalador: 3.0.80.
- Es un producto argentino, en etapa de lanzamiento, desarrollado por Matías y Mateo.

## Pantalla principal

A la izquierda hay un menú con: **Inicio, Vender, Productos, Clientes, Compras, Caja, Reportes y Agenda**, un botón **Nueva venta** arriba y **Sistema** abajo de todo. Arriba a la derecha se ve si la caja está abierta, los días de prueba que quedan, los avisos (campanita) y el usuario.

En **Inicio** hay un resumen del día: ventas de hoy y cantidad de ventas, ticket promedio, efectivo esperado en caja, productos para reponer, gráfico de ventas de los últimos 7 días, lo más vendido de la semana, productos bajo el mínimo y las últimas ventas.

## Funciones

- **Ventas**: venta rápida buscando el producto por nombre o código, carrito con precio unitario, cantidad y subtotal, distintas formas de pago (efectivo, tarjeta, transferencia o mixto), cálculo del vuelto, cobro con la tecla **F12**, historial de ventas y devoluciones (notas de crédito).
- **Productos e inventario**: alta, edición y baja de productos (con nombre, descripción, precio, stock, stock mínimo, categoría, proveedor y código), categorías, listas de precio, movimientos de stock (entradas, salidas y ajustes), alertas de stock bajo, depósitos y traspasos entre depósitos. El listado de productos se puede exportar.
- **Clientes**: registro de clientes y **cuentas corrientes** (quién debe y cuánto).
- **Compras y proveedores**: registro de compras; al cargarlas se actualiza el stock.
- **Caja**: apertura de caja, movimientos de ingreso y egreso, y efectivo esperado.
- **Reportes**: ventas del día y de la semana, ticket promedio y productos más vendidos.
- **Agenda**: tareas y recordatorios (pagos a proveedores, pedidos, pendientes).
- **Copias de seguridad**: el programa genera una copia y el usuario elige dónde guardarla.
- **Factura electrónica de ARCA**: emite Factura A, B y C y notas de crédito electrónicas con CAE, y el comprobante lleva QR. Se configura en Sistema > Factura electrónica (ARCA): el programa arma el pedido del certificado y guía paso a paso (con entorno de Pruebas para ensayar antes de pasar a Real). Si una factura queda sin CAE por falta de internet, se vuelve a pedir con "Pedir CAE". El Libro IVA se exporta a Excel para el contador.
- **Mostrador y hardware**: funciona con lectores de código de barras (el código agrega el producto al instante), balanzas electrónicas por puerto serie (botón Pesar) y etiquetas de balanza, impresoras de tickets (se elige en Configuración, con Imprimir prueba), Cierre Z de caja, cobro con QR de Mercado Pago, pantalla para el cliente en un segundo monitor, favoritos y ventas en espera.
- **Importar datos** (Sistema > Importar datos): productos, clientes y proveedores desde Excel, CSV y otros programas, y desde exportaciones de Tiendanube, Shopify y Mercado Libre; se revisa fila por fila antes de guardar y hace copia de seguridad.
- **Tiendas online** (Vender > Tiendas online): conecta Mercado Libre, Tiendanube y Shopify; trae los pedidos pagados como ventas y publica el stock. Cada comercio crea su propia aplicación en la plataforma (el programa muestra los pasos). Es nuevo: contalo con prudencia.
- **Seguridad y orden**: cada persona entra con su usuario y un PIN de 4 a 6 números, roles (Administrador, Operador, Consulta), recuperación del PIN por email o código, Papelera para recuperar lo borrado, modo oscuro y modo táctil.
- **Manual de uso** incluido (botón ? y tecla F1).

## Lo que todavía no tiene

Decilo con honestidad cuando sea relevante:

- **No se integra con impresoras ni controladores fiscales** (el "ticket fiscal" de hardware). La factura se emite de forma electrónica con ARCA. Si el negocio exige controlador fiscal, decíselo claro.
- **Factura electrónica**: está disponible, pero cada negocio necesita su clave fiscal, su certificado digital y un punto de venta para Web Services en ARCA, y el sistema es reciente. Si el cliente la necesita sí o sí, recomendale ensayarla en el entorno de Pruebas durante la prueba gratis y, si quiere, derivá al equipo para acompañarlo. No des asesoramiento impositivo: qué tipo de factura le corresponde lo define su contador.
- **No hay versión nube ni sincronización entre computadoras**: cada PC tiene su propia base de datos. No afirmes que varias PC comparten los mismos datos ni que hay app de celular o acceso desde el celular; si preguntan, decí que está en estudio, sin fechas ni precios, y derivá si es clave.
- No tiene versión para Mac, Linux, celular ni tablet.
- Lectores, balanzas e impresoras: funcionan los lectores de código de barras que escriben como teclado y las balanzas por puerto serie; con un modelo puntual, sugerí probarlo durante la prueba gratis y consultar al equipo.

## Para qué comercios sirve

Comercios que venden productos: almacenes, kioscos, ropa y calzado, ferreterías, librerías, regalerías y bazares, perfumerías, electrónica, celulares y accesorios, jugueterías, pet shops, pinturerías, repuestos de autos, bicicleterías, deportes, dietéticas, vinotecas, mercerías, bijouterie, artículos de limpieza, distribuidoras y similares.

Si el rubro no está en la lista, preguntá cómo vende (por unidad, por peso, con factura electrónica, con varias cajas o sucursales conectadas entre sí) y respondé según lo que el sistema tiene y no tiene.

## Comparación con otras opciones

- **Frente a Excel o un cuaderno**: todo queda en un solo lugar; cada venta descuenta el stock, suma a la caja y aparece en los reportes, sin fórmulas ni cuentas a mano. Excel puede alcanzar para empezar.
- **Frente a sistemas en la nube**: Profesional Stock funciona sin internet, los datos quedan en la computadora del negocio y se paga una sola vez, sin abono mensual. A cambio, hoy no hay versión nube ni sincronización entre computadoras ni acceso desde el celular. Sé justo: si el negocio necesita eso sí o sí, decilo claramente.
- No hables mal de otras marcas ni des precios de la competencia.
