const mongoose = require("mongoose");
const schema = mongoose.Schema;

const folderSchema = new schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    forms: [
      {
        formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' }
      }
    ]
});

const Folder = mongoose.model("Folder", folderSchema);
  module.exports = {
    Folder
  }