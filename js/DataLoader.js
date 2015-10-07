function addData() {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            data = JSON.parse(xobj.responseText);
            var geometry = new THREE.Geometry();
            var i = 0;
            for (var point in data["data"]) {
                var p = data["data"][point];
                console.log(p["pos"][0], p["pos"][1], p["pos"][2]);
                geometry.vertices.push(
                    new THREE.Vector3(50000*(p["pos"][0]+122.2787), p["pos"][2]-220, 50000*(p["pos"][1]-37.46244))
                );
                geometry.colors[i++] = new THREE.Color(0.1, 0.1, (p["pressure"]-988)/10.0);
            }

            var material = new THREE.LineBasicMaterial({
                linewidth: 10,
                color: 0xffffff,
                vertexColors: THREE.VertexColors
            });

            var line = new THREE.Line(geometry, material, THREE.Line);

            scene.add(line);
        }
    };
    xobj.send(null);
}