const moment = require('moment');

exports.getStartOfDay = (date = new Date()) => {
  return moment(date).startOf('day').toDate();
};

exports.getEndOfDay = (date = new Date()) => {
  return moment(date).endOf('day').toDate();
};

exports.getDateRange = (period = 'week') => {
  const ranges = {
    today: {
      start: moment().startOf('day').toDate(),
      end: moment().endOf('day').toDate()
    },
    week: {
      start: moment().startOf('week').toDate(),
      end: moment().endOf('week').toDate()
    },
    month: {
      start: moment().startOf('month').toDate(),
      end: moment().endOf('month').toDate()
    },
    year: {
      start: moment().startOf('year').toDate(),
      end: moment().endOf('year').toDate()
    }
  };
  
  return ranges[period] || ranges.week;
};

exports.formatDateForDisplay = (date) => {
  return moment(date).format('MMM D, YYYY');
};

exports.formatDateForInput = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

exports.isSameDay = (date1, date2) => {
  return moment(date1).isSame(moment(date2), 'day');
};

exports.addDays = (date, days) => {
  return moment(date).add(days, 'days').toDate();
};