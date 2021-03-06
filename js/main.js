if (!Detector.webgl) Detector.addGetWebGLMessage();

var loaded = false;
var loadingMesh = false;
var loadingData = false;

var container, stats;

var camera, scene, renderer, objects;
var particleLight;
var dae;

var line, largeMesh;
var gui;


var loading = document.getElementById('loading');
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var info = document.getElementById('info');

loading.style.display = 'none';
info.style.display = '';
instructions.style.display = 'none';

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var velocity = new THREE.Vector3();

var clock = new THREE.Clock();

var socket = io('http://happi.pw:3000', {path: '/socket.io/'});
var otherViewer;


$("#ok").click(function() {
    info.style.display = 'none';
    instructions.style.display = 'none';
    loading.style.display = '';
    init();
    animate();
});

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 0, 0);

    scene = new THREE.Scene();
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    addListeners();
    addGrid();
    addLightsFog();
    addRendererAndStats();

    addSkybox();
    loadDataset(guiManager.dataset);

    setTimeout(checkLoadStatus, 100);
    initSocket();
}

function loadDataset(dataset) {
    removeMesh();
    removeData();

    $.getJSON(dataset+'config.json', function(info) {
        console.log("loaddataset");
        console.log(info);

        addData(dataset+info['datasetURL']);
        debug("started dataset load: " + dataset);

        addMesh(dataset, info);
    });
    
}

function addLightsFog() {
    // Lights
    scene.add(new THREE.AmbientLight(0xffffff));

    // Fog
    //scene.fog = new THREE.Fog( 0x7ec0ee, 75, 200 );
}

function addRendererAndStats() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
}


function checkLoadStatus() {
    if (loadingMesh || loadingData) {
        setTimeout(checkLoadStatus, 100);
    }
    else {
        // avoid problems due to not having datasets loaded when initalizing GUI
        initGUI();
        loaded = true;
        doneLoading();
    }
}

function initSocket() {
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    otherViewer = new THREE.Mesh( geometry, material );
    //scene.add( otherViewer );


    socket.on('position', function(pos){
        otherViewer.position.x = pos.x;
        otherViewer.position.y = pos.y;
        otherViewer.position.z = pos.z;
    });

    setInterval(function(){
        guiManager.position = controls.getObject().position;
        socket.emit('position', guiManager);
    }, 1000/30);

}

function doneLoading() {
    debug("done loading");
    info.style.display = 'none';
    instructions.style.display = '';
    loading.style.display = 'none';
}

function debug(d) {
    console.log("debug:", d);
    socket.emit('debug', JSON.stringify(d));
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}



function render() {

    var timer = Date.now() * 0.0005;

    if (controlsEnabled) {
        var delta = clock.getDelta();

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;

        var speed = guiManager.speed;
        if (moveForward) velocity.z -= speed * delta;
        if (moveBackward) velocity.z += speed * delta;

        if (moveLeft) velocity.x -= speed * delta;
        if (moveRight) velocity.x += speed * delta;

        if (moveUp) velocity.y += speed * delta;
        if (moveDown) velocity.y -= speed * delta;

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);


    }


    THREE.AnimationHandler.update(clock.getDelta());

    renderer.render(scene, camera);

}

function addSkybox() {

    // Skybox
    var geometry = new THREE.SphereGeometry(10000, 60, 40);


    // shaders may be causing slowness
    /*
    var uniforms = {  
    texture: { type: 't', value: THREE.ImageUtils.loadTexture('textures/sky.jpg') }
    };

    var material = new THREE.ShaderMaterial( {  
    uniforms:       uniforms,
    vertexShader:   document.getElementById('sky-vertex').textContent,
    fragmentShader: document.getElementById('sky-fragment').textContent
    });/*/

    var material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/sky.jpg')
    })

    skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 1000.0;
    scene.add(skyBox);
}

function addGrid() {
    var size = 14,
        step = 1;

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({
        color: 0x303030
    });

    for (var i = -size; i <= size; i += step) {

        geometry.vertices.push(new THREE.Vector3(-size, -0.04, i));
        geometry.vertices.push(new THREE.Vector3(size, -0.04, i));

        geometry.vertices.push(new THREE.Vector3(i, -0.04, -size));
        geometry.vertices.push(new THREE.Vector3(i, -0.04, size));

    }
}