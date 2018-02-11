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
  obtenerMeshConImagen('img/planeta_textura.jpg',function(objeto){
    objeto_mesh=objeto;
    scene.add(objeto_mesh);
  });
  generador=new Generador();
}

async function obtenerMeshConImagen(imagen,callback){
  var material=await generador_material.generar("SphereGeometry",{"imagen":imagen});
  if(material!=null){
    var objeto=new THREE.Mesh(new THREE.SphereGeometry(30,32,24),material);
    callback(objeto);
  }else{
    console.log("El material fue nulo");
  }
}


function loop(){
  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}

async function cargarImagenComoMaterial(imagen,objeto){
  var material=await generador_material.generar(objeto.geometry.type,{"imagen":imagen});
  if(material!=null){
    objeto.material=material;
    objeto.material.needsUpdate=true;
  }else {
    console.log("Hubo un error en la creación del material");
  }
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

inicio();
loop();
