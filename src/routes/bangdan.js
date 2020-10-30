import React, { Component } from 'react'
import { connect } from 'dva';
import { Form , Icon } from 'antd';
import SecondPage from '@/components/SecondPage';
import classNames from 'classnames';
import DianGeBtn from '@/components/DianGeBtn'
import styles from './bangdan.less';
import { Control } from 'react-keeper';

 class BangDan extends Component {
  constructor(props){
    super(props)
    this.state = {
      page: 1,
      size: 5,
      hotList: [],
      tjList: [],

    }
  }

  componentDidMount(){
    window.g_singer = this;
    this.getList();
    this.getBDList();
  }

  componentWillUnmount(){
    window.g_singer = null;
  }


  getBDList = () => {
    const { dispatch } = this.props
    let {  page , size,  } = this.state
    dispatch({
      type:'home/getBangDanTJList',
      params: {  },
      callback: res => {
        if(res.errcode === 200){
          this.setState({
           tjList: res.tops||[]
          });
        }
      }
    });
  }

  getList = () => {
    const { dispatch } = this.props
    let {  page , size,  } = this.state
    dispatch({
      type:'home/getSongList',
      params: { p: page, size, type: "歌神必唱榜" },
      callback: res => {
        if(res.errcode === 200){
          this.setState({
           hotList: res.data||[]
          });
        }
      }
    });
  }

  onClickGoDetail = () => { //榜单详情页面
    Control.go('bangdandetail',{ type:'歌神必唱榜'})
  }

  onClickBD = (type) => {// 点击榜单
    Control.go('bangdandetail',{ type: type.top_name})
  }

  render() {
    const { hotList, tjList } = this.state
    return (<SecondPage className={styles.page} title="榜单" back={true}>
      <div className={styles.hotList}>
        {hotList.filter((o,index)=>index<=4).map((o,index) => (
        <div className={styles.hotRow}>
          <div 
           className={
            classNames({
              [`${styles.col1}`]: true,
              [`${styles.one}`]: index == 0,
              [`${styles.two}`]: index == 1,
              [`${styles.three}`]: index == 2
            })
          }
          >
             {index+1}
          </div>
          <div className={styles.col2}>
             <span className={styles.name}>{o.music_name}</span>
             <span className={styles.singer}>{o.singer.split(",")[0]}</span>
          </div>
          <div className={styles.col3}>
            <DianGeBtn data={o} />
          </div>
        </div> ))}
        <div className={styles.moreHot} onClick={this.onClickGoDetail}>查看榜单详情 <Icon type="right" size="16"/></div>
      </div>
      <div className={styles.tuijianbandan}>
        <div className={styles.title}>推荐榜单</div>
        <div className={styles.tjList}>
          {tjList.map((o,index)=>(
          <div key={index} className={styles.tjItem} onClick={()=>{this.onClickBD(o)}}>
          <img alt="" src={o.image}/>
          <div className={styles.right}>
            <div className={styles.topName}>{o.top_name}</div>
            {(o.data||[]).map((item,i)=>(
              <div key={i} className={styles.song}>
               {i+1}.{item.music_name} - {item.singer.split(",")[0]}
              </div>
            ))
            }
          </div>
          <div className={styles.icon}>
            <Icon type="right" />
          </div>
          </div>))
          }
        </div>
      </div>
     
      </SecondPage>)
  }
}

export default connect(({ loading }) => ({
  loading
}))(Form.create()(BangDan));