const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filesSchema = new mongoose.Schema({
  originalname: { type: String, required: true, alias: 'name', index: true },
  encoding: String,
  mimetype: { type: String, required: true },
  size: Number,
  buffer: { type: Buffer, required: true },
  agenda: Schema.Types.ObjectId
}, {
  collection: 'files',
  timestamps: true
});

const Files = mongoose.model('Files', filesSchema);

module.exports = Files;
