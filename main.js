import MapboxSource from './src/mapbox/source';
import Drag from './src/drag';
import Turnpoints from './src/turnpoints';
import {INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM, MAPBOX_TOKEN} from './src/settings';

var view = new ol.View({
    center: ol.proj.transform(INITIAL_MAP_CENTER, 'EPSG:4326', 'EPSG:3857'),
    zoom: INITIAL_MAP_ZOOM
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

var turnpoints = new Turnpoints();

turnpoints.push(new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([7, 51], 'EPSG:4326', 'EPSG:3857'))
}));

turnpoints.push(new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([8, 51.5], 'EPSG:4326', 'EPSG:3857'))
}));

var turnpointLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: turnpoints.getArray()
    }),
    style: new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: 'http://openlayers.org/en/v3.7.0/examples/data/icon.png'
        }))
    })
});

var backgroundLayer = new ol.layer.Tile({
    source: new MapboxSource(MAPBOX_TOKEN)
});

var map = new ol.Map({
    target: 'map',
    interactions: ol.interaction.defaults().extend([new Drag()]),
    layers: [backgroundLayer, turnpointLayer],
    view: view
});

var fullScreenControl = new ol.control.FullScreen();

fullScreenControl.setMap(map);
