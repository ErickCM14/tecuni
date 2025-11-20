export class Conversation {
  constructor({ phone, name, email, contactPhone, company, projectType, description, messages, pending }) {
    if (!phone || !email || !projectType) throw new Error("Missing mandatory data");
    this.phone = phone;
    this.name = name;
    this.email = email;
    this.contactPhone = contactPhone;
    this.company = company;
    this.projectType = projectType;
    this.description = description;
    this.messages = messages;
    this.pending = pending;
  }
}