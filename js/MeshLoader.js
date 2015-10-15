
function addMesh(url) {
    loadingMesh = true;
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(url, function(collada) {

        largeMesh = collada.scene;
        largeMesh.scale.x = largeMesh.scale.y = largeMesh.scale.z = 40;
        largeMesh.rotation.x = -3 / 2;
        largeMesh.position.y = 80;
        largeMesh.updateMatrix();

        scene.add(largeMesh);
        console.log("loaded dae");
        loadingMesh = false;
    });
}

function removeMesh() {
    scene.remove(largeMesh);
}