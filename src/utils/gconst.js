let monthDayOptions=[];
var i,j;
for(i=1;i<=12;i++){
  let children = [];
  if (i===1||i===3||i===5||i===7||i===8||i===10||i===12)
  for (j=1;j<=31;j++){
    children.push({
      value: j+'',
      label: j+'日',
    })
  } else
  if (i===4||i===6||i===9||i===11)
  for (j=1;j<=30;j++){
    children.push({
      value: j+'',
      label: j+'日',
    })
  } else
  if (i===2)
  for (j=1;j<=29;j++){
    children.push({
      value: j+'',
      label: j+'日',
    })
  }
  monthDayOptions.push({
    value: i+'',
    label: i+'月',
    children,
  })
}

module.exports ={
  //logo
  logos: [
    {id: '0', name: '天娱', primaryColor: '#f0804e',},
    {id: '1', name: '智娱', primaryColor: '#f0804e',},
    {id: '2', name: '和音', primaryColor: '#f0804e',},
  ],

  //月日
  monthDayOptions: monthDayOptions,

  urlPre: 'https://sy-pan.oss-accelerate.aliyuncs.com/static/',//带加速的地址
  defualtImg :  require('../assets/noimg.jpg'),
  vodUrlPre: 'https://rvod.ktvsky.com/', //vod_api 请求前缀
  vodUrlPreM: 'https://m.ktvsky.com/', //
  vodUrlPreK: 'https://k.ktvsky.com/', //
}
