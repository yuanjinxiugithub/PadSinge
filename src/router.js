import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import { HashRouter, Route } from 'react-keeper';
import Login from './Login';

import Home from './routes/home'
import Singer from './routes/singer'
import SingerDetail from './routes/singerdetail'
import BangDan from './routes/bangdan'
import BangDanDetail from './routes/bangdandetail'
import Search from './routes/search'
import Ordered from './routes/ordered'

import HomeLarge from './routes-large/home'
import BangDanLarge from './routes-large/bangdan'
import BangDanDetailLarge from './routes-large/bangdandetail'
import SearchLarge from './routes-large/search'
import SingerLarge from './routes-large/singer'
import SingerDetailLarge from './routes-large/singerdetail'
import OrderedLarge from './routes-large/ordered'
import RrinksLarge from './routes-large/drinks'
function RouterConfig() {
  return (
    <HashRouter>
      <LocaleProvider locale={zh_CN}>
        <div>
          <Route miss cache component={Login} path='/' />

          <Route component={Home} path='/home'/>
          <Route cache component={Singer} path='/singer'/>
          <Route component={SingerDetail} path="/singerdetail"/>
          <Route cache component={BangDan} path='/bangdan'/>
          <Route component={BangDanDetail} path="/bangdandetail" />
          <Route component={Search} path="/search" />
          <Route component={Ordered} path="/ordered"/>

          <Route component={HomeLarge} path='/home-large'/>
          <Route cache component={SingerLarge} path='/singer-large'/>
          <Route  component={SingerDetailLarge} path='/singerdetail-large'/>
          <Route  component={SearchLarge} path='/search-large'/>
          <Route cache component={BangDanLarge} path='/bangdan-large'/>
          <Route component={BangDanDetailLarge} path='/bangdandetail-large'/>
          <Route component={OrderedLarge} path='/ordered-large'/>
          <Route component={RrinksLarge} path='/drinks-large'/>
    
        </div>
      </LocaleProvider>
    </HashRouter>
  );
}

export default RouterConfig;
