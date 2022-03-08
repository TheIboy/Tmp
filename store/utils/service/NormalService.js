
import announcement from './Normal/announcement'
import bug from "./Normal/bug";
import help from './Normal/help'
import login from './Normal/login'
import message from './Normal/message'
import redPaper from './Normal/redPaper'
import release from './Normal/release'
import schedule from './Normal/schedule'
import school from "./Normal/school"
import score from "./Normal/score"
import user from "./Normal/user"
import volunteer from "./Normal/volunteer"

class NormalService{
  constructor(){
    this.announcement = announcement
    this.bug = bug
    this.help = help
    this.login = login
    this.message = message
    this.redPaper = redPaper
    this.release = release
    this.schedule = schedule
    this.school = school
    this.score = score
    this.user = user
    this.volunteer = volunteer
  }
}

export default NormalService