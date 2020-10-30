/* eslint-disable require-yield */
import { login, modifyPw, getClerkRights, resetPassword, getSysDate, getRoomColor, getSysPara, findHotFood } from '@/services/api';
import { formatDate } from '@/utils/utils';
const RightModelID = '07';//权限模块id 07:大厅点单

const updateTheme = (Log) => {
  console.log('Log', Log);
  const lessStyleNode = document.createElement('link');
  lessStyleNode.setAttribute('rel', 'stylesheet');
  lessStyleNode.setAttribute('type', 'text/css');
  lessStyleNode.setAttribute('href', 'static/color_' + Log + '.css');
  document.body.appendChild(lessStyleNode);
};

export default {
  namespace: 'login',

  state: {
    ZW: {},
    Rights: {},
    LimitRegion: [],
    sysDate: '',
  },

  effects: {
    *login({ params, callback }, { call, put }) {
      let response = yield call(login, params);
      let token = (response.Token || '').trim();
      sessionStorage.setItem('token', token);
      if (response.msg) {
        if (callback) callback({ err: 1, msg: response.msg });
        return
      }
      // 登录成功      
      if (token && response.Current && response.Current.ID) {
        let loginUser = { userName: response.Name || '', userID: response.UserID || '', headPic: response.HeadPic || '', buMenID: response.DepartmentID || '' };
        const clerkRights = yield call(getClerkRights, { CFL_ID: RightModelID + '%' });
        if (clerkRights.msg) {
          if (callback) callback({ err: 1, msg: clerkRights.msg });
          return;
        }
        const ZW = clerkRights.ZW || {};
        const Rights = clerkRights.Rights || {};
        const LimitRegion = clerkRights.LimitRegion || [];
        yield put({
          type: 'changeState',
          ZW,
          Rights,
          LimitRegion,
        });
        sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
        //获取系统参数
        const [responseSysDate, responseHotFood, response1, response2] = yield [
          call(getSysDate),//获取系统日期
          call(findHotFood, {IsHot: 1, size: 1, UserID: loginUser.userID}),
          call(getSysPara, { SP_ID: 'FangTaiZhuangTaiHuiYuanXianShi' }),//房台状态会员显示 0:会员姓名 1:会员卡号
          call(getSysPara, { SP_ID: 'CunJiuKaiPingDanWei' }),//存酒开瓶使用单位 0:瓶(0.1-0.9) 1:毫米(高度)
        ]
        //系统日期
        yield put({
          type: 'changeState',
          sysDate: (responseSysDate && responseSysDate.date) ? formatDate(new Date(responseSysDate.date * 1000), 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
        });
        const hasHotFood = (responseHotFood.data||[]).length>0;
        //房台状态会员显示
        if (response1 && response1.data && response1.data.length > 0) {
          sessionStorage.setItem('FangTaiZhuangTaiHuiYuanXianShi', response1.data[0].SP_Value);
        } else {
          sessionStorage.setItem('FangTaiZhuangTaiHuiYuanXianShi', '0');
        }

     
        //房台颜色
        // let roomColor = yield call(getRoomColor);
        // roomColor.RC_0 = roomColor.RC_0 || '#ffffff';
        // roomColor.RC_1 = roomColor.RC_1 || '#cc33ff';
        // roomColor.RC_2 = roomColor.RC_2 || '#00ff01';
        // roomColor.RC_4 = roomColor.RC_4 || '#ff6699';
        // roomColor.RC_5 = roomColor.RC_5 || '#cf2323';
        // roomColor.RC_6 = roomColor.RC_6 || '#339967';
        // roomColor.RC_7 = roomColor.RC_7 || '#00ccff';
        // roomColor.RC_8 = roomColor.RC_8 || '#ffcc00';
        // roomColor.RC_WeiJieBeiJing = roomColor.RC_WeiJieBeiJing || '#fff100';
        // roomColor.RC_WDDX = roomColor.RC_WDDX || '#fff100';
        // roomColor.RC_2BDX = roomColor.RC_2BDX || '#ffffff';
        // sessionStorage.setItem('RC_0', roomColor.RC_0);
        // sessionStorage.setItem('RC_1', roomColor.RC_1);
        // sessionStorage.setItem('RC_2', roomColor.RC_2);
        // sessionStorage.setItem('RC_4', roomColor.RC_4);
        // sessionStorage.setItem('RC_5', roomColor.RC_5);
        // sessionStorage.setItem('RC_6', roomColor.RC_6);
        // sessionStorage.setItem('RC_7', roomColor.RC_7);
        // sessionStorage.setItem('RC_8', roomColor.RC_8);
        // sessionStorage.setItem('RC_WeiJieBeiJing', roomColor.RC_WeiJieBeiJing);
        // sessionStorage.setItem('RC_WDDX',roomColor.RC_WDDX);
        // sessionStorage.setItem('RC_2BDX',roomColor.RC_2BDX);
        //场所信息
        if (response.Current && response.Current.ID) {
          sessionStorage.setItem('CSID', response.Current.ID);
          sessionStorage.setItem('CSName', response.Current.Name);
          sessionStorage.setItem('Logo', response.Current.Logo || '0');
          sessionStorage.setItem('Mode', response.Current.Mode || '0');//0:KTV 1:酒吧 
          sessionStorage.setItem('AppLogoUrl', response.Current.AppLogoUrl || '');
        }
        //设置外壳参数
        if (window.android) {
          if (window.android.setCSName)
            window.android.setCSName(sessionStorage.getItem('CSName'));
          if (window.android.setUserLoginResult)
            window.android.setUserLoginResult(JSON.stringify(response));
          if (window.android.setClerkRights)
            window.android.setClerkRights(JSON.stringify(clerkRights));
          if (window.android.setHasHotFood)
            window.android.setHasHotFood(hasHotFood?'1':'0');
          if (window.android.setFangTaiZhuangTaiHuiYuanXianShi)
            window.android.setFangTaiZhuangTaiHuiYuanXianShi(sessionStorage.getItem('FangTaiZhuangTaiHuiYuanXianShi'));
          // if (window.android.setRoomColor)
          //   window.android.setRoomColor(JSON.stringify(roomColor));
        }
        callback(response);
      } else {
        callback(response);
      }
    },

    * updateTheme(_, { put }) {
      updateTheme('0');
    },

    *modifyPw({ params, callback }, { call, put }) {
      const response = yield call(modifyPw, params);
      if (callback) callback(response);
    },

    *resetPassword({ params, callback }, { call }) {
      const response = yield call(resetPassword, params);
      if (callback) callback(response);
    },

    *getSysDate({ }, { call, put }) {
      //系统日期
      const responseSysDate = yield call(getSysDate);
      yield put({
        type: 'changeState',
        sysDate: (responseSysDate && responseSysDate.date) ? formatDate(new Date(responseSysDate.date * 1000), 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
      });
    },
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
