// Timestamp Module
// Ver. 1.0.4
// Saparov Arman
// S.A. Inc.
// 01/01/2019

'use strict';

class Timestamp {
  constructor() {
  };

  padANumber(num) {
    return num < 10 ? `0${num}` : num;
  };

  toAmPm(num) {
    return num >= 12 ? 'PM' : 'AM';
  };

  to12Hours(num) {
    return (num + 24) % 12 || 12;
  };

  getDate() {
    return new Date();
  };

  getMonth(date) {
    return date.getMonth() + 1;
  };

  getDay(date) {
    return date.getDate();
  };

  getYear(date) {
    return date.getFullYear();
  };

  getHour(date) {
    return date.getHours();
  };

  getMinute(date) {
    return date.getMinutes();
  };

  getSecond(date) {
    return date.getSeconds();
  };

  getTimestamp() {
    let date = this.getDate();
    let month = this.padANumber(this.getMonth(date));
    let day = this.padANumber(this.getDay(date));
    let year = this.padANumber(this.getYear(date));
    let hour = this.padANumber(this.to12Hours(this.getHour(date)));
    let minute = this.padANumber(this.getMinute(date));
    let second = this.padANumber(this.getSecond(date));
    let ampm = this.toAmPm(this.getHour(date));

    return `${month}/${day}/${year} ${hour}:${minute}:${second} ${ampm}`;
  }
};

module.exports = new Timestamp();
