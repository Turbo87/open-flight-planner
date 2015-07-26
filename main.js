import MapboxSource from './src/mapbox/source';

var MAPBOX_TOKEN = 'pk.eyJ1IjoidGJpZW5pZWsiLCJhIjoiMGFmZGM3MTE1Nzc0ZGQ2NDkwZDc2MDQ2NDdiZGViMDYifQ.yxuaR8XhvnRpesaB_BXGyQ';


class Drag extends ol.interaction.Pointer {
    constructor() {
        super({
            handleDownEvent: Drag.prototype.handleDownEvent,
            handleDragEvent: Drag.prototype.handleDragEvent,
            handleMoveEvent: Drag.prototype.handleMoveEvent,
            handleUpEvent: Drag.prototype.handleUpEvent
        });

        /**
         * @type {ol.Pixel}
         * @private
         */
        this.coordinate_ = null;

        /**
         * @type {string|undefined}
         * @private
         */
        this.cursor_ = 'pointer';

        /**
         * @type {ol.Feature}
         * @private
         */
        this.feature_ = null;

        /**
         * @type {string|undefined}
         * @private
         */
        this.previousCursor_ = undefined;
    }

    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     * @return {boolean} `true` to start the drag sequence.
     */
    handleDownEvent(evt) {
        var map = evt.map;

        var feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature);

        if (feature) {
            this.coordinate_ = evt.coordinate;
            this.feature_ = feature;
        }

        return !!feature;
    }

    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     */
    handleDragEvent(evt) {
        var deltaX = evt.coordinate[0] - this.coordinate_[0];
        var deltaY = evt.coordinate[1] - this.coordinate_[1];

        var geometry = /** @type {ol.geom.SimpleGeometry} */
            (this.feature_.getGeometry());
        geometry.translate(deltaX, deltaY);

        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];
    }

    /**
     * @param {ol.MapBrowserEvent} evt Event.
     */
    handleMoveEvent(evt) {
        if (this.cursor_) {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature);
            var element = evt.map.getTargetElement();
            if (feature) {
                if (element.style.cursor != this.cursor_) {
                    this.previousCursor_ = element.style.cursor;
                    element.style.cursor = this.cursor_;
                }
            } else if (this.previousCursor_ !== undefined) {
                element.style.cursor = this.previousCursor_;
                this.previousCursor_ = undefined;
            }
        }
    }

    /**
     * @return {boolean} `false` to stop the drag sequence.
     */
    handleUpEvent() {
        this.coordinate_ = null;
        this.feature_ = null;
        return false;
    }
};


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
