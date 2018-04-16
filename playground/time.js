const moment = require('moment');

// Jan 1st 1970 00:00:10 am

// let date = new Date();
// let months = ['Jan', 'Feb']
// console.log(date.getMonth());

// let date = moment();
// date.add(100, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));


let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let createdAt = 1234;
let date = moment(createdAt);
console.log(date.format('h:mm a'));