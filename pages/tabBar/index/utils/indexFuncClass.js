// 首页功能类
class funcNews{
  constructor(icon,name,type,url){
    this.icon = icon;
    this.name = name;
    this.type = type;
    this.url = url;

  }
  click(){
    // console.log("123");
    // console.log(this.icon);
    if(this.type == 1){
      uni.navigateTo({
        url: this.url
      });
    }else if(this.type == 2){
      uni.navigateToMiniProgram({
        appId: this.url,//腾讯实时公交appid
        path: '',
        envVersion: 'release',// 打开正式版
        success(res) {
          console.log(res)
        },
        fail: function (err) {
          console.log(err);
        }
      })
    }else if(this.type == 4){
      uni.navigateTo({
        url: '/pages/web-view/index?path=' + this.url
      })
    }
  }
}
class funcNewsItem{
  // 发送请求获取来的数组funcNewsArray
  constructor(funcNewsArray){
    this.array = [];
    funcNewsArray.forEach(element => {
      this.array.push(new funcNews(element.icon,element.name,element.type,element.url,element.appId))
    });
  }
}

export{
  funcNews,
  funcNewsItem
}