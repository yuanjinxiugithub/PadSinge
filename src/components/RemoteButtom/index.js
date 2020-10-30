import React, { Component } from 'react'
import styles from './index.less'
const clientHeight =  document.documentElement.clientHeight
const clientWidth = document.documentElement.clientWidth
 class index extends Component {
   state ={
    disX: 0,
    disY: 0,
    isDown: false,
    left: 260,
    top: 380,
   }

   componentDidMount(){
     const left =sessionStorage.getItem('ctrLeft')
     const top = sessionStorage.getItem('ctrTop')
     if(left != null){
       this.setState({left})
     }
     if(top != null){
      this.setState({top})
    }
   }

  onTouchStart = (ev) => {
    let target = ev.target; 
    let startX = ev.changedTouches[0].pageX;
    let startY =  ev.changedTouches[0].pageY;
    let disX = startX - target.offsetLeft
    let disY = startY - target.offsetTop
    this.setState({ isDown: true, disX, disY })
  }

  onTouchEnd = (e) => {
    const { left, top } = this.state
    sessionStorage.setItem("ctrLeft",left);
    sessionStorage.setItem("ctrTop",top);
  }

  onTouchMove = (ev) => {
    const { disY , disX } = this.state
    //获取x和y
    const clientX = ev.changedTouches[0].pageX;
    const clientY = ev.changedTouches[0].pageY;
    //计算移动后的左偏移量和顶部的偏移量
    let left = clientX - disX;
    let top = clientY - disY;
    if (left < 0) {
      left = 0;
    }
    if (top < 0) {
      top = 0;
    }
    if (left > clientWidth - 60) {
      left = clientWidth - 60;
    }
    if (top > clientHeight - 110) {
      top = clientHeight - 110;
    }
    this.setState({left, top })
  }
  render() {
    const { onClickChangeCtr } = this.props
    const { left , top } = this.state
    return (
      <div 
      className={styles.remoteCtrDiv} 
      onClick={()=>onClickChangeCtr(true)}
      onTouchStart={(e)=>{this.onTouchStart(e)}}
      onTouchEnd={(e)=>{this.onTouchEnd(e)}}
      onTouchMove={e => {this.onTouchMove(e)}}
      style={{left: `${left}px`,top:`${top}px`}}
      >
         遥控
      </div>
    )
  }
}
export default index