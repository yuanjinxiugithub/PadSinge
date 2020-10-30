import React, { Component } from 'react'
import SecondPage from '@/components-large/SecondPageHooks';
import styles from './drinks.less'
export default class drinks extends Component {
  state = {
    width: 10
  }
  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        width: 200
       })
    },200)
  }

  render() {
    const { width } = this.state
    return (
    <SecondPage className={styles.page} title="点单" back={true} onRef={ref=> this.pageRef = ref}>
        <div className={styles.box} style={{width: `${width}px`}}></div>
    </SecondPage>)
  }
}
