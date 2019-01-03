/**
 * This file contains all necessary Angular controller definitions for 'frontend.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';
  
    angular.module('frontend.selectors')
      .service('SelectorService', [
        '$log', '$state', '$http', 'Semver',
        function ($log, $state, $http, Semver) {
  
  
          /**
           *
           * IMPORTANT!!
           * Each key must have a respective .html file in /services/partials
           * 013 is version
           */
          var properties = {
            '013': {
              selector_name: '',
              service_id_or_name: '',
              value: "{}",
            }
          }
  
          return {
  
            getProperties: function (version) {
  
              var fver = version.split('.').slice(0, -1).join('');
              var props = properties[fver] || properties[Object.keys(properties)[Object.keys(properties).length - 1]];
  
              // Kong 0.11.x fix
              if (Semver.cmp(version, "0.11.0") >= 0 && props.http_if_terminated !== undefined) {
                props.http_if_terminated = false;
              }
  
              return props;
            }, 
  
            getLastAvailableFormattedVersion: function (version) {
  
              var fver = version.split('.').slice(0, -1).join('');
  
              var existing = Object.keys(properties).indexOf(fver) >= 0 ? fver : Object.keys(properties)[Object.keys(properties).length - 1];
  
              return existing;
            },
  
            all: function () {
              return $http.get('kong/route-by-selector')
            },
  
            findByIdOrName: function (selectorId_or_name) {
              return $http.get('kong/route-by-selector/' + selectorId_or_name)
            },
  
            update: function (selector) {
              return $http.patch('kong/route-by-selector/' + selector.id, selector)
            },
  
            delete: function (selector) {
              return $http.delete('kong/route-by-selector/' + selector.selector_name)
            },
  
            add: function (selector) {
              return $http.post('kong/route-by-selector/', selector)
            }
          }
        }
      ])
    ;
  }());
  