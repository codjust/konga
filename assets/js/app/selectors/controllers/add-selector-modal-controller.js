/**
 * This file contains all necessary Angular controller definitions for 'frontend.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('AddSelectorModalController', [
      '$scope', '$rootScope', '$log', '$state', 'SelectorService', 'SettingsService',
      '$uibModalInstance', 'MessageService',
      function controller($scope, $rootScope, $log, $state, SelectorService, SettingsService,
                          $uibModalInstance, MessageService) {

        $scope.tags = [];
        var availableFormattedVersion = SelectorService.getLastAvailableFormattedVersion($rootScope.Gateway.version);
        $scope.selector = angular.copy(SelectorService.getProperties($rootScope.Gateway.version));

        $scope.partial = 'js/app/selectors/partials/form-add-selector-' + availableFormattedVersion + '.html?r=' + Date.now();

        $log.debug("$scope.selector", $scope.selector)

        $scope.close = function () {
          $uibModalInstance.dismiss()
        }


        $scope.submit = function () {

          clearSelctor()


          SelectorService.add($scope.selector)
            .then(function (res) {
              $rootScope.$broadcast('selector.created')
              MessageService.success('Selector created!')
              $uibModalInstance.dismiss()
            }).catch(function (err) {
            $log.error("Create new selector error:", err)
            MessageService.error("Submission failed. Make sure you have completed all required fields, err: " + err)
            $scope.errors = {}
            if (err.data && err.data.body) {
              if (err.data.body.fields) {
                Object.keys(err.data.body.fields).forEach(function (key) {
                  $scope.errors[key] = err.data.body.fields[key]
                })
              }else{
                Object.keys(err.data.body).forEach(function (key) {
                  $scope.errors[key] = err.data.body[key]
                })
              }

            }
          })
        }


        function clearSelctor() {
          for (var key in $scope.selector) {
            if ($scope.selector[key] === '') {
              delete($scope.selector[key])
            }
          }
        }
      }
    ])
  ;
}());
