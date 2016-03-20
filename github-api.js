var request = require('request'),
    Promise = require('native-promise-only');

var GITHUB_USER_API_URL = 'https://api.github.com';
var requestPool = { maxSockets: 20 };

module.exports = githubApiRequest;
function githubApiRequest(githubToken, endPoint, qs) {
  return new Promise(function (resolve, reject) {
    if (!endPoint.match(/^https?:\/\//)) {
      endPoint = GITHUB_USER_API_URL + endPoint;
    }
    var opts = {
      url     : endPoint,
      qs      : qs || {},
      headers : {
        authorization : 'token ' + githubToken,
        'user-agent'  : 'github-api-basic <https://github.com/eugeneware/github-api-basic>'
      },
      json    : true,
      pool    : requestPool
    };
    var handle = function(err, response, body) {
      if (err) return reject(err);
      return resolve({ res: response, body: body });
    }
    request(opts, handle);
  });
}
