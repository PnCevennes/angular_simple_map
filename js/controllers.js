
var MapControllers = angular.module('MapControllers', []);

MapControllers.controller('ListMapController', [ '$scope', '$routeParams',"MapsServices", 
  function ($scope,$http,  MapsServices) {
    $scope.maps =  MapsServices.maps;
    if (! $scope.maps.length) {
      var dfd = MapsServices.loadData();
      dfd.then(function() {
        $scope.maps = MapsServices.maps;
        $scope.$apply();
      });
    }
    $scope.orderProp = 'order';
  }
]);


MapControllers.controller('DetailMapController', [ '$scope', '$routeParams','MapsServices','LeafletServices', '$location','filterFilter','$http','$sce','$rootScope',
  
  function($scope, $routeParams, MapsServices, LeafletServices, $location, filterFilter, $http, $sce, $rootScope) {
    $scope.mapinfo = MapsServices.getOne($routeParams.mapsId);
    
    if (! MapsServices.maps.length) {
      var dfd = MapsServices.loadData();
      dfd.then(function() {
        $scope.mapinfo = MapsServices.getOne($routeParams.mapsId);
        $scope.$apply();
      });
    }
    
    $scope.$watch('mapinfo', function(scope){
      if (!$scope.mapinfo) {
        return;
      }
    
      if ($scope.map) {
        map.remove();
      }
      map = L.map('mapc', { zoomControl:true });
      $scope.map = map;
      
      //Display layers
      layerscontrol = [];
      angular.forEach($scope.mapinfo.layers.overlays, function(value, key) {
        if (value.type == 'geojson') {
          $http.get(value.url).then(
            function(results) {     
              var lgeojson = new L.geoJson(results.data,eval("("+(value.options || {}) +")"));
              var feature_group = new L.featureGroup([]); 
              feature_group.addLayer(lgeojson);
              map.addLayer(feature_group);
              layerscontrol[value.name] =feature_group ;
              layersControl.addOverlay(feature_group, value.name);
            }
          );
        }
        else {
          var l = LeafletServices.loadData(value);
          map.addLayer(l.map);
          layerscontrol[l.name] = l.map;
        }
      }, $http);
      
      //Center
      if ($scope.mapinfo.center) {
        map.setView([$scope.mapinfo.center.lat, $scope.mapinfo.center.lng], $scope.mapinfo.center.zoom);
      }

      //baselayers
      $scope.baselayers = [];
      angular.forEach($scope.mapinfo.layers.baselayers, function(value, key) {
        var l = LeafletServices.loadData(value);
        $scope.baselayers[key] = l;
        if (value.active) {
          $scope.baselayers[key].map.addTo(map);
        }
      });
      
      //Geosearch
      if ($scope.mapinfo.geosearch) {
        var osmGeocoder = new L.Control.OSMGeocoder({
            collapsed: false,
            position: 'topright',
            text: 'Rechercher',
          });
        osmGeocoder.addTo(map);
      }
      
      //Control Layers
      var layersControl = L.control.layers({},layerscontrol,{collapsed:true}).addTo(map);
      
      //Legend
      if ($scope.mapinfo.legend) {
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend');
          div.innerHTML =$sce.trustAsHtml($scope.mapinfo.legend);
          return  div;
        };
        legend.addTo(map);
      }
      return $scope;
    }, true);
  

    $scope.changeTiles = function(nummap) {
      if ($scope.baselayers[nummap].active) {
        map.removeLayer($scope.baselayers[nummap].map);
        $scope.baselayers[nummap].active = false;
      }
      else {
        $scope.baselayers[nummap].map.addTo(map);
        $scope.baselayers[nummap].active = true;
      }
      angular.forEach($scope.baselayers, function(value, key) {
        if (key != nummap) {
          map.removeLayer($scope.baselayers[key].map);
          $scope.baselayers[key].active = false;
        }
      });
    };

    $scope.l_prev_sel = null;
    $scope.$on('feature:click', function(ev, item){
       if($scope.l_prev_sel != null){
            $scope.l_prev_sel.item.setStyle({color: $scope.l_prev_sel.color});
       }
       var prev_color = null;
       for(x in item._layers){
           prev_color = item._layers[x].options.color;
           break;
       }
       $scope.l_prev_sel = {item: item, color: prev_color};
       item.setStyle({color: 'yellow'});
    });
  }
  
]);


app.factory('MapsServices', ['$http', 'filterFilter', function($http, filterFilter) {
    return {
      maps:{},
    
      loadData : function() {
        self = this;
        $injector = angular.injector(['ng']);
        q = $injector.get('$q');
        var deferred = q.defer();
        $http.get('data/maps.json')
          .then(
            function(results) {
            self.maps = results.data;
            deferred.resolve();
          },
          function(errors) {
            deferred.reject(errors);
          },
          function(updates) {
            deferred.update(updates);
          });
          return deferred.promise;
      },

      getAll: function() {
        this.loadData();
        return this.maps;
      },
      getFirst: function() {
        return this.maps[0];
      },
      getOne: function(sname) {
        return  filterFilter(this.maps, {id:sname})[0];
      }
   };
}]);


app.factory('LeafletServices', ['$http', function($http) {
    return {
      layer : {}, 
      
      loadData : function(layerdata) {
        this.layer = {};
        this.layer.name = layerdata.name;
        this.layer.active = layerdata.active;
        
        if (layerdata.type == 'xyz' || layerdata.type == 'ign') {
          if ( layerdata.type == 'ign') {
            url = 'https://gpp3-wxs.ign.fr/' + layerdata.key + '/geoportail/wmts?LAYER='+layerdata.layer+'&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'; 
          }
          else {
            url = layerdata.url;
          }
          this.layer.map = new L.TileLayer(url,layerdata.options);
        }
        else if (layerdata.type == 'wms') {
          this.layer.map = L.tileLayer.wms(layerdata.url,layerdata.options);
        }
        return this.layer;
      }
   };
}]);
