module.exports = function(array, key) {
   var dict = {};

   array.forEach(function(item) {
       dict[item[key]] = item;
   });

   return dict;
};
