import { EstimateRepository } from "../../../../domain/interfaces/EstimateRepository.js";
import { BaseRepository } from "./BaseRepository.js";

export class MongoEstimateRepository extends EstimateRepository {
    constructor(model) {
        super();
        this.model = model;
        this.base = new BaseRepository(model);
    }

    async saveProject(projectData) {
        const existing = await this.base.findOne({ phone: projectData.phone });
        if (existing) {
            return this.base.update(existing._id, projectData);
        }
        return this.base.create(projectData);
    }

    async getProjectByNumber(phone) {
        return this.base.findOne({ phone });
    }

    // guardar estimaciones
    // async guardarEstimacion(numero, estimacionJSON) {
    async saveEstimate(phone, estimation, additionalData = {}) {
        // const now = new Date();

        await this.model.insertOne({
            phone,
            ...estimation,
            ...additionalData
            // fecha_creacion: now,
            // timestamp: now
        });
    }

    // obtener estimación por número
    // async obtenerEstimacionPorNumero(numero) {
    async getEstimateByNumber(phone) {
        return this.base.findOne({ phone });
    }

    async getAllWithPagination(query){
        return this.base.getAllWithPagination(query);
    }

}
