// 列表item属性类
class exam{
  /**
   * Creates an instance of examitem.
   * @param {*} kcmc  科目
   * @param {*} ksrq  日期
   * @param {*} kssj  时间
   * @param {*} kscdmc 考试教室
   * @param {*} ksaplxmc 考试类型（教务处统考）
   * @param {*} jkteaxms 监考员
   * @memberof examitem
   */
  constructor(kcmc,ksrq,kssj,kscdmc,ksaplxmc,jkteaxms){
    this.kcmc = kcmc;
    this.ksrq=ksrq;
    this.kssj=kssj;
    this.kscdmc=kscdmc;
    this.ksaplxmc=ksaplxmc;
    this.jkteaxms=jkteaxms;
  }
}

// 列表类
class examItem{
  // 发送请求获取来的数组informArray
  constructor(examArray){
    this.array=[]
    examArray.forEach(element => {
    this.array.push(new exam(element.kcmc,element.ksrq,element.kssj,element.kscdmc,element.ksaplxmc,element.jkteaxms))
  });
  }
}


export{
  exam,
  examItem
}