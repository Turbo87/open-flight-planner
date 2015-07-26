import MapboxSource from './src/mapbox/source';
import Drag from './src/drag'

var MAPBOX_TOKEN = 'pk.eyJ1IjoidGJpZW5pZWsiLCJhIjoiMGFmZGM3MTE1Nzc0ZGQ2NDkwZDc2MDQ2NDdiZGViMDYifQ.yxuaR8XhvnRpesaB_BXGyQ';

var view = new ol.View({
    center: ol.proj.transform([7, 51], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5
});

var geolocation = new ol.Geolocation({
    projection: view.getProjection()
});

geolocation.on('change', () => {
    map.beforeRender(ol.animation.pan({
        source: view.getCenter(),
        duration: 250
    }), ol.animation.zoom({
        resolution: view.getResolution(),
        duration: 250
    }));


    // set map center to geolocation
    view.setCenter(geolocation.getPosition());
    view.setZoom(7);

    // disable tracking again
    geolocation.setTracking(false);
});

// enable tracking
geolocation.setTracking(true);

var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([7, 51], 'EPSG:4326', 'EPSG:3857')),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: 'http://openlayers.org/en/v3.7.0/examples/data/icon.png'
    }))
});

iconFeature.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
    features: [iconFeature]
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

var backgroundLayer = new ol.layer.Tile({
    source: new MapboxSource(MAPBOX_TOKEN)
});

var map = new ol.Map({
    target: 'map',
    interactions: ol.interaction.defaults().extend([new Drag()]),
    layers: [backgroundLayer, vectorLayer],
    view: view
});

var fullScreenControl = new ol.control.FullScreen();

fullScreenControl.setMap(map);
