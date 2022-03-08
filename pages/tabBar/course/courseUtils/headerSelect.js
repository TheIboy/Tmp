//选择周数类
class selectClass {
  constructor(week){
    //传进来的总周期数
    this.week = week
    /*周期选择器的对象数组基础格式：
    [{
      id:0,
      num:1
    },...,{
      id:24,
      num:25
    }]*/
    this.weekArray = []
    //选择器里的第几个
    this.selectWeek = 0
    this.listPut()
  }
  //初始化weekArray
  listPut(){
    for(let i = 0;i < this.week;i++){
      this.weekArray.push({id: i, num:Number(i) + 1})
    }
  }
  //获取周数数组里的num
  getWeekNum(){
    return this.weekArray[this.selectWeek].num
  }
  //获取周数数组里的id
  getWeekId(){
    return this.weekArray[this.selectWeek].id
  }
  //赋值周数
  set _SelectWeek(value){
    this.selectWeek = value
  }
  //获取真实周数
  get _SelectWeek(){
    return this.selectWeek+1
  }
}
export{
  selectClass
}