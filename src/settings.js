export const INITIAL_MAP_CENTER = [7, 51];
export const INITIAL_MAP_ZOOM = 5;
export const MAPBOX_TOKEN = 'pk.eyJ1IjoidGJpZW5pZWsiLCJhIjoiMGFmZGM3MTE1Nzc0ZGQ2NDkwZDc2MDQ2NDdiZGViMDYifQ.yxuaR8XhvnRpesaB_BXGyQ';

export const LEG_STYLE = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'blue',
        width: 3
    }),
    fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
    })
});

export const TURNPOINT_STYLE_IMAGE = new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({
        color: 'orange'
    })
});

