import localforage from 'localforage';

import MapboxSource from './src/mapbox/source';
import Turnpoints from './src/turnpoints';
import {INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM, MAPBOX_TOKEN} from './src/settings';

console.log('Starting application ...');

var view = new ol.View();

var geolocation = new ol.Geolocation({
    projection: view.getProjection()
});

localforage.getItem('view', (err, value) => {
    if (err || !value) {
        console.log('Enabling GeoLocation tracking ...');
        geolocation.setTracking(true);

        console.log('Setting view parameters to defaults ...');

        console.debug('center:', INITIAL_MAP_CENTER);
        view.setCenter(ol.proj.transform(INITIAL_MAP_CENTER, 'EPSG:4326', 'EPSG:3857'));

        console.debug('zoom:', INITIAL_MAP_ZOOM);
        view.setZoom(INITIAL_MAP_ZOOM);

    } else {
        console.log('Setting view parameters from previous session ...');

        console.debug('center:', ol.proj.transform(value.center, 'EPSG:3857', 'EPSG:4326'));
        view.setCenter(value.center);

        console.debug('zoom:', value.zoom);
        view.setZoom(value.zoom);
    }
});

geolocation.on('change', () => {
    map.beforeRender(ol.animation.pan({
        source: view.getCenter(),
        duration: 250
    }), ol.animation.zoom({
        resolution: view.getResolution(),
        duration: 250
    }));

    console.log('Setting view parameters from GeoLocation ...');

    console.debug('center:', ol.proj.transform(geolocation.getPosition(), 'EPSG:3857', 'EPSG:4326'));
    view.setCenter(geolocation.getPosition());
    view.setZoom(7);

    console.log('Disabling GeoLocation tracking ...');
    geolocation.setTracking(false);
});

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
    })
});

var backgroundLayer = new ol.layer.Tile({
    source: new MapboxSource(MAPBOX_TOKEN)
});

var map = new ol.Map({
    interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
    }),
    keyboardEventTarget: document,
    layers: [backgroundLayer, turnpointLayer],
    logo: false,
    target: 'map',
    view: view
});

map.on('moveend', () => {
    console.log('Saving view parameters to localforage ...');

    localforage.setItem('view', {
        center: view.getCenter(),
        zoom: view.getZoom()
    });
});

var modify = new ol.interaction.Modify({
    features: turnpoints,
    pixelTolerance: 30
});

map.addInteraction(modify);

modify.setActive(true);

var fullScreenControl = new ol.control.FullScreen();

fullScreenControl.setMap(map);
