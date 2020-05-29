<template>
   <svg class="ii-svg-icon" version="1.1" :width="currentSize.width" :height="currentSize.height" :viewBox="box">
    <use :xlink:href="icon.id" />
  </svg>
</template>

<script>
import Icons from '../../icons/index.js'
export default {
  name: 'IiSvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 10
    },
    height: {
      type: [Number, String],
      default: '18'
    },
    width: {
      type: [Number, String],
      default: '18'
    }
  },
  data () {
    return {
      xml: null
    }
  },
  created () {
    if (!this.name) {
      return
    }
    this.xml = Icons('./' + this.name + '.svg')
  },
  computed: {
    baseSize () {
      let size = this.size
      size = Number(size)
      if (isNaN(size) || size <= 0) {
        return 10
      }
      return size
    },
    icon  () {
      if (!this.xml) {
        return {
          width: 0,
          height: 0,
          id: ''
        }
      }
      let viewBox = this.xml.default.viewBox.split(' ')
      return {
        width: viewBox[2] || 0,
        height: viewBox[3] || 0,
        id: '#' + this.xml.default.id
      }
    },
    box () {
      return `0 0 ${this.icon.width} ${this.icon.height}`
    },
    scale () {
      if (this.icon.height) {
        return this.icon.width / this.icon.height
      }
      return 1
    },
    currentSize () {
      let height = this.height
      let width = this.width
      // 不传递 width 与 height，就当做正方形处理，size 字段生效
      // 否则就按比例处理
      if (height === null && width === null) {
        return {
          width: 1 * this.baseSize,
          height: 1 * this.baseSize
        }
        // 指定了宽度，按宽度比例计算
      } else if (width !== null) {
        width = Number(width)
        if (isNaN(width) || width <= 0) {
          width = 1 * this.baseSize()
        }
        return {
          width: width,
          height: width / this.scale
        }
        // 指定了高度，按高度比例计算
      } else {
        height = Number(height)
        if (isNaN(height) || height <= 0) {
          height = 1 * this.baseSize
        }
        return {
          width: height * this.scale,
          height: height
        }
      }
    }
  },
  watch: {
    async name (val) {
      if (!val) {
        return
      }
      this.xml = Icons('./' + this.name + '.svg')
    }
  }
}
</script>

<style lang="scss" scoped="" type="text/css">
</style>
