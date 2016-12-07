"use strict";

var WebSocket = require('ws');
var botnana = {};

// botnana.ws = new WebSocket('ws://192.168.7.2:3012');
botnana.ws = new WebSocket('ws://localhost:3012');

botnana.ws.on('open', function open() {
    botnana.is_connected = true;
});

botnana.ws.on('message', function(data, flags) {
    console.log(data);
});

botnana.version = {
    info: function() {
        var json = {
            spec_version: "0.0.1",
            target: "version",
            command: "info"
        };
        botnana.ws.send(JSON.stringify(json));
    }
}

botnana.motion = {
    evaluate: function(script) {
        var json = {
            spec_version: "0.0.1",
            target: "motion",
            command: "evaluate",
            arguments: {
                script: script
            }
        };
        botnana.ws.send(JSON.stringify(json));
    }
}

botnana.config = {
    save: function() {
        var json = {
            spec_version: "0.0.1",
            target: "config",
            command: "save"
        };
        botnana.ws.send(JSON.stringify(json));
    },
    set_slave: function(args) {
        var json = {
            spec_version: "0.0.1",
            target: "config",
            command: "set_slave",
            arguments: args
        };
        botnana.ws.send(JSON.stringify(json));
    }
}

module.exports = botnana;