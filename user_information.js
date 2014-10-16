/**
 * Facebook client
 * @constructor
 */
var FacebookClient = function() {
};

/**
 * Check if authorized. false by default
 * @return {bool} authorized state.
 */
FacebookClient.prototype.isAuthorized = function() {
    var self = this;
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            self.authorized = true;
            callback.call(self);
        }
    });
    return self.authorized;
};

/**
 * Load user information
 * @param {function({firstName: string, lastName: string, imageUrl: string})} callback Load user 
 *   info callback. Called after user information has been loaded.
 */
FacebookClient.prototype.loadUserInfo = function(callback) {
    if (callback) {
        this.callback = callback;
    }

    if (!this.isAuthorized()) {
        alert('User should be logged in!');
    }

    var self = this;

    FB.api("/me", function (response) {
        if (response && !response.error) {
            var userInfo = {
                firstName: response.first_name, 
                lastName: response.last_name,
                imageUrl: 'http://graph.facebook.com/'+response.id+'/picture?type=normal'
            };
            if (self.callback) {
                self.callback(userInfo);
            }
        }
    });
};

/**
 * LinkedIn client
 * @constructor
 */
var LinkedInClient = function() {
};

/**
 * Check if authorized.
 * @return {bool} authorized state.
 */
LinkedInClient.prototype.isAuthorized = function() {
    return IN.User.isAuthorized();
};

/**
 * Load user information
 * @param {function({firstName: string, lastName: string, imageUrl: string})} callback Load user 
 *   info callback. Called after user information has been loaded.
 */
LinkedInClient.prototype.loadUserInfo = function(callback) {
    if (callback) {
        this.callback = callback;
    }

    if (!this.isAuthorized()) {
        alert('User should be logged in!');
    }

    var self = this;

    IN.API.Profile("me")
    .fields("firstName", "lastName", "pictureUrl")
    .result(function(response) {
        var userInfo = {
            firstName: response.values[0].firstName,
            lastName: response.values[0].lastName,
            imageUrl: response.values[0].pictureUrl
        };
        if (self.callback) {
            self.callback(userInfo);
        }
    });
};

function showUserInfo(userInfo) {
    $('<p>First Name: '+userInfo.firstName+'</p>'+
      '<p>Last name: '+userInfo.lastName+'</p>'+
      '<img src='+userInfo.imageUrl+' alt="Profile Image"</img>'
     ).appendTo('.user_info')
};

function init() {
    // Facebook
    var fbClient = new FacebookClient();
    $('#facebook_button').on('click', function() {
        fbClient.loadUserInfo(showUserInfo);
    });

    // LinkedIn
    var linkedInClient = new LinkedInClient();
    $('#linkedin_button').on('click', function() {
        linkedInClient.loadUserInfo(showUserInfo);
    });
};
