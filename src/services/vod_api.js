import {  request , vodRequest, vodKRequest, vodMRequest } from '@/utils/request';

//api命令
const API = {
  newSongList: '/bar/u/remote_ctrl/top/new', //新歌榜单
  
  hotSongList: '/bar/u/remote_ctrl/top/hot', //热歌榜

  
  homeBDListMAPI: '/cms/kv', //首页榜单列表
  homeSongListMAPI: '/vadd/gzh/home/top', //首页歌曲列表



  singerListKAPI: '/bar/u/remote_ctrl/song/getsingerlist', //歌手列表
  singerSongListMAPI: '/vadd/gzh/home/singer', //根据歌手id搜索歌曲列表

  tjbangdanListMAPI: '/vadd/gzh/home/tops', //推荐榜单列表

  searchListMAPI: '/vadd/gzh/home/search',// 根据关键字搜索歌曲
  orderedListMAPI: '/vadd/gzh/home/list', //已点歌曲


}

//api方法
let ApiMethod = {};
Object.keys(API).forEach(key=>{
  ApiMethod[key] = async (params) => {
  if(key.endsWith('MAPI')){
    return vodMRequest(API[key], params,'GET');
  }else if(key.endsWith('KAPI')){
    return vodKRequest(API[key], params,'GET');
  }
}
})
module.exports = ApiMethod;

