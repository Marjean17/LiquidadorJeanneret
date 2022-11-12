let consulta = 0;
let legajoIngresado;
let nominaEmpleados = [];

function obtener_localstorage() {
  if (localStorage.getItem("nominaGuardada")) {
    nominaEmpleados = JSON.parse(localStorage.getItem("nominaGuardada")) || [];
  }
}
obtener_localstorage();

console.table(nominaEmpleados);

//Se generaron 3 Div. siendo el 1ero para ingresar datos, el 2do para mostrarlos y un 3ro para mostrar el recibo de sueldo
//Se armaron dos botones siendo el "Consultar" para comenzar una consulta mediante Legajo y
//el "limpiar" para ejecutar la función "realizar consulta"

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

//se creó la clase constructora para ingresar nuevos empleados tanto como para consultar los ya ingresados
class Empleado {
  constructor(legajo, nombre, categoria, categoriaNro, antiguedad) {
    this.legajo = legajo;
    this.nombre = nombre;
    this.categoria = categoria;
    this.categoriaNro = categoriaNro;
    this.antiguedad = antiguedad;
  }
}

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
      empleadoEnNomina.categoriaNro,
      empleadoEnNomina.antiguedad,
      consulta
    );
  } else {
    //si no estuviera el empleado en nómina en el else removemos los datos y resultado de la consulta anterior,
    //pedimos los datos complementarios del legajo y realizamos una nueva consulta validando los datos ingresados

    let remove = document.getElementById("remover");
    remove.remove();
    document.querySelector("div#datosParaConsulta").textContent = "";
    document.querySelector("div#reciboDeSueldo").textContent = "";

    datoSolicitado.innerHTML += `
                    
            <h4> No tenemos registros bajo el legajo Nro ${legajoIngresado}, le solicitamos los siguientes datos para practicar la liquidación </h4>
            
            <label for="inputNombre" class="form-label">Datos personales</label>
            <input type="text" id="inputNombre" class="form-control" placeholder="Ingrese su Apellido y Nombre">
            <label for="inputCategoria" class="form-label">Datos para cálculo</label>
            <select id="inputCategoria" class="form-control" placeholder="Ingrese su Categoría" size="1">
            <label for="inputAntiguedad" class="form-label"></label>
            <input type="text" id="inputAntiguedad" class="form-control" placeholder="Ingrese su Antiguedad">
            <div class="mt-2">
              <button class="btn btn-info" id="btnNuevaConsulta">Consultar</button>
              <button class="btn btn-warning" id="btnLimpiarTodo">Limpiar</button>
            </div>
            `;

    //se implementó la promesa con fetch a fin de obtener los datos de una URL (aqui interna) respecto de
    //la cantidad de UR (Unidades Remunerativas) que conforman cada categoria y se crearon dinámicamente los option

    const opcionesCategoria = document.querySelector("#inputCategoria");
    fetch("./urPorCategoria.json")
      .then((res) => res.json())
      .then((urPorCategoria) => {
        urPorCategoria.forEach((categoria) => {
          const option = document.createElement("option");
          option.value = `${categoria.cantidadUr}-${categoria.categoriaNro}`;
          option.innerText = categoria.categoriaNro;
          opcionesCategoria.append(option);
        });
      });

    let btnNuevaConsulta = document.getElementById("btnNuevaConsulta");
    btnNuevaConsulta.addEventListener("click", () => {
      legajoIngresado;
      const inputCategoriaValue =
        document.getElementById("inputCategoria").value;
      let nombre = document.getElementById("inputNombre").value;
      const splitValue = inputCategoriaValue.split("-");
      let categoria = splitValue[0];
      const categoriaNro = splitValue[1];

      //se almacenó en 2 atributos tanto el nro de categorias como la cantidad de UR asociadas
      //y se aplicó split para almacenar el value en dos variables

      let antiguedad = document.getElementById("inputAntiguedad").value;
      if (
        isNaN(categoria) ||
        categoria === "" ||
        isNaN(antiguedad) ||
        antiguedad === "" ||
        nombre === ""
      ) {
        Toastify({
          text: "la categoria y antiguedad deben ser consignadas en número y el nombre no puede estar vacio",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "left",
          stopOnFocus: true,
          style: {
            background: "linear-gradient(to right, white, lightblue)",
            color: "black",
          },
        }).showToast();
      } else {
        //enconstrándose validados los datos del nuevo empleado procedemos a liquidar, agregarlo en nómina,
        //actualizar la misma por consola y enviarla al localStorage
        consulta++;

        liquidar(
          nombre,
          legajoIngresado,
          categoria,
          antiguedad,
          consulta,
          categoriaNro
        );
        nominaEmpleados.push(
          new Empleado(
            legajoIngresado,
            nombre,
            categoria,
            categoriaNro,
            antiguedad
          )
        );
        console.clear();
        console.table(nominaEmpleados);

        guardar_localstorage();

        function guardar_localstorage() {
          nominaEmpleados;
          localStorage.setItem(
            "nominaGuardada",
            JSON.stringify(nominaEmpleados)
          );
        }
        //finalmente volvemos a solicitar un legajo para una nueva consulta generando nuevamente la botonera correspondiente

        datoSolicitado.innerHTML = `
      <div class="mt-2" id="remover">
      <label for="inputLegajo" class="form-label">Legajo</label>
      <input type="text" id="inputLegajo" class="form-control" placeholder="Ingrese su legajo">
      <div class="mt-2">  
      <button class="btn btn-info" id="btnConsultar">Consultar</button>
      <button class="btn btn-warning" id="btnLimpiar">Limpiar</button>
      </div>
      </div>
      `;

        btnConsultar = document.getElementById("btnConsultar");
        btnConsultar.addEventListener("click", () => {
          legajoIngresado = document.getElementById("inputLegajo").value;
          realizarConsulta(legajoIngresado);
        });

        btnLimpiar = document.getElementById("btnLimpiar");
        btnLimpiar.addEventListener("click", () => {
          document.getElementById("inputLegajo").value = "";
          document.querySelector("div#datosParaConsulta").textContent = "";
          document.querySelector("div#reciboDeSueldo").textContent = "";
        });
      }
    });

    let btnLimpiarTodo = document.getElementById("btnLimpiarTodo");
    btnLimpiarTodo.addEventListener("click", () => {
      document.getElementById("inputNombre").value = "";
      document.getElementById("inputCategoria").value = "";
      document.getElementById("inputAntiguedad").value = "";
    });
  }
}
//la función "liquidar" efectua los cálculos y confecciona el recibo.
//Se utiliza tanto ante un empleado en nómina como luego del ingreso de los datos de uno nuevo
function liquidar(
  nombre,
  legajo,
  categoria,
  antiguedad,
  consulta,
  categoriaNro
) {
  let datos = document.querySelector("div#datosParaConsulta");
  datos.innerHTML = `<h3>Hola ${nombre}!</h3>
    <p>se ralizará la consulta solicitada al legajo Nro: ${legajo}</p>
    <p>en base a una categoria Nro: ${categoriaNro}</p>
    <p>con una antiguedad de ${antiguedad} años</p>
    <p>Consulta numero: ${consulta}`;
  const itemUrSueldo = 324 * categoria;
  const itemAntiguedad = 1000 * antiguedad;
  const sueldo = itemUrSueldo + itemAntiguedad;
  const jubilacion = sueldo * 0.11;
  const ley19032 = sueldo * 0.03;
  const obraSocial = sueldo * 0.03;
  const sueldoNeto = sueldo - (jubilacion + ley19032 + obraSocial);

  setTimeout(function mostrarLiq() {
    let recibo = document.querySelector("div#reciboDeSueldo");
    recibo.innerHTML = `<div class="card"> 
    <div class="card-header">
    <p> |  Legajo Nro: ${legajo}  |  Apellido y Nombre: ${nombre}  |  Categoria: ${categoriaNro}  |  Antiguedad: ${antiguedad}  |
    </div>
    <div class="card-body">  
    <h4>Su sueldo asciende a $ ${sueldo.toFixed(2)} bruto</h4> 
    <p>el cual esta conformado por: </p>
    <h5>$ ${itemUrSueldo.toFixed(2)} de sueldo </h5>
    <h5>$ ${itemAntiguedad.toFixed(2)} de antiguedad</h5>
    <p>sobre el que se efectuaron las siguientes deducciones: </p>
    <h5 class="text-center">$ ${jubilacion.toFixed(2)} por jubilación </h5>
    <h5 class="text-center">$ ${ley19032.toFixed(2)} por ley 19032 </h5>
    <h5 class="text-center">$ ${obraSocial.toFixed(2)} por obra social </h5>
    </div>
    <div class="card-footer">
    <p>Resultando en un haber neto de: </p>
    <h4 class="text-center">$ ${sueldoNeto.toFixed(2)}</h4>  
    </div>
    </div>`;
  }, 1000);
}
