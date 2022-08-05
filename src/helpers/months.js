


export function getFirstAndLastDay (){
    var now = new Date();
    var firstAndLastOfMonth = []
    for(var i=0; i<now.getMonth()+1; i++){
      const firstDay = now.getFullYear()+"-"+(i+1)+"-"+ 1;
      const lastDay = now.getFullYear()+"-"+(i+1)+"-"+new Date(now.getFullYear(), i + 1, 0).getDate();
      firstAndLastOfMonth.push({minDate:firstDay, maxDate:lastDay, month:i+1})
    }
    return firstAndLastOfMonth
  }


export function arrangeAggregate (){
    var months = getFirstAndLastDay()
    var pipeline = {}
    months.map(element => {
        pipeline[element.month] = [
            {$project:{
                expenses:{
                $filter:{
                    input:`$expenses`,
                    as: `item`,
                    cond:{$and: [
                        {$and: [
                            {"$gte": [
                                "$$item.date",
                                {
                                    $dateFromString: {
                                        dateString:  element.minDate,
                                        format: "%Y-%m-%d"
                                    }
                                }//Checkeamos que sea mas grande que el valor minimo
                            ]},
                            {"$lte": [ "$$item.date",
                            {
                                $dateFromString: {
                                    dateString: element.maxDate,
                                    format: "%Y-%m-%d"
                                }
                            }//Si no hay valor, devuelve sin limite máximo de fecha
                            ]}
                        ]}
                    ]}
                }
                }
            }
            },
            {$unwind:"$expenses"}, 
            {"$group":{"_id":"$_id","totalExpenses":{"$sum":"$expenses.value"}}}   
        ]
    })
    return pipeline
        
    
}