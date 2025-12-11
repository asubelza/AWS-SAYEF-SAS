# Acerca del proyecto 👀

> Proyecto de integracion de React con Backend con Node JS.-

## Instalación usando git clone 🔧

### Para acceder al proyecto clonándolo, deberás ejecutar en consola: 
```sh
git clone URL # URL= https://github.com/asubelza/...
npm install 
npm run dev
```

## Instalación descargando comprimido ZIP 🔧
```sh
# Ir a “code” > download ZIP
# Descomprimir el archivo
# En la carpeta donde se encuentra “package.json” ejecutar en terminal:
npm install
npm run dev
```

## Tecnologías principales:

⚙ Vite

⚙ React JS

⚙ JavaScript

⚙ HTML

⚙ CSS

## Algunas librerias:

Para que el proyecto se logre realizar de una manera esperada utilicé las siguientes herramientas:

📚 React-router-dom: routing de la web

📚 React-Firebase: base de datos 

## Firebase / Firestore  (Vamos a reemplazar esta BD por Mongodb en Docker)

- Colección: ```mangas```. Cada item tiene las siguientes características:  (Anterior)

|    Campo      |   Tipo        |   Valor       |
| ------------- | ------------- | ------------- |
| name          |   String      |   Nombre      |
| category      |   String      |   Categoría   |
| image         |   String      |   img 300x400 |
| description   |   String      |   descripcion |
| price         |   number      |   Precio      |
| stock         |   number      |   stock       |


- Colección: ```product```. Cada item tiene las siguientes características:  (Anterior)

|    Campo      |   Tipo        |   Valor       |
| ------------- | ------------- | ------------- |
| name          |   String      |   Nombre      |
| category      |   String      |   Categoría   |
| image         |   String      |   img 300x400 |
| description   |   String      |   descripcion |
| price         |   number      |   Precio      |
| stock         |   number      |   stock       |


- Colección: ```user```. Cada item tiene las siguientes características:  (Nueva coleccion)

|    Campo      |   Tipo        |   Valor       |
| ------------- | ------------- | ------------- |
| name          |   String      |   Nombre      |
| lastname      |   String      |   Apellido    |
| image         |   String      |   img 300x400 |
| mail          |   String      |   e-mail      |
| telephone     |   number      |Num de Telefono|
| rol           |   String      | admin/user    |