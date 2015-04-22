
module.exports = (function () {
    "use strict";
    var shake = {};

    var watchId = null;

    var options = {
        frequency: 300
    };

    var previousAcceleration = {
        x: null,
        y: null,
        z: null
    };

    var shakeCallBack = null;
    var sensitivity = 30;

    // Start watching the accelerometer for a shake gesture
    shake.startWatch = function (onShake, _sensitivity, onError) {
        if (onShake) {
            shakeCallBack = onShake;
        }
        if (typeof (_sensitivity) === "number") {
            sensitivity = _sensitivity;
        }

        watchId = navigator.accelerometer.watchAcceleration(assessCurrentAcceleration, onError, options);
    };

    // Stop watching the accelerometer for a shake gesture
    shake.stopWatch = function () {
        if (watchId !== null) {
            navigator.accelerometer.clearWatch(watchId);
            watchId = null;

            previousAcceleration = {
                x: null,
                y: null,
                z: null
            };
        }
    };

    // Assess the current acceleration parameters to determine a shake
    var assessCurrentAcceleration = function (acceleration) {
        var accelerationChange = {};
        if (previousAcceleration.x !== null) {
            accelerationChange.x = Math.abs(previousAcceleration.x - acceleration.x);
            accelerationChange.y = Math.abs(previousAcceleration.y - acceleration.y);
            accelerationChange.z = Math.abs(previousAcceleration.z - acceleration.z);
        }

        previousAcceleration = {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z
        };

        if (accelerationChange.x + accelerationChange.y + accelerationChange.z > sensitivity) {
            // Shake detected
            if (typeof shakeCallBack === "function") {
                shakeCallBack();
            }
        }

    };

    return shake;
})();
