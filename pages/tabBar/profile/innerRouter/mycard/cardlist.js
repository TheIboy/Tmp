import {baseUrlApi} from 'utils/api'
class cardClass{
  constructor(icon,title,info){
    this.icon = baseUrlApi + icon
    this.title = title
    this.info = info
  }
}

function cardFac(type,info){
  switch (type){
    case 'name': 
    return new cardClass('icon/img/姓名（彩）.png','姓名',info);
    break;
    case 'num': 
    return new cardClass('icon/img/学号（彩）.png','学号',info);
    break;
    case 'institude': 
    return new cardClass('icon/img/学院（彩）.png','学院',info);
    break;
    case 'grade': 
    return new cardClass('icon/img/年级（彩）.png','年级',info);
    break;
    case 'class': 
    return new cardClass('icon/img/班级（彩）.png','班级',info);
    break;
    case 'profession': 
    return new cardClass('icon/img/专业（彩）.png','专业',info);
    break;
  }
}
export { cardFac }