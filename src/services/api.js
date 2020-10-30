import  request  from '@/utils/request';

//api命令
const API = {
  login: '/oauth/login',  
  modifyPw: '/operate/change/password',
  findClerk: '/comm/clerk/find',
  findUser: '/comm/user/find',  
  getSysDate: '/comm/sysDate',
  getSysPara: '/system/syspara/list',
  getRoomRegionList: '/system/region/list',
  getRoomTypeList: '/system/roomType/list',
  getGuestSourceList: '/system/guestSource/list',
  getDeparmentList: '/system/deparment/list',
  getPayWayList: '/system/payWay/list',
  getJobList: '/system/jobSet/list', 
  getPrintRequireList: '/front/printRequire',
  getRoomList: '/front/room/list',
  checkInRoom: '/front/room/checkIn',
  getRoomInfo: '/front/room/info',
  getBillList: '/front/bill',     
  getSumBill: '/front/summary/bill',
  clearRoom: '/front/room/clean',
  getFoodTypeList: '/front/foodType/list',
  getFoodTypeVar: '/front/foodItem/ver',
  getFoodList: '/front/foodItem/list',
  confirmInput: '/front/order/confirm/input',
  confirmFree: '/front/order/confirm/free',
  getYiRenBuMen: '/front/flower/department',
  getYiRenList: '/front/flower/clerk',
  getPackItemList: '/front/packItem/list',
  getCanGiving: '/front/room/canGiving', 
  getCanReturnList: '/front/canReturn/list',
  getMasterList: '/front/master',
  getQueryDepartment: '/management/room/department',
  getQueryInput: '/management/room/input',
  returnFood: '/front/order/return',
  getCanRegDutyList: '/front/duty/can/reg',
  regDuty: '/front/duty/reg',
  orderCheckReturn: '/front/order/check/return',
  cancelStoreWine: '/wine/store/cancel',
  wineGuestList: '/wine/guest/list',
  wineNoConfirmDetail: '/wine/noConfirm/detail',
  coreMemberList: '/core/member/list',
  getClerkRights: '/comm/clerk/rights',
  resetPassword: '/operate/reset/password',
  getRoomColor: '/system/roomColor/get',
  requireSettle: '/front/require/settle',
  getWineList: '/front/foodItem/list',
  getWineTypeList: '/front/foodType/list',
  getSystemWineTypes: '/system/foodType/list',
  upload: '/upload',
  findHotFood: '/front/foodItem/list',
  decodeQr: '/reward/qr/decode',//获取打赏二维码中的服务员ID  
}

//api方法
let ApiMethod = {};
Object.keys(API).forEach(key=>{
  ApiMethod[key] = async (params) => {
    switch(key){  
      case 'getFoodTypeList':
      case 'getFoodList':
      case 'getWineList':
      case 'getWineTypeList':
        return request(API[key], params, 'GET');
      default:
        return request(API[key], params);
    }    
  }
})
module.exports = ApiMethod;

