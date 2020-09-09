<template>
  <mt-popup v-model="visible" position="bottom" popup-transition="popup-slide-top" class="zoe-calendar">
    <div class="zoe-calendar-hd">
      <div class="year">
        <span class="previous" @click="previousYear"></span>{{currentYear}} 年<span class="next" @click="nextYear"></span>
      </div>
      <div class="month">
        <span class="previous" @click="previousMonth"></span>{{currentMonth}} 月<span class="next" @click="nextMonth"></span>
      </div>
    </div>
    <div class="zoe-calendar-bd">
      <div class="zoe-calendar-weekday">
        <div class="zoe-calendar-weekday-item">周日</div>
        <div class="zoe-calendar-weekday-item">周一</div>
        <div class="zoe-calendar-weekday-item">周二</div>
        <div class="zoe-calendar-weekday-item">周三</div>
        <div class="zoe-calendar-weekday-item">周四</div>
        <div class="zoe-calendar-weekday-item">周五</div>
        <div class="zoe-calendar-weekday-item">周六</div>
      </div>
      <div class="zoe-calendar-month-wrapper">
        <div class="zoe-calendar-month-box" :style="{transform: `translateX(${xPosition})`}">
          <div class="zoe-calendar-month" v-for="(month, index) in monthList" :key="`${month.month}_${index}`" :ref="`month-${index}`">
            <div class="zoe-calendar-day" v-for="item in month.dateList" :class="{'empty-day':item.space, 'today':item.today, 'active': item.date === currentDate.date, 'disabled': item.disabled}"
                 @click="chooseDate(item)" :key="item.date">
              <div class="day">{{item.date | calendar}}</div>
              <div class="desc">{{(item.space || item.expired) ? ' ' : item.desc || ' '}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </mt-popup>
</template>

<script>
  import dayjs from 'dayjs';
  import MtPopup from 'mint-ui/lib/popup';
  import 'mint-ui/lib/popup/style.css';

  export default {
    components: {
      MtPopup,
    },
    name: 'zoe-calendar',
    props: {
      startDate: String,
      endDate: String,
      dateList: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data: () => {
      return {
        monthList: [],
        currentMonth: dayjs().month() + 1,
        currentYear: dayjs().year(),
        currentDate: {},
        visible: false,
        currentIndex: dayjs().month(),
      };
    },
    created() {
      this.createYear();
    },
    filters: {
      calendar(value) {
        return (new Date(value).getDate());
      },
    },
    computed: {
      xPosition() {
        return '-' + (this.currentIndex * (window.innerWidth -4)) + 'px';
      },
    },
    methods: {
      /**
       * 创建一年的日期数据
       * @param year 要创建的年份
       * @param isBefore 是否创建在当前年之前
       */
      createYear(year = this.currentYear, isBefore = false) {
        const monthList = [];
        for (let i = 0; i <= 11; i++) {
          monthList.push({
            year,
            month: i + 1,
            dateList: this.createMonth(year, i),
          });
        }
        if (isBefore) {
          this.monthList.unshift(...monthList);
        } else {
          this.monthList = this.monthList.concat(monthList);
        }
      },
      /**
       * 创建月份
       * @param year 要创建的月份所在年
       * @param month 要创建的月份
       * @return {Array}
       */
      createMonth(year = this.currentYear, month = this.currentMonth - 1) {
        const currentMonth = dayjs().set('year', year).set('month', month);
        const begin = dayjs(currentMonth).startOf('month');
        const end = dayjs(currentMonth).endOf('month');
        const days = currentMonth.daysInMonth();
        const beginWeekday = currentMonth.startOf('month').day();
        const arr = [];

        for (let i = 1; i <= days; i++) {
          const date = currentMonth.set('date', i).startOf('day');
          const today = dayjs().startOf('day');
          const dateInfo = {
            date: date.format('YYYY-MM-DD'),
            weekday: +date.format('d'),
            expired: date.isBefore(today),
            desc: '',
            disabled: this.dateList.length > 0 ? true : date.isBefore(today),
            today: date.isSame(today),
          };
          const dateObj = this.dateList.find((item) => item.date === dateInfo.date);
          if (dateObj) {
            Object.assign(dateInfo, dateObj);
          }
          arr.push(dateInfo);
        }
        if (beginWeekday) {
          this.fillSpace(arr, (beginWeekday - 1), 'before', begin, end);
        }
        // 该月最后一天之后添加日期到42天为止，因为有些月份可能会有6行的日期，为了统一展示效果
        this.fillSpace(arr, 41 - arr.length, 'after', begin, end);
        return arr;
      },
      // 添加月初月末空白日期
      fillSpace(arr, num, pos, begin, end) {
        const today = dayjs().startOf('day');
        switch (pos) {
          case 'before':
            for (let i = 0; i <= num; i++) {
              const date = begin.subtract(i + 1, 'days');
              const dateInfo = {
                date: date.format('YYYY-MM-DD'),
                weekday: +date.format('d'),
                expired: date.isBefore(today),
                desc: '',
                disabled: this.dateList.length > 0 ? true : date.isBefore(today),
                today: date.isSame(today),
                space: true,
              };
              const dateObj = this.dateList.find((item) => item.date === dateInfo.date);
              if (dateObj) {
                Object.assign(dateInfo, dateObj);
              }
              arr.unshift(dateInfo);
            }
            break;
          case 'after':
            for (let i = 0; i <= num; i++) {
              const date = end.add(i + 1, 'days');
              const dateInfo = {
                date: date.format('YYYY-MM-DD'),
                weekday: +date.format('d'),
                expired: date.isBefore(today),
                desc: '',
                disabled: this.dateList.length > 0 ? true : date.isBefore(today),
                today: date.isSame(today),
                space: true,
              };
              const dateObj = this.dateList.find((item) => item.date === dateInfo.date);
              if (dateObj) {
                Object.assign(dateInfo, dateObj);
              }
              arr.push(dateInfo);
            }
        }
      },
      // 上一年
      previousYear() {
        this.currentYear = dayjs(dayjs().set('year', this.currentYear - 1)).year();
        let index =
          this.monthList.findIndex((item) => item.year === this.currentYear && item.month === this.currentMonth);
        if (index <= 11) {
          this.createYear(this.currentYear, true);
          index =
            this.monthList.findIndex((item) => item.year === this.currentYear && item.month === this.currentMonth);
          this.changeMonth(index);
        } else {
          this.changeMonth(index);
        }
      },
      // 下一年
      nextYear() {
        this.currentYear = dayjs(dayjs().set('year', this.currentYear + 1)).year();
        const index =
          this.monthList.findIndex((item) => item.year === this.currentYear && item.month === this.currentMonth);
        if (index <= 0) {
          this.createYear(this.currentYear);
          this.changeMonth(this.currentIndex + 12);
        } else {
          this.changeMonth(index);
        }
      },
      // 上个月
      previousMonth() {
        const index =
          this.monthList.findIndex((item) => item.year === this.currentYear && item.month === this.currentMonth);
        if (index <= 0) {
          this.createYear(this.currentYear - 1, true);
          this.changeMonth(this.currentMonth - 1);
        } else {
          this.changeMonth(index - 1);
        }
      },
      // 下个月
      nextMonth() {
        const index =
          this.monthList.findIndex((item) => item.year === this.currentYear && item.month === this.currentMonth);
        if (index === this.monthList.length - 1) {
          this.createYear(this.currentYear + 1);
        }
        this.changeMonth(index + 1);
      },
      // 选择日期
      chooseDate(item) {
        this.currentDate = JSON.parse(JSON.stringify(item));
        if (
          dayjs(item.date).isBefore(dayjs().set('year', this.currentYear)
            .set('month', this.currentMonth - 1).startOf('month'))) {
          this.previousMonth();
        } else if (
          dayjs(item.date).isAfter(dayjs().set('year', this.currentYear)
            .set('month', this.currentMonth - 1).endOf('month'))) {
          this.nextMonth();
        }
        this.$emit('on-change', this.currentDate);
      },
      // 切换月份
      changeMonth(index) {
        this.currentYear = this.monthList[index].year;
        this.currentMonth = this.monthList[index].month;
        this.monthList[index].dateList.map(dateInfo => {
          const dateObj = this.dateList.find((item) => item.date === dateInfo.date);
          if (dateObj) {
            Object.assign(dateInfo, dateObj);
          } else {
            dateInfo.disabled = true;
          }
        });
        this.currentIndex = index;

        const monthIndex =
          this.monthList.findIndex((item) => item.year === this.currentYear && item.month === this.currentMonth);
        if (monthIndex === 0) {
          this.createYear(this.currentYear - 1, true);
          this.currentIndex = 12;
        } else if (monthIndex === this.monthList.length - 1) {
          this.createYear(this.currentYear + 1);
        }
      },
    },
  };
</script>

<style>
  .zoe-calendar {
    cursor: default;
    background: #fff;
    font-size: 1rem;
  }

  .zoe-calendar-hd {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 16px;
    background: #f5f5f5;
  }

  .previous, .next {
    padding: 0 10px;
  }

  .previous::before, .next::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-left: 2px solid #999;
    border-bottom: 2px solid #999;
  }

  .previous::before {
    transform: rotate(45deg);
  }

  .next::before {
    transform: rotate(-135deg);
  }

  .zoe-calendar-weekday {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0 10px;
    background: #f5f5f5;
  }

  .zoe-calendar-weekday-item {
    width: calc((100vw - 24px) / 7);
    box-sizing: border-box;
    padding: 1em 0;
    text-align: center;
  }

  .zoe-calendar-month-wrapper {
    width: 100vw;
    overflow: hidden;
  }

  .zoe-calendar-month-box {
    display: flex;
    flex-basis: 100vw;
    transition: .25s linear;
  }

  .zoe-calendar-month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px 0;
    flex-wrap: wrap;
    padding: 10px;
  }

  .zoe-calendar-day {
    width: calc((100vw - 24px) / 7);
    height: 40px;
    padding: .5em 0;
    box-sizing: border-box;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
  }

  .zoe-calendar-day.today {
    background: #E6E6E6;
  }

  .zoe-calendar-day.active {
    background: #4776FF;
    color: #fff;
    cursor: pointer;
  }

  .zoe-calendar-day.empty-day {
    opacity: .7;
  }

  .zoe-calendar-day.disabled {
    opacity: .4;
    pointer-events: none;
  }

  .zoe-calendar-day .day {
    font-size: 16px;
  }

  .zoe-calendar-day .desc {
    font-size: 10px;
  }
</style>
