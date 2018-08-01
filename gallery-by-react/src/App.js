import React, { Component } from 'react'
import './App.css'

// 读取数据描述
let imageData = require('./data/imageData.json')

// 给每条数据增加路径信息
function setImageUrl(imageArray) {
    const len = imageArray.length
    for (let i = 0; i < len; i += 1) {
        imageArray[i].url = require(`./images/${i + 1}.jpg`)
    }
    return imageArray
}

imageData = setImageUrl(imageData)

console.log(imageData)

class Gallery extends Component {
    render() {
        return (
            <div className="stage">
                <section className="image-area">
                </section>
                <nav className="controller">
                </nav>
            </div>
        )
    }
}

export default Gallery
