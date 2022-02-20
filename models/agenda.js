const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KomentarSchema = new Schema({
    tgl: Date,
    jabatan: String,
    pejabat: String,
    isi: String,
    action: String
}, { _id: false });


const AgendaSchema = new Schema({    
    takahType: String,
    status: String,
    konseptor: String,
    spsKonseptor: Boolean,
    pemesan: String,
    penerima: [String],
    pemeriksa: [String],
    diperiksaOleh: [String],
    sekretaristtd: [String],
    sekretariskpd: [String],
    posisi: String,
    delegasi: String,
    delegasiTerlibat: [String],
    penandatangan: [String],
    ditandatanganOleh: [String],
    pernahMengembalikan: [String],
    pernahMemeriksa: [String],
    pencetak: String,
    komentar: [KomentarSchema],
    surat: {
        type: Schema.Types.ObjectId,
        ref: 'Surat'
    },
    readByUser: [String],
    noSurat: String,
    perihal: String,
    tglSurat: Date,
    disposisiStatus: { type: Boolean, default: false },
    tanggapanStatus: { type: Boolean, default: false },
},{ collection: 'agenda', timestamps: true, toJSON: { virtuals: true, getters: true }});

AgendaSchema.index({"$**":"text"});

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;
