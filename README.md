# zoe-calendar

## 安装依赖
```
npm install zoe-calendar
```
## 引入依赖
```
import Vue from 'vue'
import ZoeCalendar from 'zoe-calendar'

Vue.use(ZoeCalendar)
```
## 使用
```
this.$calendar.show({
  dateList: [
    {date: '2020-09-09', desc: '班', disabled: false},
    {date: '2020-09-10', desc: '班', disabled: false},
    {date: '2020-09-11', desc: '班', disabled: false},
    {date: '2020-09-12', desc: '休', disabled: true},
  ]
})
```
