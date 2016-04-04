angular.module('userCtrl', ['userService'])

.controller('userController', ['User', function(User) {

  var vm = this;

  // set a flag for display of the spinner
  vm.processing = true;

  // grab all the users at page load
  User.all()
    .success(function(data)) {

      // when the data comes back, remove the processing variable
      vm.processing = false;

      // bind the data that comes back to the VM
      vm.users = data;
    }

}]);
