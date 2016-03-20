# github-api-basic

Simple helper functions to use and call the github api with streaming

[![build status](https://secure.travis-ci.org/eugeneware/github-api-basic.png)](http://travis-ci.org/eugeneware/github-api-basic)

This module exports some basic building block functions to help you build
github API calls.

## Installation

This module is installed via npm:

``` bash
$ npm install github-api-basic
```

## Example Usage - simple API call

``` js
var githubApi= require('github-api-basic/github-api');
githubApi(githubToken, '/users/eugeneware')
  .then(function (response) {
    console.log(response.body);
  })
  .catch(function (err) {
    console.error(err);
  });

/***
{ login: 'eugeneware',
  id: 38154,
  avatar_url: 'https://avatars.githubusercontent.com/u/38154?v=3',
  gravatar_id: '',
  url: 'https://api.github.com/users/eugeneware',
  html_url: 'https://github.com/eugeneware',
  ...
  followers: 190,
  following: 103,
  created_at: '2008-12-03T23:25:48Z',
  updated_at: '2016-03-18T03:42:46Z' }
 */
```

## Example Usage - streaming multiple pages of results using node.js streams

``` js
var githubApi= require('github-api-basic/github-api-stream');
githubApiStream(githubToken, '/users/eugeneware/repos')
  .on('data', console.log);

/***
{ id: 474829,
  name: 'airspec',
  full_name: 'eugeneware/airspec',
  owner:
  ... }
  ...
{ id: 15649811,
  name: 'angularjs-lively',
  full_name: 'eugeneware/angularjs-lively',
  ... }
 */
```

## API

### githubApi(githubToken, endPoint, params)

Calls the github API for a single response, with the given `endPoint` and will
pass a `params` object as a query string to the query.

`endPoint` can be prefixed with the API url, or left blank and must start with
a starting `/`.

### githubApiStream(githubToken, endPoint, params)

Used for github API queries that can return multiple pages. This returns a
`Readable` stream of the results. The `params` object passes additional parameters
through as an query string object.

`endPoint` can be prefixed with the API url, or left blank and must start with
a starting `/`.
