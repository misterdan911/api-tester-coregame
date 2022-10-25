let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function decrypt(encData, method, secretKey) {
  res = await chai.request('http://localhost/decryptor')
    .post(`/decrypt.php`)
    .send({
      encryptedData: encData,
      method: method,
      secretKey: secretKey,
    })
    .catch(err => { throw err; });
    
  return res;
}

module.exports = decrypt;
