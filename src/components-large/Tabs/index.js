import React, { Component } from 'react'
import styles from './index.less'
import classNames from 'classnames';
 class index extends Component {
   state = {
    selected: ""
   }

   componentDidMount(){
    if(this.props.onRef){
      this.props.onRef(this)
    }
  }

  switchTab = (direct) => {
    const { selected } = this.state
    const { tabs } = this.props
    const len = tabs.length - 1;
    let selectedIndex = tabs.findIndex(o=>o.type==selected)
    let nextItem = {};
    if(selectedIndex == -1) selectedIndex = 0;
    switch(direct){
     case 'l': //向左滑
       if(selectedIndex == len){ 
         return ;
       }
       nextItem = tabs[selectedIndex+1]
        break;
     case 'r': //x向右滑
       if(selectedIndex == 0){ 
         return ;
       }
       nextItem = tabs[selectedIndex-1]
       break;
     default:
       break;
    }
    this.onClickTab(nextItem);
  }
  

   onClickTab = (item) => {
    const { onChange } = this.props
    let scrollElement = document.getElementById('tabs');    
    let anchorElement = document.getElementById(item.type); 
    if(scrollElement) {
      scrollElement.scrollTo({left: anchorElement.offsetLeft-120, behavior: "smooth" });
    }
    this.setState({selected: item.type },()=>{
      onChange(item.type);
    })
   }
  render() {
    const { tabs, className } = this.props
    const { selected } = this.state
    return (
      <div className={styles.tabs+" "+className} id="tabs">
        {tabs.map((o,index)=>(
          <div className= {classNames({
            [`${styles.tab}`]: true,
            [`${styles.tabActive}`]:  (selected!=""?o.type ==selected:index==0),
          })}
           key={o.id}
           onClick={()=>{this.onClickTab(o)}}
           id={o.name}
           >
             {o.type}
          </div>
         ))
        }
      </div>
    )
  }
}
export default index