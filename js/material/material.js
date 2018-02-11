function GeneradorMaterial(){
  var loader= new THREE.TextureLoader();
  function cargar(imagen){
    return new Promise((resolve)=>{
      loader.load(imagen,function(textura){
        resolve(textura);
      },function(xhr){
        resolve(null);
      });
    })
  }

  async function generar(parametros,callback=null){
    var textura,material;
    if(parametros.hasOwnProperty("imagen"))
      textura= await cargar(parametros["imagen"]);
    if(textura!=null)
      material=new THREE.MeshBasicMaterial({map:textura});
    else if(parametros["color"]){
      material= new THREE.MeshBasicMaterial(parametros);
    }
    if(callback!=null)
      material=callback(textura);
    if(material==null)
      material=new THREE.MeshBasicMaterial();
    return material;
  }

  function run(parametros,callback,callbackFinalizado){
    return new Promise((resolve)=>{
      resolve(generar(parametros,callback))
    })
  }

  return{
    run:run
  }
}
