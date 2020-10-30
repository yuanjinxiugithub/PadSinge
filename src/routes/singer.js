import React, { Component } from 'react'
import { connect } from 'dva';
import { Form } from 'antd';
import { Control } from 'react-keeper'
import { ListView, PullToRefresh, Toast } from 'antd-mobile';
import SecondPage from '@/components/SecondPage';
import classNames from 'classnames';
import InputSearch from '@/components/InputSearch'
import styles from './singer.less';

 class Singer extends Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        return row2;
      },
    });
    this.state = {
      dataSource,
      refreshing: false,
      isLoading: true,
      page: 1,
      size: 20,
      hasMore: true,  
      list: [],
      selectType: 0,
      key: '大陆男歌星'
    }
  }

  TypeList = [{
    id:0,
    title: '大陆男歌星'
  },{
    id:1,
    title: '大陆女歌星'
  },{
    id:2,
    title: '港台男歌星'
  },{
    id:3,
    title: '港台女歌星'
  },{
    id:4,
    title: '外国歌星'
  },{
    id:5,
    title: '中国组合'
  }]

  componentDidMount(){
    window.g_singer = this;
    this.getList();
  }

  componentWillUnmount(){
    window.g_singer = null;
  }

  getList = () => {
    const { dispatch } = this.props
    let { hasMore, list, dataSource , page , size, key } = this.state
    dispatch({
      type: 'home/getSingerList',
      params: { op: "getsingerlist_new", page: page, pagesize: size , type: key,  },
      callback: res => {
        if(res.errcode === 200){
          res.data = res.result.matches
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
        
        }else{
          Toast.fail(res.errmsg,2)
        }
      }
    })
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

  onClickType = (obj) => {
    this.setState({selectType: obj.id, key : obj.title },()=>{
      this.lv.scrollTo(0, 0); //回到顶部
      setTimeout(() => this.onRefresh(), 200); //刷新数据
    })
  }

  onClickSinger = (item) => {
    Control.go("/singerdetail",{Singer_Name: item.Singer_Name})
  }

  onSearchVal = (v) => {
    console.log(v)
  }

  render() {
    const { refreshing, isLoading, dataSource, size,  selectType } = this.state
    const row = (rowData, sectionID, rowID) => 
    (<div className={styles.row} id={rowID} onClick={()=>{this.onClickSinger(rowData)}}>
     <img alt="" src={rowData.Singer_Head} />
     <div className={styles.singerName}>{rowData.Singer_Name}</div>
    </div>)
    return (<SecondPage className={styles.page} title="歌手" back={true} showControl>
       <InputSearch 
         onSearch = {v => this.onSearchVal(v)}
       />
      <div className={styles.content}>
        <div className={styles.left}>
          <div style={{flex: 1}}>
           {this.TypeList.map((obj,index)=>(
            <div
                className={
                  classNames({
                    [`${styles.typeDiv}`]: true,
                    [`${styles.typeActived}`]: obj.id == selectType
                  })
                }
                onClick={()=>{
                  this.onClickType(obj)
                }}
               key={index}>
               {obj.title}
            </div>
          ))}
         </div>
         <div className={styles.line}></div>
        </div>
        <div className={styles.right} >
          <ListView
            ref={el => this.lv = el}
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
            onEndReachedThreshold={10}
            initialListSize={size}
          />  
        </div>
      </div>
      </SecondPage>)
  }
}

export default connect(({ loading }) => ({
  loading
}))(Form.create()(Singer));