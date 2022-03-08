import {getCache} from 'utils/index.js'
let ZoneWyu = ['8:15-9:00','9:05-9:50','10:10-10.55','11:00-11.45','14:45-15:30',
'15:35-16:20','16:30-17:15','17:20-18:05','19:30-20:15','20:25-21:10','21:30-22:10',
'22:15-23:00','12:30-13:15','13:20-14:05'];
let ZoneGut = ['8:15-9:00','9:05-9:50','10:10-10.55','11:00-11.45','13:30-14:15',
'14:20-15:05','15:10-15:55','16:15-17:00','17:05-17:50','18:30-19:15','19:20-20:05',
'20:10-20:55'];
class leftTimeClass{
  constructor(school = 0){
    this.school = school
    this.timeObj = [],
    this.timeZone = [];
    this.schoolTime();
    this.putTimenum();
  }
  putTimenum(){
    for(let i = 0;i < this.timeZone.length;i++){
      let obj = {}
      obj.timenum = i+1
      obj.time = this.timeZone[i]
      this.timeObj.push(obj)
    }
  }
  schoolTime(){
    if(this.school == 1){
      this.timeZone = ZoneWyu
    }else if(this.school == 2){
      this.timeZone = ZoneGut
    }else if(getCache('school') == '1'){
      this.timeZone = ZoneWyu
    }else if(getCache('school') == '2'){
      this.timeZone = ZoneGut
    }
  }
}
export {
  leftTimeClass
}