class swiperNews{
  constructor(pictureUrl,navigateUrl = '',type, appID = ''){
    this.pictureUrl = pictureUrl;
    this.navigateUrl = navigateUrl;
    this.type = type;
    this.appID = appID
  }
  click(){
    if(this.type == 1){
      if(this.navigateUrl){
        uni.navigateTo({
          url: this.toNext
        });
      }
    }else if(this.type == 2){
      console.log("222");
      if(this.navigateUrl){
        uni.navigateTo({
          url: '/pages/web-view/index?path=' + this.navigateUrl
        })
      }
    }else if(this.type == 3){
      uni.navigateToMiniProgram({
        appId: this.toNext,//腾讯实时公交appid
        path: this.appID,
        envVersion: 'release',// 打开正式版
        success(res) {
          console.log(res)
        },
        fail: function (err) {
          console.log(err);
        }
      })
    }
  }
}

class swiperItem{
  // 发送请求获取来的数组funcNewsArray
  constructor(swiperArray){
    this.array = [];
    swiperArray.forEach(element => {
      // this.array.push(new swiperNews(element.pictureUrl,element.toNext,element.type))
      if(element.type === 1){
        this.array.push(new swiperNews(element.pictureUrl,element.navigateUrl,element.type))
      }else if(element.type === 2){
        this.array.push(new swiperNews(element.pictureUrl,element.navigateUrl,element.type))
      }
      else if(element.type === 3){
        this.array.push(new swiperNews(element.pictureUrl,element.navigateUrl,element.type,element.appID))
      }
    });
  }
}

export{
  swiperNews,
  swiperItem
}