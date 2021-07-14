# Map Events - ByPabloC

## Guía de como consumir esta API:

Ver [Guía para Map-Events-API](https://bypabloc-map-events-api.herokuapp.com/).

## Pasos para instalar esta API en local:

### Clonar el repositorio
```
git clone https://github.com/bypabloc/map-events-api.git
```
### Dirigirse a la carpeta
```
cd map-events-api
```

### Crear el archivo ".env"
```
touch .env
```

### Editar el archivo ".env"
```
sudo nano .env
```

### Indicar en el contenido del mismo el puerto y string de la conección a mongodb. Ejemplo:
```
NODE_DB='mongodb+srv://usuario:contraseña@cluster0.x.mongodb.net/x?retryWrites=true&w=x'
NODE_PORT=3000
```

### Instalar los paquetes necesarios
```
npm install
```

### Arrancar el servidor
```
npm run dev
```
