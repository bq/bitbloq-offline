(function() {
  'use strict';

  // Create the module and define its dependencies.
  var app = angular.module('bitbloqOffline');

  app.directive('draggable', draggable);
  app.directive('droppable', droppable);

  function draggable() {
    return function(scope, element, attrs) {
      // this gives us the native JS object

      var el = element[0];

      el.draggable = true;

      el.addEventListener('dragstart', function(e) {

        e.dataTransfer.effectAllowed = 'move';

        e.dataTransfer.setData('mouseOffsetX', e.offsetX);
        e.dataTransfer.setData('mouseOffsetY', e.offsetY);

        e.dataTransfer.setData('dragtype:' + attrs.dragtype, '');
        e.dataTransfer.setData('dragtype', attrs.dragtype);
        e.dataTransfer.setData('dragcategory', attrs.dragcategory);
        e.dataTransfer.setData('dragid', attrs.dragid);

        this.classList.add('dragging');

        return false;

      }, false);

      el.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        return false;
      }, false);

    };
  }

  function droppable() {
    return {
      scope: {
        drop: '=', // parent
        dropOffsetTop: '='
      },
      link: function(scope, element, attrs) {

        var el = element[0];

        /* http://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element */
        var dragEnterLeaveCounter = 0;

        el.addEventListener('dragover', function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) {
            e.preventDefault();
          }

        }, false);

        el.addEventListener('dragenter', function(e) {
          dragEnterLeaveCounter++;
          var isBoard = e.dataTransfer.types.indexOf('dragtype:board'); //We can access to dataTransfer content
          var isComponent = e.dataTransfer.types.indexOf('dragtype:component');
          var type = null;
          if (isBoard !== -1) {
            type = 'board';
          } else if (isComponent !== -1) {
            type = 'component';
          }
          this.classList.add('dragging-over');
          this.classList.add('dragging-' + type);
        }, false);

        el.addEventListener('dragleave', function() {
          dragEnterLeaveCounter--;
          if (dragEnterLeaveCounter === 0) {
            this.classList.remove('dragging-over');
            this.classList.remove('dragging-board');
            this.classList.remove('dragging-component');
          }
        }, false);

        el.addEventListener('drop', function(e) {

          // Stops some browsers from redirecting.
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          if (e.stopPropogation) {
            e.stopPropogation(); // Necessary. Allows us to drop.
          }

          dragEnterLeaveCounter = 0;

          var coordinates = {
            x: e.clientX - attrs.dropOffsetLeft - e.dataTransfer.getData('mouseOffsetX'),
            y: e.clientY - getFieldOffsetTop(scope.dropOffsetTop) - e.dataTransfer.getData('mouseOffsetY')
          };
          var droppingEvent = {
            type: e.dataTransfer.getData('dragtype'),
            id: e.dataTransfer.getData('dragid'),
            coordinates: coordinates,
            category: e.dataTransfer.getData('dragcategory')
          };

          this.classList.remove('dragging-over');
          this.classList.remove('dragging-' + droppingEvent.type);

          scope.$apply(function(self) {
            self.drop(droppingEvent);
          });

        }, false);
      }
    };
  }

  var getFieldOffsetTop = function(source) {
    var fieldOffsetTop = 0;
    var tempElement;
    for (var i = 0; i < source.length; i++) {
      tempElement = document.getElementsByClassName(source[i]);
      if (tempElement[0]) {
        fieldOffsetTop += tempElement[0].clientHeight;
      }
    }
    return fieldOffsetTop;
  };

})();