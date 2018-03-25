const readline = require('readline');

const CONFIG = require('./config.js');

const type0 = require('./type0.js');
const typeA = require('./typeA.js');
const typeB = require('./typeB.js');
const typeC = require('./typeC.js');
const typeD = require('./typeD.js');
const typeE = require('./typeE.js');
const typeF = require('./typeF.js');
const typeG = require('./typeG.js');
const typeH = require('./typeH.js');

let startAll = async (datestr)=>{
    
    CONFIG.set_date(datestr);
    
   let allType = [type0, typeA, typeB, typeC, typeD, typeE, typeF, typeG, typeH];
   
   let promises = [];
   let result = [];
   
   try{
        allType.forEach( type => promises.push(type.start()) );
        
        for(let p of promises){
       
            let judge = await p;
            
            result.push({
                type: judge.type(),
                description: judge.describe(),
                count: judge.count(),
                all: judge.all()
            });
        }
        
   }catch(e){
        console.log('start error!');   
   }
   
   return result;
   
}


exports.judge_date = startAll;




