
angular.module('userService', [])

.factory('User', ['$http', function($http) {

  var apiPath = '/api/users/';

  // create a new object
  var userFactory = {};

  // get a single user
  userFactory.get = function(id) {
    return $http.get(apiPath + id);
  };

  // get all users
  userFactory.all = function() {
    return $http.get(apiPath);
  };

  // create a user
  userFactory.create = function(userData) {
    return $http.post(apiPath, userData);
  };

  // update a user
  userFactory.update = function(id, userData) {
    return $http.put(apiPath + id, userData);
  };

  // delete a user
  userFactory.delete = function(id) {
    return $http.delete(apiPath + id);
  };

  // return the entire object
  return userFactory;

}]);
