var schedule = require('node-schedule');
// var date = new Date(2020, 8, 15, 14, 24, 0);
let date = Date.parse("2020-09-15 14:27:0");
 
var j = schedule.scheduleJob(date, function(){
 console.log('现在时间：',new Date());
});
// 在2017年12月16日16点43分0秒，打印当时时间