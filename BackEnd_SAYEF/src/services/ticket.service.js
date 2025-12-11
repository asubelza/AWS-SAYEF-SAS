import { ticketRepository } from "../repositories/index.js";

class TicketService {
  async createTicket(amount, purchaser) {
    return await ticketRepository.create({
      code: `TCK-${Date.now()}`,
      purchase_datetime: new Date(),
      amount,
      purchaser,
    });
  }

  async getTicketById(tid) {
    return await ticketRepository.getById(tid);
  }

  async getAllTickets() {
    return await ticketRepository.getAll();
  }
}

export default new TicketService();




