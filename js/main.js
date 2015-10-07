if (!Detector.webgl) Detector.addGetWebGLMessage();

var loaded = false;
var container, stats;

var camera, scene, renderer, objects;
var particleLight;
var dae;


var loading = document.getElementById('loading');
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

loading.style.display = '';
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



init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 0);

    scene = new THREE.Scene();

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    addListeners();

    addGrid();

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff));

    // Fog
    //scene.fog = new THREE.Fog( 0x7ec0ee, 75, 200 );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);


    addSkybox();
    addMesh();
    addData();
    window.addEventListener('resize', onWindowResize, false);
    loading.style.display = 'none';
    instructions.style.display = '';
    console.log("done loading");

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

        var speed = 400;
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
    var geometry = new THREE.SphereGeometry(3000, 60, 40);


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