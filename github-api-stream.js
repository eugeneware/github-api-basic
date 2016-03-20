var stream = require('stream'),
    once = require('once'),
    Promise = require('native-promise-only'),
    request = require('request'),
    githubApiRequest = require('./github-api');

var GITHUB_USER_API_URL = 'https://api.github.com'

module.exports = githubApiStream;
function githubApiStream(githubToken, endPoint, opts) {
  var rs = stream.Readable({ objectMode: true });

  var work = [GITHUB_USER_API_URL + endPoint];

  var start = once(fetch);
  rs._read = function () {
    start(githubToken);
  };

  function fetch() {
    if (work.length === 0) {
      return rs.push(null);
    }

    var item = work.shift();
    githubApiRequest(githubToken, item, opts)
      .then(function (result) {
        var res = result.res;
        if (res.statusCode !== 200) return rs.emit('error', res.body);
        if (res && res.headers && res.headers.link) {
          parseLinks(res.headers.link)
            .filter(function (link) {
              return link.rel === 'next';
            })
            .forEach(function (link) {
              work.push(link.url);
            });
        }
        result.body.forEach(function (item) {
          rs.push(item);
        });
        setImmediate(fetch);
      })
    .catch(function (err) {
      return rs.emit('error', err);
    });
  }
  return rs;
}

function parseLinks(links) {
  return String(links)
    .split(',')
    .map(function (part) {
      var parts = part.split(';').map(function (item) {
        return item.trim();
      });
      return {
        url: extractUrl(parts[0]),
        rel: extractRel(parts[1])
      };
    });
}

var urlRegex = /^<([^>]*)>$/;
function extractUrl(part) {
  var m = urlRegex.exec(part);
  if (m) return m[1];
  return null;
}

var relRegex = /^rel="([^"]*)"$/;
function extractRel(part) {
  var m = relRegex.exec(part);
  if (m) return m[1];
  return null;
}
