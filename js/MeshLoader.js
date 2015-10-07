
function addMesh() {

    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('data/odm.dae', function(collada) {

        dae = collada.scene;
        dae.scale.x = dae.scale.y = dae.scale.z = 20;
        dae.rotation.x = -3.14 / 2;
        dae.position.y = 50;
        dae.updateMatrix();

        // Add the COLLADA

        scene.add(dae);
        console.log("loaded dae");
        document.getElementById("info").innerhtml = "done loading dae";
    });
}