var schedule = require('node-schedule');

function getSeconds() {
  var date = new Date();
  return date.getSeconds().toString();
}

function initialize(context) {
  schedule.scheduleJob('*/1 * * * * *', function() {
    var seconds = getSeconds();
    context.dataGate.publishData('seconds.data', seconds);
  });
  context.register('seconds.data', getSeconds);
}

module.exports = initialize;
