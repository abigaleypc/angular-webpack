const angular = require('angular')

class AppCtrl {
  constructor() {
    this.url = 'https://abigaleypc.github.io';
  }
}

var AppModule = angular.module('app', [])
  .controller('AppCtrl', AppCtrl);

module.exports = AppModule;

