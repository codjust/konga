/**
 * This file contains all necessary Angular controller definitions for 'frontend.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('SelectorController', [
      '$scope', '$rootScope', '$state', 'SettingsService', '$log', 'AuthService', '_selector',
      function controller($scope, $rootScope, $state, SettingsService, $log,AuthService, _selector) {

        $scope.selector = _selector.data

        // Fix empty object properties
        //fixProperties()

        $state.current.data.pageName = "Selector " + ($scope.selector.selector_name || $scope.selector.id)
        $scope.activeSection = 0;
        $scope.sections = [
          {
            name: 'Selector Details',
            icon: 'mdi mdi-information-outline',
            isVisible: true
          },
          {
            name: 'Rules',
            icon: 'mdi mdi-directions-fork',
            isVisible: true
          },
          // {
          //     name : 'Health Checks',
          //     icon : 'mdi mdi-heart-pulse',
          //     isVisible : true
          // }
        ]


        $scope.showSection = function (index) {
          $scope.activeSection = index
        }

        function fixProperties() {
          var problematicProperties = ['uris', 'hosts', 'methods']
          problematicProperties.forEach(function (property) {
            if ($scope.service[property] && isObject($scope.service[property]) && !Object.keys($scope.service[property]).length) {
              $scope.service[property] = ""
            }
          })
        }

        function isObject(obj) {
          return obj === Object(obj);
        }


        $scope.$on('user.node.updated', function (node) {
          $state.go('selectors')
        })

      }
    ])
  ;
}());
