var DatsetManager = function() {
  this.dataset = 'odm';
};

var gui, guiManager;

function initGUI() {
    debug("gui init");
    guiManager = new DatsetManager();
    gui = new dat.GUI();
    var dataset = gui.add(guiManager, 'dataset', { A: "odm2", B: "data" } );
    var selector = gui.add(guiManager, 'slider', 0, 5);
    dataset.onFinishChange(function(dataset) {
        console.log(dataset);
        loadDataset(dataset);
    });
}