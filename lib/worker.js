'use strict';

var db = require('./db'),
    influx = require('influx'),
    ds = require('datejs'),
    path = '/home/cloudmaxis/Documents/sample.txt',
    Tail = require('tail').Tail,
    fs = require('fs'),
    consts = require('./consts'),
    tail,array,unixtime,date;

var Worker = function() {
    this.conn = null;
};  

    Worker.prototype.terminate = function(err) {
        console.log(err);
        process.exit();
    };

    Worker.prototype.run = function() {
        var self = this;
        db.getInstance(function(err, conn) {

            if (err) {
                self.terminate(err);
            }

            self.conn = conn;

            self.checkFileExists((status) => {

                if (status) {
                    self.watchTail((err, data) => {
                        console.log(err);
                        console.log(data);
                    });                    
                } else {
                    console.log('File not found');
                    process.exit();
                }
            })

        });
    }

    Worker.prototype.checkFileExists = function(done) {
        fs.exists(path, function(exists) {
            done(exists);
        });
    }

    Worker.prototype.watchTail = function(done) {
        var self = this;
        tail = new Tail(path);
        tail.on('line', function(data) {
            array = dataProcess(data); 
            date = array[0];
            unixtime = Date.parse(date).getTime()+'000';

            self.conn.writePoint(consts.TBL_NAME,{
                TimeLog: unixtime,
                App: array[1] ? array[1] : '',
                Title:array[2] ? array[2] : '',
                FilePath:array[3] ? array[3]: ''

            }, null, done);
        });

        var done = function(err) {

            if (err){
                console.log('error'+err);
            }

        }
        var dataProcess = function(data) {
        var temp = data.replace(/[—]/g, '-');
            temp = temp.replace('- -', '-');
            var array = temp.split('-');
            return array;
        }
    }

module.exports = new Worker();