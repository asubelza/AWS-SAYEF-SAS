import TicketModel from "./models/ticket.model.js";
import TicketDTO from "../dto/ticket.dto.js";
import { v4 as uuidv4 } from "uuid";

class TicketDBManager {
  constructor() {}

  // Crear ticket
  async createTicket(amount, purchaser) {
    try {
      if (!amount || !purchaser) {
        throw new Error("Amount y purchaser son obligatorios para crear un ticket.");
      }

      // Generar código único para el ticket
      const code = uuidv4();

      const newTicket = await TicketModel.create({
        code,
        purchase_datetime: new Date(),
        amount,
        purchaser,
      });

      // Retornar un DTO
      return new TicketDTO(newTicket);
    } catch (error) {
      console.error("Error en TicketService:", error.message);
      throw new Error("No se pudo crear el ticket.");
    }
  }

  // Obtener ticket por ID
  async getTicketById(tid) {
    try {
      const ticket = await TicketModel.findById(tid);
      if (!ticket) return null;
      return new TicketDTO(ticket);
    } catch (error) {
      throw new Error("Error al buscar el ticket.");
    }
  }

  // Obtener todos los tickets
  async getAllTickets() {
    try {
      const tickets = await TicketModel.find();
      return tickets.map((t) => new TicketDTO(t));
    } catch (error) {
      throw new Error("Error al obtener los tickets.");
    }
  }
}

export default TicketDBManager;
