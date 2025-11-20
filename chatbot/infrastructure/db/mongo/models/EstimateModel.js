import mongoose from "mongoose";

const EstimateSchema = new mongoose.Schema({
  phone: { type: String, index:true, required: true },
}, { strict: false, timestamps: true });

export const EstimateModel = mongoose.model("Estimate", EstimateSchema);
