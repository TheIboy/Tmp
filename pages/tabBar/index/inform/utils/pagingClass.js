class paging{
  constructor(kind,nowPage,allPage) {
    /*
    kind:类型
    nowPage：当前页数
    allPage:总页数
    */
    this.kind = kind;
    this.nowPage = nowPage;
    this.allPage = allPage;
  }
  changePage(type){
    if(type === "add"){
      if(this.nowPage<this.allPage){
        uni.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
        return this.nowPage ++;
      }else{
        uni.showToast({
          title: '已经是第一页了!',
          duration: 2000,
          icon:"none"
        })
      }
    }else if(type === "sub"){
      if(this.nowPage>1){
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 300
      });
        return this.nowPage--;
      }else{
        uni.showToast({
          title: '已经是第一页了!',
          duration: 2000,
          icon:"none"
        })
      }
    }
  }
  onClick(){
    
  }
}

export{
  paging
}