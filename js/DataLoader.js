function addData(url) {
    loadingData = true;

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);

    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            data = JSON.parse(xobj.responseText);
            var geometry = new THREE.Geometry();
            var i = 0;

            var scale = data["scale"];      // 50000
            var offset = data["offset"];    // [122.2787, 37.46244, 220]
            var rotation = data["rotation"];



            for (var point in data["data"]) {
                var p = data["data"][point];

                geometry.vertices.push(
                    new THREE.Vector3(scale*(p["pos"][0]+offset[0]), p["pos"][2]-offset[2], scale*(p["pos"][1]-offset[1]))
                );
                geometry.colors[i++] = new THREE.Color(0.1, 1-(p["pressure"]-988)/10.0, (p["pressure"]-988)/10.0);
            }

            var material = new THREE.LineBasicMaterial({
                linewidth: 20,
                color: 0xffffff,
                vertexColors: THREE.VertexColors
            });

            line = new THREE.Line(geometry, material, THREE.Line);

            scene.add(line);
            loadingData = false;
            debug("loaded data");
        }
    };
    xobj.send(null);
}

function removeData() {
    scene.remove(line);
}