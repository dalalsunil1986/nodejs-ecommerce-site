const moment = require('moment');


const DateHelper = {};

DateHelper.age = date => moment().diff(date, 'years');
DateHelper.ago = (n, interval) => moment().subtract(n, interval);
DateHelper.datetime = datetime =>
  moment(datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
DateHelper.mdyyyy = datetime =>
  moment(datetime).format("M/D/YYYY");
module.exports = DateHelper;
