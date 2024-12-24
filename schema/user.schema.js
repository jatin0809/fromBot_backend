const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sharedWorkspaces: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        permission: { type: String, enum: ['read', 'edit'], default: 'read' },
      }
    ],
    createdAt: { type: Date, default: Date.now },
  })

  const User = mongoose.model("User", userSchema);
  module.exports = {
    User
  }