export class Conversation {
  // constructor({ phone, name, email, contactPhone, company, projectType, description, messages, pending }) {
  constructor({ _id, phone, name, messages }) {
    if (!phone) throw new Error("Missing mandatory data");
    this.id = _id
    this.phone = phone;
    this.name = name;
    // this.email = email;
    // this.contactPhone = contactPhone;
    // this.company = company;
    // this.projectType = projectType;
    // this.description = description;
    // this.messages = messages;
    // this.pending = pending;
  }
}