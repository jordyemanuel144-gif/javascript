/* ============================================================================
   20 · JSON, FECHAS Y NÚMEROS
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   Formatear precios y fechas es la mitad de una pantalla de sistema. Y JSON
   es el idioma en que habla la API.

   CÓMO ESTÁ ARMADO: pasos cortos, ejercicios cortos, soluciones por bloque.
   Corrige con:   node verificar.js 20
   ============================================================================ */


/* ############################################################################
   20.1  JSON — pasar de objeto a texto y al revés
   ############################################################################
     JSON.stringify(objeto)    // objeto -> TEXTO
     JSON.parse(texto)         // TEXTO  -> objeto

     JSON.stringify({ a: 1 });        // '{"a":1}'
     JSON.parse('{"a":1}');           // { a: 1 }

   Por la red solo viajan TEXTOS. Por eso todo lo que mandas a una API pasa
   por stringify y todo lo que recibes pasa por parse.

   Con formato bonito, para mirarlo:
     JSON.stringify(obj, null, 2)     // 2 espacios de indentación
     //                  ^ el null es un parámetro que no usamos
############################################################################ */

// E1. Convierte el objeto a texto JSON.
// aTexto({a:1}) -> '{"a":1}'
function aTexto(obj) {
  // TODO
}

// E2. Igual, pero con indentación de 2 espacios.
// bonito({a:1}) -> '{\n  "a": 1\n}'
function bonito(obj) {
  // TODO
}

/* SOLUCIONES 20.1 ------------------------------------------------------------
   E1   return JSON.stringify(obj);
   E2   return JSON.stringify(obj, null, 2);
-------------------------------------------------------------------------- */


/* ############################################################################
   20.2  JSON.parse revienta si el texto está mal
   ############################################################################
     JSON.parse('roto');      // SyntaxError

   Como el texto viene de afuera, siempre va con try/catch (tema 19):

     try {
       return JSON.parse(texto);
     } catch {
       return null;
     }

   ⚠ El JSON usa comillas DOBLES en las claves. Esto es JSON válido:
        {"nombre":"Ana"}
     y esto NO (es un objeto de JavaScript, no JSON):
        {nombre: 'Ana'}

   ⚠ Qué se pierde al convertir a JSON:
        undefined  -> desaparece la clave
        Date       -> se convierte en texto
        funciones  -> desaparecen
############################################################################ */

// E3. Convierte el texto a objeto; si es inválido, devuelve null.
function aObjeto(texto) {
  // TODO
}

// E4. Copia profunda usando el truco de JSON (convertir a texto y volver).
// copiaJson({ dir: { ciudad: 'Lima' } })  -> copia con el dir separado
function copiaJson(obj) {
  // TODO: JSON.parse(JSON.stringify(...))
}

/* SOLUCIONES 20.2 ------------------------------------------------------------
   E3   try { return JSON.parse(texto); } catch { return null; }
   E4   return JSON.parse(JSON.stringify(obj));
-------------------------------------------------------------------------- */


/* ############################################################################
   20.3  FECHAS: crear y leer sus partes
   ############################################################################
     new Date()                    // ahora
     new Date('2026-03-15')        // desde texto ISO (lo que manda la API)

     const d = new Date('2026-03-15T10:30:00');
     d.getFullYear()    // 2026
     d.getMonth()       // 2      ⚠ EMPIEZA EN 0: enero es 0, marzo es 2
     d.getDate()        // 15     el día del mes
     d.getHours()       // 10

   El mes que empieza en 0 es la trampa número uno de las fechas en
   JavaScript. Para mostrarlo a una persona, siempre  getMonth() + 1.
############################################################################ */

const FECHA = new Date('2026-03-15T00:00:00');   // para probar

// E5. Devuelve el año de esa fecha.
// anio(FECHA) -> 2026
function anio(fecha) {
  // TODO
}

// E6. Devuelve el número de mes HUMANO (enero = 1).
// mesHumano(FECHA) -> 3
function mesHumano(fecha) {
  // TODO
}

/* SOLUCIONES 20.3 ------------------------------------------------------------
   E5   return fecha.getFullYear();
   E6   return fecha.getMonth() + 1;
-------------------------------------------------------------------------- */


/* ############################################################################
   20.4  FECHA -> TEXTO
   ############################################################################

   a) para mandar a la API o llenar un <input type="date">: formato ISO
        d.toISOString()              // '2026-03-15T00:00:00.000Z'
        d.toISOString().slice(0,10)  // '2026-03-15'
        //              ^ me quedo con los 10 primeros caracteres

   b) para mostrarle a una persona, armado a mano:
        const dia = String(d.getDate()).padStart(2, '0');
        //          ^ a texto      ^ si mide 1, le pone un '0' adelante
        // '5' queda '05'

   c) y la forma automática, según el país:
        d.toLocaleDateString('es-PE');    // '15/3/2026'
############################################################################ */

// E7. Devuelve la fecha como 'YYYY-MM-DD'.
// aInputDate(new Date('2026-03-15T00:00:00Z')) -> '2026-03-15'
function aInputDate(fecha) {
  // TODO: toISOString + slice
}

// E8. Devuelve la fecha como 'DD/MM/YYYY', con dos dígitos siempre.
// formatoCorto(FECHA) -> '15/03/2026'
// formatoCorto(new Date('2026-01-05T00:00:00')) -> '05/01/2026'
function formatoCorto(fecha) {
  // TODO: padStart en el día y en el mes (acordándote del +1)
}

/* SOLUCIONES 20.4 ------------------------------------------------------------
   E7   return fecha.toISOString().slice(0, 10);
   E8   const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        return `${dia}/${mes}/${fecha.getFullYear()}`;
-------------------------------------------------------------------------- */


/* ############################################################################
   20.5  RESTAR Y COMPARAR FECHAS
   ############################################################################
   Restar dos fechas da MILISEGUNDOS:

     const ms = fin - inicio;
     const dias = ms / (1000 * 60 * 60 * 24);
     //                 ms    seg   min   horas

   ⚠ Comparar con === NUNCA funciona: son objetos, y dos objetos distintos
     nunca son iguales (tema 16.6).

        new Date('2026-01-01') === new Date('2026-01-01')     // false
        a.getTime() === b.getTime()                           // ✓ así sí
############################################################################ */

// E9. Días completos entre dos fechas (la segunda menos la primera).
// diasEntre(new Date('2026-03-01'), new Date('2026-03-11')) -> 10
function diasEntre(desde, hasta) {
  // TODO
}

// E10. true si las dos fechas son el mismo instante.
// mismaFecha(new Date('2026-01-01'), new Date('2026-01-01')) -> true
function mismaFecha(a, b) {
  // TODO: getTime()
}

/* SOLUCIONES 20.5 ------------------------------------------------------------
   E9   return (hasta - desde) / (1000 * 60 * 60 * 24);
   E10  return a.getTime() === b.getTime();
-------------------------------------------------------------------------- */


/* ############################################################################
   20.6  NÚMEROS: convertir desde texto
   ############################################################################
     Number('12.5')        // 12.5
     Number('abc')         // NaN      <- "not a number"
     Number('')            // 0
     parseInt('12px')      // 12       corta en el primer carácter raro
     +'12'                 // 12       atajo de Number()

   ⚠ NaN no se compara consigo mismo:
        NaN === NaN            // false
        Number.isNaN(x)        // ✓ la forma correcta de preguntar

   Esto importa porque un <input type="number"> devuelve TEXTO, no número:
     '5' + 1      // '51'    <- concatena
     Number('5') + 1   // 6
############################################################################ */

// E11. Convierte el texto a número; si no se puede, devuelve 0.
// aNumero('12.5') -> 12.5 ;  aNumero('abc') -> 0
function aNumero(texto) {
  // TODO: Number + Number.isNaN
}

/* SOLUCIONES 20.6 ------------------------------------------------------------
   E11  const n = Number(texto);
        return Number.isNaN(n) ? 0 : n;
-------------------------------------------------------------------------- */


/* ############################################################################
   20.7  REDONDEAR
   ############################################################################
     Math.round(4.5)      // 5    al más cercano
     Math.floor(4.9)      // 4    hacia abajo
     Math.ceil(4.1)       // 5    hacia arriba

     (1234.567).toFixed(2)          // '1234.57'   ⚠ devuelve TEXTO
     Number((1234.567).toFixed(2))  // 1234.57     <- vuelta a número

   Regla: `toFixed` para MOSTRAR (te deja los ceros: '5.00').
          `Number(x.toFixed(2))` cuando necesitas seguir calculando.
############################################################################ */

// E12. Redondea a 2 decimales devolviendo un NÚMERO (no texto).
// redondear2(1234.567) -> 1234.57
function redondear2(n) {
  // TODO
}

// E13. Porcentaje con un decimal, como texto con %.
// porcentaje(1, 3) -> '33.3%'
function porcentaje(parte, total) {
  // TODO: parte / total * 100, toFixed(1), y le pegas el %
}

/* SOLUCIONES 20.7 ------------------------------------------------------------
   E12  return Number(n.toFixed(2));
   E13  return `${(parte / total * 100).toFixed(1)}%`;
-------------------------------------------------------------------------- */


/* ############################################################################
   20.8  LA COMA FLOTANTE MIENTE
   ############################################################################
     0.1 + 0.2                  // 0.30000000000000004
     0.1 + 0.2 === 0.3          // false

   No es un bug de JavaScript: pasa en casi todos los lenguajes. Los decimales
   no se pueden representar exactos en binario.

   Para plata, dos salidas:
     · redondear al final:  Number(total.toFixed(2))
     · o trabajar en céntimos (números enteros) y dividir al mostrar
############################################################################ */

// E14. Suma segura de precios: redondea el resultado a 2 decimales.
// sumarPrecios([0.1, 0.2]) -> 0.3 ;  sumarPrecios([]) -> 0
function sumarPrecios(precios) {
  // TODO: reduce y después redondear
}

/* SOLUCIONES 20.8 ------------------------------------------------------------
   E14  const total = precios.reduce((t, p) => t + p, 0);
        return Number(total.toFixed(2));
-------------------------------------------------------------------------- */


module.exports = {
  FECHA,
  aTexto, bonito, aObjeto, copiaJson,
  anio, mesHumano, aInputDate, formatoCorto,
  diasEntre, mismaFecha,
  aNumero, redondear2, porcentaje, sumarPrecios,
};
