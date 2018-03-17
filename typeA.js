
const judge = require('./conditionJudge.js');
const TlogP = require('./TlogP.js');

//console.log(CONFIG);



let judgeA1 = (TlogP_yesterday)=>{
    
    let data = TlogP_yesterday;
    //console.log( )
    
    let stations1 = ['51076','51243','51288','51463','51777','51656','56004','55299'];
    
    let count270_330 = 0;
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [270, 330]) ) ++count270_330;
    });
    
    let stations2 = ['52203','52323','52418','52533','51886','52818','52836','56029'];
    
    let count250_60 = 0;
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [60, 250]) ) ++count250_60;
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_330 >=6 && count250_60 >= 6;
}

let judgeA2 = (TlogP_today)=>{
    
    let data = TlogP_today;
    
    let stations1 = ['52323','52533','52418','52818','52836','56029'];
    
    let count270_330 = 0;
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && judge.between(data[id]['500'].windDir, [270, 330]) ) ++count270_330;
    });
    
    let stations2 = ['52267','52495','52652','52866','56080','52983','56064','52681'];
    
    let count250_60 = 0;
    stations2.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] &&  judge.between(data[id]['500'].windDir, [60, 250]) ) ++count250_60;
    });
    
    //console.log('count270_330: ' + count270_330 + '  count250_60: ' + count250_60);
    
    return count270_330 >=5 && count250_60 >= 6;
}

let judgeA5 = (TlogP_today)=>{
    let data = TlogP_today;
    
    let stations1 = ['53915','53845','53772','53798','57083','57178'];
    
    let count_T_Td_850_500 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if( data[id] && data[id]['500'] && data[id]['850']){
            
            let T500 = data[id]['500'].T,   T850 = data[id]['850'].T, 
               Td500 = data[id]['500'].Td, Td850 = data[id]['850'].Td;
               
            if(![T500, Td500, T850, Td850].some( v => {return v===9999}) ){
                
                if( (T500-Td500)-(T850-Td850) >=20 ) ++count_T_Td_850_500;
            }
   
        };
    });
    
    return count_T_Td_850_500 >= 4;
}

let judgeA7 = (TlogP_today)=>{
    let data = TlogP_today;
    
    let stations1 = ['53915','53845','53772','53798','57083','57178'];
    
    let count_T_Td_850 = 0, count_T_Td_700 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if( data[id] && data[id]['850']){
            
            let T850 = data[id]['850'].T, Td850 = data[id]['850'].Td;
               
            if(![T850, Td850].some( v => {return v===9999}) ){
                
                if( (T850-Td850) <=4 ) ++count_T_Td_850;
            }
   
        };
        
        if( data[id] && data[id]['700']){
            
            let T700 = data[id]['700'].T, Td700 = data[id]['700'].Td;
               
            if(![T700, Td700].some( v => {return v===9999}) ){
                
                if( (T700-Td700) <=4 ) ++count_T_Td_700;
            }
   
        };
    });
    
    return count_T_Td_850 >= 4 || count_T_Td_700 >= 4;
}

let judgeA8 = (TlogP_today)=>{
    let data = TlogP_today;
    
    let stations1 = ['53915','53845','53772','53798','57083','57178'];
    
    let count_wind200 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['200'] && data[id]['200'].windVal >= 30 ) ++count_wind200;
    });
    
    return count_wind200 >= 4;
}

let judgeA9 = (TlogP_today)=>{
    let data = TlogP_today;
    
    let stations1 = ['53915','53845','53772','53798','57083','57178'];
    
    let count_wind500 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && data[id]['500'].windVal >= 16 ) ++count_wind500;
    });
    
    return count_wind500 >= 3;
}

let judgeA10 = (TlogP_today)=>{
    let data = TlogP_today;
    
    let stations1 = ['53915','53845','53772','53798','57083','57178','57067'];
    
    let count_T500 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && data[id]['500'].T <= -9 ) ++count_T500;
    });
    
    return count_T500 >= 3;
}

let judgeA13 = (TlogP_today)=>{
    let data = TlogP_today;
    
    let stations1 = ['53915','53845','53772','53798','57083','57178'];
    
    let count_T850_500 = 0;
    
    stations1.forEach( (id) => {
        //console.log(id+':'+JSON.stringify(data[id], null, 2));
        if(data[id] && data[id]['500'] && 
           data[id]['850'] && data[id]['850'].T - data[id]['500'].T >= 30 ) ++count_T850_500;
    });
    
    return count_T850_500 >= 2;
}

exports.start = async ()=>{
    let datas = await TlogP.get();
            
    let judgeType = judge.create('西风短波槽');
    
    judgeType.add('降冰雹前1日20时500hPa，短波槽在90-100°E,35-50°N', judgeA1(datas.yesterday20), -1);
    judgeType.add('当日08时500 hPa槽线在 102-105°E，33-40°N', judgeA2(datas.today08), -1);
    judgeType.add('T850-T500 湿度差大于20℃', judgeA5(datas.today08), -1);
    judgeType.add('高空700 hPa,850 hPa任一层 湿度差≤4.0℃', judgeA7(datas.today08), -1);
    judgeType.add('200高空急流：风速≥30米/秒', judgeA8(datas.today08), -1);
    judgeType.add('500高空急流：风速≥16米/秒', judgeA9(datas.today08), -1);
    judgeType.add('500温度≤-9℃', judgeA10(datas.today08), -1);
    judgeType.add('Δt(t850-t500)≧30', judgeA13(datas.today08), -1);
    
    let count = judgeType.count();
    console.log('\n---西风短波槽 ( '+count.fulfilled+'/'+count.all+' )---')
    
    let judgeType_all = judgeType.all();
    for(let item of judgeType_all){
        
        let tip = 'x';
        if(item[2]) tip = '√';
        console.log('[ '+tip+' ] '+item[0]);
    }
           
    
}

exports.T_Td_850_500 = judgeA5;
exports.T_Td_850_or_700 = judgeA7;
exports.jet_stream200 = judgeA8;
exports.jet_stream500 = judgeA9;
exports.T500 = judgeA10;
exports.T850_500 = judgeA13;