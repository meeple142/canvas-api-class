/* eslint-env node*/
/* eslint no-console:0, no-unused-vars:0 */

var got = require('got');

got('https://learn-lti.herokuapp.com/api/v1/status')
    .then(function (response) {
        var body = JSON.parse(response.body);
        console.log("code:", body.code);
    })
    .catch(function (error) {
        console.log(error.response.body);
    });
