'use strict';

var influx = require('influx'),
    consts = require('./consts');

var Database = function(){

        this.dbname = consts.DB_NAME;
        this.client = null;
}

    Database.prototype.connect =function() {
        if (null === this.client) {
            this.client = influx({
                host: consts.DB_HOST,
                port: consts.DB_PORT, 
                protocol: consts.DB_PROTOCOL,
                username: '',
                password: '',
                database: this.dbname
            });
        }
    }

    Database.prototype.getInstance = function(done) {
        if (this.client !== null) {
            return done(null, this.client);
        }

        this.connect();
        done(null, this.client);
    }


module.exports = new Database;
