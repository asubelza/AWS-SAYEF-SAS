import { ticketDBManager } from "../dao/ticketDBManager.js";
import TicketDTO from "../dto/ticket.dto.js";

const TicketService = new ticketDBManager();

class TicketController {
  
  // Crear un ticket a partir del monto total y el email del comprador
  static async createTicket({ amount, purchaser }) {
    try {
      if (!amount || !purchaser) {
        throw new Error("Faltan datos para crear el ticket");
      }

      const newTicket = await TicketService.createTicket(amount, purchaser);
      const ticketDTO = new TicketDTO(newTicket);

      return ticketDTO;

    } catch (error) {
      console.error("Error creando ticket:", error);
      throw error;
    }
  }

  // Opcional: obtener todos los tickets
  static async getTickets() {
    try {
      const tickets = await TicketService.getAllTickets();
      return tickets.map(ticket => new TicketDTO(ticket));
    } catch (error) {
      console.error("Error obteniendo tickets:", error);
      throw error;
    }
  }

  // Opcional: obtener un ticket por id
  static async getTicketById(ticketId) {
    try {
      const ticket = await TicketService.getTicketById(ticketId);
      if (!ticket) throw new Error("Ticket no encontrado");
      return new TicketDTO(ticket);
    } catch (error) {
      console.error("Error obteniendo ticket:", error);
      throw error;
    }
  }
}

export default TicketController;
