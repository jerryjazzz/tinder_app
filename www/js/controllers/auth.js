// task 3
'use strict';　

app.controller('AuthCtrl', function(Auth, $state) {

  var auth = this; // ? thisとは何か

  auth.login = function() {
    console.log('Login cliked');

    return Auth.login().then(function(user) {
      $state.go('app.home');
    });

  };

  auth.logout = function() {
    Auth.logout();
  };
});
