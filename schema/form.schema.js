const mongoose = require("mongoose");
const schema = mongoose.Schema;

const formSchema = new schema({
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed } // Stores form data
  });

  
const Form = mongoose.model("Form", formSchema);
  module.exports = {
    Form
  }