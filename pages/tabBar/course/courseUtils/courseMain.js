import { baseUrlApi } from 'utils/api'
// 得到总课程表
let parentCou 
let tempCover = 0
let all  
class courseClass{
  constructor(kcmc,teaxms,jxbmc,zc,jcdm,xq,jxcdmc,sknrjj){
    this.kcmc = kcmc//课程名称
    this.teaxms = teaxms//教师名称
    this.jxbmc = jxbmc//教学班名称
    this.zc = zc//周次
    this.jcdm = jcdm.replace(/,/g,'')//节次代码
    this.xq = xq//星期
    this.jxcdmc = jxcdmc//教师场地名称
    this.sknrjj = sknrjj//上课内容简介
    this.width = 12.5//平移宽度
    this.courseheight = 55//基础课程高度
    this.zCover = 0
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
    this.changeZindex()
  }
  getLeft(xq){
    // 获取距左高度
    return xq==7?this.width + '%':xq*this.width + this.width + '%'
  }
  getTop(start){
    let height
    // 获取距顶高度
    if(typeof(start)!=='string'){
      height = 138+110*start/2 - 110 + 'px'
    }else{
      height = 138 + start*this.courseheight - this.courseheight + 'px'
    }
    
    return height
  }
  getHeight(){
    // 获取长度
    return this.jcdm.length/2*this.courseheight-8 +'px'
  }
  getMaxHeight(){
    // 获取最大长
    return this.jcdm.length/2*this.courseheight-8 +'px'
  }
  changeZindex(){
    if(!parentCou){
      parentCou = this
    }else{
      if((this.jcdm.includes(parentCou.jcdm) || parentCou.jcdm.includes(this.jcdm))&&this.zc === parentCou.zc && this.xq === parentCou.xq){
        this.zCover = ++ tempCover
      }else{
        tempCover = 0
      }
      parentCou = this
    }
  }
  setzCover(item,index){
    let windowRepeat = []
    for(let i = item.zCover;i>=0;i--){
      windowRepeat.push(all[index])
      index -- ;
    }
    console.log(windowRepeat)
    return windowRepeat
  }
}

class courseObj{
  constructor(course, type){
    this.info = []
    this.putObj(course, type)
  }
  putObj(course, type){
    course.forEach((item)=>{
      if(type){// 导入课表
        this.info.push(new courseClass(item.courseName,item.teachers,item.className,item.week,item.section,item.weekDay,item.courseLocation,item.courseContent))
      }else{  // 从缓存拿数据
        this.info.push(new courseClass(item.kcmc,item.teaxms,item.jxbmc,item.zc,item.jcdm,item.xq,item.jxcdmc,item.sknrjj))
      }
    })
    all = this.info
  }
  getInfo(){
    return this.info
  }
}
export{
  courseObj,
}