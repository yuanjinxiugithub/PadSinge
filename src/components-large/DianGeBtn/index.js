import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal } from 'antd';
import { allHint } from '@/utils/utils'
import styles from './index.less'

 class index extends Component {
  componentDidMount(){
    
  }

  onClickOrderSong = (data) => {
    const { home: { R_ID } } = this.props
    if(R_ID == ""){
      allHint("请扫码绑定房台！")
    }else{ //点歌操作

    }
 }

  render() {
    const { data } = this.props
    return (
      <div className={styles.orderBtn} onClick={()=>{this.onClickOrderSong(data)}}>点歌</div>
    )
  }
}

export default connect(({ loading, home }) => ({
  loading, home
}))(index);
