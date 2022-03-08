// 分段器item类
class info{
  constructor(itemName){
    /*
    itemName:切换器名字
    */ 
    this.itemName = itemName;
  }
}

// 时长览概类
class time{
  /**
   * Creates an instance of time.
   * @param {*} timeName 名字
   * @param {*} timeHour 时长
   * @memberof time
   */
  constructor(timeName,timeHour,color){
    this.timeName = timeName;
    this.timeHour = timeHour;
    this.color = color
  }
}


// 义工列表 服务记录 item属性类
class volun{
  constructor(activityName,organization,time){
    this.organization = organization;
    this.activityName=activityName;
    this.time=time;
  }
}

// 义工列表 服务记录 列表类
class volunItem{
  constructor(volunteerArray){
    this.array=[]
    volunteerArray.forEach(element => {
    this.array.push(new volun(element.activityName,element.organization,element.time))
  });
  }
}

// 培训记录
class Trainings{
  constructor(trainingType,organization){
    this.trainingType = trainingType;
    this.organization=organization;
  }
}
// 培训记录 列表类
class TrainingsItem{
  constructor(TrainingsArray){
    this.array=[]
    TrainingsArray.forEach(element => {
    this.array.push(new Trainings(element.trainingType,element.organization))
  });
  }
}


export{
  volun,
  volunItem,
  TrainingsItem,
  info,
  time
}