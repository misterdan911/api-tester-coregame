const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kopsuratSchema = new mongoose.Schema({
  baris_1: String,
  baris_2: String,
  baris_3: String,
  baris_4: String,
  baris_5: String,
  logo: {
    type: Schema.Types.ObjectId,
    ref: 'MongoFile'
  },
  jabatan: [String],
}, {
  collection: 'kopsurat',
  timestamps: true
});

const Kopsurat = mongoose.model('Kopsurat', kopsuratSchema);

module.exports = Kopsurat;
