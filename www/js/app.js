'use strict';
var app = angular.module('starter', ['ionic', 'ngCordova', 'LocalStorageModule', 'starter.controllers', 'starter.services']);
app.run(['$ionicPlatform', 'pushNotification', '$rootScope', 'localStorageService', '$location', '$timeout', function ($ionicPlatform, pushNotification
                , $rootScope, localStorageService, $location, $timeout) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        pushNotification.registerPush();

        var skipIntro;
        $rootScope.$on('$stateChangeStart',
          function (event, toState, toParams, fromState) {
              skipIntro = localStorageService.get('skip') === 'true' ? true : false;
             
              if (fromState.name === 'tabs.home' && toState.name === 'intro') {
                  if (skipIntro) {
                      navigator.app.exitApp();
                  }
              }
              if (fromState.name === 'intro' && toState.name === 'loading') {
                  navigator.app.exitApp();
              }
              if (fromState.name === 'tabs.home' && toState.name === 'loading') {
                  navigator.app.exitApp();
              }
              if (toState.name === 'intro') {
                  if (skipIntro) {
                      location.href = '#/tab/home';
                  }
              }
          });

        skipIntro = localStorageService.get('skip') === 'true' ? true : false;

        if ($location.$$url === '/loading') {
            $timeout(function () {
                if (skipIntro) {
                    location.href = '#/tab/home';
                } else {
                    location.href = '#/intro';
                }
            }, 2000);
        }


    });
}]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('loading', {
        url: '/loading',
        templateUrl: 'templates/loading.html'
    })

      .state('intro', {
          url: '/intro',
          templateUrl: 'templates/intro.html',
          controller: 'IntroCtrl'
      })
      .state('tabs', {
          url: '/tab',
          controller: 'TabsCtrl',
          templateUrl: 'templates/tabs.html'
      })
      .state('tabs.home', {
          url: '/home',
          views: {
              'home-tab': {
                  templateUrl: 'templates/home.html',
                  controller: 'HomeTabCtrl'
              }
          }
      })
      .state('tabs.settings', {
          url: '/settings',
          views: {
              'settings-tab': {
                  templateUrl: 'templates/settings.html'
              }
          }
      })
        .state('student_tabs', {
            url: '/student_tab',
            controller: 'Student_TabsCtrl',
            templateUrl: 'templates/student_tabs.html'
        })
      .state('student_tabs.home', {
          url: '/home',
          views: {
              'student_home-tab': {
                  templateUrl: 'templates/student_home.html',
                  controller: 'Student_HomeTabCtrl'
              }
          }
      })
      .state('student_tabs.settings', {
          url: '/settings',
          views: {
              'student_settings-tab': {
                  templateUrl: 'templates/student_settings.html'
              }
          }
      })
    .state('student_tabs.calender', {
        url: '/calender',
        views: {
            'student_calender-tab': {
                templateUrl: 'templates/student_calender.html'
            }
        }
    })
        .state('student_tabs.notification', {
            url: '/notification',
            views: {
                'student_notification-tab': {
                    templateUrl: 'templates/student_notification.html'
                }
            }
        })

      .state('about', {
          url: '/about',
          controller: 'AboutCtrl',
          templateUrl: 'templates/about.html'
      });

    $urlRouterProvider.otherwise('/loading');
});



