let consulta = 0;

class Empleado {
  constructor(legajo, nombre, categoria, antiguedad) {
    this.legajo = legajo;
    this.nombre = nombre;
    this.categoria = categoria;
    this.antiguedad = antiguedad;
  }
}

// SE DECLARO EL ARRAY CON UN LET A FIN DE RECUPERAR EN LA MISMA VARIABLE LA SESION DE STORAGE.
let nominaEmpleados = [];

obtener_localstorage();

function obtener_localstorage() {
  if (localStorage.getItem("nominaGuardada")) {
    nominaEmpleados = JSON.parse(localStorage.getItem("nominaGuardada"));
  }
}

console.table(nominaEmpleados);

let datoSolicitado = document.querySelector("div#ingresoDeDatos");
datoSolicitado.innerHTML += `
<div class="mt-2" id="remover">
<label for="inputLegajo" class="form-label">Legajo</label>
<input type="text" id="inputLegajo" class="form-control" placeholder="Ingrese su legajo">
<div class="mt-2">  
<button class="btn btn-info" id="btnConsultar">Consultar</button>
<button class="btn btn-warning" id="btnLimpiar">Limpiar</button>
</div>
</div>
`;

let legajoIngresado;

let btnConsultar = document.getElementById("btnConsultar");
btnConsultar.addEventListener("click", () => {
  legajoIngresado = document.getElementById("inputLegajo").value;
  realizarConsulta(legajoIngresado);
});

let btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.addEventListener("click", () => {
  document.getElementById("inputLegajo").value = "";
  document.querySelector("div#datosParaConsulta").textContent = "";
  document.querySelector("div#reciboDeSueldo").textContent = "";
});

function realizarConsulta() {
  const empleadoEnNomina = nominaEmpleados.find(
    (empl) => empl.legajo == legajoIngresado
  );

  if (empleadoEnNomina) {
    consulta++;
    liquidar(
      empleadoEnNomina.nombre,
      empleadoEnNomina.legajo,
      empleadoEnNomina.categoria,
      empleadoEnNomina.antiguedad,
      consulta
    );

    // AL INGRESAR AL SIGUIENTE ELSE CUANDO EL LEGAJO NO SE ENCUENTRA REGISTRADO NO SE PUEDE VOLVER A CONSULTAR SOLO MEDIANTE EL INGRESO DE UN LEGAJO SI NO SE REFRESCA LA PAGINA.
  } else {
    let remove = document.getElementById("remover");
    remove.remove();
    document.querySelector("div#datosParaConsulta").textContent = "";
    document.querySelector("div#reciboDeSueldo").textContent = "";

    datoSolicitado.innerHTML += `
                    
            <h4> No tenemos registros bajo el legajo Nro ${legajoIngresado}, le solicitamos los siguientes datos para practicar la liquidación </h4>
            
            <label for="inputNombre" class="form-label">Nombre</label>
            <input type="text" id="inputNombre" class="form-control" placeholder="Ingrese su Apellido y Nombre">
            <label for="inputCategoria" class="form-label">Categoría</label>
            <input type="text" id="inputCategoria" class="form-control" placeholder="Ingrese su Categoría">
            <label for="inputAntiguedad" class="form-label">Antiguedad</label>
            <input type="text" id="inputAntiguedad" class="form-control" placeholder="Ingrese su Antiguedad">
            <div class="mt-2">
              <button class="btn btn-info" id="btnNuevaConsulta">Consultar</button>
              <button class="btn btn-warning" id="btnLimpiarTodo">Limpiar</button>
            </div>
            `;

    let btnNuevaConsulta = document.getElementById("btnNuevaConsulta");
    btnNuevaConsulta.addEventListener("click", () => {
      consulta++;
      legajoIngresado;
      let nombre = document.getElementById("inputNombre").value;
      let categoria = document.getElementById("inputCategoria").value;
      let antiguedad = document.getElementById("inputAntiguedad").value;
      liquidar(nombre, legajoIngresado, categoria, antiguedad, consulta);
      nominaEmpleados.push(
        new Empleado(legajoIngresado, nombre, categoria, antiguedad)
      );
      console.clear();
      console.table(nominaEmpleados);

      guardar_localstorage();

      function guardar_localstorage() {
        nominaEmpleados;
        localStorage.setItem("nominaGuardada", JSON.stringify(nominaEmpleados));
      }
    });

    let btnLimpiarTodo = document.getElementById("btnLimpiarTodo");
    btnLimpiarTodo.addEventListener("click", () => {
      document.getElementById("inputNombre").value = "";
      document.getElementById("inputCategoria").value = "";
      document.getElementById("inputAntiguedad").value = "";
      document.querySelector("div#datosParaConsulta").textContent = "";
      document.querySelector("div#reciboDeSueldo").textContent = "";
    });
  }
}

// CUANDO SE RESUELVA LA SALIDA DEL ELSE SIN REFRESCAR LA PAGINA SE PUEDE AGREGAR ESTA ESTRUCTRA DE CONTROL
// if (isNaN(categoria) || isNaN(antiguedad) || nombre === "") {
//   alert(
//     "la categoria y antiguedad deben ser consignadas en número y el nombre no puede estar vacio"
//     );

function liquidar(nombre, legajo, categoria, antiguedad, consulta) {
  let datos = document.querySelector("div#datosParaConsulta");
  datos.innerHTML = `<h3>Hola ${nombre}!</h3>
      <p>se ralizará la consulta solicitada al legajo Nro: ${legajo}</p>
      <p>en base a una categoria Nro: ${categoria}</p>
      <p>con una antiguedad de ${antiguedad} años</p>
      <p>Consulta numero: ${consulta}`;
  const itemUrSueldo = 10000 * categoria;
  const itemAntiguedad = 1000 * antiguedad;
  const sueldo = itemUrSueldo + itemAntiguedad;
  let recibo = document.querySelector("div#reciboDeSueldo");
  recibo.innerHTML = `<h3>Su sueldo asciende a $ ${sueldo}</h3> 
      <p>el cual esta conformado por: </p>
      <h4>$ ${itemUrSueldo} de sueldo y </h4>
      <h4>$ ${itemAntiguedad} de antiguedad.</h4>`;
}
