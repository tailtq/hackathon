import moment from 'moment';

module.exports = (res) => {
  res.locals.old = (key, value = '') => {
    if (typeof res.locals.flashMessages !== 'undefined' && res.locals.flashMessages.oldValue) {
      const name = key.split('.');

      if (name.length > 1) {
        return res.locals.flashMessages.oldValue[0][name[0]][name[1]] || (value || '');
      }

      return res.locals.flashMessages.oldValue[0][key] || (value || '');
    }

    return value || '';
  };

  res.locals.errors = (key) => {
    if (typeof res.locals.flashMessages !== 'undefined' && res.locals.flashMessages.errors) {
      const { errors } = res.locals.flashMessages;

      if (errors[0] && errors[0][key]) {
        const name = key.split('.');

        if (name.length > 1) {
          return errors[0][name[0]][name[1]].msg;
        }

        return errors[0][key].msg;
      }
    }

    return '';
  };

  res.locals.moment = moment;

  res.locals.hasError = () => typeof res.locals.flashMessages !== 'undefined' && res.locals.flashMessages.errors;

  res.locals.getGender = (gender) => {
    switch (gender) {
      case 1:
        return 'Female';
      case 2:
        return 'Other';
      default:
        return 'Male';
    }
  };
};
