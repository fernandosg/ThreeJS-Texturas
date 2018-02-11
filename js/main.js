var scene,camera,renderer;
var generador;
var objeto_mesh;
var generador_material=new GeneradorMaterial();
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
  generador=new Generador();
  crearMesh(function(mesh){
    mesh.position.z=-100;
    scene.add(mesh);
  });
}

async function crearMesh(callback){
  var material=await generador_material.run({"imagen":'img/planeta_textura.jpg'},function(textura){
    return new THREE.ShaderMaterial( {
      uniforms        : {"texture":{type:"t",value:textura}},
      vertexShader    : document.getElementById( 'vertex_shader' ).textContent,
      fragmentShader    : document.getElementById( 'fragment_shader' ).textContent
    });
  });
  var geometria=generador.seleccionar("sphere");
  objeto_mesh=new THREE.Mesh(geometria,material);
  callback(objeto_mesh);
}


function loop(){
  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}

async function cargarImagenComoMaterial(imagen,objeto){
  var material=await generador_material.run({"imagen":imagen},null);
  objeto.material=material;
  objeto.material.needsUpdate=true;
}

/* Eventos */

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
      cargarImagenComoMaterial("http://localhost:8000/"+data,objeto_mesh);
    },
    error: function(xhr, status, error) {
      console.log("Error");
    }
  });
}));


var geometria_nueva;
$("#seleccionar-geometria").click(function(evt){
  geometria_nueva=generador.seleccionar($('#tipo-geometria').find(":selected").val());
  var objeto_nuevo=new THREE.Mesh(geometria_nueva,objeto_mesh.material);
  objeto_nuevo.position.set(objeto_mesh.position.x,objeto_mesh.position.y,objeto_mesh.position.z);
  scene.remove(objeto_mesh);
  scene.add(objeto_nuevo);
  objeto_mesh=objeto_nuevo;
})


var fov=0;
function mousewheel( event ) {
  event.preventDefault();
  var fov = camera.fov + event.deltaY * 0.05;
  camera.fov = THREE.Math.clamp( fov, 10, 75 );
  camera.updateProjectionMatrix();

}

window.addEventListener('mousewheel', mousewheel, false);

inicio();
loop();
