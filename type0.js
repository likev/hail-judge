const fs = require('fs');
const util = require('util');

const CONFIG = require('./config.json');
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');

//console.log(CONFIG);

let judgeType = judge.create('探空站物理量');

let judgeX1 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['57083','57178'];
    
    let countK_SI = 0;
    stations1.forEach( (id) => {
        //K=(T850-T500)+Td850-(T700-Td700)
        let S = data[id];
        if(S && S['500'] && S['700'] && S['850'] &&
            (S['850'].T - S['500'].T + S['850'].Td - S['700'].T + S['700'].Td )>=30 ) ++countK_SI;            
             
    });
    
    return countK_SI >= 1;
}

let judgeX5 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['57083','57178'];
    
    let count_height0 = 0;
    stations1.forEach( (id) => {
        //K=(T850-T500)+Td850-(T700-Td700)
        let S = data[id];
        let levels = S.contain.slice().reverse();
        let pos1 = levels.findIndex((level)=>{return S[level].T >= 0 });
        let pos2 = levels.findIndex((level)=>{return S[level].T >= -20 });
        
        let height_0 = 0, height_20 = 0;
        if(pos1 !== -1 && pos2 !== -1) {
            
        height_0 = judge.linear_interpolation([ S[levels[pos1-1] ].T, S[levels[pos1-1] ].height],
                                              [ S[levels[pos1] ].T, S[levels[pos1] ].height ], 0);
        height_20 = judge.linear_interpolation([ S[levels[pos2-1] ].T, S[levels[pos2-1] ].height],
                                               [ S[levels[pos2] ].T, S[levels[pos2] ].height], -20);
                                              
                                              
        }
        
        if( judge.between(height_0, [3500, 5000]) && judge.between(height_20, [6200,7500]) ) ++count_height0;            
             
    });
    
    return count_height0 >= 1;
}


TlogP.get()
    .then((datas)=>{
        
        console.log('---探空站物理量---')
        
        judgeType.add('反映 K与SI指数', judgeX1(datas.today08), -1);
        judgeType.add('0℃层高度在3500-5000米。-20℃高度在6200-7500米', judgeX5(datas.today08), -1);
        
        let judgeType_all = judgeType.all();
        for(let item of judgeType_all){
            
            let tip = 'X';
            if(item[2]) tip = '√';
            console.log('[ '+tip+' ] '+item[0]);
        }
        
    });


/*
let judge1 = judge.create('judge1');

judge1.add('3>4', 3>4, 3);
judge1.add('5*4===20', 5*4===20, 20);
judge1.add('1+8===9', 1+8===9, 9);
judge1.add('5! === 22222', 1*2*3*4*5 === 22222, 1*2*3*4*5);
judge1.add('13<24', 13<24, 13);
judge1.add('13>=4', 13>=4, 13);
judge1.add('22/2 === 11', 22/2 === 11, 22/2);

let judge1_all = judge1.all();
for(let item of judge1_all){
    console.log(item);
}

console.log('judge1.atleast(3): '+judge1.atleast(3));

*/
