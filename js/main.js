			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var loaded = false;
			var container, stats;

			var camera, scene, renderer, objects;
			var particleLight;
			var dae;


			var loading = document.getElementById( 'loading' );
			var blocker = document.getElementById( 'blocker' );
			var instructions = document.getElementById( 'instructions' );

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

			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			if ( havePointerLock ) {

				var element = document.body;

				var pointerlockchange = function ( event ) {

					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

						controlsEnabled = true;
						controls.enabled = true;

						blocker.style.display = 'none';

					} else {

						controls.enabled = false;

						blocker.style.display = '-webkit-box';
						blocker.style.display = '-moz-box';
						blocker.style.display = 'box';

						instructions.style.display = '';

					}

				};

				var pointerlockerror = function ( event ) {

					instructions.style.display = '';

				};

				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.addEventListener( 'click', function ( event ) {

					instructions.style.display = 'none';

					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

					if ( /Firefox/i.test( navigator.userAgent ) ) {

						var fullscreenchange = function ( event ) {

							if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

								document.removeEventListener( 'fullscreenchange', fullscreenchange );
								document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

								element.requestPointerLock();
							}

						};

						document.addEventListener( 'fullscreenchange', fullscreenchange, false );
						document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

						element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

						element.requestFullscreen();

					} else {

						element.requestPointerLock();

					}

				}, false );

			} else {

				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

			}


			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( 'data/odm.dae', function ( collada ) {

				dae = collada.scene;
				dae.scale.x = dae.scale.y = dae.scale.z = 20;
				dae.rotation.x = -3.14/2;
				dae.position.y = 50;
				dae.updateMatrix();
				
				// Add the COLLADA

				scene.add( dae );
				console.log("loaded dae");
				document.getElementById("info").innerhtml = "done loading dae";


			} );

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
				camera.position.set( 0, 0, 0 );

				scene = new THREE.Scene();

				controls = new THREE.PointerLockControls( camera );
				scene.add( controls.getObject() );

				var onKeyDown = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = true;
							break;

						case 37: // left
						case 65: // a
							moveLeft = true; break;

						case 40: // down
						case 83: // s
							moveBackward = true;
							break;

						case 39: // right
						case 68: // d
							moveRight = true;
							break;

						case 69: 
							moveUp = true;
							break;

						case 81: 
							moveDown = true;
							break;

					}

				};

				var onKeyUp = function ( event ) {

					switch( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = false;
							break;

						case 37: // left
						case 65: // a
							moveLeft = false;
							break;

						case 40: // down
						case 83: // s
							moveBackward = false;
							break;

						case 39: // right
						case 68: // d
							moveRight = false;
							break;

						case 69: 
							moveUp = false;
							break;

						case 81: 
							moveDown = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );



				// Grid

				var size = 14, step = 1;

				var geometry = new THREE.Geometry();
				var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

				for ( var i = - size; i <= size; i += step ) {

					geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
					geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

					geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
					geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

				}

				var line = new THREE.LineSegments( geometry, material );
				scene.add( line );


				// Lights

				scene.add( new THREE.AmbientLight( 0xffffff ) );

				// Skybox
				var geometry = new THREE.SphereGeometry(3000, 60, 40);  
				var uniforms = {  
				  texture: { type: 't', value: THREE.ImageUtils.loadTexture('textures/sky.png') }
				};

				var material = new THREE.ShaderMaterial( {  
				  uniforms:       uniforms,
				  vertexShader:   document.getElementById('sky-vertex').textContent,
				  fragmentShader: document.getElementById('sky-fragment').textContent
				});

				skyBox = new THREE.Mesh(geometry, material);  
				skyBox.scale.set(-1, 1, 1);  
				skyBox.eulerOrder = 'XZY';  
				skyBox.renderDepth = 1000.0;  
				scene.add(skyBox);  

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );


				//

				window.addEventListener( 'resize', onWindowResize, false );
				loading.style.display = 'none';
				instructions.style.display = '';
				console.log("done loading");

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}


			function render() {

				var timer = Date.now() * 0.0005;

				if ( controlsEnabled ) {
					var delta = clock.getDelta();

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;
					velocity.y -= velocity.y * 10.0 * delta;

					var speed = 400;
					if ( moveForward ) velocity.z -= speed * delta;
					if ( moveBackward ) velocity.z += speed * delta;

					if ( moveLeft ) velocity.x -= speed * delta;
					if ( moveRight ) velocity.x += speed * delta;

					if ( moveUp ) velocity.y += speed * delta;
					if ( moveDown ) velocity.y -= speed * delta;

					controls.getObject().translateX( velocity.x * delta );
					controls.getObject().translateY( velocity.y * delta );
					controls.getObject().translateZ( velocity.z * delta );


				}


				THREE.AnimationHandler.update( clock.getDelta() );

				renderer.render( scene, camera );

			}
