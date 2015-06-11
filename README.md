# angular_simple_map
Petite application permettant de créer une cartothèque de façon très simplifiée. Mis en place au Parc National des Cévennes de façon à proposer des cartes aux utilisateurs avec des connexions réseaux bas débits


Configuration de l'application
==============================

* Copier le fichier map.json.sample 


        cd data
        cp map.json.sample map.json
        
* Modifier ce fichier de façon à afficher vos cartes

Structure du fichier map.json
==============================

```json
      {
        "order" : 1, //Ordre d'affichage de la carte
        "id": "idMap", //Identifiant unique de la carte utiliser comme URL
        "geosearch": true, //Activer où non le module geosearch de leaflet
        "imageUrl": "miniature.jpg", //Image mignature de la carte
        "name": "Nom de la carte",  //Nom
        "snippet": "Description de la carte", //Description
        "center": { 
            "lat": 44.3266459,
            "lng": 3.6072651,
            "zoom": 2
        },//Paramètres d'initialisation de la vue carte
        "legend":"<div id='legend'>ma légende ici en html</div>", //Légende
        "layers": { 
          "baselayers": [],//liste des fonds de carte
          "overlays": {} //liste des couches de carte
        }
    }
```


Ajouter des fonds de cartes
===========================

* WMS
```json
         {
              "name": "temperature",
              "type": "wms",
              "url": "http://gis.srh.noaa.gov/arcgis/services/NDFDTemps/MapServer/WMSServer?",
              "active": true,
              "options": {"format": "image/png","transparent": true,"layers": 16 }
            }
```

Pour voir l'ensemble des options disponibles se référer à la documentation de leaflet
http://leafletjs.com/reference.html#tilelayer-wms-options

* IGN
```json
         {
              "name": "scan express",
              "type": "ign",
              "key" : "myAPIKey",
              "layer" : "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD", 
              "active" : true,
              "options": {"maxZoom": 19, "attribution": "IGN"}
            },
 ```
Pour voir l'ensemble des options disponibles se référer à la documentation de leaflet http://leafletjs.com/reference.html#tilelayer-options 

* XYZ
```json
        {
              "name": "opencyclemap",
              "type": "xyz",
              "url" : "http://tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", 
              "active" : false,
              "options": {"maxZoom": 12, "minZoom":2, "attribution": "Map data © <a href='http://opencyclemap.org'>opencyclemap</a> contributors"}
            }
```
Pour voir l'ensemble des options disponibles se référer à la documentation de leaflet http://leafletjs.com/reference.html#tilelayer-options
  
* JSON
```json
        {
              "name": "pays",
              "url": "http://openlayers.org/en/v3.2.1/examples/data/geojson/countries.geojson",
              "type": "geojson",
              "active": "true",
              "options":"{}"
            }
```

Interactions json
=================
Le paramètre option des couches correspond à une chaine de caratère qui est évaluée et transformé en javascript. De cette façon il est possible de réaliser toutes les interractions définies par l'API Leaflet.

http://leafletjs.com/reference.html#geojson

* Changer le style de la couche en fonction d'une propriété

```json
    "options":"{style: function (feature) { return { color: feature.properties.macouleur, opacity: 1, fillOpacity: 0.2}; }}"
```

* Ajouter une popup lors de la selection d'une feature sur la carte

```json
    "options":"{onEachFeature: function (feature, layer) { if (feature.properties && feature.properties.name, {noHide:false}) { layer.bindPopup(feature.properties.name); } } }"
```


* Changer la couleur de l'élément lors de la selection. La syntaxe n'est pas identique à celle définit par leaflet et est surchargé par angular au travers d'un événement broadcast.


```json
    "options":"{onEachFeature: function (feature, layer) {layer.on('click', function(e){$rootScope.$apply($rootScope.$broadcast(\"feature:click\", layer));});} }"
```
