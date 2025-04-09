import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
