import { Modal } from 'antd';

export const appid = 'wx4208df99e7946102';
//上传文件后对应文件的url地址
export const uploadFileUrl = 'https://sy-pan.oss-cn-hangzhou.aliyuncs.com/static/';

// 格式化日期yyyy-MM-dd hh:mm:ss
export const formatDate = (date, fmt) => {
  if (!date) {
      return ''
  }
  var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
  }
  return fmt
}

// 获取时间unix时间戳
export const getUnixTimes = (d1) => {
  var d2 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours() + 8, d1.getUTCMinutes(), d1.getUTCSeconds())
  return Math.round(d2.getTime() / 1000)
}
// 获取年月日unix时间戳
export const getUnixDate = (d) => {
  let d1 = new Date(formatDate(d, 'yyyy-MM-dd'))
  var d2 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours() + 8, d1.getUTCMinutes(), d1.getUTCSeconds())
  return Math.round(d2.getTime() / 1000)
}

export const DayUnixTimes = 86400;

//判断是否是正整数
export const isPosInt = (num) => {
  num = num + '';
  if (num === '') {
　  return false; 
　} 
  if (!(/(^[1-9]\d*$)/.test(num))) { 　　　　　　
　  return false; 
　}else { 
  　return true; 
　} 
}

//获取星期几
export const getWeekDay = (date) => {
  let a = ['日', '一', '二', '三', '四', '五', '六'];
  return '星期' + a[date.getDay()];
}

//将相差毫秒数转化为 天 小时 分钟 秒
export const transDateDiff = (dateDiff)=>{   
  var hours=Math.floor(dateDiff/(3600*1000))//计算出小时数
  //计算相差分钟数
  var leave2=dateDiff%(3600*1000)    //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
  //计算相差秒数
  var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  var seconds=Math.round(leave3/1000);
  return (hours>0?(hours+"小时"):'') + (minutes>0?minutes+"分钟":'') + (seconds>0?seconds+"秒":'');
}

/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
export const DateAdd = (interval, number, date) => {
  switch (interval) {
    case "y": {
        date.setFullYear(date.getFullYear() + number);
        return date;
    }
    case "q": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
    }
    case "M": {
        date.setMonth(date.getMonth() + number);
        return date;
    }
    case "w": {
        date.setDate(date.getDate() + number * 7);
        return date;
    }
    case "d": {
        date.setDate(date.getDate() + number);
        return date;
    }
    case "h": {
        date.setHours(date.getHours() + number);
        return date;
    }
    case "m": {
        date.setMinutes(date.getMinutes() + number);
        return date;
    }
    case "s": {
        date.setSeconds(date.getSeconds() + number);
        return date;
    }
    default: {
        date.setDate(date.getDate() + number);
        return date;
    }
  }
}

//提示框 info success error warning
var modal;
const showTimeSecond = 10;
var time = showTimeSecond;
var timeInterval;
const updateTime = ()=>{
  if (time-1>=0)
    time = time-1;
  modal.update({
    okText: `我知道了(${time}秒)`,
    maskClosable: true,
  });
  if (time===0){
    modal.destroy();
  }
}
const initTime = ()=>{
  if (timeInterval)
    clearInterval(timeInterval); 
  time = showTimeSecond; 
  timeInterval = setInterval(()=>{
      updateTime();
    }, 1000 * 1); 
  if (modal)
    modal.destroy();
}

export const allHint = (title)=>{
  initTime();
  let bIsMobileDevice = sessionStorage.getItem('bIsMobileDevice');
  if (bIsMobileDevice){
    modal = Modal.info({
      centered: true,
      icon: null,
      title: <div style={{fontSize:'20px'}}>{title}</div>,    
      okText: `我知道了(${time}秒)`,
      okButtonProps: {style:{fontSize:'20px',height:'40px'}},  
      maskClosable: true,
      onOk() {},
    }); 
  } else {
    modal = Modal.info({
      centered: true,
      icon: null,
      title: <div style={{fontSize:'24px'}}>{title}</div>,    
      okText: `我知道了(${time}秒)`,
      okButtonProps: {style:{fontSize:'23px',height:'55px'}},  
      maskClosable: true,
      onOk() {},
    }); 
  }  
}

export const info = (title)=>{  
  allHint(title);
}
export const success = (title)=>{
  allHint(title);;     
}
export const error = (title)=>{
  allHint(title);    
}
export const warning = (title)=>{
  allHint(title); 
}

// uuid
export const uuid = () => {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  var uuid = s.join('')
  return uuid
}

// 获取url后面的参数
export const getQueryString = (name)=> {
  let search = window.location.search
  search = encodeURI(search)
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = search.substr(1).match(reg)
  if (r != null) {
    let result = unescape(r[2])
      result = decodeURI(result)
      return result
  }
  return null
}

//扫码解析url中的state参数
export const getScanStateString = (href,name)=> {
  let ary = href.split('?');
  if (ary.length > 1){
    let search = ary[1];    
    ary = search.split('#');
    if (ary.length>0)
      search = ary[0];    
    search = encodeURI(search)
    let reg = new RegExp('(^|&)' + 'state' + '=([^&]*)(&|$)', 'i')
    let r = search.match(reg)
    if (r != null) {
      let state = unescape(r[2])
      state = decodeURI(state)        
      reg = new RegExp('(^|;)' + name + '=([^;]*)(;|$)', 'i')     
      r = state.match(reg)    
      if (r != null) {
        let result = unescape(r[2])
        result = decodeURI(result)
        return result
      }
    }
  }
  return '';
}

export const dateMinusDate = (d, dis) => {
  d.setDate(d.getDate() - dis)
  return d.getFullYear() + '-' + ((d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate()
}

export const dateMonthOne = (d) => {
  return d.getFullYear() + '-' + ((d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1)) + '-01'
}

export const dateMonthEnd = (d) => {
  let sMonthOne = dateMonthOne(d)
  let date = new Date(sMonthOne)
  date.setMonth(date.getMonth() + 1)
  return dateMinusDate(date, 1)
}