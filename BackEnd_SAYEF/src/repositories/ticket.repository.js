import TicketDBManager from "../dao/ticketDBManager.js";

export default class TicketRepository {
  constructor() {
    this.dao = new TicketDBManager();
  }

  async createTicket(data) {
    return await this.dao.createTicket(data.amount, data.purchaser);
  }

  async getTicketById(id) {
    return await this.dao.getTicketById(id);
  }

  async getAllTickets() {
    return await this.dao.getAllTickets();
  }
}

