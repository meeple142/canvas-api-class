/*eslint-env node*/
/*eslint no-unused-vars:0, no-console:0*/
var fs = require('fs'),
    got = require('got'),
    token = require('../getToken.js')('../token.json'),
    qToken = 'access_token=' + token,
    color = require('chalk'),
    domain = 'https://canvas.instructure.com';

//test my api key
got(domain + '/api/v1/courses' + '?' + qToken)
    .then(function (response) {
        var body = JSON.parse(response.body);
        console.log("Responce Body:")
        console.log(color.gray(JSON.stringify(body, null, 4)));
        console.log('answer:');
        console.log(color.green(body[0].id));
    })
    .catch(function (error) {
        console.log(color.red(error.response.body));
    });
