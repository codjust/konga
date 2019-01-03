(function () {
  'use strict';

  angular.module('frontend.selectors', [
    'angular.chips',
    'ngFileUpload'
  ]);

  // Module configuration
  angular.module('frontend.selectors')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('selectors', {
            parent: 'frontend',
            url: '/selectors',
            data: {
              activeNode: true,
              pageName: "Selectors",
              pageDescription: "Selectorsn etc.",
              //displayName : "services",
              prefix: '<i class="material-icons">cloud_queue</i>'
            },
            views: {
              'content@': {
                templateUrl: 'js/app/selectors/views/selectors.html',
                controller: 'SelectorsController',
              }
            }
          })
        //
        .state('selectors.read', {
          url: '/:selector_id/read',
          data: {
            pageName: "Show Selector",
            pageDescription: "",
            displayName: "show",
            prefix: '<i class="mdi mdi-pencil"></i>'
          },
          views: {
            'content@': {
              templateUrl: 'js/app/selectors/views/edit-selector.html',
              controller: 'SelectorController',
              resolve: {
                _selector: [
                  'SelectorService', '$stateParams',
                  function resolve(SelectorService, $stateParams) {
                    return SelectorService.findByIdOrName($stateParams.selector_id);
                  }
                ],
                _activeNode: [
                  'NodesService',
                  function resolve(NodesService) {
                    return NodesService.isActiveNodeSet();
                  }
                ],
              }

            },
            'rules@selectors.read': {
              templateUrl: 'js/app/selectors/views/selector-rules.html',
              controller: 'SelectorRulesController',
            },
            'details@selectors.read': {
              templateUrl: 'js/app/selectors/views/selector-details.html',
              controller: 'SelectorDetailsController',
            }
         /*,
            'consumers@services.read': {
              templateUrl: 'js/app/services/views/service-consumers.html',
              controller: 'ServiceConsumersController'
            } */
          }
        })
        //
      }
    ])
  ;
}());
