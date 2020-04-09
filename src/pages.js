/**
 * 此文件为@dcloudio/webpack-uni-pages-loader的一个钩子入口，遵循CommonJs规范
 * 可以直接使用require引入其他依赖，但是不会有热重载的效果
 * uni-pages-hot-modules在被初始化之后，可以引入其他依赖，并且相关依赖具备热重载
 */

// 引入一个工具函数，用于对pages进行去重和设置首页（没有使用热重载引入，因为没必要）
const { removeDuplicationAndSetIndexPage } = require('./utils/uniPagesUtils_commonJs')

/**
 * 输出最终的pages.json解析内容
 * @param pagesJson <Object> src/pages.json的文件解析内容（作为初始内容传入）
 * @param loader <Object> @dcloudio/webpack-uni-pages-loader会传入一个loader对象
 */
function exportPagesConfig (pagesJson={}, loader={}) {
    // 初始化uni-pages-hot-modules（输入loader）
    const hotRequire = require('uni-pages-hot-modules')(loader)
    // pages的初始配置
    let basePages = []
    // subPackages的初始配置
    let baseSubPackages = []

    return {
        // 合并pages.json的初始内容
        ...pagesJson,
        pages: removeDuplicationAndSetIndexPage([
                ...basePages,
                ...hotRequire('./page_modules/tabbar.js'),
                // 故意重复引入，用来验证去重方法
                ...hotRequire('./page_modules/tabbar.js'),
                ...hotRequire('./page_modules/component.js'),
                ...hotRequire('./page_modules/appPlus.js')
            ],
            // 设置首页(可省)
            'pages/component/swiper/swiper'),
        subPackages: [
            ...baseSubPackages,
            ...hotRequire('./subpackage_modules/api.js'),
            ...hotRequire('./subpackage_modules/extUI.js'),
            ...hotRequire('./subpackage_modules/template.js')
        ]
    }
}

module.exports=exportPagesConfig
