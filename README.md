# webpackConfig-Vue

a webpackConfig-Vue record

#参考 [webpack-配置](https://www.webpackjs.com/configuration/),[webpack-Loaders](https://www.webpackjs.com/loaders//),[webpack-Plugins](https://www.webpackjs.com/plugins/),
[vue-loader](https://vue-loader.vuejs.org/zh/)

### install

```
$ git clone https://github.com/DC911360/webpackConfig-Vue.git
$ npm install
$ npm start/ npm run dev
$ npm run build
```


### webpackConfig-Vue project-tree
```
webpackConfig-Vue
├─ .eslintrc.js
├─ .gitignore
├─ README.md
├─ babel.config.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ index.html
├─ src
│  ├─ .DS_Store
│  ├─ App.vue
│  ├─ main.js
│  ├─ router
│  │  └─ index.js
│  └─ views
│     ├─ .DS_Store
│     ├─ About
│     │  └─ index.vue
│     └─ Home
│        └─ index.vue
├─ webpack.config.js
├─ webpack.dev.js
└─ webpack.pro.js

```
webpack.config.js
- entry //入口文件
- output //出口文件
- module //loader 加载器
- plugins //plugin 插件
- mode // 开发/生产模式
- devtool // sourceMap
- optimization // 优化，分割
- devServer // 开发服务
- resolve // 自动补全 文件扩展名
- performance // 关闭性能分析，提高打包速度


### 代码引用
```
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path')
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin  } = require('webpack') //定义环境变量给代码使用

const isProduction = process.env.NODE_ENV ==="production"? true:false;

//返回样式处理 loader 函数   
const getStyleLoaders = (pre) => {
    return [
        isProduction? MiniCssExtractPlugin.loader:'vue-style-loader',
        'css-loader',   
        {
            //处理css 兼容性   
            //需要 package.json 中 browserslist 来处理兼容性
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env'
                    ]
                }
            }
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    entry: './src/main.js', //入口文件
    output: { //出口
        path:isProduction?path.resolve(__dirname, "./dist"):undefined, //路径
        filename: isProduction?"static/js/[name].[contenthash:10].js":"static/js/[name].js", //文件名称
        chunkFilename: isProduction?"static/js/[name].[contenthash:10].chunk.js":"static/js/[name].chunk.js", //动态导入， node_moudle
        assetModuleFilename: "static/media/[hash:10][ext][query]",// 静态资源 
        clean: true,
    },
    module: {
        rules: [
            //处理css
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },

            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader')
            },
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 图片小于 10kb 转换为 base64 格式, 
                    }
                }
            },
            //处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource" // asset:可以处理成base64 输出，  asset/resource 原封不动输出
            },
            //处理js
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "./src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                }

            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options:{
                    //开启缓存
                    cacheDirectory:path.resolve(__dirname,"./node_modules/.cache/vue-loader")
                }
            }

        ],
    },
    plugins: [
        // new NodePolyfillPlugin(),
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, '../src'), // 处理文件的路径
            exclude: "node_modules", // 排除文件不进行处理
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, "./node_modules/.cache/.eslintcache") //缓存文件存放的地址
            //thread 多线程打包
        }),

        //处理 html 文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),

        // //开发环境下 React 热更新 // 激活 JS    HMR 
        // new ReactRefreshWebpackPlugin({}),

        isProduction &&  new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
        }),
        isProduction &&  new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./public"),
                    to: path.resolve(__dirname, "./dist"),
                    globOptions: {
                        //忽略 piblic 中 index.html 文件
                        ignore: ['**/index.html', ],
                    },
                },

            ],
        }),
        new VueLoaderPlugin(),
         //cross-env 定义的变量是 给 webpack 打包工具使用的
        // DefinePlugin 定义的变量 是给 源代码使用的 ，解决vue 页面报警告的问题
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false ,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:true
        })
    ],
    mode: isProduction?'production':'development', // 生成环境会自动压缩 html文件
    devtool: isProduction?'source-map':'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups:{
                vue:{
                    test:/[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name:'vue-chunk',
                    priority:40,
                },
                elementPlus:{
                    test:/[\\/]node_modules[\\/]elementPlus(.*)?[\\/]/,
                    name:'elementPlus-chunk',
                    priority:30,
                },
                libs:{
                    test:/[\\/]node_modules[\\/]/,
                    name:'libs-chunk',
                    priority:20,
                }
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}.js `
        },
        minimize:isProduction,
        minimizer: [
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
            // `...`,
            new CssMinimizerPlugin(), //css 压缩
            new TerserPlugin(), // js   压缩

            //压缩图片
            // new ImageMinimizerPlugin({
            //     implementation:ImageMinimizerPlugin.imageminGenerate,
            //     options: {
            //         // Lossless optimization with custom option
            //         // Feel free to experiment with options for better result for you
            //         plugins: [
            //           ['gifsicle', { interlaced: true }],
            //           ['jpegtran', { progressive: true }],
            //           ['optipng', { optimizationLevel: 5 }],
            //           // Svgo configuration here https://github.com/svg/svgo#configuration
            //           [
            //             'svgo',
            //             {
            //               plugins:[
            //                 "preset-default",
            //                 "prefixIds",
            //                 {
            //                     name: 'removeViewBox',
            //                     params: {
            //                         xmlnsOrder: "alphabetical"
            //                     },
            //                 }
            //               ],
            //             },
            //           ],
            //         ],
            //       },
            // }),
        ],
    },

    //webpack 解析模块加载选项
    resolve: {
        //自动补全 文件扩展名
        extensions: [".vue", ".js", ".json"],
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true, //解决前端路由刷新 404 问题
    },
    performance:false,

}
```
### Dependencies
```
"devDependencies": {
    "@babel/eslint-parser": "^7.25.1",
    "@vue/cli-plugin-babel": "^5.0.8",
    "babel-loader": "^9.1.3",
    "copy-webpack-plugin": "^12.0.2",
    "cross-env": "^7.0.3",
    "css-loader": "^7.1.2",
    "css-minimizer-webpack-plugin": "^7.0.0",
    "eslint-webpack-plugin": "^4.2.0",
    "html-webpack-plugin": "^5.6.0",
    "less-loader": "^12.2.0",
    "mini-css-extract-plugin": "^2.9.0",
    "postcss": "^8.4.40",
    "postcss-loader": "^8.1.1",
    "postcss-preset-env": "^9.6.0",
    "sass": "^1.77.8",
    "sass-loader": "^16.0.0",
    "stylus-loader": "^8.1.0",
    "terser-webpack-plugin": "^5.3.10",
    "vue-loader": "^17.4.2",
    "vue-style-loader": "^4.1.3",
    "vue-template-compiler": "^2.7.16",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4",
    "webpack-server": "^0.1.2"
  },
  "dependencies": {
    "element-plus": "^2.7.8",
    "vue": "^3.4.34",
    "vue-router": "^4.4.0"
  }
  ```


