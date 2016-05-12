'use strict';

angular.module('bitbloqOffline')
    .directive('toolbox', function($parse, $timeout, common) {
        return {
            restrict: 'E',
            templateUrl: 'file://' + __dirname + '/views/components/toolbox.html',
            scope: {
                tree: '=',
                type: '@',
                showComponents: '=',
                componentsArray: '=',
                showCommunications: '=',
                showRobots: '='
            },
            controllerAs: 'toolbox',
            controller: function($rootScope, $scope) {
                var self = this;
                self.activeMenu = null;
                self.menuLevel = 0;

                self.select = function(menuId, advanced) {
                    if (advanced) {
                        common.analyticsVisitor.event('Open Toolbox', menuId + ' advanced').send();
                        return (self.menuLevel = 2);
                    } else {
                        common.analyticsVisitor.event('Open Toolbox', menuId).send();
                        self.menuLevel = 1;
                    }
                    if (self.activeMenu === menuId) {
                        self.activeMenu = null;
                        self.menuLevel = 0;
                    } else {
                        self.activeMenu = menuId;
                    }
                };

                self.closeDropdown = function() {
                    $timeout(function() {
                        self.activeMenu = null;
                        self.menuLevel = 0;
                    }, 0);
                };

                $rootScope.$on('toolboxSelect', function(event, args) {
                    if ($scope.type === 'hardware') {
                        self.select(args);
                    }
                });

                $(document).on('click', function() {
                    if ($(event.target).closest('toolbox').length > 0) {
                        return false;
                    }
                    self.closeDropdown();
                });
            }
        };
    });