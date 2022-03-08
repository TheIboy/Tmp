import AbstractFactory from './AbstractFactory'
import WyuService from './service/WyuService'
import GutService from './service/GutService'
import NormalService from './service/NormalService'

class ServiceFactory extends AbstractFactory{
  constructor(){
    super()
  }
  // 创建普通用户请求
  createNormalService(){
    return new NormalService()
  }
  // 创建五邑大学请求
  createWyuService(){
    return new WyuService()
  }
  // 创建广东工业大学请求
  createGutService(){
    return new GutService()
  }
}

export default ServiceFactory