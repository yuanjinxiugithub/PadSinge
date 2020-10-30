import { Component } from 'react';
import { connect } from 'dva';
import { Control } from 'react-keeper';
import styles from './Login.less';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import QRCode from 'qrcode.react';
import { success, error, appid } from '@/utils/utils';
/** android调用js方法 
 * method 方法名称
 * androidParams android传递给js的参数(android异步处理完成后返回的状态结果等参数)
 **/
window.androidCallJs = function (method, androidParams) {
  if (window.callback !== undefined) {
    window.callback.androidCallJs(method, androidParams);
  }
}
window.setCallback = function (callback) {
  window.callback = callback;
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    let bPhonePage = false;
    let panelWidth = 450;
    let screenWidth = document.querySelector('body').clientWidth;    
    if (panelWidth > screenWidth){
      bPhonePage = true;
      panelWidth = screenWidth - 60;      
    }    
    const bLocalDebug = (window.location.hostname === 'localhost'||window.location.hostname.indexOf('192.168')===0);
    this.state = {
      title: '智娱点歌',
      CS_ID: '',
      CS_Name: '',
      Ver: '',
      Mac: '',
      User: bLocalDebug?'191723':'',
      Password: bLocalDebug?'123':'',   
      topic: '',
      curInputIndex: 0,
      loginMode: 0,
      loginVisible: true, 
      bPhonePage,
      panelWidth,
      loginParams: null,
    }
  }

  /** androidCallJs **/
  androidCallJs = (method, androidParams) => {
    const { CS_ID } = this.state;
    if (CS_ID === '') {
      return;
    }
    let androidObj = {};
    try {
      if (typeof (androidParams) === 'string') {
        androidObj = JSON.parse(androidParams || '{}');
      } else {
        androidObj = androidParams;
      }
    } catch (e) {
    }   
    switch (method) {
      case 'scanQrCode':          
        let scanResult = androidObj['scanResult'];           
        setTimeout(()=>{
          const path = Control.path;
          switch(path){
            case '/home':
              if (window.g_home){
                window.g_home.getScanResult(scanResult);
              }
              break
            default:
              break
          }                               
        },500); 
        break
      case 'mqtt':
        let topic = androidObj['topic'];
        let msg = JSON.parse(androidObj['msg']);
        if (topic == this.state.topic) {
          this.loginIn({ Code: msg.Code });
        }
        break
      case 'web':        
        let page = androidObj['page'];
        let params = JSON.parse(androidObj['params'] || '{}');
        if (page == '/') {
          this.setState({ loginVisible: true });
        } else {
          let bIsMobileDevice = sessionStorage.getItem('bIsMobileDevice');
          Control.go(page+(bIsMobileDevice?'':'-large'), params);          
        }
        break
      case 'pause':
        if (Control.path!=='/')
          Control.go('/');   
        break
      case 'visible':              
        if (this.state.loginParams && !this.state.loginVisible){          
          this.loginIn(this.state.loginParams,()=>{
            this.setState({ loginVisible: true });
          }); 
        } else {        
          this.setState({ loginVisible: true });
        }
        break      
      default: 
        break
      }
  }
  /** androidCallJs **/

  componentDidMount() {   
    //设置主题
    const { dispatch } = this.props;
    dispatch({
      type: 'login/updateTheme',
    })
    //初始化参数
    window.g_login = this;
    window.setCallback(this);//将window方法传递到reactjs中
    if (window.android && window.android.getIsMobileDevice)
      sessionStorage.setItem('bIsMobileDevice',window.android.getIsMobileDevice());//是否是手机设备  
    Control.history.listen(route=>{
      if (window.android && window.android.onWebPageChange)
        window.android.onWebPageChange(route.pathname);
    });//监听路由变化
    let Mac = '';
    let CS_ID = '';
    let CS_Name = '';
    let topic = '';
    let Ver = '';
    if (window.android) {
      if (window.android.getMac) {
        Mac = window.android.getMac();
      }
      if (window.android.getCSID) {
        CS_ID = window.android.getCSID();
      }
      if (window.android.getCSName) {
        CS_Name = window.android.getCSName();
      }
      if (window.android.getVer) {
        Ver = window.android.getVer();
      }
      if (window.android.getLoginTopic) {
        topic = window.android.getLoginTopic();
      }
    }
    if (this.refUser) {
      this.refUser.focus();
    }
    this.setState({ Mac, CS_ID, CS_Name, Ver, topic });
  }

  handleSubmit = (passLoginMode) => {
    const { User, Password } = this.state;
    if (!User) {
      message.error('请输入用户名！');
      return;
    }
    if (Password === null || Password === '') {
      message.error('请输入密码！');
      return;
    }
    this.loginIn(passLoginMode==0?{User, Password}:{C_Num:User, Password});   
  }

  componentWillUnmount() {
    window.g_login = null;
  }

  loginIn = (values, callback) => {
    const { Mac } = this.state;
    values.Mac = Mac;
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      params: {
        ...values,
      },
      callback: (response) => {
        if (String(response.err) === '0') {
          if (response.Current && response.Current.ID) {
            const token = (response.Token || '').trim();
            if (token === '') {
              message.info('接口暂时出现问题，token返回为空:' + JSON.stringify(response));
              if (callback)
                callback();
              return;
            }
            if (window.android) {
              if (window.android.setToken)
                window.android.setToken(sessionStorage.getItem('token'));
              //登录成功 -- 调用android 原生方法
              // if (window.android.loginSuccess)
              //   window.android.loginSuccess();
              let bIsMobileDevice = sessionStorage.getItem('bIsMobileDevice');
              Control.go('/home'+(bIsMobileDevice?'':'-large'), {params:{ login: true }})
              this.setState({loginParams: values, loginVisible: false, User: '', Password: '', curInputIndex: 0 });
            }            
            //本地调试时测试代码
            if (!window.android) {
              let page = 'home';
              let params = {MT_ID: '135686118063960064', RoomName: '平湖秋月6号', R_ID: 'a010174cd2f24d0c992777c08f2d4715', MT_State: 'I', Mobile: '18657191723', GuestName: '涯子'};
              switch (page) {
                case 'home':
                  break;
                default:
                  break;  
              }          
               let bIsMobileDevice = sessionStorage.getItem('bIsMobileDevice');
               Control.go(page+(bIsMobileDevice?'':'-large'), params); 
            }
          } else {
            message.info('你还不是场所员工！');
            if (callback)
              callback();
          }
        } else {
          message.error(response.msg);
          if (callback)
            callback();
        }        
      }
    })
  }

  clickExit = () => {
    if (window.android)
      window.android.exitApp();
  }

  onPasswordChange = (e) => {
    this.setState({ Password: e.target.value });
  }

  clickResetPassword = () => {
    const { User } = this.state;
    if (User === null || User === '') {
      message.error('请输入用户名！');
      return;
    }
    Modal.confirm({
      title: '是否确认重置密码？',
      content: '新密码会推送到<娱助手>公众号中，重置密码前请确认已关注公众号！',
      maskClosable: true,
      onOk: () => {
        this.resetPassword();
      },
    })
  }

  resetPassword = () => {
    const { User } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'login/resetPassword',
      params: { Mobile: User },
      callback: (result) => {
        if (result.msg && result.msg !== '') {
          error(result.msg);
        } else {
          success('密码已经重置成功，请在<娱助手>公众号中查看新密码！');
        }
      }
    })
  }

  clickUser = () => {
    this.setState({ curInputIndex: 0 });
  }

  clickPw = () => {
    this.setState({ curInputIndex: 1 });
  }

  clickNum = (num) => {
    let { curInputIndex, User, Password } = this.state;
    if (curInputIndex === 0) {
      User = User + String(num);
      this.setState({ User });
    } else if (curInputIndex === 1) {
      Password = Password + String(num);
      this.setState({ Password });
    }
  }

  clickClear = () => {
    let { curInputIndex } = this.state;
    if (curInputIndex === 0) {
      this.setState({ User: '' });
    } else if (curInputIndex === 1) {
      this.setState({ Password: '' });
    }
  }

  clickDel = () => {
    let { curInputIndex, User, Password } = this.state;
    if (curInputIndex === 0) {
      User = User.substr(0, User.length - 1);
      this.setState({ User });
    } else if (curInputIndex === 1) {
      Password = Password.substr(0, Password.length - 1);
      this.setState({ Password });
    }
  }

  changeMode = (mode) => {
    this.setState({ loginMode: mode, curInputIndex: 0, User: '', Password: '' }, () => {
      if (mode === 0 && this.refUser) {
        this.refUser.focus();
      }
    });
  }

  onUserSearch = (v) => {
    if (v) {
      this.setState({ User: v });
    }
  }

  onUserChange = (v) => {
    this.setState({ User: v || '' });
    if (this.refUser)
      this.refUser.blur();
  }

  render() {
    const { loading } = this.props;
    const { loginVisible, User, Password, topic, Mac, CS_ID, CS_Name, Ver, title, curInputIndex, loginMode, bPhonePage, panelWidth } = this.state;
    let rightWidth = '100%';
    let rightPaddingTop = '0px';
    let btnStyle = { height: '60px', fontSize: '20px' };
    if (bPhonePage) {    
      btnStyle = { height: '50px', fontSize: '19px' };
    }
    return (
      !loginVisible ? null :
        <div className={styles.loginPage} style={{
          backgroundImage: "url(https://sy-pan.oss-cn-hangzhou.aliyuncs.com/bg/bg.jpg)",
          paddingTop: '20px',
          alignItems: 'flex-start',
        }}
        >
          <div>
            <div className={styles.top}>
              <div className={styles.header}>
                <span className={styles.title}>{title}</span>
              </div>
            </div>
            <Card style={{ marginTop: '20px' }}>
              {
                loginMode === 0 ?
                  <div className={`${styles.userLogin} ${bPhonePage ? styles.phoneUserLogin : styles.padUserLogin}`} style={{ width: panelWidth }}>
                    <div className={styles.userPanel}>
                      <div className={styles.loginTitle}>账号登录</div>
                      <Form
                        className={styles.passForm}
                      >
                        <Form.Item className={styles.user}>
                          <Input
                            onClick={this.clickUser}
                            size="large"
                            placeholder="请输入手机号或工号"
                            value={User}
                            onChange={e => this.onUserChange(e.target.value)}
                            allowClear
                            className={curInputIndex === 0 ? styles.curInputBox : ''}
                            readOnly={window.android?true:false}
                          />
                        </Form.Item>
                        <Form.Item className={styles.password}>
                          <Input
                            onClick={this.clickPw}
                            size="large"
                            type="password"
                            placeholder="请输入密码"
                            value={Password}
                            onChange={this.onPasswordChange}
                            allowClear
                            className={curInputIndex === 1 ? styles.curInputBox : ''}
                            readOnly={window.android?true:false}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                    <div className={styles.line} />
                    <div className={styles.numPanel} style={{ width: rightWidth, paddingTop: rightPaddingTop }}>
                      <div className={styles.numDiv}>
                        <div onClick={() => this.clickNum(1)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">1</div>
                        <div onClick={() => this.clickNum(2)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">2</div>
                        <div onClick={() => this.clickNum(3)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">3</div>
                      </div>
                      <div className={styles.numDiv}>
                        <div onClick={() => this.clickNum(4)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">4</div>
                        <div onClick={() => this.clickNum(5)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">5</div>
                        <div onClick={() => this.clickNum(6)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">6</div>
                      </div>
                      <div className={styles.numDiv}>
                        <div onClick={() => this.clickNum(7)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">7</div>
                        <div onClick={() => this.clickNum(8)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">8</div>
                        <div onClick={() => this.clickNum(9)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">9</div>
                      </div>
                      <div className={styles.numDiv}>
                        <div onClick={() => this.clickNum(0)} className={styles.numBtn} style={btnStyle} type="ghost" size="large">0</div>
                        <div onClick={() => this.clickClear()} className={styles.numBtn} style={btnStyle} type="ghost" size="large">清空</div>
                        <div onClick={() => this.clickDel()} className={styles.numBtn} type="ghost" size="large" style={{ background: '#00C0E3', color: 'white', ...btnStyle }}>删除</div>
                      </div>
                      <div style={{display:'flex'}}>
                        <div className={styles.numDiv} style={{flex:1}}>
                          <Button onClick={()=>this.handleSubmit(0)} className={styles.numBtn} style={btnStyle} type="primary" size="large" loading={loading.effects['login/login']}>手机号登录</Button>
                        </div>
                        <span style={{width: '10px'}}></span>
                        <div className={styles.numDiv} style={{flex:1}}>
                          <Button onClick={()=>this.handleSubmit(1)} className={styles.numBtn} style={btnStyle} type="primary" size="large" loading={loading.effects['login/login']}>工号登录</Button>
                        </div>
                      </div>                      
                      <div className={styles.rePwDev} style={{ paddingTop: '10px', marginBottom: '0px', fontSize: '15px' }}>
                        <div className={styles.exitDiv}>
                          <span onClick={this.clickExit}>{CS_ID !== '' ? '退出登录' : ''}</span>
                        </div>
                        {
                          Ver &&
                          <div>{'v'+Ver}</div>
                        }                        
                        <div className={styles.resetDiv}>
                          <span onClick={this.clickResetPassword}>重置密码</span>
                        </div>
                      </div>
                      <img src={require('@/assets/icon_qrlogin.png')} alt='' className={styles.icon1} onClick={() => this.changeMode(1)} />
                    </div>
                  </div>
                  :
                  <div className={`${styles.qrcodeLogin} ${bPhonePage ? styles.phoneQrcodeLogin : styles.padQrcodeLogin}`} style={{ width: panelWidth }}>
                    <div className={styles.qrcodePanel}>
                      <div className={styles.scanTitle}>扫码登录</div>
                      <div className={`${styles.qrcodeDiv} ${bPhonePage?styles.phoneQrcodeDiv:styles.padQrcodeDiv}`}>
                        <QRCode
                          value={`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=https://zs.16931.com/%23/scanoauth&state=topic=${topic}&response_type=code&scope=snsapi_userinfo#wechat_redirect`}  //value参数为生成二维码的链接
                          size={150} //二维码的宽高尺寸
                          fgColor="#000000"  //二维码的颜色
                        />
                      </div>
                      {
                        (CS_Name && Mac) &&
                        <>
                        <div className={styles.csInfoDiv} style={{paddingTop:'20px'}}>场所名称: {CS_Name}</div>
                        <div className={styles.csInfoDiv}>本机Mac: {Mac}</div>        
                        </>
                      }  
                      <div className={styles.qrExitDiv} style={{ fontSize: '15px' }}>
                        <span onClick={this.clickExit}>{CS_ID !== '' ? '退出登录' : ''}</span>
                      </div>
                      <img src={require('@/assets/icon_userlogin.png')} alt='' className={styles.icon2} onClick={() => this.changeMode(0)} />
                    </div>                    
                  </div>
              }
            </Card>
          </div>
        </div>
    );
  }
}

export default connect(({ loading }) => ({
  loading
}))(Form.create()(LoginPage));