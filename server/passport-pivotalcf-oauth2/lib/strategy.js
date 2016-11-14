/**
 * Pivotal CF passport strategy
 */

var util = require('util')
, uri = require('url')
, profileParser = require('./profileParser')
, OAuth2Strategy = require('passport-oauth2')
, InternalOAuthError = require('passport-oauth2').InternalOAuthError;

var strategyOptions = {},
	PROVIDER = 'pivotalcf',
    SSO_LOGOUT_URL = 'http://localhost:8080/uaa/logout.do',
    SSO_AUTHORIZATION_URL = 'http://localhost:8080/uaa/oauth/authorize',
    SSO_TOKEN_URL = 'http://localhost:8080/uaa/oauth/token',
    SSO_PROFILE_URL = 'http://localhost:8080/uaa/userinfo';
    SSO_SCOPE = ['openid'];
    SSO_SKIP_USER_PROFILE = false;
    SSO_GRANT_TYPE = 'authorization_code';

function Strategy(options, verify) {
	strategyOptions = options || {};

    strategyOptions.authorizationURL = options.authorizationURL || SSO_AUTHORIZATION_URL;
    strategyOptions.tokenURL = options.tokenURL || SSO_TOKEN_URL;
    strategyOptions.logoutURL = options.logoutURL || SSO_LOGOUT_URL;
    strategyOptions.profileURL = options.profileURL || SSO_PROFILE_URL;
    strategyOptions.callbackURL = options.callbackURL;
    strategyOptions.clientID = options.clientID;
    strategyOptions.clientSecret = options.clientSecret;
    strategyOptions.passReqToCallback = options.passReqToCallback;
    strategyOptions.scope = options.scope || SSO_SCOPE;
    strategyOptions.grant_type = SSO_GRANT_TYPE;
    strategyOptions.skipUserProfile = SSO_SKIP_USER_PROFILE;

    //Send clientID & clientSecret in 'Authorization' header
    var auth = 'Basic ' + new Buffer(strategyOptions.clientID + ':' + strategyOptions.clientSecret).toString('base64');
    strategyOptions.customHeaders = {
        'Authorization':auth
    };

    //Store auth in a different variable so we can reset it back.
    this._origCustomHeader = {
        'Authorization':auth
    };

    OAuth2Strategy.call(this, strategyOptions, verify);

	this.name = PROVIDER;

    //Set AuthMethod as 'Bearer' (used w/ accessToken to perform actual resource actions)
    this._oauth2.setAuthMethod('Bearer');

    this._oauth2.useAuthorizationHeaderforGET(true);

	this._userProfileURI = strategyOptions.profileURL ;
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

// console.log("userProfile accessToken:");
// console.log(util.inspect(accessToken, false, null));

// console.log("userProfile strategyOptions:");
// console.log(util.inspect(strategyOptions, false, null));

	if (strategyOptions.scope.indexOf("openid") >= 0)
	{
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
			profile = profileParser.parseProfile(json);

			done(null, profile);
		});    
	}
	else
	{
		var profile = {};
		profile = profileParser.parseAccessToken(accessToken);

		done(null, profile);
	}
};


Strategy.prototype.authorizationParams = function(options) {
    if(this._stateParamCallback) {
        return {'state': this._stateParamCallback()};
    }
	return {};
};

Strategy.prototype.setStateParamCallBack = function(callback) {
  this._stateParamCallback = callback;
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
