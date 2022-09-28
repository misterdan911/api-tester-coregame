const config = require('config');
// const appKey = require('./appKey');

let url = `${config.backendUrl}/api/v1`;

const FormData = require('form-data');
const bent = require('bent');

// const apiKey = "eyJhcHBfYWxpYXMiOiJwb3J0YWxIdXRjaCIsImFwcF9uYW1lIjoiUG9ydGFsIEh1dGNoIiwiY3BfaWQiOjV9pNNpr46aKHSUOS4T";
// const apiKey = appKey[config.appAlias];

class SingleToken {

  async generate(apiKey, msisdn) {
    var form = new FormData();
    form.append('msisdn', msisdn);
    const header = form.getHeaders();
    const theHeader = {
      "Authorization": `bearer ${apiKey}`,
      'content-type': header['content-type']
    };

    const req = bent(url, 'POST', 'json', 200, 401);
    const res = await req('/arcade/tokenGen', form, theHeader).catch(err => {
      throw err;
    });
 
    // console.log('xxx', res);
    return res.single_token;
  }

}

module.exports = new SingleToken();
