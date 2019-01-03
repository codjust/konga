/**
 * This file contains all necessary Angular controller definitions for 'frontend.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('AddConditionController', [
      '$scope', '$rootScope', '$state', 'SettingsService', '$log', 'AuthService', '$uibModalInstance', '_selector',
      function controller($scope, $rootScope, $state, SettingsService, $log, AuthService, $uibModalInstance, _selector) {
        $scope.ctype_names = [
          "URI",
          "Header",
          "Query",
          "PostParams",
          "IP",
          "UserAgent",
          "Host",
          "Referer"
        ]

        $scope.operators = [
          "match",
          "not_match",
          "=",
          "!=",
          ">",
          ">=",
          "<",
          "<="
        ]

        $scope.close = function () {
          $uibModalInstance.dismiss()
        }

        $scope.selector = _selector
        $scope.submit = function () {
          var condition = {
            type: $scope.type,
            name: $scope.name,
            operator: $scope.operator,
            value: $scope.value
          }
          console.log("AddConditionController condition:", condition)
          $scope.$emit('addRuleConditionClick', condition);
          $scope.$broadcast('addRuleConditionClick', condition);
          $rootScope.$broadcast('addRuleConditionClick', condition);
          $rootScope.$emit('addRuleConditionClick', condition);

  /*         $scope.selector = res.data;
          var value = $scope.selector.value
          console.log("rules:", value)
          console.log("selector:", $scope.selector)
          var rulesJsonObject = angular.fromJson(value)
          $scope.rules = rulesJsonObject.rules */

          $uibModalInstance.dismiss()
        }
      }
    ]);
}());