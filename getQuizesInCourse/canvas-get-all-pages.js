/*eslint-env node*/
/*eslint no-unused-vars:2, no-console:0, no-undefined:2*/

var got = require('got'),
    asyncLib = require('async'),
    chalk = require('chalk'),
    querystring = require('querystring');;


//takes a balse url string and adds all the query vars
function makeUrlString(urlIn, query) {
    stringOut = urlIn + '?' + querystring.stringify(query);
    //console.log(chalk.gray(stringOut));

    return stringOut;
}


/*
 parses the link string into a useable obj 
 details on the string here 
 https://canvas.instructure.com/doc/api/file.pagination.html
*/
function getLinksObj(links) {
    function captureGroupOrEmpty(needle, haystack) {
        var match = haystack.match(needle);
        return Array.isArray(match) ? match[1] : '';
    }

    var objOut = links.split(',')
        .reduce(function (objOut, link) {
            //get what we need
            //page=2
            var url = captureGroupOrEmpty(/^<(.+?)>;/, link),
                rel = captureGroupOrEmpty(/rel="([a-z]+?)"$/i, link),
                pageNumber = captureGroupOrEmpty(/page=(\d+)/, link),
                pageNumberAsNumber = +pageNumber;

            //make pageNumber a number
            pageNumber = isNaN(pageNumberAsNumber) ? 0 : pageNumberAsNumber;

            //save it
            objOut[rel] = {
                url: url,
                page: pageNumber
            };

            //send it on
            return objOut;

        }, {});

    //console.log(chalk.green('links:'), objOut);
    return objOut;

}

/* makes one call*/
function makeCall(call, cbMakeCall) {
    //console.log(chalk.yellow(call));
    got(call)
        .then(function (response) {
            //console.log(chalk.green(call));
            cbMakeCall(null, response);
        }, function (error) {
            cbMakeCall(error, null);
        });

}

//when the first call is made below, it checks if there is a last url
//if has last, make array of all the calls needed, then get'em with async
function getTheRest(firstVal, urlBase, query, linkObj, cb) {
    var calls = [],
        arrayOut = [firstVal],
        i;



    //make array of all the calls
    for (i = linkObj.next.page; i <= linkObj.last.page; ++i) {
        query.page = i;
        calls.push(makeUrlString(urlBase, query));
    }

    //console.log('calls:', calls);
    //go get them all
    asyncLib.map(calls, makeCall, function (err, requests) {
        if (err) {
            cb(err, null);
            return;
        }
        var bodies = requests.map(request => JSON.parse(request.body));

        //save then flatten them 
        arrayOut = arrayOut
            .concat(bodies)
            .reduce((flat, page) => flat = flat.concat(page), []);

        cb(null, arrayOut);

    });



}


function getAllPages(domain, call, queryObj, cb) {
    var firstVal,
        urlBase = domain + call;

    //make first call
    makeCall(makeUrlString(urlBase, queryObj), function (err, response) {
        if (err) {
            console.log(chalk.red(err));
            cb(err, null);
            return;
        }
        //save the first one
        firstVal = JSON.parse(response.body);
        //parse the link data    
        var linkObj = getLinksObj(response.headers.link);

        //check if there is a last
        if (typeof linkObj.last !== 'undefined' && linkObj.last.page !== 0) {
            getTheRest(firstVal, urlBase, queryObj, linkObj, cb);
        } else if (typeof linkObj.next !== 'undefined' && linkObj.next.page !== 0) {
            getOneByOne();
        } else {
            //only had one page?
            console.log(chalk.red('Did "' + urlBase + '" really only have one page?'));
            cb(null, arrayOut);
        }

    });






    //if not has last, get next from link obj and call self when done?

}

module.exports = getAllPages;
