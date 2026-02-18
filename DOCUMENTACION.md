# 📦 SAYEF - Tienda Online de Productos Eléctricos

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Base de Datos](#base-de-datos)
6. [Autenticación](#autenticación)
7. [API Endpoints](#api-endpoints)
8. [Mejoras Implementadas](#mejoras-implementadas)
9. [Guía de Inicio](#guía-de-inicio)

---

## 1. Descripción General

**SAYEF** es un ecommerce especializado en productos eléctricos desarrollado con:
- **Frontend**: React + Vite + PrimeReact
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB (Mongoose)
- **Autenticación**: JWT + Google OAuth

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (React + Vite)                            │
│         Puerto: 5173  │  http://localhost:5173              │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + JWT
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│                   (Express + Node.js)                        │
│         Puerto: 8080  │  http://localhost:8080               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     MONGODB                                  │
│              (Base de Datos)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitectura del Sistema

### Estructura de Carpetas

```
SAYEF/
├── BackEnd_SAYEF/              # Backend Node.js
│   ├── src/
│   │   ├── app.js             # Configuración principal Express
│   │   ├── server.js          # Servidor HTTP
│   │   ├── config/            # Configuraciones
│   │   │   ├── db.config.js
│   │   │   ├── env.config.js
│   │   │   ├── logger.js
│   │   │   └── swagger.config.js
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/            # Definición de rutas API
│   │   ├── services/          # Servicios (lógica de negocio)
│   │   ├── repositories/      # Acceso a datos
│   │   ├── dao/               # Data Access Objects
│   │   │   └── models/        # Modelos Mongoose
│   │   ├── middlewares/       # Middlewares Express
│   │   ├── utils/             # Utilidades
│   │   ├── dto/               # Data Transfer Objects
│   │   └── mocks/             # Generadores de datos mock
│   └── test/                  # Tests
│
├── Front_SAYEF_React/          # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── context/           # Contextos (Auth, Cart)
│   │   ├── services/          # Servicios API
│   │   └── App.jsx            # Componente principal
│   └── package.json
│
├── docker-compose.yml          # Orquestación Docker
└── .dockerignore              # Archivos ignorados por Docker
```

---

## 3. Backend

### Flujo de Peticiones

```
CLIENTE ──► MIDDLEWARES ──► ROUTES ──► CONTROLLERS ──► SERVICES ──► REPOSITORIES ──► DAO ──► MONGODB
              │              │            │              │              │            │
              ▼              ▼            ▼              ▼              ▼            ▼
          CORS           Validación    Lógica de      Acceso a       Consultas   Modelos
          Rate Limit     (JWT)         Negocio        Datos                        Mongoose
          Logging
          (Winston)
```

### Middlewares (Orden de Ejecución)

```javascript
// 1. CORS - Permite requests desde frontend
app.use(cors({ origin: env.corsOrigin, credentials: true }));

// 2. Logging HTTP - Registra todas las peticiones
app.use((req, res, next) => { logger.http(`${req.method} ${req.url}`); next(); });

// 3. Rate Limiting - Limita a 100 petitions/15min
app.use('/api/', limiter);

// 4. Parseo de JSON
app.use(express.json());

// 5. Passport JWT
app.use(passport.initialize());
```

### Controladores

| Controlador | Funcionalidad |
|-------------|---------------|
| `user.controller.js` | Registro, login, Google OAuth, perfil |
| `product.controller.js` | CRUD productos, importación Excel |
| `cart.controller.js` | Gestión del carrito |
| `order.controller.js` | Órdenes de compra |
| `ticket.controller.js` | Tickets/Comprobantes |

---

## 4. Frontend

### Estructura de Componentes

```
src/
├── components/
│   ├── Navbar.jsx              # Barra de navegación
│   ├── Cart.jsx                # Carrito de compras
│   ├── CartWidget.jsx          # Icono del carrito
│   ├── ItemListContainer.jsx   # Contenedor de lista productos
│   ├── ItemList.jsx            # Lista de productos
│   ├── ItemDetailContainer.jsx # Detalle de producto
│   ├── ItemDetail.jsx          # Vista detalle
│   ├── ItemCount.jsx          # Contador de cantidad
│   ├── Checkout.jsx           # Página de pago
│   ├── PrivateRoute.jsx       # Ruta protegida
│   ├── Loading.jsx            # Spinner de carga
│   ├── NotFound.jsx           # Página 404
│   └── ContactForm.jsx        # Formulario de contacto
│
├── pages/
│   ├── Login.jsx               # Login
│   ├── Register.jsx           # Registro
│   ├── Profile.jsx            # Perfil usuario
│   └── AdminProducts.jsx      # Admin gestión productos
│
├── context/
│   ├── AuthContext.jsx        # Estado global autenticación
│   └── ShoppingCartContext.jsx # Estado global carrito
│
└── services/
    ├── api.js                 # Configuración Axios
    ├── productService.js      # API productos
    └── orderService.js        # API órdenes
```

### Contextos

#### AuthContext (Gestión de Usuario)

```jsx
// Provider que expone:
const { 
  user,           // Usuario actual
  token,          // JWT token
  login,          // Login email/password
  loginWithToken, // Login con token Google
  logout,         // Cerrar sesión
  updateProfile,  // Actualizar perfil
  isAuthenticated // Boolean
} = useAuth();
```

#### ShoppingCartContext (Gestión del Carrito)

```jsx
// Provider que expone:
const {
  cart,              // Array de productos
  addItem,           // Agregar producto
  removeItem,        // Eliminar producto
  clearCart,         // Vaciar carrito
  total,             // Total calculado
  itemCount          // Cantidad items
} = useShoppingCart();
```

---

## 5. Base de Datos

### Modelos MongoDB

#### User (Usuario)

```javascript
{
  email: String,        // unique, required
  password: String,     // hashed, required
  first_name: String,  // nombre
  last_name: String,   // apellido
  role: String,        // 'user' | 'admin', default: 'user'
  createdAt: Date,
  updatedAt: Date
}
```

#### Product (Producto)

```javascript
{
  title: String,        // required
  description: String, // required
  code: String,        // unique, required (código interno)
  price: Number,        // required
  stock: Number,        // required
  category: String,     // required
  thumbnails: [String], // URLs de imágenes
  offer: Boolean,       // producto en oferta
  createdAt: Date,
  updatedAt: Date
}
```

#### Cart (Carrito)

```javascript
{
  products: [
    {
      product: ObjectId, // ref: Product
      quantity: Number   // default: 1
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### Order (Orden)

```javascript
{
  user: ObjectId,        // ref: User
  products: [...],      // items ordenados
  total: Number,         // monto total
  status: String,       // 'pending' | 'completed' | 'cancelled'
  createdAt: Date
}
```

#### Ticket (Ticket/Comprobante)

```javascript
{
  order: ObjectId,       // ref: Order
  code: String,          // código único
  purchase_datetime: Date,
  amount: Number,
  purchaser: String,     // email del comprador
  createdAt: Date
}
```

---

## 6. Autenticación

### Flujo JWT

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRO                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Usuario envía: { email, password }                      │
│                          ▼                                  │
│  2. Validación express-validator                           │
│                          ▼                                  │
│  3. bcrypt.hash(password) - Hashear password               │
│                          ▼                                  │
│  4. Guardar en MongoDB                                     │
│                          ▼                                  │
│  5. generateToken(user) - Crear JWT                        │
│                          ▼                                  │
│  6. Responder: { token, payload: UserDTO }                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOGIN                                     │
├─────────────────────────────────────────────────────────────┤
│  1. Usuario envía: { email, password }                      │
│                          ▼                                  │
│  2. Buscar usuario por email                               │
│                          ▼                                  │
│  3. bcrypt.compare(password, hash) - Verificar           │
│                          ▼                                  │
│  4. generateToken(user) - Crear JWT                        │
│                          ▼                                  │
│  5. Responder: { token, payload: UserDTO }                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              ACCESO A RUTAS PROTEGIDAS                      │
├─────────────────────────────────────────────────────────────┤
│  1. Request con Header: Authorization: Bearer <token>     │
│                          ▼                                  │
│  2. passport.authenticate('jwt') - Verificar token        │
│                          ▼                                  │
│  3. Adjuntar user a req.user                              │
│                          ▼                                  │
│  4. Ejecutar controller                                    │
└─────────────────────────────────────────────────────────────┘
```

### Protección de Rutas

```javascript
// Solo usuarios autenticados
router.get('/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => { /* ... */ }
);

// Solo admins
router.delete('/products/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('admin'),
  (req, res) => { /* ... */ }
);
```

---

## 7. API Endpoints

### Productos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Listar todos | ❌ |
| GET | `/api/products/:pid` | Ver detalle | ❌ |
| POST | `/api/products` | Crear producto | ✅ Admin |
| PUT | `/api/products/:pid` | Actualizar | ✅ Admin |
| DELETE | `/api/products/:pid` | Eliminar | ✅ Admin |
| POST | `/api/products/import` | Importar Excel | ✅ Admin |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Registrarse | ❌ |
| POST | `/api/users/login` | Iniciar sesión | ❌ |
| POST | `/api/users/google` | Login Google | ❌ |
| GET | `/api/users/current` | Datos actuales | ✅ |
| PATCH | `/api/users/me` | Actualizar perfil | ✅ |

### Carrito

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/carts/:cid` | Ver carrito | ✅ |
| POST | `/api/carts/:cid/products` | Agregar item | ✅ |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar item | ✅ |

### Órdenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Mis órdenes | ✅ |
| POST | `/api/orders` | Crear orden | ✅ |

### Otros

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Servidor funcionando | ❌ |
| GET | `/health` | Health check | ❌ |
| GET | `/api/docs` | Documentación Swagger | ❌ |

---

## 8. Mejoras Implementadas

### 🔧 Correcciones Realizadas

| # | Problema | Solución |
|---|----------|----------|
| 1 | Modelo User sin `first_name`/`last_name` | Agregados campos al schema |
| 2 | CORS hardcodeado | Ahora usa variable `CORS_ORIGIN` |
| 3 | Variables de entorno sin validación | Validación al inicio del servidor |
| 4 | Logging antes de CORS | Reordenado: CORS → Logging |
| 5 | Rutas duplicadas (`/api/sessions`) | Eliminado router duplicado |
| 6 | Loading hardcodeado 5s | Eliminado, carga instantánea |

### ✨ Nuevas Funcionalidades

#### 1. Rate Limiting

```javascript
// Limita a 100 peticiones cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                  // 100 peticiones
  message: { status: 'error', message: 'Demasiadas solicitudes' }
});
app.use('/api/', limiter);
```

**Beneficio**: Previene ataques de fuerza bruta y DDoS.

#### 2. Validación de Inputs

```javascript
// En routes/users.router.js
router.post("/register",
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  validate,
  controller
);
```

**Beneficio**: Previene datos maliciosos o mal formados.

#### 3. .dockerignore

```gitignore
node_modules
.env
*.log
coverage
.DS_Store
```

**Beneficio**: Imagen Docker más ligera, excluye secretos.

#### 4. Tests Unitarios

```javascript
// test/validation.test.js
describe("Validation Tests", () => {
  test("debe fallar con email inválido", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "no-es-email" });
    expect(res.statusCode).toBe(400);
  });
});
```

**Beneficio**: Código más robusto, detección de regresiones.

---

## 9. Guía de Inicio

### Requisitos Previos

- Node.js 18+
- MongoDB (local o Atlas)
- npm o yarn

### Variables de Entorno (.env)

```env
# Backend
PORT=8080
MONGO_URL=mongodb://localhost:27017/sayef
JWT_SECRET=tu_secret_super_seguro
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Ejecutar Localmente

```bash
# Backend
cd BackEnd_SAYEF
npm install
npm run dev

# Frontend
cd Front_SAYEF_React
npm install
npm run dev
```

### Ejecutar con Docker

```bash
# Construir y ejecutar
npm run docker:up

# Detener
npm run docker:down
```

### Tests

```bash
cd BackEnd_SAYEF
npm test
```

---

## 📊 Diagrama de Flujo Completo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              USUARIO                                          │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│  │   Login     │   │   Register  │   │  Catalogo  │   │   Carrito   │       │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘       │
│         │                 │                 │                 │              │
│         └─────────────────┴────────┬────────┴─────────────────┘              │
│                                    ▼                                         │
│                          ┌─────────────────┐                                  │
│                          │  AuthContext    │                                  │
│                          │  (JWT Token)    │                                  │
│                          └────────┬────────┘                                  │
└───────────────────────────────────┼───────────────────────────────────────────┘
                                    │ axios/fetch
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Express)                                     │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MIDDLEWARES                                   │    │
│  │  CORS → Rate Limit → Logging → JSON Parse → Passport JWT           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         ROUTES                                      │    │
│  │  /api/products  /api/users  /api/carts  /api/orders  /api/mocks   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      CONTROLLERS                                    │    │
│  │  productController  userController  cartController  orderController │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       SERVICES                                      │    │
│  │  productService  userService  cartService  orderService            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      REPOSITORIES                                  │    │
│  │  productRepository  userRepository  cartRepository  orderRepository│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      DAO + MODELS                                   │    │
│  │  productDBManager  userDBManager  cartDBManager  orderDBManager    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         MONGODB                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Users   │  │ Products  │  │  Carts   │  │  Orders  │  │  Tickets  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Conclusión

Este proyecto sigue una arquitectura moderna con separación clara de responsabilidades:

- **Controllers**: Lógica de negocio
- **Services**: Acceso y transformación de datos
- **Repositories**: Consultas a base de datos
- **DAO**: Abstracción de Mongoose

Las mejoras implementadas，增加 la seguridad, robustez y mantenibilidad del código.

---

*Documentación generada para SAYEF - Tienda Online de Productos Eléctricos*
*Versión: 1.0*
*Fecha: Febrero 2026*
