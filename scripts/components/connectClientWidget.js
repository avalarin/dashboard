import React from 'react';
import QRCodeWidget from 'components/qrcodeWidget';

class ConnectClientWidget extends QRCodeWidget {

  _formatValue(value) {
    var link = "http://" + location.hostname + ":" + location.port + "/connect/" + value;
    console.log(link);
    return link;
  }

}

export default ConnectClientWidget;
