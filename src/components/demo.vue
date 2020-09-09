<template>
  <div class="hello">
    <button @click="showCalendar">显示日历</button>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'Demo',
        props: {
            msg: String,
        },
        data() {
            return {
                dateList: [
                    {
                        date: '2020-09-09',
                        disabled: true,
                        desc: '已满',
                    },
                    {
                        date: '2020-09-10',
                        disabled: false,
                        desc: '余10人',
                    },
                    {
                        date: '2020-09-11',
                        disabled: false,
                        desc: '余1人',
                    },
                    {
                        date: '2020-09-12',
                        disabled: false,
                        desc: '余5人',
                    },
                ],
            };
        },
        methods: {
            showCalendar() {
                this.$calendar.show({
                    dateList: this.dateList
                })
            },
        },
    });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
