import React, { Component } from 'react'
import { Icon } from 'antd'
import RemoteControl from '@/components/RemoteControl';
import RemoteButtom from '@/components/RemoteButtom';
import { Control } from 'react-keeper';
import styles from './index.less';

class index extends Component {
  state={
    openCtr: false,
  }
  componentDidMount(){

  }

  onScrollRef = (ref) => {
    if (this.props.onRef)
      this.props.onRef(ref);
  }

  back = () => {
    Control.go(-1);
  }

  onClickChangeCtr = (flag) => {
    this.setState({ openCtr: !!flag})
  }

  render() {
    const { title, className, back , showControl } = this.props;
    const { openCtr } = this.state
    return (
      <div className={styles.secondPage}>
        <RemoteControl
         openVisible = {openCtr}
         closePage = {()=>this.onClickChangeCtr(false)}
        />
        <div className={styles.head}>
          {back &&
            <div className={styles.back} onClick={this.back}>
              <Icon style={{color: '#D9BC92'}} type="left"  />
            </div>
          }
          <div className={styles.title}>{title}</div>
        </div>
        <div className={`${styles.content} ${className}`}
          ref={this.onScrollRef}
          style={{...this.props.style}}
        >
          {this.props.children}
        </div>
        {showControl &&
          <RemoteButtom
          onClickChangeCtr ={this.onClickChangeCtr}
          />
        }
        
      </div>
    )
  }
}


export default index