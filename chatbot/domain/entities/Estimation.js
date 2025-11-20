export class Estimation {
  constructor({ phone, name, email, contactPhone, company, projectType, descripcion, total_costo, total_horas, modulos, resume, createdAt }) {
    if (!phone) throw new Error("Missing mandatory data");
    this.phone = phone;
    this.name = name;
    this.email = email;
    this.contactPhone = contactPhone;
    this.company = company;
    this.projectType = projectType;
    this.descripcion = descripcion;
    this.total_costo = total_costo;
    this.total_horas = total_horas;
    this.modulos = modulos;
    this.resume = resume;
    this.createdAt = createdAt;
  }
}