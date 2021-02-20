# APP

****目录结构骨架****
```
├── app                 // 应用App入口
|  ├── components       // 全局公用组件
|  ├── config           // 配置文件
|  ├── index.js         // 路由入口文件
|  ├── less             // 全局样式
|  ├── pages            // 各个功能页面

|  └── redux            // redux逻辑目录
|  └── util             // 工具类
├── assets              // 静态资源文件
|  ├── data         
|  ├── iconfot
|  ├── icons
|  └── images
|  └── js
├── dist                // 打包后生成的文件 
|  ├── assets
|  ├── index.html
|  ├── js
|  └── vendors~main.70af83f0.chunk.js
├── index.html          // main入口html
├── index.js            // main入口文件
├── package-lock.json
├── package.json
├── README.md
├── webpack.dev.config.js   // 开发配置
└── webpack.pro.config.js   // 生成配置
```
****打包流程步骤****
1. 进入webpack.dev.config.js将output.publicPath="./" (发布完要改回"/"，不然资源文件访问不到)
2. 进入config文件修改commonUrl = 'http://192.168.111.132:8080'(打包后修改为commonUrl = '/api';)
3. 根目录下执行 npm run hb

****列表ListView组件****
```
1.import ListView from "{相对路径}/component/homeListView/listViewComp" //引入方式
2.所有复杂渲染都已经封装组件了，你只需传参就行，只针对本项目的列表统一封装，其他不同渲染方式另外。
3.参数说明
ListViewComp.propTypes = {
  url: PropTypes.string.isRequired,  //请求url地址
  params: PropTypes.object.isRequired, //请求传入的参数，没有参数传 空{} 
  columnCode: PropTypes.string,       //tab切换作用。（注意：不同tab传不同的标识进去，例如有两个tab1，tab2，那就分别传入）， 没有tab的别传
  row: PropTypes.func.isRequired, 每行渲染的dom元素。最外层为div 例如<div>{props.children}</div>
  useBodyScroll:PropTypes.bool //是否使用html展示的body作为滚动容器 ，例如 false ，我里面已经自动处理，就是固定的容器。

}
```
****启动****
```
1. npm i
2. npm run dev
```

****npm设置淘宝源****
```
淘宝源地址：npm config set registry https://registry.npmjs.org/
源地址：npm config set registry https://registry.npm.taobao.org
```