// cp 列表类
class CPNews{
  constructor(partnerId,avatar,realName,bindingTime,differDay,school){
    this.partnerId = partnerId;
    this.avatar = avatar;
    this.realName = realName;
    this.bindingTime = bindingTime;
    this.differDay = differDay;
    this.school = school
  }
}
// 列表类
class CPItem{
  // 发送请求获取来的数组informArray
  constructor(CPArray){
  this.array=[]
  let nowDate = new Date();
  CPArray.forEach(element => {
    // 计算cp天数
    let startDate = new Date(element.bindingTime);
    let differDay = (nowDate - startDate + 8 * 1e3 * 3600) / 1e3 / 24 / 3600
    differDay = (differDay) >> 0
    this.array.push(new CPNews(element.partnerId,element.avatar,element.realName,element.bindingTime,differDay,element.school))
  });
  }
}






export{
  CPNews,
  CPItem
}