import React, { Component } from 'react'
import { connect } from 'dva';
import { Form , Icon } from 'antd';
import { Control } from 'react-keeper';
import { ListView, PullToRefresh, Toast } from 'antd-mobile';
import SecondPage from '@/components/SecondPage';
import InputSearch from '@/components/InputSearch'
import DianGeBtn from '@/components/DianGeBtn'
import classNames from 'classnames';

import styles from './bangdandetail.less';

 class bangdandetail extends Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        return row2;
      },
    });
    this.state = {
      list: [],
      dataSource,
      refreshing: false,
      isLoading: true,
      page: 1,
      size: 20,
      hasMore: true,  
    }
  }

  componentDidMount(){
   this.getList()
  }

  componentWillUnmount(){

  }

  getList = () => {
    const { dispatch } = this.props
    let { page, size, hasMore, list, dataSource } = this.state;  
    const { type } =  Control.state
    dispatch({
      type:'home/getSongList',
      params: { p: page, size: size, type },
      callback: res => {
        if(res.errcode === 200){
          if (res.data.length<size)
          hasMore = false;
          res.data.forEach((item,i)=>{
            list.push({ ...item, num: (page-1)*size+(i+1) });
          });
          this.setState({
            list,
            dataSource: dataSource.cloneWithRows(list), 
            refreshing: false, 
            isLoading: false,
            selectedRowID: -1,   
          });
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

  onSearchVal = () => {

  }

  render() {
    const { type } = Control.state
    const {refreshing, isLoading, dataSource, size } = this.state
    const row = (rowData, sectionID, rowID) => {
      return <div key={rowData.singerid} className={styles.row}>
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
         <DianGeBtn data={rowData} />
       </div>
      </div>}
    return (
     <SecondPage title={`${type}`} back={true} className={styles.page}>
        <InputSearch 
          disabled ={true}
          onSearch = {v => this.onSearchVal(v)}
        />
      <div className={styles.list}>
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

     </SecondPage>
        
    )
  }
}

export default connect(({ loading }) => ({
  loading
}))(Form.create()(bangdandetail));