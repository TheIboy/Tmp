import { baseUrlApi } from 'utils/api'
class indexSchedule{
  constructor(timeText, time, location, teacher, kcmc){
    // 第几大节
    this.timeText = timeText
    // 上课时间
    this.time = time
    // 上课地点
    this.location = location
    // 授课教师
    this.teacher = teacher
    // 课程名称
    this.name = kcmc
  }
}

class schedule{
  constructor(kcmc,teaxms,jxbmc,zc,jcdm,xq,jxcdmc,sknrjj){
    // 课程名称
    this.kcmc = kcmc
    // 教师名称
    this.teaxms = teaxms
    // 教学班名称
    this.jxbmc = jxbmc
    // 周次
    this.zc = zc
    // 节次代码
    this.jcdm = jcdm
    // 星期
    this.xq = xq
    // 教学场地名称
    this.jxcdmc = jxcdmc
    // 上课内容简介
    this.sknrjj = sknrjj
    this.window= [
      {
        title:"教室：",
        img: baseUrlApi + "icon/img/地点.png",
        windowinfo:jxcdmc
      },
      {
        title:"节数: ",
        img: baseUrlApi + "icon/img/时间.png",
        windowinfo:jcdm
      },{
        title:"周次: ",
        img: baseUrlApi + "icon/img/本周.png",
        windowinfo:zc
      },{
        title:"老师: ",
        img: baseUrlApi + "icon/img/教师.png",
        windowinfo:teaxms
      },{
        title:"班级: ",
        img: baseUrlApi + "icon/img/班级.png",
        windowinfo:jxbmc
      },{
        title:"内容: ",
        img: baseUrlApi + "icon/img/内容.png",
        windowinfo:sknrjj
      },]
  }
  // 首页课程显示数据
  indexSchedule(){
    switch (this.jcdm) {
      case "0102":
        return new indexSchedule("第一大节", "8:15-9:50", this.jxcdmc, this.teaxms, this.kcmc)
      case "0304":
        return new indexSchedule("第二大节", "10:10-11:45", this.jxcdmc, this.teaxms, this.kcmc)
      case "01020304":
        return new indexSchedule("一二大节", "8:15-11:45", this.jxcdmc, this.teaxms, this.kcmc)
      case "010203":
        return new indexSchedule("早上三小节", "8:15-10:55", this.jxcdmc, this.teaxms, this.kcmc)
      case "0506":
        return new indexSchedule("第三大节", "14:45-16:20", this.jxcdmc, this.teaxms, this.kcmc)
      case "0708":
        return new indexSchedule("第四大节", "16:30-18:05", this.jxcdmc, this.teaxms, this.kcmc)
      case "05060708":
        return new indexSchedule("三四大节", "14:45-18:05", this.jxcdmc, this.teaxms, this.kcmc)
      case "050607":
        return new indexSchedule("下午三小节", "14:45-17：15", this.jxcdmc, this.teaxms, this.kcmc)
      case "0910":
        return new indexSchedule("第五大节", "19:30-21:10", this.jxcdmc, this.teaxms, this.kcmc)
      case "1112":
        return new indexSchedule("第六大节", "21:20-23:00", this.jxcdmc, this.teaxms, this.kcmc)
      case "09101112":
        return new indexSchedule("五六大节", "19:00-22:00", this.jxcdmc, this.teaxms, this.kcmc)
      case "091011":
        return new indexSchedule("晚上三小节","19:30-22:00", this.jxcdmc, this.teaxms, this.kcmc)
      case "1314":
        return new indexSchedule("第八大节", "12:30-14:05", this.jxcdmc, this.teaxms, this.kcmc)
      default:
        throw new Error('Parameter exception')
    }
  }
}

class scheduleFactory{
  constructor(arr){
    this.data = []
    this.initData(arr)
  }
  initData(arr){
    arr.forEach(item => {
      this.data.unshift(new schedule(item.kcmc,item.teaxms,item.jxbmc,item.zc,item.jcdm,item.xq,item.jxcdmc,item.sknrjj))
    });
  }
}

export default scheduleFactory