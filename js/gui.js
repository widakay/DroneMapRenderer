var DatsetManager = function() {
  this.dataset = 'data/';
  this.xoffset = 0;
  this.yoffset = 0;
  this.zoffset = 0;


  this.xrot = 0;
  this.yrot = 0;
  this.zrot = 0;

  this.sensor = 'asdf';

  this.position = 0;

  this.speed = 400;
};

var gui, guiManager;
guiManager = new DatsetManager();

function initGUI() {
    debug("gui init");

	guiManager.xoffset = largeMesh.position.x;
	guiManager.yoffset = largeMesh.position.y;
	guiManager.zoffset = largeMesh.position.z;


	guiManager.xrot = largeMesh.rotation.z;
	guiManager.yrot = largeMesh.rotation.y;
	guiManager.zrot = largeMesh.rotation.z;


    gui = new dat.GUI();
    var dataset = gui.add(guiManager, 'dataset', { A: "odm2/", B: "data/" } );


    var meshSettings = gui.addFolder('MeshOffset');

    meshSettings.add(guiManager, 'xoffset',  -1000, 1000).onChange(function(offset) {
    	largeMesh.position.x = offset;
    });
    meshSettings.add(guiManager, 'yoffset',  -1000, 2000).onChange(function(offset) {
    	largeMesh.position.y = offset;
    });
    meshSettings.add(guiManager, 'zoffset',  -1000, 1000).onChange(function(offset) {
    	largeMesh.position.z = offset;
    });

    meshSettings.add(guiManager, 'xrot',  -Math.PI, Math.PI).onChange(function(rot) {
    	largeMesh.rotation.x = rot;
    });
    meshSettings.add(guiManager, 'yrot',  -Math.PI, Math.PI).onChange(function(rot) {
    	largeMesh.rotation.y = rot;
    });
    meshSettings.add(guiManager, 'zrot',  -Math.PI, Math.PI).onChange(function(rot) {
    	largeMesh.rotation.z = rot;
    });

    console.log("sensors:", listSensors());
    var sensor = gui.add(guiManager, 'sensor', listSensors() );
    gui.add(guiManager, 'speed', 0, 5000 );

    gui.open();



    sensor.onFinishChange(function(sensor) {
    	selectSensor(sensor);
    });

    dataset.onFinishChange(function(dataset) {
        console.log("Loading dataset", dataset);
        loadDataset(dataset);
    });
}

