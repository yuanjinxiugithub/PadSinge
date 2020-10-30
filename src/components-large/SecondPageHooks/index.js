import React, { useState } from 'react'
import { Icon } from 'antd'
import { Control } from 'react-keeper';
import styles from './index.less'

function index(props) {

  const back = () =>{
    Control.go(-1);
  }

  const onScrollRef = (ref) => { //ref 对组件实例的引用
      //加载时给父组件传递此页面名称
    if(props.onRef){
      props.onRef(ref)
    }

  }

  const test = () => {
    console.log('test')
  }

  return (
    <div className={styles.secondPage}>
    <div className={styles.head}>
      {props.back &&
        <div className={styles.back} onClick={back}>
          <Icon style={{color: '#D9BC92'}} type="left"  />
        </div>
      }
      <div className={styles.title}>{props.title}</div>
    </div>
    <div className={`${styles.content} ${props.className}`}
      ref={onScrollRef}
      style={{...props.style}}
    >
      {props.children}
    </div>
    {/* <div className={styles.footer}>123</div> */}
  </div>
  )
}

export default  index