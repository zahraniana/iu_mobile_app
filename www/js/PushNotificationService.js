'use strict';
app.factory('pushNotification', ['phonegapReady', 'localStorageService', '$cordovaToast', '$http', function (phonegapReady, localStorageService, $cordovaToast, $http) {
    return {
        registerPush: function (fn) {
            phonegapReady().then(function () {
                var pushNotification = window.plugins.pushNotification,
                    successHandler = function (result) {
                        console.log('result = ' + result);
                    },
                    errorHandler = function (error) {
                        console.log('error = ' + error);
                    },
                    tokenHandler = function (result) {
                        return fn({
                            'type': 'registration',
                            'id': result,
                            'device': 'ios'
                        });
                    };
                if (device.platform == 'android' || device.platform == 'Android') {
                    pushNotification.register(successHandler, errorHandler, {
                        'senderID': '26338089179',
                        'ecb': 'onNotificationGCM'
                    });
                } else {
                    pushNotification.register(
                        tokenHandler,
                        errorHandler,
                        {
                            "badge": "true",
                            "sound": "true",
                            "alert": "true",
                            "ecb": "onNotificationAPN"
                        });
                }
            });
        },
        processNotification: function (payload) {
            var savedpush = localStorageService.get('pushlist');
            var pushdata = (localStorageService.get('pushlist') !== null) ? savedpush : [];
            pushdata.push({
                message: payload,
                date: new Date()
            });
            localStorageService.add('pushlist', angular.toJson(pushdata));
        },
        unregister: function () {
            //unregister the device id
            console.info('unregister')
            var push = window.plugins.pushNotification;
            if (push) {
                push.unregister(function () {
                    console.info('unregister success')
                });
            }
        },

        storeToken: function (type , token) {
            var user = { UserName: Math.floor((Math.random() * 10000000) + 1), DeviceToken: token, DevicePlatform: type };
            console.log("Post token for registered device with data " + JSON.stringify(user));

            $http.post('http://development.iu.edu.sa:8091/api/Device', JSON.stringify(user))
                .success(function (data, status) {
                    $cordovaToast.showShortCenter('Token stored, device is successfully subscribed to receive push notifications.');
                    console.log("Token stored, device is successfully subscribed to receive push notifications.");

                })
                .error(function (data, status) {
                    $cordovaToast.showShortCenter("Error storing device token." + data + " " + status);
                    console.log("Error storing device token." + data + " " + status)

                }
            );
        }
    };
}]);


function onNotificationAPN(e) {
    if (e.alert) {
        console.log('push-notification: ' + e.alert);
        navigator.notification.alert(e.alert);
    }

    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(event) {
    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var pushService = injector.get('pushNotification');

    switch (event.event) {
        case 'registered':
            if (event.regid.length > 0) {
                console.log('REGISTERED -> REGID:' + event.regid);
                // pushService.storeDeviceId(event.regid);
                //navigator.notification.alert('REGISTERED -> REGID:' + event.regid);

                // store device token 
                pushService.storeToken('android', event.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (event.foreground) {
                console.log('INLINE NOTIFICATION');
                var my_media = new Media("/android_asset/www/" + event.soundname);
                my_media.play();
            } else {
                if (event.coldstart) {
                    console.log('COLDSTART NOTIFICATION');
                } else {
                    console.log('BACKGROUND NOTIFICATION');
                }
            }

            // Example for vibration, beep and alert
            navigator.notification.vibrate(1000);
            // navigator.notification.beep(1);
            navigator.notification.alert(event.payload.message);

            pushService.processNotification(event.payload.message);

            //  console.log('MESSAGE -> MSG: ' + event.payload.message);
            //Only works for GCM
            //   console.log('MESSAGE -> MSGCNT: ' + event.payload.msgcnt);
            //Only works on Amazon Fire OS
            //  console.log('MESSAGE -> TIME: ' + event.payload.timeStamp);
            break;

        case 'error':
            console.log('ERROR -> MSG:' + event.msg);
            break;

        default:
            console.log('EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}