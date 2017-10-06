'use strict';

module.exports = {
  mock: function () {
    var gtm = {
      open: jasmine.createSpy(),
      close: jasmine.createSpy()
    };

    return gtm;
  }
};
