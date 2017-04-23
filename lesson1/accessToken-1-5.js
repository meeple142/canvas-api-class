/*eslint-env node*/
/*eslint no-unused-vars:0, no-console:0*/
var fs = require('fs'),
    got = require('got'),
    token = require('../getToken.js')('../token.json'),
    color = require('chalk'),
    domain = 'https://canvas.instructure.com';

//test my api key
got(domain + '/api/v1/users/self/profile?access_token=' + token)
    .then(function (response) {
        var body = JSON.parse(response.body);
        console.log("Responce Body:")
        console.log(color.gray(JSON.stringify(body, null, 4)));
        console.log('answer:');
        console.log(color.green(body.calendar.ics));
    })
    .catch(function (error) {
        console.log(color.red(error.response.body));
    });


