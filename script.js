const dbg = (obj) => {
    if (obj) console.log(obj);
    return location.hash === "#debug";
};

const options = {
    volume: 0.2,
    maxScale: 6,
    worldSize: {x: 200, y: 100},
    colors: [
        "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179",
        "#29366f", "#3b5dc9", "#41a6f6", "#73eff7", "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
    ]
};

const state = {
    canvas: null,
    ctx: null,
    canvasScale: null,
    lastUpdate: null,
    target: null,
    sfx: null
};

window.addEventListener("load", () => {
    state.canvas = document.getElementById("canvas");
    state.ctx = state.canvas.getContext("2d");
    state.sfx = new Sfx();
    state.sfx.init();
    //TODO: state.sfx.startMusic();
    state.ocean = new Ocean(options.worldSize, 80);
    window.addEventListener("resize", () => resize());
    state.canvas.addEventListener("mousemove", (e) => {
        state.target = Vec.scale({x: e.layerX, y: e.layerY}, 1 / state.canvasScale);
    });

    resize();
    update();
});

const resize = () => {
    state.canvasScale = Math.min(window.innerWidth / options.worldSize.x, window.innerHeight / options.worldSize.y);
    state.canvasScale = Math.min(state.canvasScale, options.maxScale);
    const canvasSize = Vec.scale(options.worldSize, state.canvasScale);
    state.canvas.width = canvasSize.x;
    state.canvas.height = canvasSize.y;
    state.canvas.style.left = `${(window.innerWidth - canvasSize.x) / 2}px`;
    state.canvas.style.top = `${(window.innerHeight - canvasSize.y) / 2}px`;
    state.ctx.imageSmoothingEnabled = false;
};

const whale = new Thing(new Sprite("whale"), {x: 20, y: 60});

const boats = [
    new Thing(new Sprite("small-boat"), {x: 40, y: 15}),
    new Thing(new Sprite("small-boat"), {x: 100, y: 15}),
];

const environment = [
    new Thing(new Sprite("stone"), {x: 68, y: 93}, {x: 0, y: 1}),
    new Thing(new Sprite("stone"), {x: 60, y: 95}),
    new Thing(new Sprite("seaweed", 4, 600, 0), {x: 140, y: 86}),
    new Thing(new Sprite("seaweed", 4, 600, 2), {x: 160, y: 84}),
    new Thing(new Sprite("seaweed", 4, 600, 1), {x: 180, y: 82})
];

const text = new Text("Hello, World!", {x: 1, y: 1});

const update = () => {
    const time = Date.now();
    const delta = state.lastUpdate ? time - state.lastUpdate : 0;
    state.lastUpdate = time;
    updateWhale(delta);
    state.ocean.update();

    state.ctx.fillStyle = options.colors[4];
    state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    [
        state.ocean.background,
        ...boats,
        whale,
        ...environment,
        state.ocean.foreground,
        text
    ].forEach((thing) => {
        state.ctx.save();
        state.ctx.scale(state.canvasScale, state.canvasScale);
        thing.draw(state.ctx, time);
        state.ctx.restore();
    });

    requestAnimationFrame(update);
};

const updateWhale = (delta) => {
    if (!state.target) state.target = whale.position;
    whale.forward = Vec.normalize(Vec.subtract(state.target, whale.position));
    if (Vec.distance2(state.target, whale.position) > 10)
        whale.position = Vec.add(whale.position, Vec.scale(whale.forward, delta * 0.02));
};
