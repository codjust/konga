(function () {
  'use strict';

  angular.module('frontend.selectors')
    .controller('SelectorsController', [
      '$scope', '$rootScope', '$log', '$state', 'SelectorService', 'ListConfig', 'SelectorModel',
      'UserService', '$uibModal', 'DialogService',
      function controller($scope, $rootScope, $log, $state, SelectorService, ListConfig, SelectorModel,
                          UserService, $uibModal, DialogService) {

        SelectorModel.setScope($scope, false, 'items', 'itemCount');
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig('selector', SelectorModel)));
        $scope.user = UserService.user()
        $scope.openAddSelectorModal = openAddSelectorModal
        /**
         * -----------------------------------------------------------------------------------------------------------
         * Internal Functions
         * -----------------------------------------------------------------------------------------------------------
         */

    /*     function updateService(id, data) {

          $scope.loading = true

          ServiceModel.update(id, data)
            .then(function (res) {
              $log.debug("Update Service: ", res)
              $scope.loading = false
              _fetchData()
            }).catch(function (err) {
            $log.error("Update Service: ", err)
            $scope.loading = false;
          });

        } */


        function openAddSelectorModal() {
          $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/app/selectors/views/add-selector-modal.html',
            controller: 'AddSelectorModalController',
            controllerAs: '$ctrl',
            size: 'lg'
          });
        }


        function _fetchData() {
          $scope.loading = true;
          SelectorModel.load({
            size: $scope.itemsFetchSize
          }).then(function (response) {
            $scope.items = response;
            console.log("Selectors =>", $scope.items);
            $scope.loading = false;
          })

        }


        function onFilteredItemsChanged(services) {


        }


        /**
         * -----------------------------------------------------------------------------------------------------------
         * Watchers and Listeners
         * -----------------------------------------------------------------------------------------------------------
         */



        $scope.$on('selector.created', function () {
          _fetchData()
        })


        $scope.$on('user.node.updated', function (node) {
          _fetchData()
        })


        // Assign Service health checks to filtered items only
        // so that the DOM is not overencumbered
        // when dealing with large datasets
/* 
        $scope.$watch('v     ', function (newValue, oldValue) {

          if (newValue && (JSON.stringify(newValue) !== JSON.stringify(oldValue))) {
            onFilteredItemsChanged(newValue)
          }
        }) */


        // Init

        _fetchData();

      }
    ])
  ;
}());
