var fs = require('fs');
const FormData = require('form-data');

const kopSurat_WithoutLogo = {
  baris_1: 'Badan Pendidikan dan Pelatihan',
  baris_2: '',
  baris_3: '',
  baris_4: '',
  baris_5: '',
  jabatan: 'Presiden RI;Sekretariat'
};

function kopSurat_Logonya_jpg() {
  var form = new FormData();
  form.append('baris_1', 'Badan Pendidikan dan Pelatihan');
  form.append('logo', fs.createReadStream('assets/logo.jpg'));
  form.append('jabatan', 'Presiden RI;Sekretariat');
  return form;
}
function kopSurat_Logonya_jpeg() {
  var form = new FormData();
  form.append('baris_1', 'Badan Pendidikan dan Pelatihan');
  form.append('logo', fs.createReadStream('assets/logo.jpeg'));
  form.append('jabatan', 'Presiden RI;Sekretariat');
  return form;
}
function kopSurat_Logonya_png() {
  var form = new FormData();
  form.append('baris_1', 'Badan Pendidikan dan Pelatihan');
  form.append('logo', fs.createReadStream('assets/logo.png'));
  form.append('jabatan', 'Presiden RI 2;Sekretariat 2');
  return form;
}
function kopSurat_Logonya_gif() {
  var form = new FormData();
  form.append('baris_1', 'Badan Pendidikan dan Pelatihan');
  form.append('logo', fs.createReadStream('assets/logo.gif'));
  form.append('jabatan', 'Presiden RI 3;Sekretariat 3');
  return form;
}
function kopSurat_Logonya_bmp() {
  var form = new FormData();
  form.append('baris_1', 'Badan Pendidikan dan Pelatihan');
  form.append('logo', fs.createReadStream('assets/logo.bmp'));
  form.append('jabatan', 'Presiden RI 4;Sekretariat 4');
  return form;
}

module.exports = {
  kopSurat_WithoutLogo,
  kopSurat_Logonya_jpg,
  kopSurat_Logonya_jpeg,
  kopSurat_Logonya_png,
  kopSurat_Logonya_gif,
  kopSurat_Logonya_bmp,
};