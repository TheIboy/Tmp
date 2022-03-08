import { baseUrlApi } from 'utils/api'
class list{
  constructor(name, icon){
    // 列表名称
    this.name = name
    // 显示icon
    this.icon = baseUrlApi + 'icon/img/' + icon
    //右箭头
    this.arrow = baseUrlApi + 'icon/img/右箭头bfbfbf.png'
	}
}

class pageList extends list{
  constructor(name, icon, url){
		super(name,icon)
    this.url = '/pages/tabBar/profile/innerRouter/' + url
  }

  click(){
    uni.navigateTo({
      url:this.url
    })
  }
}
function Factory(name, icon, url,type){
  return new pageList(name, icon, url)
}

export { Factory }