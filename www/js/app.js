// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngAnimate','toastr'])


    /*.factory('$cordovaDatePicker', ['$window', '$q', function ($window, $q) {

        return {
            show: function (options) {
                var q = $q.defer();
                options = options || {date: new Date(), mode: 'date'};
                $window.datePicker.show(options, function (date) {
                    q.resolve(date);
                }, function (error){
                    q.reject(error);
                });
                return q.promise;
            }
        };
    }])
*/

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

/*template*/
      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          /*controller: 'AppCtrl'*/
      })

/*login*/
      .state('login',  {
        url:'/login',
        controller:'loginController',
        templateUrl:'templates/login.html'
      })
      /*template url..*/
      .state('menu',{
          url:'/menu',
          controller:'menuController',
          templateUrl:'templates/menu.html'
      })

      .state('app.dashboard',{
        url: '/dashboard',
          views: {
              'menuContent': {
                  //templateUrl: 'templates/search.html'
                  controller:'dashboardController',
                  templateUrl: 'templates/dashboard.html'
              }
          }
      })

      .state('app.notifications',{
          url: '/notifications',
            views:{
                'menuContent':{
                    controller:'notificationsController',
                    templateUrl:'templates/notifications.html'
                }
            }
      })

      .state('app.sales',{
          url: '/sales',
            views:{
                'menuContent':{
                    controller:'salesController',
                    templateUrl:'templates/sales.html'
                }
            }
      });




//template.
   /* .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })*/
/*
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  });*/
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
