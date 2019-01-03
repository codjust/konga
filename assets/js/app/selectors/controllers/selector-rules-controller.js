/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('SelectorRulesController', [
      '_', '$scope', '$stateParams', '$log', '$state', 'SelectorService',
      '$uibModal', 'DialogService', 'InfoService' ,'AuthService', 'MessageService',
      function controller(_, $scope, $stateParams, $log, $state, SelectorService,
                          $uibModal, DialogService, InfoService, AuthService, MessageService) {



        $scope.selector_id = $stateParams.selector_id;
        $scope.rules = []


        $log.debug("SelectorRulesController selector_id: ", $scope.selector_id);
        console.log("SelectorRulesController selector_id:", $scope.selector_id)
        $scope.onAddRule = onAddRule;
        $scope.deleteRule = deleteRule;
  /*      $scope.onEditRoute = onEditRoute;
        $scope.deleteRoute = deleteRoute;
        $scope.updateRoute = updateRoute;
        $scope.toggleAttribute = toggleAttribute;
         */
        $scope.canCreate = AuthService.hasPermission('services','create');
        $scope.canEdit = AuthService.hasPermission('services','edit');
        $scope.canDelete = AuthService.hasPermission('services','delete');
        $scope.search = '' 

        //$log.debug("Routes",$scope.routes.data);

        /**
         * ----------------------------------------------------------------------
         * Functions
         * ----------------------------------------------------------------------
         */


        function toggleAttribute(route,attr, enabled) {
          var obj = {};
          obj[attr] = !enabled;
          updateRoute(route,obj);
        }

        function onAddRule() {
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/app/selectors/views/rules-modal.html',
            size: 'lg',
            controller: 'AddRuleModalController',
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

 /*        function updateRoute(route,data) {

          RoutesService.update(route.id, data)
            .then(function (res) {
              $log.debug("updateRoute", res)
              $scope.routes.data[$scope.routes.data.indexOf(route)] = res.data;

            }).catch(function (err) {
            $log.error("updateRoute", err)
          })
        } */


      /*   function deleteRoute(route) {
          DialogService.prompt(
            "Delete Route", "Really want to delete the route?",
            ['No don\'t', 'Yes! delete it'],
            function accept() {
              RoutesService.delete(route)
                .then(function (resp) {
                  $scope.routes.data.splice($scope.routes.data.indexOf(route), 1);
                }).catch(function (err) {
                $log.error(err)
              })
            }, function decline() {
            })
        }

        function onEditRoute(item) {
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/app/routes/views/route-modal.html',
            size: 'lg',
            controller: 'RouteDetailsController',
            resolve: {
              _route: function () {
                return _.cloneDeep(item)
              }
            }
          });

          modalInstance.result.then(function (data) {

          }, function (data) {
            if(data) {
              fetchRules();
            }
          });
        } */

        function fetchRules() {
          SelectorService.findByIdOrName($scope.selector_id).then(function (res) {
            $scope.selector = res.data;
            var value = $scope.selector.value
            console.log("rules:", value)
            console.log("selector:", $scope.selector)
            var rulesJsonObject = angular.fromJson(value)
            $scope.rules = rulesJsonObject.rules
          });
        }

        function deleteRule(item) {
          DialogService.prompt(
            "Delete Rule", "Really want to delete the rule?",
            ['No don\'t', 'Yes! delete it'],
            function accept() {
              var currentSelector =  $scope.selector 
              var value = currentSelector.value
              var rulesJsonObject = angular.fromJson(value)
              var currentRules = rulesJsonObject.rules
              console.log("delete rule item start:", item)
              var newRules = new Array()
              var index = 0;
              for(var r in currentRules) {
                console.log("r rule:", r)
                if(currentRules[r].rule_name == item.rule_name && currentRules[r].type == item.type 
                  && currentRules[r].upstream_name == item.upstream_name){
                    console.log("delete rule item:", item)
                    //delete currentRules[r]
                    continue;
                  }
                  newRules[index] = currentRules[r];
                  index++;
              }

              console.log("currentRules:", currentRules)
              if(!currentRules && currentRules !== 0 && currentRules !== '') {
                rulesJsonObject.rules = [];
              }else {
                rulesJsonObject.rules = newRules;
              }
              console.log("rulesJsonObject:", rulesJsonObject)
              var newValue = angular.toJson(rulesJsonObject)
              $scope.selector.value = newValue 

              SelectorService.update($scope.selector).then(function(res) {
                console.log("delete rule:", res)
                fetchRules();
              })

   /*            RoutesService.delete(route)
                .then(function (resp) {
                  $scope.routes.data.splice($scope.routes.data.indexOf(route), 1);
                }).catch(function (err) {
                $log.error(err)
              }) */
            }, function decline() {
            })
        }

        fetchRules();

        /**
         * ------------------------------------------------------------
         * Listeners
         * ------------------------------------------------------------
         */
        $scope.$on("rules.added", function () {
          fetchRules()
        })

        $scope.$on("rules.created", function () {
          fetchRules()
        })

        $scope.$on("rules.updated", function (ev, route) {
          fetchRules()
        })


      }
    ])
  ;
}());
