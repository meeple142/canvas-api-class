/*eslint-env node*/
/*eslint no-unused-vars:0, no-console:0*/



var fs = require('fs'),
    got = require('got'),
    token = require('../getToken.js')('../token.json'),
    color = require('chalk'),
    getAllPages = require('./canvas-get-all-pages.js'),
    dsv = require('d3-dsv'),
    domain = 'https://byuh.instructure.com',
    course_id = '1458190',
    apiCall = `/api/v1/courses/${course_id}/quizzes`,

    query = {
        access_token: token,
        per_page: 20
    };



getAllPages(domain, apiCall, query, function (err, quizes) {
    //var onesWeLike = quizes.filter(quiz => quiz.title.match(/Level \d/) !== null);
    var onesWeLike = quizes;

    console.log("onesWeLike.length:", onesWeLike.length);
    var colsWeWant = ['id', 'title', 'html_url', 'mobile_url'];
    fs.writeFileSync('allTheQuizes.csv', dsv.csvFormat(onesWeLike));
    fs.writeFileSync('allTheQuizesFilteredCols.csv', dsv.csvFormat(onesWeLike, colsWeWant));
});
