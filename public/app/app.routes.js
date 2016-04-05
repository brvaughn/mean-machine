angular.module('app.routes', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider
    //home page route
    .when('/', {
      templateUrl : 'app/views/pages/home.html'
    })

    // route for the login page
    .when('/login', {
      templateUrl : 'app/views/pages/login.html',
      controller : 'mainController',
      controllerAs : 'login'
    })

    // route for all users page
    .when('/users', {
      templateUrl : 'app/views/pages/users/all.html',
      controller : 'userController',
      controllerAs : 'user'
    })

    // form to create a new user
    // same view as the edit page
    .when('/users/create', {
      templateUrl : 'app/views/pages/users/single.html',
      controller : 'userCreateController',
      controllerAs : 'user'
    })

    // for for editing a user's information
    .when('/users/:user_id', {
      templateUrl : 'app/views/pages/users/single.html',
      controller : 'userEditController',
      controllerAs : 'user'
    });


  // get rid of the hash in the URL
  $locationProvider.html5Mode(true);

}]);
