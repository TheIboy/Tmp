let color = ['rgb(255,163,158)','rgb(255,192,105)','rgb(149,222,100)','rgb(54,207,201)','rgb(255,163,158)','rgb(105,192,255)','rgb(211,173,247)']
let num = 0
class scoreClass{
  /**
   * Creates an instance of score.
   * @param {*} kcmc      课程名称
   * @param {*} xdfsmc    类型
   * @param {*} xf        学分
   * @param {*} xnxqdm    学年学期
   * @param {*} xsxm      姓名
   * @param {*} zcj       总成绩
   * @memberof score
   */
  constructor(kcmc,xdfsmc,xf,xnxqdm,xsxm,zcj,length){
    this.kcmc = kcmc
    this.xdfsmc = xdfsmc
    this.xf = xf
    this.xnxqdm = xnxqdm
    this.xsxm = xsxm
    this.zcj = zcj
    this.color = color[num++ % 7]
    this.screenshow = true
  }
  
}
class scoreList{
  constructor(score,Year,schoolSemester,selectCourse,startYear){
    this.list = []
    this.zcj = []
    this.cj = []
    this.xf = []
    this.jd = []
    this.Year = Year
    this.schoolSemester = schoolSemester
    this.selectCourse = selectCourse
    this.startYear = startYear
    this.list = this.getscoreList(score)
    this.echartsValue = [0,0,0,0,0]
  }
  getscoreList(score){
    let pre
    let index = 0
    let list = []
    for(let item of score){
      if(!pre){
        pre = item
        list[index ++] = new scoreClass(item.kcmc,item.xdfsmc,item.xf,item.xnxqdm,item.xsxm,item.zcj,this.list.length)
      }else{
        if(pre.kcmc === item.kcmc){
          index --
        }
        list[index ++] = new scoreClass(item.kcmc,item.xdfsmc,item.xf,item.xnxqdm,item.xsxm,item.zcj,this.list.length)
        pre = item
      }
    }
    return list
  }
  getscore(){
    return this.list
  }
  getStoragescore(point){
    let realYear = 0
    let xq = 0
    switch(this.Year){
      case '全部':
        realYear = 'qb'
        break
      case '大一':
        realYear = Number(this.startYear);
        break;
      case '大二':
        realYear = Number(this.startYear) + 1;
        break;
      case '大三':
        realYear = Number(this.startYear) + 2;
        break;
      case '大四':
        realYear = Number(this.startYear) + 3;
        break;
    }
    switch(this.schoolSemester){
      case '全部':
        xq = '';
        break;
      case '上学期':
        xq = '01';
        break;
      case '下学期':
        xq = '02';
        break
    }
    //过滤后成绩容器
    let scoreFilter = []
    //判断学期不是全部情况
    if(xq !== ''){
      //判断学年选择是全部情况
      if(realYear === 'qb'){
        if(this.selectCourse === '不包含选修'){
          scoreFilter = this.list.filter((item) => {return item.xnxqdm.substring(4,6) === xq && item.xdfsmc === '必修'})
        }else{
          scoreFilter = this.list.filter((item)=>{return item.xnxqdm.substring(4,6) === xq})
        }
      //判断学年选择不是全部情况
      }else{
        let xnxq = realYear.toString().concat(xq)
        if(this.selectCourse === '不包含选修'){
          scoreFilter = this.list.filter((item) => {return item.xnxqdm === xnxq && item.xdfsmc === '必修'})
        }else{
          scoreFilter = this.list.filter((item) => {return item.xnxqdm === xnxq})
        }
      }
    //判断学期是全部情况
    }else{
      //判断学年选择是全部情况
      if(realYear === 'qb'){
        if(this.selectCourse === '不包含选修'){
          scoreFilter = this.list.filter((item) => {return item.xdfsmc === '必修'})
        }else{
          scoreFilter = this.list
        }
        //判断学年选择不是全部情况
      }else{
        let xnxq = realYear.toString()
        if(this.selectCourse === '不包含选修'){
          scoreFilter = this.list.filter((item) => {return item.xnxqdm.substring(0,4) === xnxq && item.xdfsmc === '必修'})
        }else{
          scoreFilter = this.list.filter((item) => {return item.xnxqdm.substring(0,4) === xnxq})
        }
      }
      
    }
    scoreFilter.forEach((item)=>{
      this.zcj.push(item.zcj)
      this.xf.push(item.xf)
    })
    let average = this.getAverage(point).toFixed(3)
    if(isNaN(average)){
      average = 0
    }
    let scoreObj = {
      scoreFilter:scoreFilter,
      average:average,
      echartsValue:this.echartsValue
    }
    return scoreObj
  }
  getAverage(point){
    this.zcj.forEach((item,index) => {
      switch(item){
        case '优秀':
          this.zcj[index] = "95";
          break;
        case '良好' || '合格':
          this.zcj[index] ="85";
          break;
        case '中等':
          this.zcj[index] = "75";
          break;
        case '及格':
          this.zcj[index] = "65";
          break;
        case '不及格'|| '不合格':
          this.zcj[index] = "0";
          break;
        default:
          break;
      }
    })
    let average = point.$store.state.info.userInfo.getTotal(this.zcj,this.xf).average
    this.echartsValue = point.$store.state.info.userInfo.getTotal(this.zcj,this.xf).echartsValue
    return average
  }
  getAxiosData(point){
    let Json = []
    this.getStoragescore(point).scoreFilter.forEach(item => {
      Json.push({
        courseName: item.kcmc,
        score: item.zcj,
        credit:item.xf
      })
    })
    return Json
  }
}
export {
  scoreList
}