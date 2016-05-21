'use strict';

var influx = require('influx'),
    consts = require('./consts');

class Database {

    constructor() {
        this.dbname = consts.DB_NAME;
        this.client = null;
    }

    connect() {
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

    /*dbExist(done) {
        var self = this;
        self.client
            .getDatabaseNames((err, dbs) => {
                if (err) {
                    return done(err);
                }

                if (dbs.indexOf(self.dbname) === -1) {
                    return done(null, false);
                }

                done(null, true);
            });
    }

    createDatabase(done) {
        this.client
            createDatabase(this.dbname, (err, db) => {
                done(err, db);
            });
    }*/

    getInstance(done) {
        if (this.client !== null) {
            return done(null, this.client);
        }

        this.connect();
        done(null, this.client);
    }
}

module.exports = new Database;
