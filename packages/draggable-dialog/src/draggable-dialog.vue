<template>
  <ii-dialog ref="draggable_dialog" :visible="visible" @opend="$emit('opend')" @close="$emit('close')" @closed="$emit('closed')" v-bind="$props">
    <slot name="title" slot="title"></slot>
    <slot />
    <slot name="footer" slot="footer"></slot>
  </ii-dialog>
</template>
<script>
import { Dialog } from 'element-ui'
export default {
  name: 'IiDraggableDialog',
  props: {
    visible: Boolean,
    ...Dialog.props // 继承内在组件的props
  },
  mounted () {
    // 获取弹框头部（这部分可双击全屏）
    const dialogHeaderEl = this.$refs.draggable_dialog.$el.querySelector('.el-dialog__header')
    // 弹窗
    const dragDom = this.$refs.draggable_dialog.$el.querySelector('.el-dialog')
    let el = this.$refs.draggable_dialog.$el
    // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
    dragDom.style.overflow = 'auto'
    // 清除选择头部文字效果
    // dialogHeaderEl.onselectstart = new Function('return false')
    // 头部加上可拖动cursor
    dialogHeaderEl.style.cursor = 'move'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null)
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    let moveDown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      // 获取到的值带px 正则匹配替换
      let styL, styT
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace('%', '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace('%', '') / 100)
      } else {
        styL = +sty.left.replace('px', '')
        styT = +sty.top.replace('px', '')
      }
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY
        // 移动当前元素
        if ((l + styL) < (dragDom.clientWidth - el.clientWidth) / 2) {
          dragDom.style.left = `${(dragDom.clientWidth - el.clientWidth) / 2}px`
        } else {
          dragDom.style.left = `${l + styL}px`
        }
        if ((t + styT) < (dragDom.clientHeight - el.clientHeight) / 2) {
          dragDom.style.top = `${(dragDom.clientHeight + 50 - el.clientHeight) / 2}px`
        } else {
          dragDom.style.top = `${t + styT}px`
        }
        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    dialogHeaderEl.onmousedown = moveDown
  }
}
</script>
