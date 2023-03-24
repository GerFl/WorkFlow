# WorkFlow - v1.5

Hola desde la compu Vostro:)

Administrador de proyectos.<br>
Fue elaborado en el entorno NodeJs, usando Express como servidor de la aplicación, Sequelize como ORM para la base de datos con SQL y Pug como template engine.

También se usaron tecnologías como:
- 'axios' para mandar request de tipo *get*, *patch* y *delete* desde el frontend al backend
- 'webpack' para compilar los scripts que se usan en el frontend
- 'passport' para autenticación de usuarios
- 'gulp' para automatizar tareas como compilación de SASS
- utilidades de 'express' para validaciones de datos y sesiones
- 'nodemailer' para envío de correos
- 'multer' para carga de imágenes

entre otras.

## ¿Cómo instalar las dependencias?
Se pueden instalar de dos maneras, una usando el archivo 'package.json' y otra utilizando el 'package-lock.json'.
- Si se decide utilizar el 'package.json' sólo es necesario estar en la carpeta del proyecto en la terminal y escribir `npm install`. Esto instalará las versiones recientes de las dependencias
- Si se usa 'package-lock.json' también se debe estar en la carpeta del proyecto en la terminal, pero en este caso se escribe `npm ci`. Esto instalará las versiones **utilizadas** de las dependencias durante el desarrollo del proyecto

Para más información visita este hilo en [stackoverflow](https://stackoverflow.com/questions/44206782/do-i-commit-the-package-lock-json-file-created-by-npm-5?rq=1)
  
## ¿Cómo iniciar la aplicación?
**Es necesario tener la base de datos creada previamente. Los datos de conexión se pueden cambiar en ./config/database.js**<br>
**El ORM se encargará de crear las tablas al ejecutar la aplicación.**
### NPM scripts
  Hay cuatro comandos :
  - `npm run start` : iniciará la aplicación para uso normal
  - `npm run pokemon` : iniciará la aplicación con **nodemon**, el cual captura los cambios de los archivos .js y .json
  - `npm run watch` : Este comando no inicia la aplicación, sólo utilizará **webpack** para poder compilar los modulos js ubicados en la carpeta 'src', los cuales se mandan al frontend para funcionalidad y mandar peticiones con **axios**
  - `npm run dev` : utilizará el paquete **concurrently** para poder ejecutar *npm run pokemon* y *npm run watch* al mismo tiempo

La aplicación se muestra por default en `localhost:3001`. El puerto se puede cambiar en el archivo 'index.js' ubicado en la raíz del proyecto.

### GULP
En caso de hacer cambios en los archivos de Sass, se puede correr cualquiera de los siguientes comandos:
- `gulp compilarSass` : compila Sass una sola vez
- `gulp uatu` : compila Sass de manera automática cada que haya cambios en los archivos .scss

### Migraciones
  Para hacer una migración de la base de datos es necesario contar con sequelize-cli, el cuál se puede instalar en el proyecto fácilmente con el siguiente comando:
  ````
  npm install --save-dev sequelize-cli
  ````
  Luego de eso podemos correr uno de los siguientes en la terminal:
  ````
  npx sequelize-cli db:migrate        -> Para hacer una migración y actualizar la base de datos
  npx sequelize-cli db:migrate:undo   -> Para deshacer la migración y dejar la base de datos en su estado anterior
  ````
  donde:
  - 'db' = nombre de la base de datos
  
  Para más detalles se puede visitar el sitio oficial de [Sequelize](https://sequelize.org/)<br>
  O bien, para el uso sequelize-cli visitar el [repositorio de Sequelize CLI](https://github.com/sequelize/cli)

## Evolución
Los primeros borradores se realizaron en AdobeXD. Este era el aspecto inicial:
<img src="workflow-proyectos-firstdraft.png" alt="Borrador de proyectos">
<img src="workflow-tareas-firstdraft.png" alt="Borrador de tareas">
