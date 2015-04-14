var express = require("express");
var request = require('request');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require("path");
var util = require('util');

//Set Cloud Foundry app's clientID
var CF_CLIENT_ID = 'newapp';

//Set Cloud Foundry app's clientSecret
var CF_CLIENT_SECRET = 'password';

// Note: You should have a app.get(..) for this callback to receive callback from Cloud Foundry
// For example: If your callback url is: https://myKoolapp.cloudfoundry.com/auth/cloudfoundry/callback
// then, you should have a HTTP GET endpoint like: app.get('/auth/cloudfoundry/callback', callback))
//
var CF_CALLBACK_URL = '/auth/cloudfoundry/callback';

var CF_ROUTE_URL = '/auth/cloudfoundry';

var CF_LOGIN_URL = '/login';

var CF_AUTHORIZATION_URL = 'http://localhost:8080/uaa/oauth/authorize';

var CF_TOKEN_URL = 'http://localhost:8080/uaa/oauth/token';

var CF_LOGOUT_URL = 'http://localhost:8080/uaa/logout.do?redirect=';

var port = (process.env.VCAP_APP_PORT || 9000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var homeURL = JSON.parse(process.env.VCAP_APPLICATION || '{"uris":["' + 'http://' + host + ':' + port + '"]}').uris[0];
var loginURL = homeURL + CF_LOGIN_URL;



var CloudFoundryStrategy = require("./passport-pivotalcf").Strategy;

// Use the CloudFoundryStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and CloudFoundry
//   profile), and invoke a callback with a user object.
var cfStrategy = new CloudFoundryStrategy({
    authorizationURL : CF_AUTHORIZATION_URL,
    tokenURL : CF_TOKEN_URL,
    logoutURL : CF_LOGOUT_URL,
    clientID: CF_CLIENT_ID,
    clientSecret: CF_CLIENT_SECRET,
    callbackURL: CF_CALLBACK_URL,
    grant_type: 'authorization_code',
    skipUserProfile: false
}, function(accessToken, refreshToken, profile, done) {


    // asynchronous verification, for effect...
    process.nextTick(function() {

        // To keep the example simple, the user's CloudFoundry profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the CloudFoundry account with a user record in your database,
        // and return that user instead.
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      return done(null, profile);
    });
});

var passport = require('passport');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete CloudFoundry profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use("pivotalcf", cfStrategy);


var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};


// Config
app.use(allowCrossDomain);
var application_root = __dirname;
app.use(express.static(path.join(application_root, "../client")));
app.use(bodyParser());
app.use(cookieParser());
var sessionStore  = new expressSession.MemoryStore;
app.use(expressSession({ secret: 'somesecretmagicword', store: sessionStore}));
app.use(passport.initialize());
app.use(passport.session());



var ensureAuthenticated = function(req, res, next) {
console.log(util.inspect(req.session, false, null));
console.log(util.inspect(req.originalUrl, false, null));
  if(!req.isAuthenticated()) {
              req.session.originalUrl = req.originalUrl;
    res.redirect(CF_LOGIN_URL);
  } else {
    return next();
  }
};

// GET /auth/cloudfoundry
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in CloudFoundry authentication will involve
//   redirecting the user to angellist.co.  After authorization, CloudFoundry
//   will redirect the user back to this application at /auth/angellist/callback
app.get(CF_ROUTE_URL, passport.authenticate('pivotalcf'), function(req, res) {
    // The request will be redirected to CloudFoundry for authentication, so this
    // function will not be called.
});


// GET /auth/angellist/callback
//   PS: This MUST match what you gave as 'callback_url' earlier
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(CF_CALLBACK_URL, passport.authenticate('pivotalcf', {
    successRedirect: '/api',
    failureRedirect: CF_LOGIN_URL
}), function(req, res) {
  console.log("callback");
    res.redirect('/api');
});

app.get('/login', function(req, res) {
    // req.session.destroy();
    // req.logout();
    // cfStrategy.reset(); //reset auth tokens

    // console.log(req.session);

    res.send('<html><body><a href="/auth/cloudfoundry">Sign in with Pivotal CF</a></body></html>');

});

app.get('/logout', function(req, res) {
    
    
    req.session.destroy(function (err) {
      if (err) throw new Exception('Failed to logout ', err);

      req.logout();
      cfStrategy.reset();
      res.redirect(CF_LOGOUT_URL + loginURL); 
    });

    
});

app.get('/api', ensureAuthenticated, function(req, res) {
   res.send('<html><body><a href="/logout">' + req.session.passport.user.given_name + ' Log Out</a></body></html>');

});


app.get('/getGnaviPrefs', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/PrefSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviAreas', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/AreaSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviCats', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviRestByArea', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&area=" + req.query.area + "&hit_per_page=1&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviRestByCat', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&category_l=" + req.query.category_l + "&hit_per_page=1&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviRestByAreaCat', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&category_l=" + req.query.category_l + "&area=" + req.query.area + "&hit_per_page=1&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});


var server = app.listen(port, host, function() {
  console.log('Express server listening on ' + server.address().port);
});
