### Proyecto Backend – Dockerizado   ###

Este proyecto está dockerizado y listo para ejecutarse sin necesidad de instalar Node.js en el host.

---

## Docker

La imagen del proyecto está disponible en DockerHub:

https://hub.docker.com/r/asubelza/docker-backend


Levantar la aplicación:
docker-compose up --build


Esto levantará:

MongoDB en el contenedor mongo

Backend en el contenedor backend_app

Accedé a la app en http://localhost:8080

Ver logs en tiempo real:
docker-compose logs -f

Detener los contenedores:
docker-compose down

### Ejecutar la imagen desde Docker Hub  ###

```bash
docker run -p 8080:8080 \
  -e MONGO_URL="mongodb+srv://..." \
  -e JWT_SECRET="mi_secreto" \
  -e PORT="8080" \
  tuusuario/backend-final:1.0.0
