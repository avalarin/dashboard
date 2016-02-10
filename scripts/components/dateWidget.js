import React from 'react';
import TextWidget from 'components/textWidget';
import moment from 'moment';

class DateWidget extends TextWidget {

  _formatValue(value) {
    var format = this.props.format || 'DD.MM.YYYY hh:mm';
    return moment(value).format(format)
  }

}

export default DateWidget;
