#!/usr/local/bin/node

var async = require('async');

var stdin = process.stdin;
var stdout = process.stdout;

stdin.setEncoding('utf8'); 
stdin.resume(); 

process.on('SIGINT', function() {
    console.log("Closing .....\n");
    process.exit();
});


async.series({
    email : function(cb){

        stdout.write("Email: ");

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        stdin.setRawMode(false);

        var callback = function(email) {
            email = email.trim();

            if(!re.test(email)) {
                stdout.write("Invalid email address \nEmail: ");
                return;
            }

            stdin.removeListener('data', callback);
            cb(null, email);
             
        }

        stdin.on('data', callback);
    },
    password : function(cb){
        var data = "";

        stdin.setRawMode(true);

        process.stdout.write("\nPassword:");
        
        var callback = function(char) {

            if(char == '\3') {
                process.emit('SIGINT');
            }
            
            if(char == "\r" || char == "\r\n") {
                stdin.removeListener('data', callback);
                cb(null, data);
                return;
            };

            process.stdout.write("*");
            data += char;
        }
        
        stdin.on('data', callback);
        
    },
    displayName: function(cb) {
        stdin.setRawMode(false);
        stdout.write("\n\nDisplay Name: ");
        

        var callback = function(char) {
            stdin.removeListener('data', callback);
            cb(null, char);
            
        }

        stdin.on('data', callback);
        
        stdin.setRawMode(false);

    }
}, function(err, results) {
    console.log(err, results);
});


