const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../04-js-asincrono/27-dom-y-eventos');

const doc = m.document;
const fn = (v) => { if (typeof v !== 'function') pendiente(); return v; };
const el = (v) => { if (!v || !v.tagName) pendiente(); return v; };

grupo('TEMA 27 - DOM y eventos', () => {
  prueba('E1  crearFila devuelve un LI con el texto', () => {
    const li = el(m.crearFila('hola'));
    esperar({ tag: li.tagName, texto: li.textContent }).aSer({ tag: 'LI', texto: 'hola' });
  });
  prueba('E1  crearFila le pone la clase fila', () => {
    const li = el(m.crearFila('hola'));
    esperar(li.classList.contains('fila')).aSer(true);
  });
  prueba('E2  crearLista arma una UL con 2 hijos', () => {
    const ul = el(m.crearLista(['a', 'b']));
    esperar({ tag: ul.tagName, hijos: ul.children.length }).aSer({ tag: 'UL', hijos: 2 });
  });
  prueba('E3  textosDe -> [a, b]', () => {
    const ul = doc.createElement('ul');
    for (const t of ['a', 'b']) {
      const li = doc.createElement('li');
      li.textContent = t;
      ul.append(li);
    }
    esperar(m.textosDe(ul)).aSer(['a', 'b']);
  });
  prueba('E4  alternarActivo prende y apaga', () => {
    const d = doc.createElement('div');
    esperar([usar(m.alternarActivo)(d), m.alternarActivo(d)]).aSer([true, false]);
  });
  prueba('E5  contarClics cuenta 2 clics', () => {
    const b = doc.createElement('button');
    const total = fn(usar(m.contarClics)(b));
    b.click(); b.click();
    esperar(total()).aSer(2);
  });
  prueba('E6  tipoDelEvento -> click', () => {
    const b = doc.createElement('button');
    const r = m.tipoDelEvento(b);
    if (r === null) pendiente();
    esperar(r).aSer('click');
  });
  prueba('E7  cancelarEnvio hace preventDefault', () => {
    const form = doc.createElement('form');
    usar(m.cancelarEnvio)(form);
    esperar(form.dispatchEvent({ type: 'submit' })).aSer(false);
  });
  prueba('E8  escucharEnPadre lee el texto del hijo clickeado', () => {
    const ul = doc.createElement('ul');
    const li = doc.createElement('li');
    li.textContent = 'b';
    ul.append(li);
    const leer = fn(usar(m.escucharEnPadre)(ul));
    li.click();
    esperar(leer()).aSer('b');
  });
  prueba('E9  cortarBurbujeo: no llega nada al padre', () => {
    const ul = doc.createElement('ul');
    const li = doc.createElement('li');
    ul.append(li);
    const enPadre = m.cortarBurbujeo(ul, li);
    if (typeof enPadre !== 'function') pendiente();
    if (Object.keys(li.oyentes).length === 0) pendiente();
    li.click();
    esperar(enPadre()).aSer(0);
  });
  prueba('E10 delegarPorDataset lee data-id', () => {
    const ul = doc.createElement('ul');
    const li = doc.createElement('li');
    li.dataset.id = '7';
    ul.append(li);
    const leerId = fn(usar(m.delegarPorDataset)(ul));
    li.click();
    esperar(leerId()).aSer('7');
  });
  prueba('E11 guardarObjeto + leerObjeto', () => {
    usar(m.guardarObjeto)('u', { id: 1, nombre: 'Ana' });
    esperar(m.leerObjeto('u')).aSer({ id: 1, nombre: 'Ana' });
  });
  prueba('E11 guarda TEXTO, no el objeto', () => {
    usar(m.guardarObjeto)('u2', { a: 1 });
    esperar(typeof m.almacenamiento.get('u2')).aSer('string');
  });
  prueba('E11 leerObjeto de una clave que no existe -> null', () => esperar(m.leerObjeto('no-existe')).aSer(null));
  prueba('E12 leerLoEscrito devuelve lo tecleado', () => {
    const input = doc.createElement('input');
    const leer = fn(usar(m.leerLoEscrito)(input));
    input.value = 'hola';
    input.dispatchEvent({ type: 'input' });
    esperar(leer()).aSer('hola');
  });
});
