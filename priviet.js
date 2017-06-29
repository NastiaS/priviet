/*

Slash Webtasks: Extend Slack with Node.js, powered by Auth0 Webtasks (https://webtask.io)
For documentation, go to https://github.com/auth0/slash
You can find us on Slack at https://webtask.slack.com (join via http://chat.webtask.io)

*/

var https = require('https');

module.exports = (ctx, cb) => {
  // TIPS:
  // 1. Input and output: https://github.com/auth0/slash#inputs-and-outputs
  // 2. Response formatting: https://api.slack.com/docs/messages/builder
  // 3. Secrets you configure using the key icon are available on `ctx.secrets`

  var options = {
      hostname: 'www.alphavantage.co',
      port: 443,
      path: '/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=R9OS',
      headers: {
        "Content-Type": 'application/json'
      }
  };

  var req = https.request(options, function(res) {
    var str = '';
    res.on('data', function (chunk) {
      str += chunk;
    });
  
    res.on('end', function () {
        if (str !== '') {
         var api_document = JSON.parse(str);
         cb(null, {
            text: `@${ctx.body.user_name}, the current price of ` +  api_document["Realtime Global Securities Quote"]["01. Symbol"] + ` is ` + `$` + api_document["Realtime Global Securities Quote"]["03. Latest Price"]
          });
        } else {
          cb(null, {
            text: `@${ctx.body.user_name}, I did not find any price `
          });
        }
    });
  });
  
  req.end();
  
}