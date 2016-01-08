module.exports = function(context) {
  context.registerProvider('seconds.data', '*/1 * * * * *', function() {
    var date = new Date();
    return date.getSeconds().toString();
  });
};
