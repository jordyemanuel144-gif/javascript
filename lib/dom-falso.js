/* ============================================================================
   DOM FALSO — un navegador de mentira, en miniatura.
   No necesitas tocar este archivo.

   Node no tiene DOM (no hay document ni window), así que aquí hay una versión
   mínima para poder practicar eventos de verdad: burbujeo, event.target,
   preventDefault, stopPropagation, delegación y classList.

   Lo que soporta:
     crearDocumento()                      -> un `document` nuevo y vacío
     document.createElement(tag)
     document.getElementById(id) / querySelector('#id' | '.clase' | 'tag')
     document.querySelectorAll(selector)
     elemento.append(hijo) / elemento.remove()
     elemento.id, .className, .classList.{add,remove,toggle,contains}
     elemento.textContent, .value, .dataset, .setAttribute/.getAttribute
     elemento.addEventListener(tipo, fn) / removeEventListener
     elemento.dispatchEvent({ type, ... })  -> burbujea hasta document
     elemento.click()                       -> dispara un evento 'click'
   ============================================================================ */

class ClaseLista {
  constructor(el) { this.el = el; }
  get lista() { return this.el.className.split(' ').filter(Boolean); }
  set lista(v) { this.el.className = v.join(' '); }
  add(c) { if (!this.contains(c)) this.lista = [...this.lista, c]; }
  remove(c) { this.lista = this.lista.filter(x => x !== c); }
  contains(c) { return this.lista.includes(c); }
  toggle(c) { this.contains(c) ? this.remove(c) : this.add(c); return this.contains(c); }
}

class Elemento {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.id = '';
    this.className = '';
    this.textContent = '';
    this.value = '';
    this.dataset = {};
    this.children = [];
    this.parentNode = null;
    this.atributos = {};
    this.oyentes = {};
    this.classList = new ClaseLista(this);
  }

  append(...hijos) {
    for (const h of hijos) { h.parentNode = this; this.children.push(h); }
    return this;
  }

  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter(c => c !== this);
    this.parentNode = null;
  }

  setAttribute(n, v) { this.atributos[n] = String(v); }
  getAttribute(n) { return this.atributos[n] ?? null; }

  addEventListener(tipo, fn) {
    (this.oyentes[tipo] ||= []).push(fn);
  }

  removeEventListener(tipo, fn) {
    this.oyentes[tipo] = (this.oyentes[tipo] || []).filter(f => f !== fn);
  }

  // Recorre este elemento y todos sus descendientes.
  todos() {
    return [this, ...this.children.flatMap(c => c.todos())];
  }

  coincide(selector) {
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    return this.tagName === selector.toUpperCase();
  }

  querySelector(sel) { return this.todos().slice(1).find(e => e.coincide(sel)) ?? null; }
  querySelectorAll(sel) { return this.todos().slice(1).filter(e => e.coincide(sel)); }

  // Dispara el evento y lo hace BURBUJEAR hacia arriba, como un navegador.
  dispatchEvent(datos) {
    const evento = {
      type: datos.type,
      target: this,
      currentTarget: this,
      defaultPrevented: false,
      propagacionCortada: false,
      preventDefault() { this.defaultPrevented = true; },
      stopPropagation() { this.propagacionCortada = true; },
      ...datos,
    };
    let nodo = this;
    while (nodo) {
      evento.currentTarget = nodo;
      for (const fn of nodo.oyentes[evento.type] || []) fn(evento);
      if (evento.propagacionCortada) break;
      nodo = nodo.parentNode;
    }
    return !evento.defaultPrevented;
  }

  click() { return this.dispatchEvent({ type: 'click' }); }
}

function crearDocumento() {
  const doc = new Elemento('#document');
  doc.createElement = (tag) => new Elemento(tag);
  doc.getElementById = (id) => doc.querySelector(`#${id}`);
  doc.body = new Elemento('body');
  doc.append(doc.body);
  return doc;
}

module.exports = { crearDocumento, Elemento };
