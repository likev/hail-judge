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

let startAll = async ()=>{
    
   let allType = [type0, typeA, typeB, typeC, typeD, typeE, typeF, typeG, typeH];
   
   let promises = [];
   
   try{
        allType.forEach( type => promises.push(type.start()) );
        
        for(let p of promises){
       
            await p;
        }
        
   }catch(e){
        console.log('start error!');   
   }
   
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let loop = async ()=>{
    
    let start = async (datestr) => {
        
        CONFIG.set_date(datestr); 
        
        try{
           await startAll(); 
        }catch(e){
            
        }
        
        
        loop();
    
    }
    
    rl.question('\n>>>请输入日期后回车（当天日期可直接回车）: ', start );
    
}

loop();




