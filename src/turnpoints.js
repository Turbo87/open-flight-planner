export default class Turnpoints {
    constructor() {
        this._features = [];
    }

    get features() {
        return this._features;
    }

    add(feature) {
        this._features.push(feature);
    }
}

