/**
 * Module dependencies.
 */
// Licensed under the Apache License. See footer for details.
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy, 
    InternalOAuthError = require('passport-oauth').InternalOAuthError,
    url = require('url'),
    util = require('util');

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
    //options.scope = options.scope || ['profile'];

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

    //Set default userProfileURI (this is /info endpoint for cloudfoundry.COM)
    this._userProfileURI = options.profileURL;

    this._logoutURL = options.logoutURL;
    
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Cloud Foundry.
 *
 * This function calls /info endpoint of Cloud Foundry and returns the result
 * as 'profile'
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get(this._userProfileURI, accessToken, function (err, body, res) {
        if (err) {
            return done(err);
        }

        try {
            done(null, JSON.parse(body));
        } catch (e) {
            done(e);
        }
    });
};

Strategy.prototype.reset = function () {
    

    console.log(util.inspect(this._origCustomHeader, false, null));
    console.log(util.inspect(this._oauth2._customHeaders, false, null));

    this._oauth2._customHeaders = {};
    this._oauth2._customHeaders['Authorization'] = this._origCustomHeader['Authorization'];
    

};

Strategy.prototype.setUserProfileURI = function (userProfileURI) {
    this._userProfileURI = userProfileURI;
};



/**
 * Override authorizationParams function. In our case, we will check if this._stateParamCallback is
 * set. If so, we'll call that callback function to set {'state' : 'randomStateVal'}
 *
 * @param  {Object} options Hash of options
 * @return {Object}         {} or {'state' : 'randomStateValFrom__stateParamCallback'}
 */
Strategy.prototype.authorizationParams = function(options) {
    if(this._stateParamCallback) {
        return {'state': this._stateParamCallback()};
    }
  return {};
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;