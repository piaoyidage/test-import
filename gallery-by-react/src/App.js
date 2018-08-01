import React, { Component } from 'react'
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
 * 单个图片
 */
class ImageFigure extends Component {
    render() {
        const { url, title } = this.props.data
        return (
            <figure className="figure-wrap">
                <img className="figure-image" src={url} alt={title} />
                <figcaption className="figure-title">
                    {title}
                </figcaption>
            </figure>
        )
    }
}

/**
 * 图片画廊
 */
class Gallery extends Component {
    render() {
        const imageFigures = []
        const controllerUnits = []

        imageData.forEach(item => {
            imageFigures.push(<ImageFigure key={item.url} data={item} />)
        })

        return (
            <div className="stage">
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
