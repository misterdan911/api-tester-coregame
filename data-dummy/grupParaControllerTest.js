const jabatanModel = require('../models/jabatan');
const agendaModel = require('../models/agenda');

const dataForDelete = {
  grupParaData: {
    _id: '5eee3b196e1c8aba9544b0ab',
    nama: 'Para Elites',
    departemen: "5eee3b196e1c8aba9544b0ac"
  },
  agendaData: {
    _id: '5f15672b4769203e888f6e08',
    penerima: ["Presiden", "Para Elites"],
    status: "SEDANG_DIPERIKSA"
  },
  prepareData: async function () {
    const grupPara = new jabatanModel(this.grupParaData);
    await grupPara.save();
    const agenda = new agendaModel(this.agendaData);
    await agenda.save();
  },
  cleanData: async function() {
    await jabatanModel.deleteOne({ _id: this.grupParaData._id });
    await agendaModel.deleteOne({ _id: this.agendaData._id });
  }
};

module.exports = {dataForDelete};