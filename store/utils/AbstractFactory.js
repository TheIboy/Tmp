class AbstractFactory{
  constructor(){
    if(new.target === AbstractFactory){
      throw new Error('Instantiation exception')
    }
  }
  // 创建普通用户请求
  createNormalService(){
    throw new Error('Override exception')
  }
  // 创建五邑大学请求
  createWyuService(){
    throw new Error('Override exception')
  }
  // 创建广东工业大学请求
  createGutService(){
    throw new Error('Override exception')
  }
}

export default AbstractFactory