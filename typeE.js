
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');
const typeA = require('./typeA.js');

//console.log(CONFIG);

let judgeE1 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['53068','54102','53336','53463','54218','53543','54401','53772','53798','54727','57083','54511','54539','57067'];
    
    let count270_340 = 0;
    
    let count250_60 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500']){
            let d = data[id]['500'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=5 && count250_60 >= 5;
}

let judgeE4 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['52495','53336','53513','53463','53543','54511','52681','53614','52983','53915','53845','53772','53798','57083','57067','54727'];
    
    let count270_340 = 0;
    
    let count250_60 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['700']){
            let d = data[id]['700'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=6 && count250_60 >= 6;
}

let judgeE5 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['52495','53336','53513','53463','53543','54511','52681','53614','52983','53915','53845','53772','53798','57083','57067','54727'];
    
    let wind700_12 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['700']){
            let d = data[id]['700'].windVal;
            if( d >= 12 ) ++wind700_12;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return wind700_12 >=10;
}

let judgeE6 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['52495','53336','53513','53463','53543','54511','52681','53614','52983','53915','53845','53772','53798','57083','57067','54727'];
    
    let count270_340 = 0;
    
    let count250_60 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['850']){
            let d = data[id]['850'].windDir;
            if(judge.between( d, [270, 340]) ) ++count270_340;
            if(judge.between( d, [60, 250]) ) ++count250_60;
        }
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_340 >=6 && count250_60 >= 6;
}


exports.start = async ()=>{
    let datas = await TlogP.get();
            
    let judgeType = judge.create('华北冷涡型 2');
    
    judgeType.add('500hPa ＞5站以上风向270-340°，＞5个站250-60°', judgeE1(datas.today08), -1);
    judgeType.add('700hPa ＞6站以上风向270-340°，＞6个站250-60°', judgeE4(datas.today08), -1);
    judgeType.add('850hPa ＞6站以上风向270-340°，＞6个站250-60°', judgeE6(datas.today08), -1);
    
    judgeType.add('700hPa ＞10站以上 风速≥12m/s', judgeE5(datas.today08), -1);
    //judgeType.add('T850-T500 湿度差大于20℃', typeA.T_Td_850_500(datas.today08), -1);
    judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', typeA.T_Td_850_or_700(datas.today08), -1);
    judgeType.add('200高空急流：风速≥30米/秒', typeA.jet_stream200(datas.today08), -1);
    judgeType.add('500高空急流：风速≥16米/秒', typeA.jet_stream500(datas.today08), -1);
    judgeType.add('500温度≤-9℃', typeA.T500(datas.today08), -1);
    judgeType.add('Δt(t850-t500)≧30', typeA.T850_500(datas.today08), -1);
    
    let count = judgeType.count();
    console.log('\n---华北冷涡型 2 ( '+count.fulfilled+'/'+count.all+' )---')
    
    let judgeType_all = judgeType.all();
    for(let item of judgeType_all){
        
        let tip = 'x';//X
        if(item[2]) tip = '√';
        console.log('[ '+tip+' ] '+item[0]);
    }
        
}