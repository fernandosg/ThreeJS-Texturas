var scene,camera,renderer,loader;

$("#cargar-imagen").on('submit', (function(ev) {
  ev.preventDefault();
  $.ajax({
    url: 'cargar.php',
    type: 'POST',
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function(data, status, xhr) {
      obtenerMaterialConTextura("http://localhost:8000/"+data,function(material){
        objeto.material=material;
        objeto.material.needsUpdate=true;
      })
    },
    error: function(xhr, status, error) {
      console.log("Error");
    }
  });
}));


function inicio(){
  var SCREEN_WIDTH = 650, SCREEN_HEIGHT = 480;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  scene=new THREE.Scene();
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.lookAt(scene.position);
  camera.position.set( 0, 0, 150 );
  // RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.autoClear = false;
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById('canvas');
  container.appendChild( renderer.domElement );
  loader= new THREE.TextureLoader();
  obtenerMeshConImagen('img/planeta_textura.jpg',function(objeto){
    scene.add(objeto);
  });
}

function obtenerMaterialConTextura(imagen,callback){
  loader.load(imagen,function(textura){
    var uniforms={
      "texture":{type:"t",value:textura}
    };
    callback(crearShaderMaterial(uniforms));
  },function(xhr){

  });
}

function obtenerMeshConImagen(imagen,callback){
  loader.load(
    imagen,
    function ( textura ) {
      var uniforms = {
        "texture": { type: "t", value: textura }
      };
      objeto=new THREE.Mesh(new THREE.SphereGeometry(30,32,24),crearShaderMaterial(uniforms));
      callback(objeto);
    },
    function ( xhr ) {
      console.log("");
    },
    function ( xhr ) {
      console.log( 'Error en la carga' );
    }
  );
}

function crearShaderMaterial(uniforms){
  return new THREE.ShaderMaterial( {
    uniforms		: uniforms,
    vertexShader	: document.getElementById( 'vertex_shader' ).textContent,
    fragmentShader	: document.getElementById( 'fragment_shader' ).textContent
  });
}

function loop(){
  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}

inicio();
loop();
