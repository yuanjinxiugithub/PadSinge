/* eslint-disable require-yield */
import { orderedListMAPI,searchListMAPI, tjbangdanListMAPI, newSongList, singerList, singerSongListMAPI, hotSongList, homeBDListMAPI , homeSongListMAPI, singerListKAPI } from '@/services/vod_api.js';
import { formatDate } from '@/utils/utils';
import {  message } from 'antd';

export default {
  namespace: 'home',

  state: {
    R_ID: ""
  },

  effects: {
    *getBDList({ params, callback }, { call, put }){
      let response = yield call(homeBDListMAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getSongList({ params, callback }, { call, put }){
      let response = yield call(homeSongListMAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getNewSongList({ params, callback }, { call, put }) {
      let response = yield call(newSongList, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getSingerList({ params, callback }, { call, put }){
      let response = yield call(singerListKAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getSingerSongList({ params, callback }, { call, put }){
      let response = yield call(singerSongListMAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getHotSongList({ params, callback }, { call, put }){
      let response = yield call(hotSongList, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getBangDanTJList({ params, callback }, { call, put }){
      let response = yield call(tjbangdanListMAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getSearchListMAPI({ params, callback }, { call, put }){
      let response = yield call(searchListMAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    },

    *getOrderedListMAPI({ params, callback }, { call, put }){
      let response = yield call(orderedListMAPI, params);
      if(response.errcode !== 200){
        message.error(response.errmsg,2);
        return ;
      }
      if(callback){
        callback(response);
      }
    }

  },

  reducers: {
    changeState(state, action) {
      return {
        ...state,
        ...action,
      };
    },
  },
};
