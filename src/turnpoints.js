export default class Turnpoints extends ol.Collection {
    constructor(...args) {
        super(...args);
        this.on('add', evt => {
            evt.element.getGeometry().on('change', () => this.changed());
            this.changed();
        });
        this.on('remove', evt => {
            evt.element.getGeometry().un('change', () => this.changed());
            this.changed();
        });
    }
}
