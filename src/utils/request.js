import fetch from 'dva/fetch';
import { message } from 'antd';
import { getQueryString } from '@/utils/utils';
import { vodUrlPre, vodUrlPreM, vodUrlPreK }  from '@/utils/gconst'
message.config({
  duration: 2,
  maxCount: 1,
});

function parseQuery (obj){
  let str = ''
  for (let key in obj) {
    const value = typeof obj[key] !== 'string' ? JSON.stringify(obj[key]) : obj[key]
    str += '&' + key + '=' + value
  }
  return str.substr(1);
}

function _fetch(fetch_promise, timeout) {
  var abort_fn = null;
  //这是一个可以被reject的promise
  var abort_promise = new Promise(function(resolve, reject) {
         abort_fn = function() {
            reject('请求超时!');
         };
  });
  //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
   var abortable_promise = Promise.race([
         fetch_promise,
         abort_promise
   ]);
   setTimeout(function() {
         abort_fn();
    }, timeout);
   return abortable_promise;
}

export default function request(name, body={}, method='POST') {
  let url = (window.location.hostname?'/':'https://login.16931.com/') + (getQueryString('API')||'PROD')  + name;  
  let options = {};     
  switch (name){
    case '/upload':
      let fileData = new FormData();
      fileData.append('', body);
      options = {
        method: method,       
        body: fileData,
        headers: {　　  
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    　　},
      } 
      break
    default:
      options = {
        method: method,           
        headers: {
    　　  'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    　　},
      }  
      if(method === 'GET'){
        url += '?' + parseQuery(body);
      }else{
        options.body = JSON.stringify(body);
        let params = '';
        if (body.hasOwnProperty('page')){
          params = (params===''?`?page=${body.page}`:`${params}&page=${body.page}`);
        }
        if (body.hasOwnProperty('size')){
          params = (params===''?`?size=${body.size}`:`${params}&size=${body.size}`);
        } 
        url += params;
      }         
      break
  }
  return _fetch(fetch(url, options), 1000 * 10)
    .then(function(res) {
      const status = res.status;
      switch(status){
        case 200:   
          return res.json();
        case 401:
          message.warning('401错误：授权已失效，请重新登录！');    
          if (window.android && window.android.returnLoginPage){
            setTimeout(()=>{
              window.android.returnLoginPage();
            }, 1000*3);
          }                        
          return { err: 1, msg: '授权已失效，请重新登录！'};
        case 504:           
          message.warning('504错误：请检查网络连接！');
          return { err: 1, msg: status + '错误！'};
        default:
          return { err: 1, msg: status + '错误！'};
      }
    }, function(err) {
      message.warning('请求异常：请检查网络连接！');
      return { err: 1, msg: String(err)};
    })          
}

export  function vodRequest(name, body={}, method='POST') {
  let url = vodUrlPre + name; 
  let options = { method };      
  if(method === 'GET'){
    url += '?' + parseQuery(body);
  }
  return _fetch(fetch(url, options), 1000 * 10)
    .then(function(res) {
      const status = res.status;
      switch(status){
        case 200:   
          return res.json();
        case 401:
          message.warning('401错误：授权已失效，请重新登录！');    
          if (window.android && window.android.returnLoginPage){
            setTimeout(()=>{
              window.android.returnLoginPage();
            }, 1000*3);
          }                        
          return { err: 1, msg: '授权已失效，请重新登录！'};
        case 504:           
          message.warning('504错误：请检查网络连接！');
          return { err: 1, msg: status + '错误！'};
        default:
          return { err: 1, msg: status + '错误！'};
      }
    }, function(err) {
      message.warning('请求异常：请检查网络连接！');
      return { err: 1, msg: String(err)};
    })          
}

export  function vodKRequest(name, body={}, method='POST') {
  let url = (window.location.hostname?'/'+ (getQueryString('API')||'KAPI'):'https://k.ktvsky.com/')   + name;  
  let options = { method };      
  if(method === 'GET'){
    url += '?' + parseQuery(body);
  }
  return _fetch(fetch(url, options), 1000 * 10)
    .then(function(res) {
      const status = res.status;
      switch(status){
        case 200:   
          return res.json();
        case 401:
          message.warning('401错误：授权已失效，请重新登录！');    
          if (window.android && window.android.returnLoginPage){
            setTimeout(()=>{
              window.android.returnLoginPage();
            }, 1000*3);
          }                        
          return { err: 1, msg: '授权已失效，请重新登录！'};
        case 504:           
          message.warning('504错误：请检查网络连接！');
          return { err: 1, msg: status + '错误！'};
        default:
          return { err: 1, msg: status + '错误！'};
      }
    }, function(err) {
      message.warning('请求异常：请检查网络连接！');
      return { err: 1, msg: String(err)};
    })          
}

export  function vodMRequest(name, body={}, method='POST') {
  let url = (window.location.hostname?'/'+ (getQueryString('API')||'MAPI'):'https://m.ktvsky.com') + name;  
  let options = { method };    
  if(method === 'GET'){
    url += '?' + parseQuery(body);
  }
  return _fetch(fetch(url, options), 1000 * 10)
    .then(function(res) {
      const status = res.status;
      switch(status){
        case 200:   
          return res.json();
        case 401:
          message.warning('401错误：授权已失效，请重新登录！');    
          if (window.android && window.android.returnLoginPage){
            setTimeout(()=>{
              window.android.returnLoginPage();
            }, 1000*3);
          }                        
          return { err: 1, msg: '授权已失效，请重新登录！'};
        case 504:           
          message.warning('504错误：请检查网络连接！');
          return { err: 1, msg: status + '错误！'};
        default:
          return { err: 1, msg: status + '错误！'};
      }
    }, function(err) {
      message.warning('请求异常：请检查网络连接！');
      return { err: 1, msg: String(err)};
    })          
}
