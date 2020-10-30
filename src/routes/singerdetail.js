import React, { Component } from 'react'
import { connect } from 'dva';
import { Form } from 'antd';
import { Control } from 'react-keeper'
import SecondPage from '@/components/SecondPage';
import InputSearch from '@/components/InputSearch'
import { ListView, PullToRefresh, Toast } from 'antd-mobile';
import DianGeBtn from '@/components/DianGeBtn'
import classNames from 'classnames';
import styles from './singerdetail.less';

 class Singerdetail extends Component {
   constructor(props){
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        return row2;
      },
    });
     super(props)
     this.state = {
       dataSource,
       refreshing: false,
       isLoading: true,
       hasMore: true,  
       page: 1,
       size: 20,
       list: [],
       type: 0,
     }
   }
   tabs = [{
    id: 0,
    title: '最热歌曲'
  },{
    id: 1,
    title: '最新歌曲'
  }]

  componentDidMount(){
    this.getList()
  }
 
  getList = () => {
    const { Singer_Name } = Control.state
    const { dispatch } = this.props
    let { hasMore, list, dataSource , page , size, isLoading, type } = this.state
    dispatch({
      type: 'home/getSingerSongList',
      params: { q: Singer_Name, p: page, size, sort: type },
      callback: res => {
        if(res.errcode === 200){
          res.song = res.matches||[];
          if (res.song.length<size){
            hasMore = false;
          }
          res.song.forEach((item,i)=>{
            list.push({ ...item, num: (page-1)*size+(i+1) });
          });
          this.setState({
            list,
            dataSource: dataSource.cloneWithRows(list), 
            refreshing: false, 
            isLoading: false,
            selectedRowID: -1,   
          });
        }else{
          Toast.fail(res.errmsg,2)
        }
      }
    });
  }

  onRefresh = () => {
    // 刷新数据 
    this.setState({ hasMore: true, refreshing: true, isLoading: true, page: 1, list: [], selectedRowID: -1 },()=>{
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


  onSearchVal = (val) => {
    console.log(val);
  }

  onChangeType = (o) => {
    this.setState({type: o.id},()=>{
      this.getList()
    })
  }

  render() {
    const { loading } = this.props
    const { refreshing, isLoading, dataSource, size, type } = this.state
    const row = (rowData, sectionID, rowID) => (
    <div className={styles.row} id={rowID}>
       <div className={styles.col1}>
        <img alt="" src={rowData.headimg}/>
       </div>
       <div className={styles.col2}>
        <div className={styles.songName}>{rowData.music_name}</div>
        <div className={styles.singerName}>{rowData.singer_name0}</div>
        <div className={styles.guanming}>
         由<span className={styles.guanmings}>{rowData.nickname}</span>老板，全球冠名
        </div>
       </div>
       <div className={styles.col3}>
         <DianGeBtn data={rowData}/>
       </div>
    </div>)
    return (
      <SecondPage className={styles.page} title="歌手详情" back={true} showControl>
        <InputSearch 
         disabled ={true}
         onSearch = {v => this.onSearchVal(v)}
        />
        <div className={styles.tabs}>
          {this.tabs.map(o=>(
            <div 
              className={
                classNames({
                  [`${styles.typeDiv}`]: true,
                  [`${styles.typeActived}`]: type == o.id
                })
              }
              onClick={()=>{this.onChangeType(o)}}
            >
            {o.title}
           </div>
          ))
          }
        </div>
        <div className={styles.list}>
          <ListView
            ref={el => this.lv = el}
            className={styles.listView}
            dataSource={dataSource}
            loading={loading.effects['home/getSingerSongList']}
            renderFooter={() => (<div style={{height:'40px',lineHeight:'40px', textAlign: 'center',color: 'gray', fontSize:'17px' }}>
              {isLoading ? '加载中...' : '已加载全部数据'}
            </div>)}
            renderRow={row}
            pullToRefresh={<PullToRefresh
            refreshing={refreshing}
            onRefresh={this.onRefresh}
            />}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            initialListSize={size}
          />  
        </div>
      </SecondPage>
    )
  }
}

export default connect(({ loading }) => ({
  loading
}))(Form.create()(Singerdetail));