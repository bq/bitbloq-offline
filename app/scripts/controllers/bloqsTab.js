'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsTabCtrl
 * @description
 * # BloqsTabCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('BloqsTabCtrl', function($scope, common) {
    console.log('bloqstab ctrl');

    var fs = require('fs'),
      bloqsSchemas = null,
      $field;
    //load Bloqs
    console.log(common.appPath);
    console.log(common.webPath);
    fs.readFile(common.appPath + '/bower_components/bloqs/dist/bloqsmap.json', function(err, data) {
      if (err) {
        throw err;
      } else {
        bloqsSchemas = JSON.parse(data.toString());
        console.log($scope.arduinoMainBloqs);
        $field = $('#bloqs--field');
        // Create the main arduino bloqs
        //firsttime set componentsArray and field
        $scope.arduinoMainBloqs.varsBloq = new bloqs.Bloq({
          bloqData: bloqsSchemas['varsBloq'],
          componentsArray: $scope.componentsArray,
          $field: $field
        });
        $field.append($scope.arduinoMainBloqs.varsBloq.$bloq);
        $scope.arduinoMainBloqs.varsBloq.enable(true);
        $scope.arduinoMainBloqs.varsBloq.doConnectable();

        $scope.arduinoMainBloqs.setupBloq = new bloqs.Bloq({
          bloqData: bloqsSchemas['setupBloq'],
          componentsArray: $scope.componentsArray,
          $field: $field
        });
        $field.append($scope.arduinoMainBloqs.setupBloq.$bloq);
        $scope.arduinoMainBloqs.setupBloq.enable(true);
        $scope.arduinoMainBloqs.setupBloq.doConnectable();


        $scope.arduinoMainBloqs.loopBloq = new bloqs.Bloq({
          bloqData: bloqsSchemas['loopBloq'],
          componentsArray: $scope.componentsArray,
          $field: $field
        });
        $field.append($scope.arduinoMainBloqs.loopBloq.$bloq);
        $scope.arduinoMainBloqs.loopBloq.enable(true);
        $scope.arduinoMainBloqs.loopBloq.doConnectable();

        $('#getcodebutton').click(function() {
          $('#code--field').html(window.bloqsUtils.getCode(componentsArray, $scope.arduinoMainBloqs));
        });

        //start build bloqs!

        //Create a if bloq from the bloqsSchemas loaded
        var bloq1 = new bloqs.Bloq({
          bloqData: bloqsSchemas['if'],
          componentsArray: $scope.componentsArray,
          $field: $field
        });
        //append it to the field
        $field.append(bloq1.$bloq);
        //enable if you want
        bloq1.enable(true);
        //do connectable to allow anothers bloqs to connect to them
        bloq1.doConnectable();


        var bloq2 = new bloqs.Bloq({
          bloqData: bloqsSchemas['for-v1'],
          componentsArray: $scope.componentsArray,
          $field: $field
        });
        $field.append(bloq2.$bloq);
        bloq2.enable(true);
        bloq2.doConnectable();

        var bloq3 = new bloqs.Bloq({
          bloqData: bloqsSchemas['number'],
          componentsArray: $scope.componentsArray,
          $field: $field
        });
        $field.append(bloq3.$bloq);
        bloq3.enable(true);
        bloq3.doConnectable();
      }
    });

  });