/* ============================================================
   TEMA 07 - Funciones flecha
   ------------------------------------------------------------
   La MISMA funcion escrita de tres formas:

     function sumar(a, b) { return a + b; }        // clasica
     const sumar = (a, b) => { return a + b; };    // flecha con llaves
     const sumar = (a, b) => a + b;                // flecha corta

   Regla de la forma corta: si el cuerpo es UNA sola expresion,
   puedes quitar las llaves y el return. El resultado se devuelve solo.

   Con un solo parametro los parentesis son opcionales:
     const doble = n => n * 2;

   Sin parametros van parentesis vacios obligatorios:
     const saludo = () => "hola";

   OJO: para devolver un OBJETO en forma corta hay que envolverlo
   en parentesis, o JavaScript cree que las llaves son un bloque:
     const hacer = () => ({ ok: true });
   ============================================================ */

// EJERCICIO 1
// Escribe restar como funcion flecha CON llaves y return explicito.
// restar(10, 4) -> 6
const restar = (a, b) => {
  return a - b;
};

// EJERCICIO 2
// La misma idea, pero en forma corta (sin llaves ni return).
// multiplicar(3, 4) -> 12
const multiplicar = (a, b) => a * b; // TODO

// EJERCICIO 3
// Un solo parametro, forma corta, sin parentesis en el parametro.
// alCuadrado(5) -> 25
const alCuadrado = (a) => a ** 2; // TODO

// EJERCICIO 4
// Sin parametros. Devuelve siempre el texto "hola mundo".
const holaMundo = () => "hola mundo"; // TODO

// EJERCICIO 5
// Devuelve un OBJETO en forma corta. Recuerda los parentesis.
// crearUsuario("Ana", 30) -> { nombre: "Ana", edad: 30 }
const crearUsuario = (nombre, edad) => ({ nombre, edad });

// EJERCICIO 6
// Aqui la funcion flecha va COMO ARGUMENTO de map (esto es lo que
// mas vas a ver en React). Completa solo la flecha de adentro.
// triplicarTodos([1, 2]) -> [3, 6]
function triplicarTodos(numeros) {
  //esta no entendí, solo recorde lo que hicimos en arrays creo
  return numeros.map((n) => n * 3);
}

/* ------------------------------------------------------------
   SEGUNDA PARTE: los parametros
   ------------------------------------------------------------
   Lo de arriba fue la FORMA de la flecha. Esto es que va dentro
   de los parentesis, que es distinto:

     DEFINIR -> eliges NOMBRES (cajas vacias)
        const saludar = (nombre) => ...
                         ^^^^^^ un nombre inventado por ti

     LLAMAR  -> pasas VALORES (se llenan las cajas)
        saludar("Ana");
                ^^^^^ el valor real

   Tres reglas:
     a) El nombre del parametro lo eliges tu. Estas dos son iguales:
          const doble = n => n * 2;
          const doble = loQueSea => loQueSea * 2;
     b) El ORDEN importa: el primer valor entra al primer parametro.
     c) Dentro del cuerpo usas el NOMBRE, nunca el valor de ejemplo.
        Si escribes el valor a mano, la funcion devuelve siempre lo
        mismo y deja de servir.

   Cada ejercicio se prueba con DOS entradas distintas, justo para
   detectar si dejaste un valor clavado.
   ------------------------------------------------------------ */

// EJERCICIO 7
// Recibe un nombre y devuelve "Buenos dias, <nombre>".
// Tu eliges como llamar al parametro.
// dias("Ana") -> "Buenos dias, Ana"   |   dias("Luis") -> "Buenos dias, Luis"
// Puedes usar template literal (escribe tl + Tab) o concatenar con +
const dias = (nombre) => "Buenos días, " + nombre; // TODO

// EJERCICIO 8
// Dos textos, pegados con un espacio en medio. El ORDEN importa.
// juntar("hola", "mundo") -> "hola mundo"
const juntar = (texto1, texto2) => {
  return texto1 + " " + texto2;
}; // TODO

// EJERCICIO 9
// UN parametro usado DOS veces: devuelve numero + numero.
// sumarConsigoMismo(7) -> 14
const sumarConsigoMismo = (numero) => numero + numero; // TODO

// EJERCICIO 10
// Ningun parametro. Devuelve siempre 42.
const respuesta = () => 42; // TODO

// EJERCICIO 11
// Tres parametros, devuelve la suma.
// sumarTres(1, 2, 3) -> 6
const sumarTres = (a, b, c) => a + b + c; // TODO

// EJERCICIO 12
// Devuelve los dos valores en un array, pero al reves.
// voltear("a", "b") -> ["b", "a"]
const voltear = (a, b) => [b, a];

//seria bueno que me digas si hay un afuncion que retorna el array inv // TODO

// EJERCICIO 13
// Esta ya esta escrita. NO la toques.
const areaCirculo = (radio) => 3.14 * radio * radio;

// Escribe una funcion que reciba un radio y devuelva el area
// LLAMANDO a areaCirculo. Aqui practicas pasar el valor.
// calcularArea(2) -> 12.56
const calcularArea = (radio) => areaCirculo(radio); // TODO

// EJERCICIO 14
// Las dos deben devolver el triple, pero con nombres de parametro
// DISTINTOS entre si. Hay un test que lo comprueba: sirve para que
// veas con tus ojos que el nombre da igual.
// tripleA(5) -> 15   |   tripleB(5) -> 15
const tripleA = (parameter) => parameter * 3; // TODO
const tripleB = (parametro) => parametro * 3; // TODO

// EJERCICIO 15
// Recibe nombre y edad y devuelve un objeto con esos datos.
// Es el ejercicio 5 otra vez, ahora que tienes claro lo de arriba.
// hacer("Luis", 25) -> { nombre: "Luis", edad: 25 }
// OJO: los valores van tal cual. Un template literal convertiria
// la edad en el texto "25" en vez del numero 25.
const hacer = (nombre, edad) => ({ nombre, edad }); // TODO

module.exports = {
  restar,
  multiplicar,
  alCuadrado,
  holaMundo,
  crearUsuario,
  triplicarTodos,
  dias,
  juntar,
  sumarConsigoMismo,
  respuesta,
  sumarTres,
  voltear,
  areaCirculo,
  calcularArea,
  tripleA,
  tripleB,
  hacer,
};
