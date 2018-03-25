
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');
const typeA = require('./typeA.js');

//console.log(CONFIG);

let judgeB1 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['50834','54102','53068','53336','53513'];
    
    let count300_360 = 0;
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [300, 360]) ) ++count300_360;
    });
    
    let stations2 = ['54135','54218','54401','53465','53543','54511'];
    
    let count250_60 = 0;
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] &&  judge.between(data[id]['500'].windDir, [60, 250]) ) ++count250_60;
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count300_360 >=3 && count250_60 >= 4;
}


exports.start = async ()=>{
    let datas = await TlogP.get();
            
    let judgeType = judge.create('B');
    
    judgeType.add('降冰雹前1日20时和当日08时500hPa图，有一低涡。位置 120-132°E,40-43°N。', judgeB1(datas.today08), -1);
    judgeType.add('T850-T500 湿度差大于20℃', typeA.T_Td_850_500(datas.today08), -1);
    judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', typeA.T_Td_850_or_700(datas.today08), -1);
    judgeType.add('200高空急流：风速≥30米/秒', typeA.jet_stream200(datas.today08), -1);
    judgeType.add('500高空急流：风速≥16米/秒', typeA.jet_stream500(datas.today08), -1);
    judgeType.add('500温度≤-9℃', typeA.T500(datas.today08), -1);
    judgeType.add('Δt(t850-t500)≧30', typeA.T850_500(datas.today08), -1);
    
    let count = judgeType.count();
    console.log('\n---横槽转竖型 ( '+count.fulfilled+'/'+count.all+' )---')
    
    let judgeType_all = judgeType.all();
    for(let item of judgeType_all){
        
        let tip = 'x';
        if(item[2]) tip = '√';
        console.log('[ '+tip+' ] '+item[0]);
    }
    
    return judgeType;

}