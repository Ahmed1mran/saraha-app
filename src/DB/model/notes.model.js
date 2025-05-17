import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "Title should not uppercase.",
      },
    },

    content: { type: String, require: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const notesModel = mongoose.models.Notes || model("Notes", noteSchema);
export default notesModel;
