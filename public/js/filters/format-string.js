/**
 * Created by derek on 2015/4/24.
 */

angular.module('app')
    .filter('formatMethod', function() {
        return function(methodName) {
            if (typeof methodName == 'string')
                return methodName.replace(/anal([A-Z].+)([A-Z].+)/, '$1 $2');
            else
                return '';
        }
    })

    .filter('firstCharToUppercase', function() {
        return function(str) {
            if (typeof str == 'string')
                return str.charAt(0).toUpperCase() + str.slice(1);
            else
                return '';
        }
    });