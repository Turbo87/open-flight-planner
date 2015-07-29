export const INITIAL_MAP_CENTER = [7, 51];
export const INITIAL_MAP_ZOOM = 5;
export const MAPBOX_TOKEN = 'pk.eyJ1IjoidGJpZW5pZWsiLCJhIjoiMGFmZGM3MTE1Nzc0ZGQ2NDkwZDc2MDQ2NDdiZGViMDYifQ.yxuaR8XhvnRpesaB_BXGyQ';

export const TASK_STYLE = [
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#F012BE',
            width: 7
        })
    }),
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 3
        })
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#F012BE'
            })
        }),
        geometry: taskToMultiPoint
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: 'white'
            })
        }),
        geometry: taskToMultiPoint
    })
];

function taskToMultiPoint(feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    return new ol.geom.MultiPoint(coordinates);
}
