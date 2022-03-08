import NormalService from './NormalService'
import notify from './Wyu/notify'
class WyuService extends NormalService{
  constructor(){
    super()
    this.notify = notify
  }
}

export default WyuService