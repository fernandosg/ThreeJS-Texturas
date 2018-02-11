function SphereGeometryMaterial(){
  var loader= new THREE.TextureLoader();
  function crearShaderMaterial(uniforms){
    return new THREE.ShaderMaterial( {
      uniforms		: uniforms,
      vertexShader	: document.getElementById( 'vertex_shader' ).textContent,
      fragmentShader	: document.getElementById( 'fragment_shader' ).textContent
    });
  }

  function cargar(imagen,resolve){
    loader.load(imagen,function(textura){
      var uniforms={
        "texture":{type:"t",value:textura}
      };
      resolve(crearShaderMaterial(uniforms));
    },function(xhr){

    });
  }
  var crear=function(propiedades,resolve){
    var material;
    if(propiedades.hasOwnProperty("imagen")){
      material=cargar(propiedades.imagen,resolve);
    }else if(propiedades.hasOwnProperty("color")){
      resolve(new THREE.MeshBasicMaterial(propiedades));
    }
  }

  return{
    crear:crear
  }
}


function GeneradorMaterial(){
  var generar=function(tipo_geometria,propiedades){
    return new Promise((resolve)=>{
      var material;
      switch(tipo_geometria){
        case "SphereGeometry":
          var sphere_geometry_material=new SphereGeometryMaterial();
          sphere_geometry_material.crear(propiedades,resolve);
          break;
        default:
          resolve(null);
          break;
      }
    })
  }

  return{
    generar:generar
  }
}
