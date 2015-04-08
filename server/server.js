var application_root = __dirname;
var express = require("express");
var request = require('request');
var session = require('express-session');
var path = require("path");
var app = express();

var passport = require('passport');
var CloudFoundryStrategy = require("./passport-pivotalcf").Strategy;

//Set Cloud Foundry app's clientID
var CF_CLIENT_ID = 'my_web_app';

//Set Cloud Foundry app's clientSecret
var CF_CLIENT_SECRET = 'password';

// Note: You should have a app.get(..) for this callback to receive callback from Cloud Foundry
// For example: If your callback url is: https://myKoolapp.cloudfoundry.com/auth/cloudfoundry/callback
// then, you should have a HTTP GET endpoint like: app.get('/auth/cloudfoundry/callback', callback))
//
var CF_CALLBACK_URL = '/auth/cloudfoundry/callback';

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





// Use the CloudFoundryStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and CloudFoundry
//   profile), and invoke a callback with a user object.
var cfStrategy = new CloudFoundryStrategy({
    authorizationURL : 'http://localhost:8080/uaa/oauth/authorize',
    tokenURL : 'http://localhost:8080/uaa/oauth/token',
    clientID: CF_CLIENT_ID,
    clientSecret: CF_CLIENT_SECRET,
    callbackURL: CF_CALLBACK_URL,
    grant_type: 'authorization_code'
}, function(accessToken, refreshToken, profile, done) {

    console.log("abc");

    // asynchronous verification, for effect...
    process.nextTick(function() {

        // To keep the example simple, the user's CloudFoundry profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the CloudFoundry account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
    });
});

passport.use("pivotalcf", cfStrategy);

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

function ensureAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) {
              req.session.originalUrl = req.originalUrl;
    res.redirect('/login');
  } else {
    return next();
  }
}

// Config
app.use(allowCrossDomain);
app.use(express.static(path.join(application_root, "../client")));

app.use(session({ secret: 'keyboard cat',
          resave: false,
          saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());


// GET /auth/cloudfoundry
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in CloudFoundry authentication will involve
//   redirecting the user to angellist.co.  After authorization, CloudFoundry
//   will redirect the user back to this application at /auth/angellist/callback
app.get('/auth/cloudfoundry', passport.authenticate('pivotalcf'), function(req, res) {
    // The request will be redirected to CloudFoundry for authentication, so this
    // function will not be called.
});


// GET /auth/angellist/callback
//   PS: This MUST match what you gave as 'callback_url' earlier
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/cloudfoundry/callback', passport.authenticate('pivotalcf', {
    successRedirect: '/api',
    failureRedirect: '/login'
}), function(req, res) {
  console.log("callback");
    res.redirect('/api');
});

app.get('/login', function(req, res) {
    req.session.destroy();
    req.logout();
    cfStrategy.reset(); //reset auth tokens

    res.send('<html><body><a href="/auth/cloudfoundry">Sign in with Pivotal CF</a></body></html>');

    // res.render('login', {
    //     user: req.user
    // });
});

app.get('/logout', function(req, res) {
    res.redirect('/login');
});

app.get('/api', ensureAuthenticated, function(req, res) {
   res.send(req.session);
   // res.send('REST API is running');
   console.log("Hello World");

});

// app.get('/api', function (req, res) {
//    res.send('REST API is running');
//    console.log("Hello World");
// });


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


var server = app.listen((process.env.PORT || 9000), function() {
  console.log('Express server listening on port ' + server.address().port);
});
