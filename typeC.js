const fs = require('fs');
const util = require('util');

const CONFIG = require('./config.json');
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');
const typeA = require('./typeA.js');

//console.log(CONFIG);

let judgeC1 = (TlogP_yesterday)=>{
    
    let data = TlogP_yesterday;
    
    let stations1 = ['54102','53068','44373','53336'];
    
    let count300_360 = 0;
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [300, 360]) ) ++count300_360;
    });
    
    let stations2 = ['54135','54218','54401','53465','53543'];
    
    let count260_60 = 0;
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] &&  judge.between(data[id]['500'].windDir, [60, 260]) ) ++count260_60;
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count300_360 >=3 && count260_60 >= 4;
}

let judgeC2 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['53336','53465','54401','53543'];
    
    let count300_360 = 0;
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [300, 360]) ) ++count300_360;
    });
    
    let stations2 = ['54511','53772','53845','53798'];
    
    let count260_60 = 0;
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] &&  judge.between(data[id]['500'].windDir, [60, 260]) ) ++count260_60;
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count300_360 >=3 && count260_60 >= 3;
}


exports.start = ()=>{
    TlogP.get()
        .then((datas)=>{
            
            let judgeType = judge.create('华北冷涡型');
            console.log('\n---华北冷涡型---')
            
            judgeType.add('500hPa前1日20时高空有冷涡。109-113°E ,40-43°', judgeC1(datas.yesterday20), -1);
            judgeType.add('500hPa当日08时冷涡位置：110-114°E,36-40°N', judgeC2(datas.today08), -1);
            judgeType.add('T850-T500 湿度差大于20℃', typeA.T_Td_850_500(datas.today08), -1);
            judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', typeA.T_Td_850_or_700(datas.today08), -1);
            judgeType.add('200高空急流：风速≥30米/秒', typeA.jet_stream200(datas.today08), -1);
            judgeType.add('500高空急流：风速≥16米/秒', typeA.jet_stream500(datas.today08), -1);
            judgeType.add('500温度≤-9℃', typeA.T500(datas.today08), -1);
            judgeType.add('Δt(t850-t500)≧30', typeA.T850_500(datas.today08), -1);
            
            let judgeType_all = judgeType.all();
            for(let item of judgeType_all){
                
                let tip = 'X';
                if(item[2]) tip = '√';
                console.log('[ '+tip+' ] '+item[0]);
            }
            
        });
}