import localforage from 'localforage';

import MapboxSource from './src/mapbox/source';
import SkylinesAirspaceSource from './src/skylines/source';
import throttle from './src/throttle';

import {
    INITIAL_MAP_CENTER,
    INITIAL_MAP_ZOOM,
    MAPBOX_TOKEN,
    TASK_STYLE
} from './src/settings';

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

var task = new ol.Feature({
    geometry: new ol.geom.LineString([
        ol.proj.transform([7, 51], 'EPSG:4326', 'EPSG:3857'),
        ol.proj.transform([8, 51.5], 'EPSG:4326', 'EPSG:3857')
    ])
});

var taskLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [task]
    }),

    style: TASK_STYLE
});

var airspaceLayer = new ol.layer.Tile({
    source: new SkylinesAirspaceSource()
});

var backgroundLayer = new ol.layer.Tile({
    source: new MapboxSource(MAPBOX_TOKEN)
});

class TrackingModify extends ol.interaction.Modify {
    constructor(options) {
        super(options);

        this.modifying = false;

        this.on('modifystart', () => {
            console.log('Modification started');
            this.modifying = true
        });
        this.on('modifyend', () => {
            console.log('Modification ended');
            this.modifying = false
        });
    }
}

var modify = new TrackingModify({
    features: new ol.Collection([task]),
    pixelTolerance: 30,
    deleteCondition: evt => evt.type === 'dblclick'
});

var snap = new ol.interaction.Snap({
    features: new ol.Collection([task])
});

var map = new ol.Map({
    interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
    }).extend([modify, snap]),
    keyboardEventTarget: document,
    layers: [backgroundLayer, airspaceLayer, taskLayer],
    logo: false,
    target: 'map',
    view: view
});

map.on('moveend', (evt) => saveView(evt.map.getView()));

map.on('pointermove', () => {
    if (modify.modifying)
        throttle(() => printDistance(task), 30)();
});

modify.on('modifyend', () => setTimeout(() => printDistance(task), 0));

var wgs84Sphere = new ol.Sphere(6378137);

function calcDistance(task) {
    var distance = 0;

    task.getGeometry().forEachSegment((c1, c2) => {
        distance += wgs84Sphere.haversineDistance(
            ol.proj.transform(c1, 'EPSG:3857', 'EPSG:4326'),
            ol.proj.transform(c2, 'EPSG:3857', 'EPSG:4326')
        )
    });
    return distance;
}

const distanceDiv = document.getElementById('distance');

function printDistance(task) {
    distanceDiv.innerHTML = (calcDistance(task) / 1000).toFixed(1);
}

function saveView(view) {
    console.log('Saving view parameters to localforage ...');

    localforage.setItem('view', {
        center: view.getCenter(),
        zoom: view.getZoom()
    });
}

var fullScreenControl = new ol.control.FullScreen();

fullScreenControl.setMap(map);

printDistance(task);
