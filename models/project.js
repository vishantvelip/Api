const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    projectImg: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = model("Project", projectSchema);