export default class extends ol.source.XYZ {
    constructor(access_token, mapid='mapbox.streets', format='png') {
        super({
            url: `https://api.mapbox.com/v4/${mapid}/{z}/{x}/{y}.${format}?access_token=${access_token}`
        });
    }
}

