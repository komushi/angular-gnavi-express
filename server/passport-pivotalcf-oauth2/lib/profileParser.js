/**
 * Parse Cloud Foundry UAA Profile
 */
exports.parseAccessToken = function(accessToken) {
  console.log("parseAccessToken");

  var b64Token = (accessToken.split("."))[1]; 

  var buf = new Buffer(b64Token, 'base64'); // Ta-da
  var json = buf.toString();

  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};

  profile.user_id = json.user_id;
  profile.user_name = json.user_name;
  profile.given_name = json.given_name;
  profile.family_name = json.family_name;
  profile.email = json.email;
  profile.scope = json.scope;
  profile.client_id = json.client_id;
  profile.zid = json.zid;

    
  return profile;
};

exports.parseProfile = function(json) {
  console.log("parseProfile");
  
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  var profile = {};

  profile.user_id = json.user_id;
  profile.user_name = json.user_name;
  profile.given_name = json.given_name;
  profile.family_name = json.family_name;
  profile.email = json.email;
  profile.scope = json.scope;
  profile.client_id = json.client_id;
  profile.zid = json.zid;
    
  return profile;
};
