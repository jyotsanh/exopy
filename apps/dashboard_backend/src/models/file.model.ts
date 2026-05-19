import { Schema, model } from "mongoose";
import { IFile } from "./types/index.js";

const fileSchema = new Schema<IFile>({
  name: { type: String, required: true, index: true },
  url: { type: String, required: true },
  uploaded_by: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
},{ timestamps: true});

export const File = model<IFile>("File", fileSchema);