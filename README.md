# Practica de JavaScript - Nivel 1: fundamentos

## Como funciona

1. Abre un archivo de la carpeta `01-basicos/` y completa las funciones donde dice `// TODO`.
2. Ejecuta el corrector para ver si van bien.

```
node verificar.js        # revisa todos los temas
node verificar.js 03     # revisa solo el tema 03
```

Cada prueba sale como:

- `PASA` - correcto
- `FALLA` - lo intentaste pero el resultado no coincide (te dice que esperaba)
- `PENDIENTE` - todavia no lo has escrito

## Orden recomendado

| Tema | Archivo | Que practicas |
|---|---|---|
| 01 | `01-basicos/01-variables-y-tipos.js` | let, const, string, number, boolean, typeof |
| 02 | `01-basicos/02-operadores.js` | + - * / %, comparaciones, && y \|\| |
| 03 | `01-basicos/03-strings.js` | template literals, metodos de texto |
| 04 | `01-basicos/04-condicionales.js` | if / else if / else, ternario |
| 05 | `01-basicos/05-bucles.js` | for, while, acumuladores |
| 06 | `01-basicos/06-arrays.js` | arrays, map, filter, reduce |

## Probar algo suelto

Si quieres experimentar sin tests, crea un archivo y ejecutalo:

```
node mi-prueba.js
```

Dentro usa `console.log(...)` para ver valores.

---

# Nivel 2: sintaxis moderna

Aqui la logica es trivial a proposito. Lo nuevo es **como se escribe**, que
es lo que necesitas para leer codigo de proyectos reales y de React.

| Tema | Archivo | Que practicas |
|---|---|---|
| 07 | `02-sintaxis/07-funciones-flecha.js` | `=>` en sus tres formas + parametros vs argumentos (15 ejercicios) |
| 08 | `02-sintaxis/08-objetos.js` | crear, leer, shorthand, `Object.keys` |
| 09 | `02-sintaxis/09-desestructuracion.js` | **esto es "props"** |
| 10 | `02-sintaxis/10-spread-y-rest.js` | los tres puntos `...` |
| 11 | `02-sintaxis/11-datos-reales.js` | arrays de objetos, `map`/`filter`/`find` |
| 12 | `02-sintaxis/12-valores-opcionales.js` | `?.`, `??`, parametros por defecto |

Se corrigen igual: `node verificar.js 09`, o `node verificar.js` para todo.
# javascript
