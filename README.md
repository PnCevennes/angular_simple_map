# angular_simple_map
Petite application permettant de créer une catothèque de façon très simplifiée. Mis en place au Parc Natial des Cévennes de façon à proposer des cartes aux utilisateurs avec des connexions réseaux bas débits


Configuration de l'application
==============================

* Copier le fichier map.json.sample 

    ::
    
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
        "legend":"<div id='legend'>ma légende ici en html</div>", //Légened
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
