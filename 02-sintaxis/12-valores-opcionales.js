/* ============================================================
   TEMA 12 - Valores que pueden no estar
   ------------------------------------------------------------
   En datos reales, los campos faltan constantemente. Estas tres
   construcciones existen para eso.

   1) OPTIONAL CHAINING  ?.
      Si lo de la izquierda es null o undefined, devuelve undefined
      en vez de reventar:

        usuario.direccion.ciudad     // TypeError si no hay direccion
        usuario.direccion?.ciudad    // undefined, sin error

   2) NULLISH COALESCING  ??
      Valor de reemplazo SOLO si lo de la izquierda es null o undefined:

        const nombre = dato ?? "sin nombre";

      Cuidado con la diferencia frente a  ||  :
        0 || "vacio"    -> "vacio"   (0 es "falsy", lo descarta)
        0 ?? "vacio"    -> 0         (0 es un valor valido)
      Para numeros y textos vacios, ?? casi siempre es lo correcto.

   3) PARAMETROS POR DEFECTO
        function saludar(nombre = "invitado") { ... }
      Se aplica solo si el argumento es undefined.
   ============================================================ */

// EJERCICIO 1
// Devuelve la ciudad del usuario, o undefined si no tiene direccion.
// NO uses if. Usa ?.
// ciudadDe({ direccion: { ciudad: "Lima" } }) -> "Lima"
// ciudadDe({})                                -> undefined
function ciudadDe(usuario) {
  return usuario.direccion?.ciudad;
  //Si no tiene ciudad: 
  //return usuario.direccion?.ciudad?;
}

// EJERCICIO 2
// Devuelve el nombre, o "invitado" si es null o undefined.
// Usa ??
// nombreODefecto("Ana")  -> "Ana"
// nombreODefecto(null)   -> "invitado"
function nombreODefecto(nombre) {
  return nombre ?? "invitado";
}

// EJERCICIO 3
// Devuelve la cantidad, o 10 si no vino.
// OJO: cantidad puede ser 0, y 0 es un valor valido que debe respetarse.
// cantidadO10(5)         -> 5
// cantidadO10(0)         -> 0     <- aqui se ve por que ?? y no ||
// cantidadO10(undefined) -> 10
function cantidadO10(cantidad) {
  // TODO
  return cantidad ?? 10;
}

// EJERCICIO 4
// Parametro por defecto: si no pasan saludo, usa "Hola".
// saludar("Ana")           -> "Hola, Ana"
// saludar("Ana", "Buenas") -> "Buenas, Ana"
function saludar(nombre, saludo = "Hola") {
  return `${saludo}, ${nombre}`;
}

// EJERCICIO 5
// Combina las tres cosas: devuelve el nombre de la empresa del
// usuario en mayusculas, o "SIN EMPRESA" si falta en cualquier nivel.
// empresaDe({ trabajo: { empresa: "Acme" } }) -> "ACME"
// empresaDe({})                               -> "SIN EMPRESA"
function empresaDe(usuario) {
  return usuario.trabajo?.empresa.toUpperCase() ?? "SIN EMPRESA";
}

// EJERCICIO 6
// ?. tambien sirve para llamar metodos que quiza no existen,
// y para entrar a posiciones de un array.
// primerNombre([{ nombre: "Ana" }]) -> "Ana"
// primerNombre([])                  -> undefined  (sin error)
// Pista: lista[0]?.nombre
function primerNombre(lista) {
  return lista[0]?.nombre;
  //si el el objeto  esta como {} , osea no tiene nombre como sería
  //return lista[0]?.nombre? 
}

module.exports = { ciudadDe, nombreODefecto, cantidadO10, saludar, empresaDe, primerNombre };
