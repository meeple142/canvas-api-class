/*eslint-env node*/
/*eslint no-unused-vars:0, no-console:0*/

function objToQuery(obj) {
    var query = Object.keys(obj).map(function (key) {
        if (Array.isArray(obj[key])) {
            return obj[key].map(item => key + '[]=' + item).join('&');
        } else {
            return key + '=' + obj[key];
        }
    }).join('&');
    query = '?' + encodeURI(query);
    //console.log('query:', query);
    return query;
}

var fs = require('fs'),
    got = require('got'),
    token = require('../getToken.js')('../token.json'),
    color = require('chalk'),
    domain = 'https://byuh.instructure.com',
    course_id = '1458190',
    apiCall = `/api/v1/courses/${course_id}/quizzes`,
    query = {
        access_token: token,
        per_page: 20,
        page: 2
    };

//test my api key 
got(domain + apiCall + objToQuery(query))
    .then(function (response) {
        var quizes = JSON.parse(response.body),
            headers = JSON.parse(response.headers),
            pageLinks = headers.link;
        //console.log("response:", response);
        console.log("Quiz Count:", quizes.length)
        console.log("pageLinks:", pageLinks);
        quizes.forEach(function (quiz) {
            console.log(quiz.title);
        });
        //console.log(JSON.stringify(body, null, 2));

    })
    .catch(function (error) {
        console.log(color.red(error.response.body));
    });
