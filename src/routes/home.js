import React, { Component } from 'react'
import { connect } from 'dva';
import { Control } from 'react-keeper'
import { Form, Button, Icon, message } from 'antd';
import { ListView, PullToRefresh,Toast } from 'antd-mobile';
import Tabs from '@/components/Tabs'
import SecondPage from '@/components/SecondPage';
import RemoteControl from '@/components/RemoteControl';
import RemoteButtom from '@/components/RemoteButtom';
import InputSearch from '@/components/InputSearch'
import DianGeBtn from '@/components/DianGeBtn'
import styles from './home.less';

class Home extends Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        return row2;
      },
    });
    this.state = {
      bangdanList : [],
      songList: [],
      openCtr : false, 
      dataSource,
      refreshing: true,
      isLoading: true,
      page: 1,
      size: 20,
      hasMore: true,  
      type: '',
    }
  }

  componentDidMount(){
    window.g_home = this;
    this.getBDList();
    this.addTouchListenter();
  }

  addTouchListenter = () => {
    const listElement = this.refList
    listElement.addEventListener("touchstart", (e) => {
      this.initPageX = e.targetTouches[0].pageX;
      this.initPageY = e.targetTouches[0].pageY; 
    });
    listElement.addEventListener("touchmove", (e) => {
      let disX = e.targetTouches[0].pageX - this.initPageX;
      let disY = e.targetTouches[0].pageY - this.initPageY;
      if (Math.abs(disX) - Math.abs(disY) > 0) {
         this.touchDirect = disX>0?'r':'l';
         this.touchEvent = 'switch'
      } else{
         this.touchEvent = 'scroll'
      }
    });
    listElement.addEventListener("touchend", (e) => {
      if(this.touchEvent == "switch")
      this.tabsRef.switchTab(this.touchDirect);
    });
  }

  getBDList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'home/getBDList',
      params: { key: "vadd_cms_phoneTags"},
      callback: res=> {
        if(res.errcode === 200){
          let bangdanList = []
          res.data.phoneTagsList.map(o=>{
            let obj = {name: o.name, type: o.type,id: o.id}
            bangdanList.push(obj)
          })
          this.setState({bangdanList},()=>{
              this.getList()
          })
        }else{
          Toast.fail(res.errmsg,2)
        }
      }
    })
  }

  getList = () => {
    const { dispatch } = this.props
    let { page, size, hasMore, songList, dataSource, bangdanList, type } = this.state;    
    dispatch({
      type: 'home/getSongList',
      params: { p: page, size: size, type: type!=""?type:bangdanList[0].type},
      callback: res=> {
        if(res.errcode === 200){
          if (res.data.length<size)
          hasMore = false;
          res.data.forEach((item,i)=>{
            songList.push({ ...item, num: (page-1)*size+(i+1) });
          });
          this.setState({
            songList,
            dataSource: dataSource.cloneWithRows(songList), 
            refreshing: false, 
            isLoading: false,
            selectedRowID: -1,   
          });
        }else{
          Toast.fail(res.errmsg,2)
        }
      }
    })
  }

  componentWillUnmount(){
    window.g_home = null;
  }

  onRefresh = () => {
    // 刷新数据 
    this.setState({ hasMore: true, refreshing: true, isLoading: true, page: 1, songList: [], selectedRowID: -1 },()=>{
      this.getList();
    });    
  }

  onEndReached = () => {
     // 加载更多数据
     const { isLoading, hasMore, page } = this.state;
     if (isLoading || !hasMore) {
       return;
     }
     this.setState({ isLoading: true, page: page + 1 }, ()=>{
      this.getList();
    });   
  }

  clickScan = () => {
    if (window.android && window.android.scanQrCode) {
      window.android.scanQrCode('home');
    }
  }

  getScanResult = (res) => {
    alert(res)
  }

  onClickHasOrder = () => {
    //跳转至已点界面
  }

  onClickBtns = (flag) => { //按钮组
    let path = "";
    switch(flag){
       case 0: //歌手
       path ="/singer"
        break;
      case 1: //榜单
        path = "/bangdan"
        break;
      case 2: //点单
        break;
      default:
        break;    
    }
    Control.go(path);   
  }

  onClickChangeCtr = (flag) => {
    this.setState({ openCtr: !!flag})
  }

  onSearchVal = (val) => {
    console.log(val);
  }
  
  onChangeTabs = (v) => {
    this.setState({type: v},()=>{
      this.onRefresh();
    })
  }

  render() {
    const {refreshing, isLoading, dataSource, size, bangdanList, openCtr } = this.state
    const row = (rowData, sectionID, rowID) => {
      return <div key={rowID} className={styles.row}>
       <div className={styles.col1}>
        <img alt="" src={rowData.headimg}/>
       </div>
       <div className={styles.col2}>
        <div className={styles.songName}>{rowData.music_name}</div>
        <div className={styles.singerName}>{rowData.singer.split(",")[0]}</div>
        <div className={styles.guanming}>
          由<span className={styles.guanmings}>{rowData.nickname}</span>老板，全球冠名
        </div>
       </div>
       <div className={styles.col3}>
        <DianGeBtn  data={rowData}/>
       </div>
      </div>}
    return (
      <SecondPage className={styles.page} title="智娱点歌" showControl>
        <InputSearch 
         disabled={true}
         onSearch = {v => this.onSearchVal(v)}
        />
        <div className={styles.buttonGroup}>
          <div onClick={()=>this.onClickBtns(0)}>
            <img alt=""  src={require('@/assets/geshou@2x.png')}/>
          </div>
          <div onClick={()=>this.onClickBtns(1)}>
            <img alt=""  src={require('@/assets/bangdan@2x.png')}/>
          </div>
          <div onClick={()=>this.onClickBtns(2)}>
            <img alt=""  src={require('@/assets/diandan@2x.png')}/>
          </div>
        </div>
        <Tabs 
          onRef = {el => this.tabsRef = el}
          tabs={bangdanList}
          onChange = {this.onChangeTabs}
         />
         <div className={styles.list}	ref={el=>this.refList=el}>
          <ListView
            className={styles.listView}
            dataSource={dataSource}
            renderFooter={() => (<div style={{height:'40px',lineHeight:'40px', textAlign: 'center',color: 'gray', fontSize:'17px' }}>
              {isLoading ? '加载中...' : '已加载全部数据'}
            </div>)}
            renderRow={row}
            pullToRefresh={<PullToRefresh
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />}
            onEndReached={this.onEndReached}
            initialListSize={size}
          /> 
         </div>

        <div className={styles.scanDiv}>
          <Button className={styles.scanBtn} size="large" onClick={this.clickScan} icon="scan">扫码绑定房台</Button>
        </div>
      </SecondPage>
    )
  }
}


export default connect(({ loading }) => ({
  loading
}))(Form.create()(Home));