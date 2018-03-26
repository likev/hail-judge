"use strict";

const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { exec } = require('child_process');

const {judge_date} = require('./judge-date.js');
const TlogP = require('./TlogP.js');


let writeAlertJsonInfo = async function(req, res){
	
	res.write('TlogP_list_json = '+ JSON.stringify(await TlogP.file_list())+ ';' );
	res.write('app.onready();');
	res.write('</script></body></html>');
	res.end();
}

let homepage = function(req, res){
	res.writeHead(200, {'Content-Type':'text/html'});

	//console.log(__dirname);
	let rs = fs.createReadStream("./hail-judge.html");

	rs.pipe(res, {end:false});
	rs.on('end', ()=>{

		writeAlertJsonInfo(req, res);
		//res.end();
	});
}

let newItem = async function(req, res, config){
	res.writeHead(200, {'Content-Type':'application/json'});
	
	config.response = res;
    
    let result = await judge_date(config.datestr);
	
	res.end( JSON.stringify(result) );
	
}

let startHttpServer = function(){
	http.createServer(function(req, res) {
		const host = req.headers.host;
		const hostname = url.parse('http://'+host).hostname;

		let pathname = url.parse(req.url).pathname;
		console.log(pathname);
		if( pathname === '/' ){
			homepage(req, res);
		}else if( pathname.slice(0,5) === '/post' ){
			    
			var post = '';     
			var config = {};
			
			req.on('data', function(chunk){    
				post += chunk;
			});
 
			req.on('end', function(){    
				config = querystring.parse(post);
				console.log(config);
				newItem(req, res, config);
			});
		  		  
		  
		}
		
	}).listen(8087,()=>{
	   console.log('listen on port 8087...');
	 });
}

//--------test begin---------------------
/*
startHttpServer();
*/
//---------test end----------------------

exports.start = function(){
	startHttpServer();
    
    exec('start http://127.0.0.1:8087', (err, stdout, stderr) => {
      // ...
    });
}