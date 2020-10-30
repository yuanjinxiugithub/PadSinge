import React, { Component } from 'react'
import { connect } from 'dva';
import { Form , Icon, message, Spin } from 'antd';
import SecondPage from '@/components/SecondPage';
import classNames from 'classnames';
import DianGeBtn from '@/components/DianGeBtn'
import InputSearch from '@/components/InputSearch'
import styles from './search.less';
import { Control } from 'react-keeper';

 class Serach extends Component {
  constructor(props){
    super(props)
    this.state = {
      page: 1,
      size: 5,
      singerList: [],
      songList: [],
      history: [],
      search: false,
      spin: false
    }
  }

  componentDidMount(){
    window.g_serach = this;
    this.getHistory();
  }

  componentWillUnmount(){
    window.g_serach = null;
  }

  getHistory = () => {
    const searchArr =  JSON.parse(localStorage.getItem('searchHistory'))||[]
    this.setState({ history: searchArr });
  }

  onSearchVal = (v) => {
    const { dispatch }= this.props
    dispatch({
      type: 'home/getSearchListMAPI',
      params: {k: v, openid: 1, unionid: 2},
      callback: res => {
        if(res.errcode == 200){
          this.setState({singerList: res.singer||[], songList: res.song||[],search: true})
        }else{
          message.error(res.errmsg)
        }
      }
    });
  }
    
  clearHis = () => {
    localStorage.removeItem('searchHistory');
    this.getHistory()
  }

  onClickSearchVal = (val) => {
    this.refSearch.onChangeVal(val);
    this.onSearchVal(val);
  }

  onClickSinger = (item) => {
    Control.go("/singerdetail",{Singer_Name: item.singer})
  }

  render() {
    const { singerList, history, songList, search, spin } = this.state
    return (
    <SecondPage className={styles.page} title="搜索" back={true}>
       <Spin tip="加载中..." className={styles.spinLoading} spinning={spin}></Spin>
       <InputSearch 
          onRef={ref => this.refSearch = ref}
          onSearch = {v => this.onSearchVal(v)}
        />
        {!search &&
        <div className={styles.history}>
          <div className={styles.title}>
            <span className={styles.txt}>搜索历史</span>
            <span onClick={this.clearHis}><Icon type="delete" style={{color:'#D9BC92', marginRight:'10px'}}/></span>
          </div>
          <div className={styles.hlist}>
          {history.reverse().map((o,i)=>(
            <div className={styles.col} key={i} onClick={()=>this.onClickSearchVal(o)}>
              {o}
            </div>))
          }
        </div>
        </div>
        }
        {search &&
         <div className={styles.singerList}>
          {singerList.map((o,k)=>(
            <div key={k} className={styles.singerItem} onClick={()=>{this.onClickSinger(o)}}>
               <div className={styles.image}><img alt="" src={o.singerhead}/></div>
               <div className={styles.name}>{o.singer}</div>
               <div className={styles.right}>
                 <Icon type="right"/>
               </div>
            </div>
          ))
          }
        </div>
        }
        
        <div className={styles.songList}>
          {songList.map((o,k)=>(
            <div key={k} className={styles.songItem}>
               <div className={styles.image}><img alt="" src={o.headimg}/></div>
               <div className={styles.name}>
                  <div>{o.music_name}</div>
                  <div className={styles.singerName}>{o.singer}</div>
                  <div className={styles.guanming}>由<span className={styles.boss}>{o.nickname}</span>老板,全球冠名</div>
               </div>
               <div className={styles.right}>
                 <DianGeBtn  data={o}/>
               </div>
            </div>
          ))
          }
        </div>
        {search &&
          <div className={styles.bottom}>已加载全部数据</div>
        }
    </SecondPage>)
  }
}

export default connect(({ loading }) => ({
  loading
}))(Form.create()(Serach));