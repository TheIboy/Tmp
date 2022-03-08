// 列表item类
class informNews{
  /*
  标题 title
  作者 author
  时间 publishDate
  wbNewsId wbNewsId
  btreeId btreeId 
  */
  constructor(title,author,publishDate,wbNewsId=0,btreeId=0,read,oldUrl){
    this.title = title;
    this.author = author;
    this.publishDate=publishDate;
    this.wbNewsId=wbNewsId;
    this.btreeId = btreeId;
    this.read = read
    this.oldUrl = oldUrl
  }
}
// 列表类
class informNewsItem{
  // 发送请求获取来的数组informArray
  constructor(informArray,allPage,btreeId){
  this.array=[]
  this.allPage =allPage
  this.btreeId = btreeId
  informArray.forEach(element => {
    this.array.push(new informNews(element.title,element.author,element.publishDate,element.wbNewsId,element.btreeId,element.read,element.oldUrl))
  });
  }
}






export{
  informNews,
  informNewsItem
}