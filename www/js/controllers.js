angular.module('starter.controllers', [])

.controller('TabsCtrl', function ($scope, $ionicSideMenuDelegate) {

    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }

})

    .controller('Student_TabsCtrl', function ($scope, $ionicSideMenuDelegate) {

        $scope.openMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        }

    })

.controller('HomeTabCtrl', function ($scope, $ionicSideMenuDelegate) {

})
.controller('Student_HomeTabCtrl', function ($scope, $ionicSideMenuDelegate) {

})

.controller('AboutCtrl', function ($scope, $ionicSideMenuDelegate) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }
})

.controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate, localStorageService) {

    $scope.startApp = function () {
        localStorageService.set('skip', true);
        $state.go('tabs.home');
    };
    $scope.next = function () {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
        $ionicSlideBoxDelegate.previous();
    };

    $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
    };
});
