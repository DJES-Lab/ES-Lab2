/**
 * Created by derek on 2015/4/11.
 */
/**
 * Created by derek on 2015/3/31.
 */
var nohm = require('nohm').Nohm;

module.exports = nohm.model('Data', {
    idGenerator: 'increment',
    properties: {
        accelerometerData: {
            type: 'json',
            defaultValue: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        ambientData: {
            type: 'json',
            defaultValue: {
                soundLevel: 0,
                illuminance: 0
            }
        },
        gpsData: {
            type: 'json',
            defaultValue: {
                lat: 0,
                lng: 0
            }
        },
        creationTime: {
            type: 'string',
            defaultValue: new Date().toString()
        },
        lastEditTime: {
            type: 'string',
            defaultValue: ''
        }
    },
    methods: {
        fill: function (data, fields, fieldCheck) {
            var props = {},
                self = this,
                doFieldCheck = typeof(fieldCheck) === 'function';

            fields = Array.isArray(fields) ? fields : Object.keys(data);

            fields.forEach(function (i) {
                var fieldCheckResult;

                if (doFieldCheck)
                    fieldCheckResult = fieldCheck(i, data[i]);

                if (doFieldCheck && fieldCheckResult === false)
                    return;
                else if (doFieldCheck && typeof (fieldCheckResult) !== 'undefined' &&
                    fieldCheckResult !== true)
                    return (props[i] = fieldCheckResult);


                props[i] = data[i];
            });

            this.p(props);
            return props;
        },
        store: function (data, callback) {
            var self = this;

            this.fill(data);
            this.save(function () {
                callback.apply(self, Array.prototype.slice.call(arguments, 0));
            });
        },
        allProperties: function (stringify) {
            var props = this._super_allProperties.call(this);
            return stringify ? JSON.stringify(props) : props;
        }
    }
});