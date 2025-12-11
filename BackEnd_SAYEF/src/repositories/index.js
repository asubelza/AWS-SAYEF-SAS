import ProductDBManager from "../dao/productDBManager.js";
import CartDBManager from "../dao/cartDBManager.js";
import UserDBManager from "../dao/userDBManager.js";
import TicketDBManager from "../dao/ticketDBManager.js";

import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";
import UserRepository from "./user.repository.js";
import TicketRepository from "./ticket.repository.js";

// Instanciar DAOs
const productDAO = new ProductDBManager();
const cartDAO = new CartDBManager(productDAO); // Si el cart necesita el productDAO
const userDAO = new UserDBManager();
const ticketDAO = new TicketDBManager();

// Inyectar DAOs en los Repositories
export const productRepository = new ProductRepository(productDAO);
export const cartRepository = new CartRepository(productDAO); // Le pasamos productDAO si es necesario
export const userRepository = new UserRepository();
export const ticketRepository = new TicketRepository(ticketDAO);
