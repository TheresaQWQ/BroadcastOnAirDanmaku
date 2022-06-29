# BroadcastOnAirDanmaku

## 安装方法
- 首先去安装nodejs运行环境，可以在 [这里下载](https://nodejs.org/zh-cn/)
- 点击右上角的Code按钮，里面有个Download ZIP，点击就可以下载这个仓库的代码压缩包
- 找个地方解压
- 打开终端，运行如下代码 `npm install` 安装依赖包
- 运行 `node app.js` 启动服务
- 如果需要修改端口可以参考下文

## 使用方法
1. OBS添加浏览器源
2. 链接填写: http://localhost:3000/#房间号

## 修改配置
### 字体，弹幕速度等参数
`public/style.css` 文件中，21~24行

- time：弹幕出现时长，以毫秒为单位
- size：文字和图片的大小
- font-weight：字体粗细，默认粗体

### 修改启动端口
- 在启动的时候，添加 `--port 端口` 参数即可
- 例如: `node app.js --port 2333`

### 可选参数
- 关闭头像: ?avatar=false
- 关闭用户名: ?name=false

## 已知问题
- 大量弹幕环境中获取头像可能会导致风控，请自行判断是否需要关闭头像

## 一个截图
![截图1](images/1.png)