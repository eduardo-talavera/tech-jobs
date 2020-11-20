# Tech jobs

## Requerimientos 📄
- Node >= 12.8
- Mongo >= 4.2.2


## Configuración 📦
- Clonar el repositorio
- Instalar las dependencias con `npm install`
- Crear el archivo con las variables de entorno en la raíz del proyecto y nombrarlo como "variables.env"
- crear un archivo dentro de la carpeta config y nombrarlo "email.js"

## Ejecución 🧪
- Desarrollo: `npm run dev`
- Producción: `npm run start`


## Archivo variables.env
El archivo debe contener las siguientes variables
- PUERTO:   Puerto en el cual levantar el servicio.
- NODE_ENV:   indica si el proyecto esta en fase de desarrollo o producción
- DATABASE:   Ruta de de la base de datos, si la base de datos se crea en local no require contraseña
- SECRETO
- KEY

Ejemplo:

```env

  PUERTO=5000
  NODE_ENV=development
  DATABASE=mongodb://localhost/tech-jobs-db
  SECRETO=supersecretoo
  KEY=llavesecreta
```
## Archivo email.js
El archivo debe exportar un objeto con las claves y valores necesarios para el envio de emails
<br>
necesitaras contar con un cliente de correo si no cuentas con uno puedes obtener uno de pruebas en la pagina de <a href="https://mailtrap.io/" target="_blank">mailtrap<a/> una vez que te hallas registrado e iniciado sesión dezplazate a la seccion imboxes y despues da click en el engrane como se muestra en la imagen acontinuación. <br/>

<img src="https://raw.githubusercontent.com/eduardo-talavera/tech-jobs/master/public/img/mail-trap-panel.png" width="100%" > <br/>

Despues pulsa en mostrar credenciales en la pestaña de configuración de smtp,
se te debe mostrar algo similar.

<img src="https://raw.githubusercontent.com/eduardo-talavera/tech-jobs/master/public/img/panel-credentials.png" width="100%" > <br/>

ahora debera colocar esos valores en su archivo email.js

si desea utilizar su cuenta de gmail debera ir a la configuración de la misma y habilitar el acceso de aplicaciones poco seguras, el host de gmail es "smtp.gmail.com" debera colocar este junto con el usuario y contraseña con que ingresa a su cuenta.

Ejemplo de como debe quedar el archivo:

```js
module.exports = {
  user: '<tu usuario>',
  pass: '<tu contraseña>',
  host: 'smtp.mailtrap.io',//tomamos el host de mailtrap como ejemplo
  port: '2525',
}
```