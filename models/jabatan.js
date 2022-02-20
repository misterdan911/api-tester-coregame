const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jabatanSchema = new mongoose.Schema({
  nama: { type: String, required: true, index: true, unique: true },
  jabatanDisplay: String,

  kode: String,
  departemen: {
    type: Schema.Types.ObjectId,
    ref: 'Departemen',
  },
  noUrut: { type: Number, default: 99 },
  aktif: Boolean,
  deactivedDate: Date,
  pejabat: Schema.Types.Mixed,
  pejabatLama: Schema.Types.Mixed,
  departemenLama: Schema.Types.Mixed,
  sekretaris: String,
  delegasi: {
    type: Schema.Types.ObjectId,
    ref: 'Delegasi',
  },
  jabatanAtasNama: String,
  jabatanUntukBeliau: String,
  isGrupPara: {
    type: Boolean,
    default: false
  },
  isGrupParaForAll: Boolean,
  anggotaGrupPara: [String],
  dihapus: Boolean
}, {
  collection: 'jabatan'
});

const Jabatan = mongoose.model('Jabatan', jabatanSchema);

module.exports = Jabatan;
