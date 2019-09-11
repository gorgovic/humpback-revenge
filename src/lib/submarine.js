class Submarine {
    constructor(position) {
        this.thing = new Thing(new Sprite("submarine"), position);
        this.velocity = {x: 0, y: 0};
    }

    destroy() {
        state.game.explosionEmitter.burst(this.thing.position, 100);
        state.sfx.explosion();
        state.game.score += 100;
        this.toDelete = true;
    }

    update(delta) {

    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
