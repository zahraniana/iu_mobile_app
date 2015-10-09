'use strict';
app
 .factory('phonegapReady', function ($rootScope, $q) {
     var loadingDeferred = $q.defer();

     document.addEventListener('deviceready', function () {
         $rootScope.$apply(loadingDeferred.resolve);
     });

     return function phonegapReady() {
         return loadingDeferred.promise;
     };
 });