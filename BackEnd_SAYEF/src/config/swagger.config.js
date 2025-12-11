import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API SAYEF",
      version: "1.0.0",
      description: "API para la tienda de productos eléctricos SAYEF",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  // Escanea rutas y controladores
  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js",
    "./src/docs/*.yaml"
  ],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
