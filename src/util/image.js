import fs from 'fs'
const sizeOf = require('image-size')

export class Image {
  constructor (imageUrl) {
    if (imageUrl) {
      this.init(imageUrl)
    }
  }

  init (imageUrl) {
    console.info('[image]开始初始化加载')
    const slashIdx = imageUrl.lastIndexOf('/') + 1
    this.index = 0
    this.imageUrl = ''
    this.imageName = imageUrl.substring(slashIdx)
    this.dirUrl = imageUrl.substring(0, slashIdx)
    console.info('[image]正在加载图片路径:' + this.imageUrl)
    console.info('[image]正在加载图片所在文件夹路径:' + this.dirUrl)
    this.loadImageList()
    // console.info('[image]正在加载初始图片...')
    // this.loadImage()
    console.info('[image]初始化加载结束')
  }

  loadImageList () {
    this.imageList = []
    console.info('[image]正在查找文件夹中所有图片...')
    const that = this
    let index = -1
    // 遍历图片
    try {
      fs.readdirSync(this.dirUrl).forEach(function (item) {
        try {
          const dimensions = sizeOf(that.dirUrl + item)
          console.info('[image]正在加载图片' + item)
          that.imageList.push({
            name: item,
            data: {
              url: that.dirUrl + item,
              type: dimensions.type,
              width: dimensions.width,
              height: dimensions.height
            },
            attr: {
              // 是否为长图（垂直）
              longV: dimensions.width / dimensions.height <= 0.4,
              // 是否为长图（水平）
              longH: dimensions.height / dimensions.width <= 0.4,
              scale: 0,
              left: 0,
              top: 0,
              rotate: 0
            }
          })
          index += 1
          if (that.imageName === item) {
            that.setIndex(index)
          }
        } catch (err) {}
      })
    } catch (err) {
      console.error('[image]地址不存在，查找失败')
    }
    console.info('[image]查找结束')
    console.info('[image]初始图片序号' + this.index)
    console.info('[image]正在优化图片顺序...')
    // TODO
    console.info('[image]优化结束')
  }

  delete () {
    if (this.imageList.length > 0) {
      if (this.imageList.length === 1) {
        this.setIndex(-1)
        fs.unlinkSync(this.imageUrl)
      } else {
        // 删除最后项情况
        if (this.index === this.imageList.length - 1) {
          this.setIndex(0)
        } else {
          this.setIndex(this.index + 1)
        }
        fs.unlinkSync(this.imageUrl)
      }
      this.loadImageList()
    }
  }

  setIndex (index) {
    this.index = index
    if (index === -1) {
      this.imageUrl = ''
      this.imageName = ''
    } else {
      this.imageUrl = this.imageList[index].data.url
      this.imageName = this.imageList[index].data.name
    }
  }

  getImageList () {
    return { index: this.index, images: this.imageList }
  }
}
