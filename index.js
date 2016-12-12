"use strict";

var botnana = {
    sender: null,
    _: {}
};

// Event API
botnana.handlers = {}

botnana.on = function(tag, handler) {
    botnana.handlers[tag] = handler;
};

botnana.handle_response = function(resp) {
    let r = resp.split("|");
    if(r[0]==="slave") {
        let slave = botnana.ethercat.slave(parseInt(r[1]));
        for (var i=2; i<r.length; i=i+2) {
            if(slave.handlers[r[i]]) {
                slave.handlers[r[i]](r[i+1]);
            }
        }
    } else {
        for (var i=0; i< r.length; i=i+2) {
            if(botnana.handlers[r[i]]) {
                botnana.handlers[r[i]](r[i+1]);
            }
        }
    }
};

// Version API
botnana.version = {
    get: function() {
        var json = {
            jsonrpc: "2.0",
            method: "version.get",
        };
        botnana.sender.send(JSON.stringify(json));
    }
}

// Real-time script API
botnana.motion = {};

botnana.motion.evaluate = function(script) {
    var json = {
        jsonrpc: "2.0",
        method: "motion.evaluate",
        params: {
            script: script
        }
    };
    botnana.sender.send(JSON.stringify(json));
};

/// Hidden API
botnana._.get_slaves = function() {
    var json = {
        jsonrpc: "2.0",
        method: "_.get_slaves"
    };
    botnana.sender.send(JSON.stringify(json));
}

// Slave API
class Slave {
    constructor(i) {
        this.position = i;
        this.handlers = {};
        this.on = (tag, handler) => {
            this.handlers[tag] = handler;
        };
        this.set = function(args) {};
        this.get = function() {
            var json = {
                jsonrpc: "2.0",
                method: "ethercat.slave.get",
                params: {
                    position: this.position 
                }
            };
            botnana.sender.send(JSON.stringify(json));
        };
        this.set_homing_method = function(value) {};
        this.set_dout = function(index, value) {};
        this.get_dout = function(index) {};
        this.get_din = function(index) {};
        this.disable_aout = function(index) {};
        this.enable_aout = function(index) {};
        this.set_aout = function(index, value) {};
        this.get_aout = function(index) {};
        this.disable_ain = function(index) {};
        this.enable_ain = function(index) {};
        this.get_ain = function(index) {};
    }
}

botnana.ethercat = {};
botnana.ethercat.slaves = [];
botnana.ethercat.slave = function(n) {
    if (1 <= n && n <= botnana.ethercat.slaves.length) {
        return botnana.ethercat.slaves[n-1];
    } else {
        console.log("Invalid slave index " + n + ".")
    }
}

// Configuration API
botnana.config = {
    save: function() {
        var json = {
            jsonrpc: "2.0",
            method: "config.save"
        };
        botnana.sender.send(JSON.stringify(json));
    },
    set_slave: function(args) {
        var json = {
            jsonrpc: "2.0",
            method: "config.set_slave",
            params: args
        };
        botnana.sender.send(JSON.stringify(json));
    }
}

// Start API
botnana.start = function(ip) {
    var WebSocket = require('ws');
    var ws = new WebSocket(ip);
    ws.on('message', function(data, flags) {
        console.log(data);
        botnana.handle_response(data);
    });
    ws.on('open', function () {
        botnana._.get_slaves();
    });
    botnana.sender = ws;
    botnana.on("slaves", function(slaves) {
        let s = slaves.split(",");
        let slave_count = s.length/2;
        console.log("slave count: " + slave_count);
        for (var i = 0; i < slave_count; i = i + 1) {
            botnana.ethercat.slaves[i] = new Slave(i+1);
        }
        let ready_handler = botnana.handlers["ready"];
        if (ready_handler) {
            ready_handler();
        };
    });
}

module.exports = botnana;
