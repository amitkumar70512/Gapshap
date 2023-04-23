var express = require("express");
const app = express();

var date = new Date();
console.log(date.getHours()+':'+date.getMinutes());