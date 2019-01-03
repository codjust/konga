/**
 * This file contains all necessary Angular controller definitions for 'frontend.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('AddRuleModalController', [
      '_', '$scope', '$rootScope', '$log', '$state', 'SelectorService', 'SettingsService',
      '$uibModalInstance', 'MessageService', '$uibModal', '_selector',
      function controller(_, $scope, $rootScope, $log, $state, SelectorService, SettingsService,
        $uibModalInstance, MessageService, $uibModal, _selector) {


        var availableFormattedVersion = SelectorService.getLastAvailableFormattedVersion($rootScope.Gateway.version);
        $scope.desc = "测试页面"

        $scope.onAddCondition = onAddCondition;
        $scope.selector = _selector

        $scope.rule = {
          rule_name: "",
          type: 0,
          conditions: [],
          upstream_name: ""
        }

        $scope.ctypes = [{
            type: 0,
            name: "Single Condition"
          },
          {
            type: 1,
            name: "And Condition"
          },
          {
            type: 2,
            name: "Or Condition"
          },
          {
            type: 3,
            name: "Expressions Condition"
          },
        ]

        //$scope.service = _service;
        //$scope.route = angular.copy(RoutesService.getProperties($rootScope.Gateway.version));
        // Assign service id
        /*    $scope.route.service = {
          id: _service.id
        };
 */
        $scope.partial = 'js/app/selectors/partials/form-rule-' + availableFormattedVersion + '.html?r=' + Date.now();

        //console.log("$scope.route", $scope.route, _service.id)

        $scope.close = function () {
          $uibModalInstance.dismiss()
        }

        function onAddCondition() {
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/app/selectors/views/condition-modal.html',
            size: 'lg',
            controller: 'AddConditionController',
            resolve: {
              _selector: function () {
                   return $scope.selector;
                 }
               }
          });

          modalInstance.result.then(function close(data) {

          }, function dismiss(data) {
            if (data) {
              fetchRules();
            }
          });
        }

        $scope.$on("addRuleConditionClick", function (e, condition) {
          console.log("condition->", condition)
          $scope.rule.conditions[$scope.rule.conditions.length] = condition
        });

        $scope.submitRule = function () {
          if ($scope.rule.type == 0 && $scope.rule.conditions.length > 1) {
            MessageService.error("Submission failed. Single Condition but no one condition.");
            return;
          }

          if(!$scope.rule.rule_name) {
            MessageService.error("Submission failed. rule name must be valid string.");
            return;
          }

          if($scope.rule.conditions.length == 0) {
            MessageService.error("Submission failed. must be add condition.");
            return;
          }

          if(!$scope.rule.upstream_name) {
            MessageService.error("Submission failed. upstream_name can not empty.");
            return;
          }

          var value = $scope.selector.value
          var rulesJsonObject = angular.fromJson(value)
          var oriRules = rulesJsonObject.rules
          if (!oriRules) { 
            rulesJsonObject = {
              rules:[
                $scope.rule
              ]
            }
          } else {
            for (var r in oriRules) {
              if (r.rule_name == $scope.rule.rule_name) {
                MessageService.error("Submission failed. " + $scope.rule.rule_name+ " rule name alreadey exist.");
                return;
              }
            }
            rulesJsonObject.rules[oriRules.length] = $scope.rule;
          }

          $scope.selector.value = angular.toJson(rulesJsonObject)
          console.log("submitRule->", $scope.selector)

          SelectorService.update($scope.selector)
            .then(function (res) {
              $rootScope.$broadcast('rule.created')
              MessageService.success('Rule created!')
              $uibModalInstance.dismiss(res);
            }).catch(function (err) {
              $log.error("Create new rule error:", err)
              MessageService.error("Submission failed. " + _.get(err, 'data.body.message', ""));
              $scope.errors = {}
              if (err.data && err.data.body) {
                if (err.data.fields) {
                  Object.keys(err.data.body.fields).forEach(function (key) {
                    $scope.errors[key] = err.data.body.fields[key]
                  })
                } else {
                  Object.keys(err.data.body).forEach(function (key) {
                    $scope.errors[key] = err.data.body[key]
                  })
                }
              }
            })
        }


        function clearRule() {
          /*        for (var key in $scope.route) {

                   if ($scope.route[key] instanceof Array && !$scope.route[key].length) {
                     delete($scope.route[key]);
                   }

                   if ($scope.route[key] === undefined || $scope.route[key] === "") {
                     delete($scope.route[key]);
                   }
                 } */
        }


      }
    ]);
}());