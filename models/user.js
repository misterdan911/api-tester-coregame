const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    nama: String,
    jabatan: mongoose.Schema.Types.ObjectId,
    dihapus: Boolean,
}, {
    collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
