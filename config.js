var moment = require('moment');
const path = require('path');
const util = require('util');
const fs = require('fs');

const CONFIG = require('./config.json');
const TlogP = require('./TlogP.js');

exports.pathTlogP = ()=>{
    return CONFIG.pathTlogP;
}

exports.today = ()=>{
    return CONFIG.date.format("YYMMDD");
}

exports.yesterday = ()=>{
    return CONFIG.date
                .clone()
                .subtract(1, 'days')
                .format("YYMMDD");
}

exports.set_date = (datestr)=>{
    //console.log(datestr);
    datestr = datestr.trim();
    if(datestr.length === 6){
        CONFIG.date = moment(datestr, "YY-MM-DD");
    }else if(datestr.length === 8){
        CONFIG.date = moment(datestr, "YYYY-MM-DD");
    }else{
        CONFIG.date = moment();
    }
    
    TlogP.update();
}

exports.set_dir = async (dirname)=>{
    
	CONFIG.pathTlogP = dirname;
	
	const writeFile = util.promisify(fs.writeFile);
	
	await writeFile( path.join( __dirname, 'config.json' ), 
		JSON.stringify(CONFIG, null, 2) );
    
    TlogP.update();
}

//set_date('');







