const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin  } = require('webpack') //定义环境变量给代码使用

const path = require('path')



//返回样式处理 loader 函数
const getStyleLoaders = (pre) => {
    return [
        'vue-style-loader',
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
        path: undefined, //路径
        filename: "static/js/[name].js", //文件名称
        chunkFilename: "static/js/[name].chunk.js", //动态导入， node_moudle
        assetModuleFilename: "static/media/[hash:10][ext][query]",// 静态资源        
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
                loader: 'vue-loader'
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

        new MiniCssExtractPlugin(),

        new VueLoaderPlugin(),


        //cross-env 定义的变量是 给 webpack 打包工具使用的
        // DefinePlugin 定义的变量 是给 源代码使用的 ，解决vue 页面报警告的问题
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false ,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:true
        })

    ],
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}.js `
        }
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true, //解决前端路由刷新 404 问题
    },

    //webpack 解析模块加载选项
    resolve: {
        //自动补全 文件扩展名
        extensions: [".vue", ".js", ".json"],


    },
}