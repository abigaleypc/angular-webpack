

### 项目目录

```
├── dist                   // 打包后生成的静态文件
│   ├── app.js
│   └── index.html
├── package.json           // 项目配置文件
├── src                    // 项目源文件
│   ├── app.js
│   └── index.html
└── webpack.config         // Webpack打包工具配置文件
    ├── base.js
    ├── dev.js
    └── pro.js
```

### 初始化项目

在命令面板敲下npm init 初始化项目并生成 package.json 。

* 新建项目 `mkdir angular-webpack`
* 切换进入 `cd angular-webpack`
* 初始项目 `npm init`
* 安装框架 `npm install angular --save-dev` ( 如已安装yarn，可直接执行`yarn add angular` )

### 入口文件

* 新建`src`文件夹，存放业务代码。在src下新建`index.html`入口文件。

 src / index.html

```html
<!DOCTYPE html>
<html lang="en" ng-app="app"> // 指定当前这个元素是根元素。
<head>
    <meta charset="UTF-8">
    <title>Dome</title>
</head>
<body>
    <div ng-controller="AppCtrl as vm"> // 为应用添加控制器
      <h1 class="title">Hello</h1>
      <a ng-href="{{vm.url}}" target="_blank">Welcome to Abigale's Blog</a>
    </div>
</body>
</html>

```

* 新建`app.js`文件，与`index.html`实现双向绑定。

src / app.js

```javascript
const angular = require('angular')

class AppCtrl {
  constructor() {
    this.url = 'https://abigaleypc.github.io';
  }
}

var AppModule = angular.module('app', [])
  .controller('AppCtrl', AppCtrl);

module.exports = AppModule;

```


### 添加Webpack模块

* 安装模块 `npm install webpack --save-dev`

### 编写配置文件

* 新建配置文件夹 `webpack.config`,在该文件夹之下新建`base.js`

webpack.config / base.js

```
const path = require('path')
const root = path.resolve(__dirname, '..') // 项目的根目录绝对路径

module.exports = {
    entry: path.join(root, 'src/app.js'), // 入口文件路径
    output: {
        path: path.join(root, 'dist'), // 出口目录
        filename: 'app.js' // 出口文件名
    },
    resolve: {
        alias: { // 配置目录别名
            // 在任意目录下require('components/example') 相当于require('项目根目录/src/components/example')
            components: path.join(root, 'src/components'),
            views: path.join(root, 'src/views'),
            styles: path.join(root, 'src/styles'),
            store: path.join(root, 'src/store')
        },
        extensions: ['', '.js'], // 引用js和vue文件可以省略后缀名
        fallback: [path.join(root, 'node_modules')] // 找不到的模块会尝试在这个数组的目录里面再寻找
    },
    resolveLoader: {
        fallback: [path.join(root, 'node_modules')] // 找不到的loader模块会尝试在这个数组的目录里面再寻找
    },
    module: { // 配置loader
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ } // .js文件使用babel-loader，切记排除node_modules目录
        ]
    }
}
```

webpack.config / dev.js

```
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./base')
const root = path.resolve(__dirname, '..') // 项目的根目录绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    devServer: {
        historyApiFallback: true, // 404的页面会自动跳转到/页面
        inline: true, // 文件改变自动刷新页面
        progress: true, // 显示编译进度
        colors: true, // 使用颜色输出
        port: 3000, // 服务器端口
    },
    devtool: 'source-map', // 用于标记编译后的文件与编译前的文件对应位置，便于调试
    entry: [
        'webpack/hot/dev-server', // 热替换处理入口文件
        path.join(root, 'src/app.js')
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 添加热替换插件,每次改动文件不会再整个页面都刷新
        new HtmlWebpackPlugin({
            template: path.join(root, 'src/index.html'), // 模板文件
            inject: 'body' // js的script注入到body底部, 使用HtmlWebpackPlugin，实现js入口文件自动注入
        })
    ]
})
```

webpack.config / pro.js

```
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./base')
const root = path.resolve(__dirname, '..')

module.exports = merge(baseConfig, {
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(root, 'src/index.html'), // 模板文件
            inject: 'body' // js的script注入到body底部
        })
    ]
})
```

### 执行命令

在项目 `package.json` 中添加如下命令

```
"scripts": {
    "dev": "webpack-dev-server --config webpack.config/dev.js",
    "build": "webpack --config webpack.config/pro.js"
  }
```

打开命令面板

* 执行 `npm run dev` ，打开浏览器 `http://localhost:3000/`。
* 执行 `npm run build`，生成 `dist`下静态文件。
