const fs = require('fs');
const util = require('util');

const CONFIG = require('./config.json');
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');
const typeA = require('./typeA.js');

//console.log(CONFIG);

let judgeG1 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['53336','53463','54401','54511','53543'];
    
    let count270_340 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500']){
            let d = data[id]['500'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
        }
    });
    
    let stations2 = ['53845','53772','53798','54727'];
    
    let count250_60 = 0;
    
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500']){
            let d = data[id]['500'].windDir;
            
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=4 && count250_60 >= 3;
}

let judgeG2 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ["53543", "54511", "53772", "53798", "53845"];
    
    let count270_340 = 0;
    
    //let count250_60 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['700']){
            let d = data[id]['700'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
            //if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=4 ; //&& count250_60 >= 8;
}

let judgeG3 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ["53463", "53543", "53845", "53336", "53513"];
    
    let count270_340 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['850']){
            let d = data[id]['850'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
        }
    });
    
    let stations2 = ['53845','53772','53798','57067','57083'];
    
    let count250_60 = 0;
    
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['850']){
            let d = data[id]['850'].windDir;
            
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=3 && count250_60 >= 3;
}


exports.start = ()=>{
    TlogP.get()
        .then((datas)=>{
            
            let judgeType = judge.create('横槽型');
            
            judgeType.add('500hpa ＞4个站 风向270-340°，＞3个站以上，风向在250-60°', judgeG1(datas.today08), -1);
            judgeType.add('700hpa ＞4个站 风向270-340°', judgeG2(datas.today08), -1);
            judgeType.add('850hpa ＞3个站 风向270-340°，＞3个站以上，风向在250-60°', judgeG3(datas.today08), -1);
            
            //judgeType.add('T850-T500 湿度差大于20℃', typeA.T_Td_850_500(datas.today08), -1);
            judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', typeA.T_Td_850_or_700(datas.today08), -1);
            judgeType.add('200高空急流：风速≥30米/秒', typeA.jet_stream200(datas.today08), -1);
            judgeType.add('500高空急流：风速≥16米/秒', typeA.jet_stream500(datas.today08), -1);
            //judgeType.add('500温度≤-9℃', typeA.T500(datas.today08), -1);
            judgeType.add('Δt(t850-t500)≧30', typeA.T850_500(datas.today08), -1);
            
            let count = judgeType.count();
            console.log('\n---横槽型 ( '+count.fulfilled+'/'+count.all+' )---')
            
            let judgeType_all = judgeType.all();
            for(let item of judgeType_all){
                
                let tip = 'x';//X
                if(item[2]) tip = '√';
                console.log('[ '+tip+' ] '+item[0]);
            }
            
        });
}