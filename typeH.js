const fs = require('fs');
const util = require('util');

const CONFIG = require('./config.json');
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');
const typeA = require('./typeA.js');

//console.log(CONFIG);

let judgeH1 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['53336', '53463', '54401', '53513', '53543', '53614', '53772', '53845', '53916', '57067', '57083', '52983', '52495'];
    
    let count270_340 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500']){
            let d = data[id]['500'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
        }
    });
    
    
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=10 ;//&& count250_60 >= 3;
}

let judgeH2 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['53513', '53463', '53543', '53614'];
    
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
    
    let stations2 = ['53845', '53772', '53798', '57067', '57083'];
    
    let count250_60 = 0;
    
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['700']){
            let d = data[id]['700'].windDir;
            
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=3 && count250_60 >= 3;
}

let judgeH3 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['53513', '53463', '53543', '53614', '53845', '53772', '53798', '57067', '57083'];
    
    let count270_340 = 0, count250_60 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['850']){
            let d = data[id]['850'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=4 && count250_60 >= 4;
}


exports.start = ()=>{
    TlogP.get()
        .then((datas)=>{
            
            let judgeType = judge.create('偏北气流型');
            
            judgeType.add('500hpa ＞10个站 风向270-340°', judgeH1(datas.today08), -1);
            judgeType.add('700hpa ＞3个站 风向270-340°，＞3个站以上，风向在250-60°', judgeH2(datas.today08), -1);
            judgeType.add('850hpa ＞4个站 风向270-340°，＞4个站以上，风向在250-60°', judgeH3(datas.today08), -1);
            
            //judgeType.add('T850-T500 湿度差大于20℃', typeA.T_Td_850_500(datas.today08), -1);
            judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', typeA.T_Td_850_or_700(datas.today08), -1);
            judgeType.add('200高空急流：风速≥30米/秒', typeA.jet_stream200(datas.today08), -1);
            judgeType.add('500高空急流：风速≥16米/秒', typeA.jet_stream500(datas.today08), -1);
            //judgeType.add('500温度≤-9℃', typeA.T500(datas.today08), -1);
            judgeType.add('Δt(t850-t500)≧30', typeA.T850_500(datas.today08), -1);
            
            let count = judgeType.count();
            console.log('\n---偏北气流型 ( '+count.fulfilled+'/'+count.all+' )---')
            
            let judgeType_all = judgeType.all();
            for(let item of judgeType_all){
                
                let tip = 'x';//X
                if(item[2]) tip = '√';
                console.log('[ '+tip+' ] '+item[0]);
            }
            
        });
}