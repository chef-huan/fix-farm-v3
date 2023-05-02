import { Document } from "mongoose";

export interface FeeSummary extends Document {
  data: string,
  created_at: Date;
  updated_at: Date;
}