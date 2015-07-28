export default class extends ol.source.XYZ {
    constructor() {
        super({
            url: 'https://www.skylines.aero/mapproxy/tiles/1.0.0/airspace/{z}/{x}/{y}.png'
        });
    }
}

