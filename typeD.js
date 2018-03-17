
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');
const typeA = require('./typeA.js');

//console.log(CONFIG);

let judgeD1 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['30935','44292','53068'];
    
    let count270_330 = 0;
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [270, 330]) ) ++count270_330;
    });
    
    let stations2 = ['30965','50827','54102'];
    
    let count230_60 = 0;
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] &&  judge.between(data[id]['500'].windDir, [60, 230]) ) ++count230_60;
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_330 >=2 && count230_60 >= 2;
}


exports.start = async ()=>{
    let datas = await TlogP.get();
            
    let judgeType = judge.create('西北气流下滑型');
    
    judgeType.add('当日08时500hPa在蒙古到我国东北附近在42-48°N，115-119°E', judgeD1(datas.today08), -1);
    
    judgeType.add('T850-T500 湿度差大于20℃', typeA.T_Td_850_500(datas.today08), -1);
    judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', typeA.T_Td_850_or_700(datas.today08), -1);
    judgeType.add('200高空急流：风速≥30米/秒', typeA.jet_stream200(datas.today08), -1);
    judgeType.add('500高空急流：风速≥16米/秒', typeA.jet_stream500(datas.today08), -1);
    judgeType.add('500温度≤-9℃', typeA.T500(datas.today08), -1);
    judgeType.add('Δt(t850-t500)≧30', typeA.T850_500(datas.today08), -1);
    
    let count = judgeType.count();
    console.log('\n---西北气流下滑型 ( '+count.fulfilled+'/'+count.all+' )---')
    
    let judgeType_all = judgeType.all();
    for(let item of judgeType_all){
        
        let tip = 'x';//X
        if(item[2]) tip = '√';
        console.log('[ '+tip+' ] '+item[0]);
    }
            
}