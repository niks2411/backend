const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);


