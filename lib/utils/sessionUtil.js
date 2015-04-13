/**
 * Created by derek on 2015/4/14.
 */
var _ = require('lodash');

var sessionTracker = {};

exports.trackSession = function(userID, sessionID, session) {
    if (!sessionTracker[userID]) {
        sessionTracker[userID] = [];
    }
    sessionTracker[userID].push({
        sid: sessionID,
        session: session
    });
};

exports.untrackSession = function(userID, sessionID, session) {
    var sessionObj = {
        sid: sessionID,
        session: session
    };
    if (sessionTracker[userID]) {
        sessionTracker[userID] = _.without(sessionTracker[userID], sessionObj);
    }
};

exports.untrackAllSessions = function(userID) {
    if (sessionTracker[userID]) {
        sessionTracker[userID].forEach(function(sessionObj) {
            sessionObj.session.destroy();
        });
        delete sessionTracker[userID];
    }
};