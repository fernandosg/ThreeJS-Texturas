function Generador(){
  var puntos = [];

	for ( var i = 0; i < 50; i ++ ) {
	  puntos.push( new THREE.Vector2( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, ( i - 5 ) * 2 ) );
	}
  var valores={
    "sphere":"75, 20, 10","plane":"100, 100, 4, 4 ","box":"100, 100, 100, 4, 4, 4","circle":"50, 20, 0, "+(Math.PI * 2),
    "ring":"10, 50, 20, 5, 0,"+(Math.PI * 2),"cylinder":"25, 75, 100, 40, 5","lathe":"2","torus":"50, 20, 20, 20","torusknot":"50, 10, 50, 20"
  }
  function obtenerValoresIniciales(opcion){
    return valores[opcion].split(",");
  }
  var seleccionar=function(opcion){
    var geometria,vals_inic;
    if(opcion!="lathe")
          vals_inic=obtenerValoresIniciales(opcion).split(",")
    switch(opcion){
      case "sphere":
        geometria=new SphereGeometry(vals_inic[0],vals_inic[1],vals_inic[2])
        break;
      case "plane":
        geometria=new PlaneGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3])
      case "box"
        geometria=new BoxGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3],vals_inic[4],vals_inic[5]);
      case "circle":
        geometria=new CircleGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3]);
      case "ring":
        geometria=new RingGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3],vals_inic[4],vals_inic[5])
      case "cylinder":
        geometria=new CylinderGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3],vals_inic[4]);
      case "lathe":
        geometria=new LatheGeometry(puntos,20);
      case "torus":
        geometria=new TorusGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3]);
      case "torusknot":
        geometria=new TorusKnotGeometry(vals_inic[0],vals_inic[1],vals_inic[2],vals_inic[3]);
    }
    return geometia;
  }

  return{
    seleccionar:seleccionar
  }
}
