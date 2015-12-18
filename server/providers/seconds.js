function getSeconds() {
  var date = new Date();
  return date.getSeconds().toString();
}

function provider(context, schedule) {
  schedule.scheduleJob('*/5 * * * * *', function() {
    var seconds = getSeconds();
    context.dataGate.publishData('seconds', seconds);
  });
  context.dataGate.subscribeData('seconds', function(client, data) {
    var seconds = getSeconds();
    client.publishData('seconds', seconds);
  });
}

module.exports = provider;
