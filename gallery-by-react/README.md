# 图片画廊

## 搭建项目框架

1. 使用 create-react-app 创建项目结构
2. 配置 eslint


## 项目开发

### 主要项目文件说明

1. images: 图片存放位置
2. imageData.json: 图片描述信息，包括文件名、文件标题、文件描述信息
3. App.js: 项目开发的主要逻辑文件

### 计算每张图片的位置

图片位置分布在四个区域，中间区域，上分区，左分区、右分区。其中中间区域显示一张图片，上部区域显示一张图片，左右显示剩下的等分数量的图片。每个分区使用四个坐标点来标志范围，x[0], x[1], y[0], y[1]。图片的位置在范围内随机计算。

**上分区**
![top](./images/top.png)

**左右分区**
![left-right](./images/left-right.png)

### 图片翻转

大致 DOM 结构大致如下，正常展示图片，翻转展示 hello：

```html
<div class="wrap" onclick="handleClick()">
	<img src='' />
	<div class="desc">hello</div>
</div>
```

其主要样式大致如下：

```css
.wrap {
	width: 100px;
	transform-origin: 0 0 0;
	/* 其子元素位于 3D 空间 */
	transform-style: preserve-3d;
    transition: transform .6s ease-in-out;
	/* 其他 */

}

.inverse {
	/* 右移 wrap 的宽度之后，y 轴翻转 180 度，desc 相当于翻转 360度，也就是不翻转了 */
	transform: translateX(100px) rotateY(180deg);;
}

.desc {
	/* 完全覆盖 父元素的空间 */
	position: absolute;
	left: 0px;
	top: 0px;
	height: 100%;
	width: 100%;
	transform: rotateY(180deg);
	/* 其他 */

}
```








