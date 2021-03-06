angular.module('userCtrl', ['userService'])

.controller('userController', ['User', function(User) {

  var vm = this;

  // set a flag for display of the spinner
  vm.processing = true;

  // grab all the users at page load
  User.all()
    .success(function(data) {

      // when the data comes back, remove the processing variable
      vm.processing = false;

      // bind the data that comes back to the VM
      vm.users = data;
    });

  // We may need to delete someone
  vm.deleteUser = function(id) {
    vm.processing = true;

    //accepts the user id as a parameter
    User.delete(id)
      .success(function(data) {

        // get all users to update the table
        // Maybe add a return of the full Users list as a response from the delete call
        User.all()
          .success(function(data) {
            vm.processing = false;
            vm.users = data;
          });
      });
  };

}])

// controller for creating a user
.controller('userCreateController', ['User', function(User) {
  var vm = this;

  // variable to hide/show elements of the view
  // used to differentiate between create and edit views
  vm.type = 'create';

  // function to create a user
  vm.saveUser = function() {
    vm.processing = true;

    // clear the messages
    vm.message = '';

    // use the create function in the userService
    User.create(vm.userData)
      .success(function(data) {
        vm.processing = false;

        // clear the form
        vm.userData = {};
        vm.message = data.message;
      });
  };
}])

// controller applied to user edit page
.controller('userEditController', ['$routeParams', 'User', function($routeParams, User) {

  var vm = this;

  vm.type = 'edit';

  // get the user data for the user to edit
  // $routeParams contains the information in the URL
  User.get($routeParams.user_id)
    .success(function(data) {
      vm.userData = data;
    });

  // function to save the user
  vm.saveUser = function() {
    vm.processing = true;
    vm.message = '';

    // call the userServuce function to update
    User.update($routeParams.user_id, vm.userData)
      .success(function(data) {
        vm.processing = false;

        // clear the form out
        vm.userData = {};

        // bind the message from our API to the message
        vm.message = data.message;
      });
  };


}]);
