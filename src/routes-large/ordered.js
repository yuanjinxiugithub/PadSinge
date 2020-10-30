import React, { Component } from 'react'
import { connect } from 'dva';
import { Form } from 'antd';
import { ListView, PullToRefresh } from 'antd-mobile';
import SecondPage from '@/components-large/SecondPage';
import InputSearch from '@/components-large/InputSearch'
import styles from './ordered.less'


class Ordered extends Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        return row2;
      },
    });
    this.state ={
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
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props
    let { size, dataSource, list, page ,hasMore } = this.state
    dispatch({
      type:'home/getOrderedListMAPI',
      params: {p: 1, size: size},
      callback: res=> {
        res.data = [{
          id:1, music_name: '演员',singer: '薛之谦', nickname:'海伦',headimg:'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLEAfHt77iabaFic7VlYE0LPbA3rBOJUQ576D23r3pUhEIicIiaM1LTOFtBibK1m2YK5qV7ELQsRHlwEibw/132'
        },{  id:2, music_name: '沧海一声笑',singer: 'GAI', nickname:'海伦',headimg:'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLEAfHt77iabaFic7VlYE0LPbA3rBOJUQ576D23r3pUhEIicIiaM1LTOFtBibK1m2YK5qV7ELQsRHlwEibw/132'}]
        if (res.data.length<size)
        hasMore = false;
        res.data.forEach((item,i)=>{
          list.push({ ...item, num: (page-1)*size+(i+1) });
        });
        this.setState({
          dataSource: dataSource.cloneWithRows(list), 
          refreshing: false, 
          isLoading: false,
          selectedRowID: -1,  
        })
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

  onClickTop = (data) => {//置顶操作
   console.log(data)
  }

  render() {
    const { refreshing, isLoading, dataSource, list , p ,size} = this.state
    const row = (rowData, sectionID, rowID) => {
      return <div className={styles.row} key={rowID}>
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
         {rowID >0 &&
          <div className={styles.topBtn} onClick={()=>{this.onClickTop(rowData)}}>置顶</div>
         }
       </div>
      </div>
    }
    return (
    <SecondPage className={styles.page} title="已点歌曲" back={true}>
      <InputSearch 
        disabled={true}
        onSearch = {v => this.onSearchVal(v)}
      />
       <div className={styles.list}>
          <ListView
            className={styles.listView}
            dataSource={dataSource}
            renderFooter={() => (<div style={{height:'55px',lineHeight:'55px', textAlign: 'center',color: 'gray', fontSize:'24px' }}>
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
}))(Form.create()(Ordered));