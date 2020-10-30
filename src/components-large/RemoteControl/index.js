import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Toast } from 'antd-mobile'
import { allHint } from '@/utils/utils'
import styles from './index.less'
import classNames from 'classnames';

 class index extends Component {
   constructor(props){
     super(props)
     this.state = {
      modalVisible: false
     }
  }

  componentDidMount(){
    

  }

  show = () => {
    
  }

  operateArr = [
    {
      title: '重唱',
      id: 0,
    },{
      title: '播/停',
      id: 1,
    },{
      title: '切歌',
      id: 2,
    },{
      title: '原/伴',
      id: 3,
    },{
      title: '评分',
      id: 4,
    },{
    title: '麦克风',
    id: 5,
   },{
  title: '音量',
  id: 6,
  }]

  onClickOperate = (operateID) =>{
    const { home: { R_ID } } = this.props
    if(R_ID == ""){
      allHint("请扫码绑定房台！");
      return ;
    }
  }

  onClickAddSub = (operateID,operateFlag) => {
    //operateFlag 0 - ;1+
    const { home: { R_ID } } = this.props
    if(R_ID == ""){
      allHint("请扫码绑定房台！");
      return ;
    }
  }

  onClose = () => {
    this.setState({ modalVisible: false})
  }
  
  render() {
    const { openVisible, closePage, home: { R_ID } } = this.props
    return (<div 
    className={classNames({
      [`${styles.page}`]: true,
      [`${styles.page_active}`]: openVisible,
    })}
    >
     <div className={styles.mask} onClick={()=>{closePage()}}> </div>
     <div className={styles.content}>
       <div className={styles.operateCtr}>
          <div className={styles.ctrRow1}>
          {this.operateArr.filter(o=>o.id<5).map((item,k)=>(
            <div key={k} onClick={()=>{this.onClickOperate(item)}}>
              {item.id === 0&&
                <img alt="" src={require('@/assets/chongchang@2x.png')}/>
              }
              {item.id === 1&&
                <img alt="" src={require('@/assets/boting@2x.png')}/>
              }
              {item.id === 2&&
                <img className={styles.bigImg} alt="" src={require('@/assets/qiege@2x.png')}/>
              }
              {item.id === 3&&
                <img alt="" src={require('@/assets/yuanchang@2x.png')}/>
              }
              {item.id === 4&&
                <img alt="" src={require('@/assets/pingfen@2x.png')}/>
              }
              <div className={styles.title}>
              {item.title}
            </div>
            </div>))
          }
          </div>
          <div className={styles.ctrRow2}>
                { this.operateArr.filter(o=>o.id>=5).map((item,k)=>(
                  <div key={k}>
                    <img alt="" src={require('@/assets/reduce@2x.png')}
                    onClick={()=>{this.onClickAddSub(item.id,'0')}}/>
                    <span>{item.title}</span>
                    <img alt="" src={require('@/assets/add@2x.png')} 
                    onClick={()=>{this.onClickAddSub(item.id,'1')}}/>
                  </div>
                ))
                }
              </div>
        </div>
       <div className={styles.cancelCtr} onClick={()=>closePage()}>取消</div>
     </div>
    </div>)
  }
}

export default connect(({ loading, home }) => ({
  loading, home
}))(index);
