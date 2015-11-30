
var largeMesh;
function addMesh(basepath, info) {
    loadingMesh = true;
    
    //loadingMesh = false;
    //return;
    var url = basepath + info["meshURL"];
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(url, function(collada) {

        largeMesh = collada.scene;
        largeMesh.scale.x = largeMesh.scale.y = largeMesh.scale.z = info["scale"];//40;

        largeMesh.rotation.x = info["rotation"][0];//-3 / 2;
        largeMesh.rotation.y = info["rotation"][1];
        largeMesh.rotation.z = info["rotation"][2];


        largeMesh.position.x = info["offset"][0];
        largeMesh.position.y = info["offset"][1];//80;
        largeMesh.position.z = info["offset"][2];
        console.log("mesh position", info["offset"])

        largeMesh.updateMatrix();

        scene.add(largeMesh);
        loadingMesh = false;
    });
}

function removeMesh() {
    scene.remove(largeMesh);
}