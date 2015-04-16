/**
 * IBM Bluemix passport strategy
 */

var util = require('util')
, uri = require('url')
, Profile = require('./profile')
, OAuth2Strategy = require('passport-oauth2')
, InternalOAuthError = require('passport-oauth2').InternalOAuthError;

var PROVIDER = 'pivotalcf',
    SSO_LOGOUT_URL = 'http://localhost:8080/uaa/logout.do',
    SSO_AUTHORIZATION_URL = 'http://localhost:8080/uaa/oauth/authorize',
    SSO_TOKEN_URL = 'http://localhost:8080/uaa/oauth/token',
    SSO_PROFILE_URL = 'http://localhost:8080/uaa/userinfo';

function Strategy(options, verify) {
	options = options || {};
    options.authorizationURL = options.authorizationURL || SSO_AUTHORIZATION_URL;
    options.tokenURL = options.tokenURL || SSO_TOKEN_URL;
    options.profileURL = options.profileURL || SSO_PROFILE_URL;
    options.logoutURL = options.logoutURL || SSO_LOGOUT_URL;

    //Send clientID & clientSecret in 'Authorization' header
    var auth = 'Basic ' + new Buffer(options.clientID + ':' + options.clientSecret).toString('base64');
    options.customHeaders = {
        'Authorization':auth
    };

    //Store auth in a different variable so we can reset it back.
    this._origCustomHeader = {
        'Authorization':auth
    };

    OAuth2Strategy.call(this, options, verify);

	this.name = PROVIDER;

    //Set AuthMethod as 'Bearer' (used w/ accessToken to perform actual resource actions)
    this._oauth2.setAuthMethod('Bearer');

    this._oauth2.useAuthorizationHeaderforGET(true);

	this._userProfileURI = options.profileURL ;
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Cloud Foundry.
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	var url = uri.parse(this._userProfileURI);
	url = uri.format(url);
	
	 this._oauth2.get(url, accessToken, function (err, body, res) {
	    var json;
	    
	    if (err) {
	      if (err.data) {
	        try {
	          json = JSON.parse(err.data);
	        } catch (_) {}
	      }
	      
	      if (json && json.error && typeof json.error == 'object') {
	        return done(json, err);
	      }
	      return done(new InternalOAuthError('Failed to fetch user profile', err));
	    }
	    
	    try {
	      json = JSON.parse(body);
	    } catch (ex) {
	      return done(new Error('Failed to parse user profile'));
	    }
	    var profile = {};
	    profile = json;
	    profile._raw = body;

	    done(null, profile);
	  });    
};



/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
