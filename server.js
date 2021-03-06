"use strict";

const fs = require('fs');
const path = require('path');

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { exec } = require('child_process');

const {judge_date} = require('./judge-date.js');
const TlogP = require('./TlogP.js');
const CONFIG = require('./config.js');

let writeAlertJsonInfo = async function(req, res){
	
	res.write('app.TlogP_dirname = '+ JSON.stringify(CONFIG.pathTlogP() )+ ';' );
	res.write('app.TlogP_list_json = '+ JSON.stringify(await TlogP.file_list())+ ';' );
	res.write('app.updateList();');
	res.write('</script></body></html>');
	res.end();
}

let homepage = function(req, res){
	res.writeHead(200, {'Content-Type':'text/html'});

	//console.log(__dirname);
	let rs = fs.createReadStream( path.join( __dirname, "hail-judge.html" ) );

	rs.pipe(res, {end:false});
	rs.on('end', ()=>{

		writeAlertJsonInfo(req, res);
		//res.end();
	});
}

let static_file = function(req, res, filename){
    let mime = {
        "css": "text/css",
        "js": "text/javascript"
    };
    let ext = path.extname(filename).slice(1);
    
	res.writeHead(200, {'Content-Type': mime[ext]});

	//console.log(__dirname);
	let rs = fs.createReadStream( path.join( __dirname, 'static-files',filename ) );

	rs.pipe(res, {end:true});
}

let newItem = async function(req, res, config){
	res.writeHead(200, {'Content-Type':'application/json'});
	
	config.response = res;
    
    let result = await judge_date(config.datestr);
	
	res.end( JSON.stringify(result) );
	
}

let setDir = async function(req, res, config){
	res.writeHead(200, {'Content-Type':'application/json'});
	
	//config.response = res;
	await CONFIG.set_dir(config.dirname);
    
    let result = await TlogP.file_list();
	
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
				
				if(config.action === 'calc') newItem(req, res, config);
				else if(config.action === 'set-dir') setDir(req, res, config);
			});
		  		  
		  
		}else if( pathname.slice(0,5) === '/file' ){
            let filename = pathname.slice(6);
            console.log(filename);
            static_file(req, res, filename);
        }else{
            res.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});

            res.write("This request URL " + pathname + " was not found on this server.");

            res.end();
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