import React, { Component } from 'react'
import { Form, Input, Icon } from 'antd';
import { Control } from 'react-keeper'
import styles from './index.less'

const { Search } = Input
 class index extends Component {
   state={
    searchVal: "",
   }

  componentDidMount(){
  if (this.props.onRef)
    this.props.onRef(this);
  }

  onClickHasOrder = () =>{
    Control.go('/ordered-large')
  }

  onClickBtn = () => {
    const { disabled } = this.props
    if(disabled){
      Control.go('/search-large')
    }
  }

  onSearch = (val,flag) => {
    const {  onSearch } = this.props
    if(flag){
      console.log(flag)
      this.setState({searchVal: val});
    }else{
      if(val != ""){
        const searchArr =  JSON.parse(localStorage.getItem('searchHistory'))||[]
        const valid  = searchArr.find(o=>o==val);
        if(!valid){
          searchArr.push(val)
          localStorage.setItem('searchHistory',JSON.stringify(searchArr))
        }
          onSearch(val);
      }
    }
  }

  onChange= (e) =>{
    this.setState({searchVal: e.target.value})
  }

  onChangeVal = (val) => {
    this.setState({searchVal: val})
  }

  render() {
    const { disabled } = this.props
    const { searchVal} = this.state 
    return (
      <div className={styles.search}>
          <div className={styles.searchInput} onClick={this.onClickBtn}>
          <Search
            autoFocus={!disabled}
            placeholder="搜歌名、搜歌手"
            enterButton="搜索"
            size="large"
            value={searchVal}
            onSearch={value => {this.onSearch(value)}}
            onChange={this.onChange}
            disabled={disabled}
          />
          </div>
          <div className={styles.btn} onClick={this.onClickHasOrder}><Icon type="check-circle" /> 已点</div>
        </div>
    )
  }
}

export default index
