/**
 * This file contains all necessary Angular controller definitions for 'frontend.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('SelectorDetailsController', [
      '_', '$scope', '$rootScope', '$log', '$state', 'SelectorService', '$uibModal', 'MessageService', 'SettingsService',
      function controller(_, $scope, $rootScope, $log, $state, SelectorService, $uibModal, MessageService, SettingsService) {

        var availableFormattedVersion = SelectorService.getLastAvailableFormattedVersion($rootScope.Gateway.version);
        $scope.settings = SettingsService.getSettings();
        $scope.partial = 'js/app/selectors/partials/form-add-selector-' + availableFormattedVersion + '.html?r=' + Date.now();

        // Store the original service in a var so that we can later check if the name is modified.
        // This is a monkey patch that fixes Kong's API inconsistency when using Cassandra in v0.13.x.
        // https://github.com/Kong/kong/issues/3534
        var originalSelector = angular.copy($scope.selector);

        $scope.updateSelector = function () {

          $scope.loading = true
          var data = angular.copy($scope.selector);

          console.log("updateselector data: ", data)
          // workaround, name field creates constraint violation in v0.13.x when using Cassandra
          if (!isKongUsingPostgres() && originalSelector.selector_name === data.selector_name) {
            delete data.selector_name;
          }

          SelectorService.update(data)
            .then(function (res) {
              console.log("Update Selector: ", res)
              $scope.loading = false
              MessageService.success('Selector updated successfully!');
              originalSelector = res.data; // ref. monkey patch
            }).catch(function (err) {
            console.log("err", err)
            $scope.loading = false
            var errors = {}
            Object.keys(err.data.body).forEach(function (key) {
              MessageService.error(key + " : " + err.data.body[key])
            })
            $scope.errors = errors
          })

        }
        function isKongUsingPostgres() {
          return _.get($rootScope.Gateway, 'configuration.database') === 'postgres';
        }
      }
    ])
  ;
}());
