import Factory from './ServiceFactory'

class User{
  static factory = new Factory()
  /**
   * 用户构造器
   * @param {Object} object 用户信息
   * @returns User
   */
  constructor(object){
    if(!User._single){
      User._single = this
    }
    this.init(object)
    return User._single
  }
  /**
   * 初始化数据
   * @param { Object } data 用户信息
   */
  init(data){
    // 所在学校 0-> 普通用户 1 -> 五邑大学 2-> 广东工业大学
    User._single.school = data.school ? data.school : 0
    // 学院名称
    User._single.college = data.college
    // 专业名称
    User._single.major = data.major
    // 班级
    User._single.myClass = data.myClass
    // 姓名
    User._single.name = data.name
    // 性别
    User._single.sex = data.sex
    // 学号
    User._single.studentNum = data.studentNum
    // 入学年份
    User._single.year = data.year
    // 对应请求
    User._single.service = this.getService(User._single.school)
  }
  /**
   * 获取不同学校对应请求
   * @param { Number } type 学校类型
   */
  getService(type){
    switch (type) {
      case 0:
        return User.factory.createNormalService()
      case 1:
        return User.factory.createWyuService()
      case 2:
        return User.factory.createGutService()
      default:
        throw new Error('TypeError exception')
    }
  }
  getTotal(zcj,xf){
    return this.school=='2' ? this.getTotalOld(zcj,xf) : this.getTotalNew(zcj,xf)
  }
  getTotalOld(zcj,xf){
    let echartsValue = [0,0,0,0,0];
    zcj.forEach(item => {
      switch( true ) {
        case item>=91 && item<=100 || item  == '优秀':
          echartsValue[0]++
          break;
        case item>=81 && item<=90 || item == '良好' || item == '合格':
          echartsValue[1]++
          break;
        case  item>=71 && item<=80 || item =='中等':
          echartsValue[2]++
          break;
        case  item>=60 && item<=70 || item =='及格':
          echartsValue[3]++
          break;
        case  item < 60 || item == '不及格' || item.zcj == '不合格':
          echartsValue[4]++
          break;
        default:
          break;
      }
    })
    let totalscore = 0;
    let totalxf = 0;
    let jd = 0
    for(let i = 0 ;i<zcj.length;i++){
      jd = 5-(100-Number(zcj[i]))*0.1;
      totalscore += Number(jd) * Number(xf[i])
      totalxf += Number(xf[i])
    }
    let average = Number(totalscore/totalxf)
    let scoreObj = {
      average : average,
      echartsValue : echartsValue
    }
    return scoreObj
  }
  getTotalNew(zcj,xf){
    let jd = [];
    let echartsValue = [0,0,0,0,0];
    zcj.forEach(item => {
      switch( true ) {
        case item>=96 && item<=100 :
          jd.push(5)
          echartsValue[0]++
          break;
        case item>=91 && item<=95 || item  == '优秀':
          jd.push(4.5)
          echartsValue[0]++
          break;
        case item>=86 && item<=90 :
          jd.push(4.0)
          echartsValue[1]++
          break;
        case  item>=81 && item<=85 || item == '良好' || item == '合格':
          jd.push(3.5)
          echartsValue[1]++
          break;
        case  item>=76 && item<=80:
          jd.push(3.0)
          echartsValue[2]++
          break;
        case  item>=71 && item<=75 || item =='中等':
          jd.push(2.5)
          echartsValue[2]++
          break;
        case  item>=66 && item<=70:
          jd.push(2.0)
          echartsValue[3]++
          break;
        case  item>=61 && item<=65 || item =='及格':
          jd.push(1.5)
          echartsValue[3]++
          break;
        case  item == 60:
          jd.push(1)
          echartsValue[3]++
          break;
        case  item < 60 || item == '不及格' || item.zcj == '不合格':
          jd.push(0)
          echartsValue[4]++
          break;
        default:
          break;
      }
    })
    let totalscore = 0
    let totalxf = 0
    for(let i = 0;i<jd.length;i++){
      totalscore += Number(jd[i])*Number(xf[i])
      totalxf += Number(xf[i])
    }
    let average = Number(totalscore/totalxf)
    let scoreObj = {
      average : average,
      echartsValue : echartsValue
    }
    return scoreObj
  }
}

export default User