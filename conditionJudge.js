

let judge_create = (type)=>{
    
    let judge_type = type;
    let all_count = 0, fulfill_count = 0, reject_count = 0;
    let fulfill_conditions = [], reject_conditions = [], all_conditions = [];
    
    let type_descriptions = {
        '0':'探空站物理量',
        'A':'西风短波槽',
        'B':'横槽转竖型',
        'C':'华北冷涡型 1',
        'D':'西北气流下滑型',
        'E':'华北冷涡型 2',
        'F':'低槽型',
        'G':'横槽型',
        'H':'偏北气流型'
        
    }
    
    let judge = {};
    
    judge.add = (description, condition, val)=>{
        
        if(condition){
            fulfill_count++;
            
            fulfill_conditions.push([description, val]);
            
        }else{
            
            reject_count++;
            reject_conditions.push([description, val]);
        }
        
        all_count++;
        all_conditions.push([description, val, condition]);
    }
    
    judge.type = ()=>{
        
        return judge_type;
    }
    
    judge.describe = ()=>{
        
        return type_descriptions[judge_type];
    }
    
    judge.count = ()=>{
        
        return {
            all      : all_count,
            fulfilled: fulfill_count,
            rejected : reject_count
        };
    }
    
    judge.atleast = (ratio)=>{
        
        return fulfill_count/all_count >= ratio;
    }
    
    judge.fulfilled = ()=>{
        
        return fulfill_conditions;
    }
    judge.rejected = ()=>{
        
        return reject_conditions;
    }
    judge.all = ()=>{
        
        return all_conditions;
    }
    
    return judge;
    
}

exports.create = judge_create;

exports.between = (a, span)=>{
    
    return a>=span[0] && a<=span[1];
}

exports.linear_interpolation = ([x0, y0], [x1, y1], x)=>{
    
    
    let y = y0 + (x-x0)*(y1-y0)/(x1-x0);
    
    //console.log([x0, y0, x1, y1, x, y])
    
    return y;
}

exports.wind_shear = ([v0, d0], [v1, d1])=>{
    
    let angle_between = Math.abs(d0-d1);
    
    if(angle_between > 180) angle_between -= 180;
    
    angle_between *= Math.PI/180;
    let shear = Math.sqrt(v0*v0 + v1*v1 - 2*v0*v1*Math.cos(angle_between) );
    
    //console.log([v0, d0 , v1, d1, shear])
    
    return shear;
}



