var it = require('tape'),
    githubApi = require('..').githubApi,
    githubApiStream = require('..').githubApiStream;

var githubToken = process.env.GITHUB_API_TOKEN;

it('should be able to make a basic GitHub API Request', function(t) {
  t.plan(3);
  githubApi(githubToken, '/users/eugeneware')
    .then(function (result) {
      t.equal(result.body.login, 'eugeneware');
      t.equal(result.body.id, 38154);
      t.equal(result.body.name, 'Eugene Ware');
    })
    .catch(function (err) {
      t.fail(err);
    });
});

it('should be able to do basic GitHub API streaming', function(t) {
  var n = 0;
  githubApiStream(githubToken, '/users/eugeneware/repos')
    .on('data', function (data) {
      t.equal(data.owner.login, 'eugeneware');
      n++;
    })
    .on('error', t.fail.bind(t))
    .on('end', function () {
      t.assert(n > 170);
      t.end();
    });
});
