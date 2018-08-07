import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import cloneDeep from 'lodash/cloneDeep'

import './App.css'

// 读取图片数据描述
let imageData = require('./data/imageData.json')

// 给每条图片数据增加路径信息
function setImageUrl(imageArray) {
    const len = imageArray.length
    for (let i = 0; i < len; i += 1) {
        imageArray[i].url = require(`./images/${i + 1}.jpg`)
    }
    return imageArray
}

imageData = setImageUrl(imageData)

/**
 * [getRandomRange 获取 low 到 high 之间的随机整数]
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 * @return {[type]}      [description]
 */
function getRandomRange(low, high) {
    return Math.ceil(low + Math.random() * (high - low))
}

/**
 * [getRandom30Deg 获取 -30 到 30 之间的随机数]
 * @return {[type]} [description]
 */
function getRandom30Deg() {
    return Math.ceil((Math.random() > 0.5 ? 1 : -1) * Math.random() * 30)
}

/**
 * 单个图片
 */
class ImageFigure extends Component {
    handleClick = () => {
        const { handleInverse, handleCenter, info: { center } } = this.props
        if (!center) {
            handleCenter()
        } else {
            handleInverse()
        }
    }
    render() {
        const { data: { url, title, desc }, info: { left, top, rotate, inverse, center } } = this.props
        const positionStyle = {
            left,
            top,
        }
        // 如果旋转角度不为0，设置旋转角度（中心图片没有旋转角度）
        if (rotate) {
            positionStyle.transform = `rotate(${rotate}deg)`
        }
        // 防止中心图片被遮挡
        if (center) {
            positionStyle.zIndex = 11
        }
        let classNames = 'figure-wrap'
        if (inverse) {
            classNames += ' is-inverse'
        }
        return (
            <figure className={classNames} style={positionStyle} onClick={this.handleClick}>
                <img className="figure-image" src={url} alt={title} />
                <figcaption>
                    <div className="figure-title">{title}</div>
                    <div className="figure-desc">{desc}</div>
                </figcaption>
            </figure>
        )
    }
}

/**
 * 控制组件
 */
class Controller extends Component {
    handleClick = () => {
        const { info: { inverse, center }, handleInverse, handleCenter } = this.props
        if (center) {
            handleInverse()
        } else {
            handleCenter()
        }

    }
    render() {
        const { inverse, center } = this.props.info
        let classNames = 'control-unit'
        if (center) {
            classNames += ' is-center'
        }
        let centerStyle = {}
        if (inverse) {
            centerStyle.transform = 'rotateY(180deg)'
        }
        return <span className={classNames} style={centerStyle} onClick={this.handleClick} />
    }
}

/**
 * 图片画廊
 */
class Gallery extends Component {
    constructor(props) {
        super(props)
        // 图片区域范围
        this.rangeSection = {
            leftSection: {
                x: [0, 0],
                y: [0, 0],
            },
            rightSection: {
                x: [0, 0],
                y: [0, 0],
            },
            topSection: {
                x: [0, 0],
                y: [0, 0],
            },
            centerSection: {
                x: [0, 0],
                y: [0, 0],
            },
        }
        this.state = {
            // imagePositionArr: Array(imageData.length).fill({ left: 0, top: 0 }),
            imagePositionArr: [],
        }
    }

    componentDidMount() {
        // 获取画廊的大小
        const stageHeight = ReactDOM.findDOMNode(this.refs.stage).scrollHeight
        const stageWidth = ReactDOM.findDOMNode(this.refs.stage).scrollWidth

        // 单个图片的大小
        const imageHeight = ReactDOM.findDOMNode(this.refs.imageFigures0).scrollHeight
        const imageWidth = ReactDOM.findDOMNode(this.refs.imageFigures0).scrollWidth

        // 计算图片范围
        let { leftSection, rightSection, topSection, centerSection } = this.rangeSection
        // 左边区域
        leftSection.x[0] = -imageWidth / 2
        leftSection.x[1] = stageWidth / 2 - imageWidth / 2 * 3
        leftSection.y[0] = -imageHeight / 2
        leftSection.y[1] = stageHeight - imageHeight / 2
        // 右边区域
        rightSection.x[0] = stageWidth / 2 + imageWidth / 2
        rightSection.x[1] = stageWidth - imageWidth / 2
        rightSection.y[0] = -imageHeight / 2
        rightSection.y[1] = stageHeight - imageHeight / 2
        // 上边区域
        topSection.x[0] = stageWidth / 2 - imageWidth
        topSection.x[1] = stageWidth / 2
        topSection.y[0] = -imageHeight / 2
        topSection.y[1] = stageHeight / 2 - stageHeight / 2 * 3
        // 中间区域
        // 固定位置
        centerSection.x[0] = stageWidth / 2 - imageWidth / 2
        centerSection.x[1] = stageWidth / 2 - imageWidth / 2
        centerSection.y[0] = stageHeight / 2 - imageHeight / 2
        centerSection.y[1] = stageHeight / 2 - imageHeight / 2

        // 图片随机排列
        this.rearrange(0)
    }

    // 图片翻转
    handleInverse = index => () => {
        const cloneArr = cloneDeep(this.state.imagePositionArr)
        cloneArr[index].inverse = !cloneArr[index].inverse
        this.setState({
            imagePositionArr: cloneArr,
        })
    }

    // 将图片放置到中间
    handleCenter = index => () => this.rearrange(index)

    rearrange = centerIndex => {
        const { leftSection, rightSection, topSection, centerSection } = this.rangeSection
        const { imagePositionArr } = this.state
        const cloneArr = cloneDeep(imagePositionArr)

        // 中间图片
        const centerImages = cloneArr.splice(centerIndex, 1)
        centerImages[0].left = centerSection.x[0]
        centerImages[0].top = centerSection.y[0]
        centerImages[0].rotate = 0
        centerImages[0].center = true

        // 上边图片
        // 数量随机0或者1
        const topIndex = Math.floor(Math.random() * (cloneArr.length - 1))
        const topImages = cloneArr.splice(topIndex, Math.ceil(Math.random() * 2) - 1)
        topImages.forEach((item, index) => {
            item.left = getRandomRange(topSection.x[0], topSection.x[1])
            item.top = getRandomRange(topSection.y[0], topSection.y[1])
            item.rotate = getRandom30Deg()
            item.center = false
        })

        // 左右图片
        for (let i = 0, len = cloneArr.length, half = len / 2; i < len; i += 1) {
            if (i < half) {
                cloneArr[i].left = getRandomRange(leftSection.x[0], leftSection.x[1])
                cloneArr[i].top = getRandomRange(leftSection.y[0], leftSection.y[1])
                cloneArr[i].rotate = getRandom30Deg()
                cloneArr[i].center = false
            } else {
                cloneArr[i].left = getRandomRange(rightSection.x[0], rightSection.x[1])
                cloneArr[i].top = getRandomRange(rightSection.y[0], rightSection.y[1])
                cloneArr[i].rotate = getRandom30Deg()
                cloneArr[i].center = false
            }
        }

        if (topImages.length > 0) {
            cloneArr.splice(topIndex, 0, topImages[0])
        }

        cloneArr.splice(centerIndex, 0, centerImages[0])
        // 居中后，所有图片翻转状态重置
        cloneArr.forEach(item => item.inverse = false)

        this.setState({
            imagePositionArr: cloneArr,
        })
    }

    render() {
        const imageFigures = []
        const controllerUnits = []

        const { imagePositionArr } = this.state

        imageData.forEach((item, index) => {
            if (!imagePositionArr[index]) {
                imagePositionArr[index] = { left: 0, top: 0, rotate: 0, inverse: false, center: false }
            }
            imageFigures.push(<ImageFigure key={item.url} data={item} ref={`imageFigures${index}`} info={imagePositionArr[index]} handleInverse={this.handleInverse(index)} handleCenter={this.handleCenter(index)} />)
            controllerUnits.push(<Controller info={imagePositionArr[index]}  handleInverse={this.handleInverse(index)} handleCenter={this.handleCenter(index)} />)
        })

        return (
            <div className="stage" ref="stage">
                <section className="image-area">
                    {imageFigures}
                </section>
                <nav className="controller">
                    {controllerUnits}
                </nav>
            </div>
        )
    }
}

export default Gallery
