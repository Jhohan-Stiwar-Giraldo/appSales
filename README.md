# Configuración inicial

Esta es una plantilla para proyectos tipo Vanilla

## Estructura de carpetas

El espacio de trabajo contiene tres carpetas por defecto, estas son:

- `data`: para mantener datos de prueba, posiblemente en formato JSON.
- `node_modules`: para el control de las dependencias.
- `resources`: que contiene a su vez tres carpetas:
    - `assets`: para guardar recursos de tipo media (images, videos, ...)
    - `css`: donde irán todas las hojas de estilo en cascada.
    - js: contendrá todo lo de JavaScript.
    - views: contendrá todas las páginas html distintas a la página principal.

## Qué configuración inicial se tuvo en cuenta

- Se verificó que NPM estuviera instalado en el equipo (`npm -v`).
- Se comprobó si existían actualizaciones de npm (`npm install -g npm`)
- Se inicializó el espacio de trabajo (`npm init`)
- Se instaló (`npm i -g npm-check-updates`) para chequear estado de las dependencias mediante ncu.
- Se instaló Normalice.css (`npm i normalize.css`)

## Tareas iniciales adicionales
- Se ejecuta `git init`
- Se configura `.gitignore`
- `git add -A` para agregar los archivos al stating
- `git commit -m 'mensaje...'` para confirmar los cambios
- `git remote add origin https://user@.../user/repositorio.git` para agregar el proyecto local al repositorio remoto
- `git push -u origin master` (para transferir los cambios de lo local al servidor remoto)

## Tareas repetitivas
- `git add -A` para agregar los archivos al stating
- `git commit -m '...'` para confirmar los cambios
- `git push -u origin master` (para transferir los cambios de lo local al servidor remoto)
- Si se desea crear un tag
    - `git tag nombre-tag -m "..."` para crear el tag
    - `git push --tags`
    - `git push origin master --tags`
- Si se desea eliminar un tag
    - Local: `git tag --delete nombreTag`
    - Remoto: `git push --delete origin nombre-tag`

## en caso de requerir cambiar de repositorio remoto
Importante: verifique con `git remote -v` que su repositorio remoto sea el correcto, si no lo es proceda a actualizarlo de la siguiente manera:

- `rm -rf .git` esto eliminara todo lo relacionado a tu repositorio git
- `git init`  inicializa git en tu proyecto
- `git remote add origin  https://.../usuario/repositorio.git`

Para información sobre  `NPM y su configuración básica`, consulte [aquí](https://codingpotions.com/npm-tutorial).