var get_date;
module.exports.get_date= function(){
var currentDate = new Date();
var options = {    //here you can name the object options any name.
  weekday: "long",
 day:"numeric",
 month:"long" // gives the name of current week day.
   // gives the name of current month. // gives the current day of month.
};

var day = currentDate.toLocaleDateString("en-us", options);
return day;
}
var get_day;
module.exports.get_day=function(){
var currentDate = new Date();
var options = {
  weekday: "long"// gives the name of current week day.
   // gives the name of current month. // gives the current day of month.
};

var day = currentDate.toLocaleDateString("en-us", options);
return day;
}
