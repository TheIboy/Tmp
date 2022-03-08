// 义工列表item属性类
class second{
  /**
   * Creates an instance of second.
   * @param {*} rdxf 分数
   * @param {*} xmfl 名字
   * @param {*} xnxqmc  学期
   * @memberof second
   */
  constructor(rdxf,xmfl,xnxqmc){
    this.rdxf = rdxf;
    this.xmfl=xmfl;
    this.xnxqmc = xnxqmc;
  }
}

// 义工列表列表类
class secondItem{
  // 发送请求获取来的数组informArray
  constructor(secondArray){
    this.array=[]
    secondArray.forEach(element => {
    this.array.push(new second(element.rdxf,element.xmfl,element.xnxqmc))
  });
  }
}

export{
  secondItem
}