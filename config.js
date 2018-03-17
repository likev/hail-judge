var moment = require('moment');

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

let set_date = (datestr)=>{
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

//set_date('');

exports.set_date = set_date;






