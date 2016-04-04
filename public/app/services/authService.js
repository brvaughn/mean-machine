angular.module('authService', [])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', ['$http', '$q', 'AuthToken', function($http, $q, AuthToken) {

  // create auth factory object
  var authFactory = {};

  // login
  authFactory.login = function(username, password) {
      // return the promise object and its data
      return $http.post('/api/authenticate', {
        username : username,
        password : password
      })
        .success(function(data) {
          AuthToken.setToken(data.token);
          return data;
        });
  };

  // logout
  authFactory.logout = function() {
    // clear the token
    AuthToken.setToken();
  };

  // check if a user is logged in
  // check if there is a local token
  authFactory.isLoggedIn = function() {
    if (AuthToken.getToken())
      return true;
    else
      return false;
  };

  // get the user info
  authFactory.getUser = function() {

    if (AuthToken.getToken())
      return $http.get('/api/me', { cache : true });
    else
      return $q.reject({ message : 'User has no token' });
  };

  // return auth factory object
  return authFactory;

}])

// ===================================================
// factory for handling tokens
// inject $window
// ===================================================
.factory('AuthToken', ['$window', function($window) {

  var authTokenFactory = {};

  // get the token out of local storage
  authTokenFactory.getToken = function() {
    return $window.localStorage.getItem('token');
  };

  // set the token or clear the token
  // if a token is passed, set the token
  // if there is no token, clear it from local storage
  authTokenFactory.setToken = function(token) {
    if (token)
      $window.localStorage.setItem('token', token);
    else
      $window.localStorage.removeItem('token');
  };

  return authTokenFactory;

}])

// ===================================================
// application configuration to integrate token into requests
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function($q, $location, AuthToken) {

  var interceptorFactory = {};

  // attach the token to every request
  interceptorFactory.request = function(config) {
    // grab the token
    var token = AuthToken.getToken();

    // if the token exists, add it to the header as x-access-token
    if (token)
      config.headers['x-access-token'] = token;

    return config;
  };

  // redirect if a token does not authenticate; happens on response errors
  interceptorFactory.responseError = function(response) {
    // if a 403 is returned
    if (response.status = 403) {
      AuthToken.setToken();
      $location.path('/login');
    }

    // return the errors from the server as a promise
    return $q.reject(response);
  };

  return interceptorFactory;

}]);