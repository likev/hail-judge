const fs = require('fs');
const util = require('util');

const CONFIG = require('./config.json');
const judge = require('./conditionJudge.js');

//console.log(CONFIG);

let parse_diamond5 = (data)=>{
    
    let result = data.split(/[\r\n]+(\d{5})/);
    
    let count = 0;
    for(let item of result){
        //console.log(count +': '+item);
        ++count;
    }
    
    let stations = {};
    
    for(let i=1; i<result.length; i += 2){
        
        let lines = result[i+1].trim().split(/[\r\n]+/);
        
        //console.log();
        
        let levels = {contain:[]};
        for(let l=1; l<lines.length; l ++){
            let values = lines[l].trim().split(/\s+/);
            
            levels.contain.push(values[0]);
            levels[values[0]] = {
                height: values[1],
                T: values[2],
                Td: values[3],
                windDir: values[4],
                windVal: values[5]
            }
        }
        
        stations[result[i]] = levels;
        
        //console.log(result[i]);
        //console.log(JSON.stringify(levels, null, 2));
    }
    
    return stations;
    
}

const readFile = util.promisify(fs.readFile);

async function readTlogP(filepath){
    
    const TlogP_today = await readFile(filepath, 'ascii');

    return parse_diamond5(TlogP_today);
    
}

const TlogP = {};
let isReadAllSuccessed = false;

async function readAll(){

    const pathTlogP_yesterday20 = CONFIG.pathTlogP+'/'+CONFIG.yesterday+'20.000';
    
    const pathTlogP_today08 = CONFIG.pathTlogP+'/'+CONFIG.today+'08.000';
    
    let read_yesterday20 = readTlogP(pathTlogP_yesterday20), read_today08 = readTlogP(pathTlogP_today08); 
    
    TlogP.yesterday20 = await read_yesterday20;
    TlogP.today08 = await read_today08;
    
    isReadAllSuccessed = true;
    
    return TlogP;

}

exports.get = async function(){
    
    if(isReadAllSuccessed) return TlogP;
    else return await readAll();
}