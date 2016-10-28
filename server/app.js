// initialize the express application
var express = require("express"),
    app = express();

// initialize the Fitbit API client
var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("227WML", "b0d84b98ae16aa25fb99f4afe2dd9548");

// redirect the user to the Fitbit authorization page
app.get("/authorize", function (req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity', 'http://localhost:3000/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://localhost:3000/callback').then(function (result) {
        // use the access token to fetch the user's profile information
        client.get("/activities/steps/date/today/1m.json", result.access_token).then(function (results) {
            res.send(results[0]);
            var fs = require('fs');
            fs.writeFile("test.json", JSON.stringify(results[0]), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("saved!");
            });
        });
    }).catch(function (error) {
        res.send(error);
    });
});

// launch the server
app.listen(3000);