# 打包步骤
### 成绩模块echarts
  * 从uniapp插件市场下载echarts插件 -> 秋云 ucharts echarts 高性能跨全端图表组件(推荐使用v2.0)->直接点击Hbuilderx导入插件
  * 进入链接 https://demo.ucharts.cn/#/ -> 在线生成工具 -> type选择饼状图 -> canvasId输入m47q94iWdR9cPX7aAnnLC1h4rDU6rTr7 此码为规定的32位字符串-> 打开canvas2D->关闭animation ->其他默认不动
  * 右边配置代码config-ucharts.js，复制该代码  -> 回到开发环境打开uni_modules\qiun-data-charts\js_sdk\u-charts\config-ucharts.js -> 找到"pie" -> 整体粘贴替换掉该段"pie"：{}对象代码
# 分支规范
* ### 命名规范
  - feature/日期-需求名称
* ### 拉取规范
  - 一个需求一个分支，如果需求太大要自己细分需求，一个需求的开发周期尽量不要超过一周
  - 如果存在父需求，需要拉取父需求对应分支的最新代码，根据最新代码拉出一个新的分支
  - 如果不存在父需求，则获取最新的master代码，根据master拉出一个新的分支

# BEM命名规范
### BEM是三个单词的缩写：Block（块）代表更高级别的抽象或组件，Element（元素） Block的后代，以及Modifier（修饰） 不同状态的修饰符。
```
.block__element--modifier {
  display: flex;
}

.block-block {
  display: flex;
}

.block--modifier {
  display: flex;
}

.block__element {
  display: flex;
}
```
* Block
  - 负责描述功能的，不应该包含状态。
    ```
    /* correct */
    .header {
    ​
    }
    ​
    /* wrong */
    .header--select {
    ​
    }
    ```
  - 不能使用元素选择器和ID选择器
    ```
    /* correct */
    .header {
    ​
    }
    ​
    /* wrong */
    .header a {
      margin-top: 50px;
    }
    ```
* Element
  - 是用一个双下划线隔开
    ```
    /* correct */
    .header__body {
      margin-top: 50px;
    }
    ​
    /* wrong */
    .header .body {
      margin-top: 50px;
    }
    ```
  - 表示的是目的，而不是状态，如下例子：目的是在header下面定义三个区域 body、logo、title，但是并没有指定任何状态。
    ```
    .header__body {
      margin-top: 50px;
    }
    ​
    .header__logo {
      margin-top: 50px;
    }
    ​
    .header__title {
      margin-top: 50px;
    }
    ```
  - 不能脱离Block父级单独使用
    ```
    /* correct */
    <p class="header">
      <p class="header__body">
        <button class="header__button--primary"></button>
        <button class="header__button--default"></button>
      </p>
    </p>
    ​
    /* wrong */
    <p>
      <p class="header__body">
        <button class="header__button--primary"></button>
        <button class="header__button--default"></button>
      </p>
    </p>
    ```
* Modifier
  - 表示的是一个状态，是用双横杠分开的。
    ```
    .header__button--default {
      background: none;
    }
    ```
  - Boolean
    ```
    .header__button--select {
      background: none;
    }
    ```
  - 枚举
    ```
    .header__button--primary {
      background: #329FD9;
    }
    ```
  - 不能单独使用
    ```
    /* correct */
    <p class="header">
      <p class="header__body">
        <button class="header__button--primary"></button>
        <button class="header__button--default"></button>
      </p>
    </p>
    ​
    /* wrong */
    <p>
      <p>
        <button class="header__button--primary"></button>
        <button class="header__button--default"></button>
      </p>
    </p>
    ```

# 特殊注释
*TODO *在该注释处有功能代码待编写，待实现的功能在说明中会简略说明

*FIXME *在该注释处代码需要修正，甚至代码是错误的，不能工作，需要修复，如何修正会在说明中简略说明

*XXX *在该注释处代码虽然实现了功能，但是实现的方法有待商榷，希望将来能改进，要改进的地方会在说明中简略说明

*NOTE *在该注释处说明代码如何工作

*HACK *在该注释处编写得不好或格式错误，需要根据自己的需求去调整程序代码

*BUG *在该注释处有 Bug
```
// TODO功能未完成，待完善
// FIXME  待修复
// XXX    实现方法待确认
// NOTE   代码功能说明
// HACK   此处写法有待优化
// BUG    此处有 Bug
```