var ce = Object.defineProperty;
var ue = (s, t, e) => t in s ? ce(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var k = (s, t, e) => ue(s, typeof t != "symbol" ? t + "" : t, e);
function f() {
  return f = Object.assign ? Object.assign.bind() : function(s) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (s[i] = e[i]);
    }
    return s;
  }, f.apply(this, arguments);
}
function b(s, t = 9) {
  const e = Math.pow(10, t);
  return Math.round(s * e) / e;
}
const I = (s, t) => {
  const { x: e, y: i } = s, { x: o, y: n } = t, r = o - e, a = n - i;
  return Math.sqrt(a * a + r * r);
};
class A {
  constructor({ name: t, callback: e, unregister: i, register: o }) {
    this.name = void 0, this.callback = void 0, this.registered = !1, this.register = void 0, this.unregister = void 0, this.name = t, this.register = () => {
      this.registered || (this.registered = !0, o(e));
    }, this.unregister = () => {
      this.register && (this.registered = !1, i(e));
    }, this.callback = e;
  }
}
class Jt {
  constructor(t) {
    this._minPixelDragDistance = void 0, this._minPixelDragDistanceDrawing = void 0, this._minPixelDragDistanceSelecting = void 0, this._lastDrawEvent = void 0, this._coordinatePrecision = void 0, this._heldKeys = /* @__PURE__ */ new Set(), this._listeners = [], this._dragState = "not-dragging", this._currentModeCallbacks = void 0, this._minPixelDragDistance = typeof t.minPixelDragDistance == "number" ? t.minPixelDragDistance : 1, this._minPixelDragDistanceSelecting = typeof t.minPixelDragDistanceSelecting == "number" ? t.minPixelDragDistanceSelecting : 1, this._minPixelDragDistanceDrawing = typeof t.minPixelDragDistanceDrawing == "number" ? t.minPixelDragDistanceDrawing : 8, this._coordinatePrecision = typeof t.coordinatePrecision == "number" ? t.coordinatePrecision : 9;
  }
  getButton(t) {
    return t.button === -1 ? "neither" : t.button === 0 ? "left" : t.button === 1 ? "middle" : t.button === 2 ? "right" : "neither";
  }
  getMapElementXYPosition(t) {
    const e = this.getMapEventElement(), { left: i, top: o } = e.getBoundingClientRect();
    return { containerX: t.clientX - i, containerY: t.clientY - o };
  }
  getDrawEventFromEvent(t) {
    const e = this.getLngLatFromEvent(t);
    if (!e) return null;
    const { lng: i, lat: o } = e, { containerX: n, containerY: r } = this.getMapElementXYPosition(t), a = this.getButton(t), l = Array.from(this._heldKeys);
    return { lng: b(i, this._coordinatePrecision), lat: b(o, this._coordinatePrecision), containerX: n, containerY: r, button: a, heldKeys: l };
  }
  register(t) {
    this._currentModeCallbacks = t, this._listeners = this.getAdapterListeners(), this._listeners.forEach((e) => {
      e.register();
    });
  }
  getCoordinatePrecision() {
    return this._coordinatePrecision;
  }
  getAdapterListeners() {
    return [new A({ name: "pointerdown", callback: (t) => {
      if (!this._currentModeCallbacks || !t.isPrimary) return;
      const e = this.getDrawEventFromEvent(t);
      e && (this._dragState = "pre-dragging", this._lastDrawEvent = e);
    }, register: (t) => {
      this.getMapEventElement().addEventListener("pointerdown", t);
    }, unregister: (t) => {
      this.getMapEventElement().removeEventListener("pointerdown", t);
    } }), new A({ name: "pointermove", callback: (t) => {
      if (!this._currentModeCallbacks || !t.isPrimary) return;
      t.preventDefault();
      const e = this.getDrawEventFromEvent(t);
      if (e) if (this._dragState === "not-dragging") this._currentModeCallbacks.onMouseMove(e), this._lastDrawEvent = e;
      else if (this._dragState === "pre-dragging") {
        if (!this._lastDrawEvent) return;
        const i = { x: this._lastDrawEvent.containerX, y: this._lastDrawEvent.containerY }, o = { x: e.containerX, y: e.containerY }, n = this._currentModeCallbacks.getState(), r = I(i, o);
        let a = !1;
        if (a = n === "drawing" ? r < this._minPixelDragDistanceDrawing : n === "selecting" ? r < this._minPixelDragDistanceSelecting : r < this._minPixelDragDistance, a) return;
        this._dragState = "dragging", this._currentModeCallbacks.onDragStart(e, (l) => {
          this.setDraggability.bind(this)(l);
        });
      } else this._dragState === "dragging" && this._currentModeCallbacks.onDrag(e, (i) => {
        this.setDraggability.bind(this)(i);
      });
    }, register: (t) => {
      this.getMapEventElement().addEventListener("pointermove", t);
    }, unregister: (t) => {
      this.getMapEventElement().removeEventListener("pointermove", t);
    } }), new A({ name: "contextmenu", callback: (t) => {
      this._currentModeCallbacks && t.preventDefault();
    }, register: (t) => {
      this.getMapEventElement().addEventListener("contextmenu", t);
    }, unregister: (t) => {
      this.getMapEventElement().removeEventListener("contextmenu", t);
    } }), new A({ name: "pointerup", callback: (t) => {
      if (!this._currentModeCallbacks || t.target !== this.getMapEventElement() || !t.isPrimary) return;
      const e = this.getDrawEventFromEvent(t);
      e && (this._dragState === "dragging" ? this._currentModeCallbacks.onDragEnd(e, (i) => {
        this.setDraggability.bind(this)(i);
      }) : this._dragState !== "not-dragging" && this._dragState !== "pre-dragging" || this._currentModeCallbacks.onClick(e), this._dragState = "not-dragging", this.setDraggability(!0));
    }, register: (t) => {
      this.getMapEventElement().addEventListener("pointerup", t);
    }, unregister: (t) => {
      this.getMapEventElement().removeEventListener("pointerup", t);
    } }), new A({ name: "keyup", callback: (t) => {
      this._currentModeCallbacks && (this._heldKeys.delete(t.key), this._currentModeCallbacks.onKeyUp({ key: t.key, heldKeys: Array.from(this._heldKeys), preventDefault: () => t.preventDefault() }));
    }, register: (t) => {
      this.getMapEventElement().addEventListener("keyup", t);
    }, unregister: (t) => {
      this.getMapEventElement().removeEventListener("keyup", t);
    } }), new A({ name: "keydown", callback: (t) => {
      this._currentModeCallbacks && (this._heldKeys.add(t.key), this._currentModeCallbacks.onKeyDown({ key: t.key, heldKeys: Array.from(this._heldKeys), preventDefault: () => t.preventDefault() }));
    }, register: (t) => {
      this.getMapEventElement().addEventListener("keydown", t);
    }, unregister: (t) => {
      this.getMapEventElement().removeEventListener("keydown", t);
    } })];
  }
  unregister() {
    this._listeners.forEach((t) => {
      t.unregister();
    }), this.clear();
  }
}
class ge extends Jt {
  constructor(t) {
    super(t), this._nextRender = void 0, this._map = void 0, this._container = void 0, this._rendered = !1, this.changedIds = { deletion: !1, points: !1, linestrings: !1, polygons: !1, styling: !1 }, this._map = t.map, this._container = this._map.getContainer();
  }
  clearLayers() {
    this._rendered && (["point", "linestring", "polygon"].forEach((t) => {
      const e = `td-${t.toLowerCase()}`;
      this._map.removeLayer(e), t === "polygon" && this._map.removeLayer(e + "-outline"), this._map.removeSource(e);
    }), this._rendered = !1, this._nextRender && (cancelAnimationFrame(this._nextRender), this._nextRender = void 0));
  }
  _addGeoJSONSource(t, e) {
    this._map.addSource(t, { type: "geojson", data: { type: "FeatureCollection", features: e }, tolerance: 0 });
  }
  _addFillLayer(t) {
    return this._map.addLayer({ id: t, source: t, type: "fill", paint: { "fill-color": ["get", "polygonFillColor"], "fill-opacity": ["get", "polygonFillOpacity"] } });
  }
  _addFillOutlineLayer(t, e) {
    const i = this._map.addLayer({ id: t + "-outline", source: t, type: "line", paint: { "line-width": ["get", "polygonOutlineWidth"], "line-color": ["get", "polygonOutlineColor"] } });
    return e && this._map.moveLayer(t, e), i;
  }
  _addLineLayer(t, e) {
    const i = this._map.addLayer({ id: t, source: t, type: "line", paint: { "line-width": ["get", "lineStringWidth"], "line-color": ["get", "lineStringColor"] } });
    return e && this._map.moveLayer(t, e), i;
  }
  _addPointLayer(t, e) {
    const i = this._map.addLayer({ id: t, source: t, type: "circle", paint: { "circle-stroke-color": ["get", "pointOutlineColor"], "circle-stroke-width": ["get", "pointOutlineWidth"], "circle-radius": ["get", "pointWidth"], "circle-color": ["get", "pointColor"] } });
    return e && this._map.moveLayer(t, e), i;
  }
  _addLayer(t, e, i) {
    e === "Point" && this._addPointLayer(t, i), e === "LineString" && this._addLineLayer(t, i), e === "Polygon" && (this._addFillLayer(t), this._addFillOutlineLayer(t, i));
  }
  _addGeoJSONLayer(t, e) {
    const i = `td-${t.toLowerCase()}`;
    return this._addGeoJSONSource(i, e), this._addLayer(i, t), i;
  }
  _setGeoJSONLayerData(t, e) {
    const i = `td-${t.toLowerCase()}`;
    return this._map.getSource(i).setData({ type: "FeatureCollection", features: e }), i;
  }
  getEmptyGeometries() {
    return { points: [], linestrings: [], polygons: [] };
  }
  updateChangedIds(t) {
    [...t.updated, ...t.created].forEach((e) => {
      e.geometry.type === "Point" ? this.changedIds.points = !0 : e.geometry.type === "LineString" ? this.changedIds.linestrings = !0 : e.geometry.type === "Polygon" && (this.changedIds.polygons = !0);
    }), t.deletedIds.length > 0 && (this.changedIds.deletion = !0), t.created.length === 0 && t.updated.length === 0 && t.deletedIds.length === 0 && (this.changedIds.styling = !0);
  }
  getLngLatFromEvent(t) {
    const { left: e, top: i } = this._container.getBoundingClientRect();
    return this.unproject(t.clientX - e, t.clientY - i);
  }
  getMapEventElement() {
    return this._map.getCanvas();
  }
  setDraggability(t) {
    t ? (this._map.dragRotate.enable(), this._map.dragPan.enable()) : (this._map.dragRotate.disable(), this._map.dragPan.disable());
  }
  project(t, e) {
    const { x: i, y: o } = this._map.project({ lng: t, lat: e });
    return { x: i, y: o };
  }
  unproject(t, e) {
    const { lng: i, lat: o } = this._map.unproject({ x: t, y: e });
    return { lng: i, lat: o };
  }
  setCursor(t) {
    const e = this._map.getCanvas();
    t === "unset" ? e.style.removeProperty("cursor") : e.style.cursor = t;
  }
  setDoubleClickToZoom(t) {
    t ? this._map.doubleClickZoom.enable() : this._map.doubleClickZoom.disable();
  }
  render(t, e) {
    this.updateChangedIds(t), this._nextRender && cancelAnimationFrame(this._nextRender), this._nextRender = requestAnimationFrame(() => {
      const i = [...t.created, ...t.updated, ...t.unchanged], o = this.getEmptyGeometries();
      for (let l = 0; l < i.length; l++) {
        const d = i[l];
        Object.keys(e).forEach((h) => {
          const { properties: c } = d;
          if (c.mode !== h) return;
          const u = e[h](d);
          d.geometry.type === "Point" ? (c.pointColor = u.pointColor, c.pointOutlineColor = u.pointOutlineColor, c.pointOutlineWidth = u.pointOutlineWidth, c.pointWidth = u.pointWidth, o.points.push(d)) : d.geometry.type === "LineString" ? (c.lineStringColor = u.lineStringColor, c.lineStringWidth = u.lineStringWidth, o.linestrings.push(d)) : d.geometry.type === "Polygon" && (c.polygonFillColor = u.polygonFillColor, c.polygonFillOpacity = u.polygonFillOpacity, c.polygonOutlineColor = u.polygonOutlineColor, c.polygonOutlineWidth = u.polygonOutlineWidth, o.polygons.push(d));
        });
      }
      const { points: n, linestrings: r, polygons: a } = o;
      if (this._rendered) {
        const l = this.changedIds.deletion || this.changedIds.styling, d = l || this.changedIds.linestrings, h = l || this.changedIds.polygons;
        let c;
        (l || this.changedIds.points) && (c = this._setGeoJSONLayerData("Point", n)), d && this._setGeoJSONLayerData("LineString", r), h && this._setGeoJSONLayerData("Polygon", a), c && this._map.moveLayer(c);
      } else {
        const l = this._addGeoJSONLayer("Point", n);
        this._addGeoJSONLayer("LineString", r), this._addGeoJSONLayer("Polygon", a), this._rendered = !0, l && this._map.moveLayer(l);
      }
      this.changedIds = { points: !1, linestrings: !1, polygons: !1, deletion: !1, styling: !1 };
    });
  }
  clear() {
    this._currentModeCallbacks && (this._currentModeCallbacks.onClear(), this.clearLayers());
  }
  getCoordinatePrecision() {
    return super.getCoordinatePrecision();
  }
  unregister() {
    return super.unregister();
  }
  register(t) {
    super.register(t), this._currentModeCallbacks && this._currentModeCallbacks.onReady && this._currentModeCallbacks.onReady();
  }
}
class pe extends Jt {
  constructor(t) {
    super(t), this.mapboxglAdapter = void 0, this.mapboxglAdapter = new ge(t);
  }
  register(t) {
    this.mapboxglAdapter.register(t);
  }
  unregister() {
    this.mapboxglAdapter.unregister();
  }
  getCoordinatePrecision() {
    return this.mapboxglAdapter.getCoordinatePrecision();
  }
  getLngLatFromEvent(t) {
    return this.mapboxglAdapter.getLngLatFromEvent(t);
  }
  getMapEventElement() {
    return this.mapboxglAdapter.getMapEventElement();
  }
  setDraggability(t) {
    this.mapboxglAdapter.setDraggability(t);
  }
  project(t, e) {
    return this.mapboxglAdapter.project(t, e);
  }
  unproject(t, e) {
    return this.mapboxglAdapter.unproject(t, e);
  }
  setCursor(t) {
    this.mapboxglAdapter.setCursor(t);
  }
  setDoubleClickToZoom(t) {
    this.mapboxglAdapter.setDoubleClickToZoom(t);
  }
  render(t, e) {
    this.mapboxglAdapter.render(t, e);
  }
  clear() {
    this.mapboxglAdapter.clear();
  }
}
let ye = 0;
const L = typeof navigator < "u" && navigator.userAgent !== void 0 ? navigator.userAgent.toLowerCase() : "";
L.includes("firefox"), L.includes("safari") && !L.includes("chrom") && (L.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(L)), L.includes("webkit") && L.includes("edge"), L.includes("macintosh");
typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope;
(function() {
  let s = !1;
  try {
    const t = Object.defineProperty({}, "passive", { get: function() {
      s = !0;
    } });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
})();
var me = class {
  constructor() {
    this.disposed = !1;
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.disposeInternal());
  }
  disposeInternal() {
  }
}, qt = class {
  constructor(s) {
    this.type = s, this.target = null;
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
  stopPropagation() {
    this.propagationStopped = !0;
  }
};
function St() {
}
function Zt(s) {
  for (const t in s) delete s[t];
}
var fe = class extends me {
  constructor(s) {
    super(), this.eventTarget_ = s, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
  }
  addEventListener(s, t) {
    if (!s || !t) return;
    const e = this.listeners_ || (this.listeners_ = {}), i = e[s] || (e[s] = []);
    i.includes(t) || i.push(t);
  }
  dispatchEvent(s) {
    const t = typeof s == "string", e = t ? s : s.type, i = this.listeners_ && this.listeners_[e];
    if (!i) return;
    const o = t ? new qt(s) : s;
    o.target || (o.target = this.eventTarget_ || this);
    const n = this.dispatching_ || (this.dispatching_ = {}), r = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    let a;
    e in n || (n[e] = 0, r[e] = 0), ++n[e];
    for (let l = 0, d = i.length; l < d; ++l) if (a = "handleEvent" in i[l] ? i[l].handleEvent(o) : i[l].call(this, o), a === !1 || o.propagationStopped) {
      a = !1;
      break;
    }
    if (--n[e] == 0) {
      let l = r[e];
      for (delete r[e]; l--; ) this.removeEventListener(e, St);
      delete n[e];
    }
    return a;
  }
  disposeInternal() {
    this.listeners_ && Zt(this.listeners_);
  }
  getListeners(s) {
    return this.listeners_ && this.listeners_[s] || void 0;
  }
  hasListener(s) {
    return !!this.listeners_ && (s ? s in this.listeners_ : Object.keys(this.listeners_).length > 0);
  }
  removeEventListener(s, t) {
    if (!this.listeners_) return;
    const e = this.listeners_[s];
    if (!e) return;
    const i = e.indexOf(t);
    i !== -1 && (this.pendingRemovals_ && s in this.pendingRemovals_ ? (e[i] = St, ++this.pendingRemovals_[s]) : (e.splice(i, 1), e.length === 0 && delete this.listeners_[s]));
  }
}, ve = "change";
function xt(s, t, e, i, o) {
  if (o) {
    const r = e;
    e = function() {
      s.removeEventListener(t, e), r.apply(this, arguments);
    };
  }
  const n = { target: s, type: t, listener: e };
  return s.addEventListener(t, e), n;
}
function wt(s, t, e, i) {
  return xt(s, t, e, i, !0);
}
function It(s) {
  s && s.target && (s.target.removeEventListener(s.type, s.listener), Zt(s));
}
var Ce = class extends fe {
  constructor() {
    super(), this.on = this.onInternal, this.once = this.onceInternal, this.un = this.unInternal, this.revision_ = 0;
  }
  changed() {
    ++this.revision_, this.dispatchEvent(ve);
  }
  getRevision() {
    return this.revision_;
  }
  onInternal(s, t) {
    if (Array.isArray(s)) {
      const e = s.length, i = new Array(e);
      for (let o = 0; o < e; ++o) i[o] = xt(this, s[o], t);
      return i;
    }
    return xt(this, s, t);
  }
  onceInternal(s, t) {
    let e;
    if (Array.isArray(s)) {
      const i = s.length;
      e = new Array(i);
      for (let o = 0; o < i; ++o) e[o] = wt(this, s[o], t);
    } else e = wt(this, s, t);
    return t.ol_key = e, e;
  }
  unInternal(s, t) {
    const e = t.ol_key;
    if (e) (function(i) {
      if (Array.isArray(i)) for (let o = 0, n = i.length; o < n; ++o) It(i[o]);
      else It(i);
    })(e);
    else if (Array.isArray(s)) for (let i = 0, o = s.length; i < o; ++i) this.removeEventListener(s[i], t);
    else this.removeEventListener(s, t);
  }
};
class Dt extends qt {
  constructor(t, e, i) {
    super(t), this.key = e, this.oldValue = i;
  }
}
new class extends Ce {
  constructor(s) {
    super(), this.ol_uid || (this.ol_uid = String(++ye)), this.values_ = null, s !== void 0 && this.setProperties(s);
  }
  get(s) {
    let t;
    return this.values_ && this.values_.hasOwnProperty(s) && (t = this.values_[s]), t;
  }
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  getPropertiesInternal() {
    return this.values_;
  }
  hasProperties() {
    return !!this.values_;
  }
  notify(s, t) {
    let e;
    e = `change:${s}`, this.hasListener(e) && this.dispatchEvent(new Dt(e, s, t)), e = "propertychange", this.hasListener(e) && this.dispatchEvent(new Dt(e, s, t));
  }
  addChangeListener(s, t) {
    this.addEventListener(`change:${s}`, t);
  }
  removeChangeListener(s, t) {
    this.removeEventListener(`change:${s}`, t);
  }
  set(s, t, e) {
    const i = this.values_ || (this.values_ = {});
    if (e) i[s] = t;
    else {
      const o = i[s];
      i[s] = t, o !== t && this.notify(s, o);
    }
  }
  setProperties(s, t) {
    for (const e in s) this.set(e, s[e], t);
  }
  applyProperties(s) {
    s.values_ && Object.assign(this.values_ || (this.values_ = {}), s.values_);
  }
  unset(s, t) {
    if (this.values_ && s in this.values_) {
      const e = this.values_[s];
      delete this.values_[s], function(i) {
        let o;
        for (o in i) return !1;
        return !o;
      }(this.values_) && (this.values_ = null), t || this.notify(s, e);
    }
  }
}();
const xe = { radians: 6370997 / (2 * Math.PI), degrees: 2 * Math.PI * 6370997 / 360, ft: 0.3048, m: 1, "us-ft": 1200 / 3937 };
var Qt = class {
  constructor(s) {
    this.code_ = s.code, this.units_ = s.units, this.extent_ = s.extent !== void 0 ? s.extent : null, this.worldExtent_ = s.worldExtent !== void 0 ? s.worldExtent : null, this.axisOrientation_ = s.axisOrientation !== void 0 ? s.axisOrientation : "enu", this.global_ = s.global !== void 0 && s.global, this.canWrapX_ = !(!this.global_ || !this.extent_), this.getPointResolutionFunc_ = s.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = s.metersPerUnit;
  }
  canWrapX() {
    return this.canWrapX_;
  }
  getCode() {
    return this.code_;
  }
  getExtent() {
    return this.extent_;
  }
  getUnits() {
    return this.units_;
  }
  getMetersPerUnit() {
    return this.metersPerUnit_ || xe[this.units_];
  }
  getWorldExtent() {
    return this.worldExtent_;
  }
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  isGlobal() {
    return this.global_;
  }
  setGlobal(s) {
    this.global_ = s, this.canWrapX_ = !(!s || !this.extent_);
  }
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  setDefaultTileGrid(s) {
    this.defaultTileGrid_ = s;
  }
  setExtent(s) {
    this.extent_ = s, this.canWrapX_ = !(!this.global_ || !s);
  }
  setWorldExtent(s) {
    this.worldExtent_ = s;
  }
  setGetPointResolution(s) {
    this.getPointResolutionFunc_ = s;
  }
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
};
const J = 6378137, X = Math.PI * J, Pe = [-X, -X, X, X], Me = [-180, -85, 180, 85], it = J * Math.log(Math.tan(Math.PI / 2));
class V extends Qt {
  constructor(t) {
    super({ code: t, units: "m", extent: Pe, global: !0, worldExtent: Me, getPointResolution: function(e, i) {
      return e / Math.cosh(i[1] / J);
    } });
  }
}
const Ft = [new V("EPSG:3857"), new V("EPSG:102100"), new V("EPSG:102113"), new V("EPSG:900913"), new V("http://www.opengis.net/def/crs/EPSG/0/3857"), new V("http://www.opengis.net/gml/srs/epsg.xml#3857")], Ot = [-180, -90, 180, 90], _e = 6378137 * Math.PI / 180;
class N extends Qt {
  constructor(t, e) {
    super({ code: t, units: "degrees", extent: Ot, axisOrientation: e, global: !0, metersPerUnit: _e, worldExtent: Ot });
  }
}
const kt = [new N("CRS:84"), new N("EPSG:4326", "neu"), new N("urn:ogc:def:crs:OGC:1.3:CRS84"), new N("urn:ogc:def:crs:OGC:2:84"), new N("http://www.opengis.net/def/crs/OGC/1.3/CRS84"), new N("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"), new N("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")];
let mt = {};
function at(s, t, e) {
  const i = s.getCode(), o = t.getCode();
  i in mt || (mt[i] = {}), mt[i][o] = e;
}
function te(s, t) {
  if (t !== void 0) for (let e = 0, i = s.length; e < i; ++e) t[e] = s[e];
  else t = s.slice();
  return t;
}
function be(s) {
  s.getCode(), at(s, s, te);
}
function jt(s) {
  (function(t) {
    t.forEach(be);
  })(s), s.forEach(function(t) {
    s.forEach(function(e) {
      t !== e && at(t, e, te);
    });
  });
}
var Lt, Wt, Bt, C;
jt(Ft), jt(kt), Lt = Ft, Wt = function(s, t, e) {
  const i = s.length;
  e = e > 1 ? e : 2, t === void 0 && (t = e > 2 ? s.slice() : new Array(i));
  for (let o = 0; o < i; o += e) {
    t[o] = X * s[o] / 180;
    let n = J * Math.log(Math.tan(Math.PI * (+s[o + 1] + 90) / 360));
    n > it ? n = it : n < -it && (n = -it), t[o + 1] = n;
  }
  return t;
}, Bt = function(s, t, e) {
  const i = s.length;
  e = e > 1 ? e : 2, t === void 0 && (t = e > 2 ? s.slice() : new Array(i));
  for (let o = 0; o < i; o += e) t[o] = 180 * s[o] / X, t[o + 1] = 360 * Math.atan(Math.exp(s[o + 1] / J)) / Math.PI - 90;
  return t;
}, kt.forEach(function(s) {
  Lt.forEach(function(t) {
    at(s, t, Wt), at(t, s, Bt);
  });
});
(function(s) {
  s.Commit = "commit", s.Provisional = "provisional", s.Finish = "finish";
})(C || (C = {}));
const Pt = "selected", H = "midPoint", Nt = "closingPoint";
function ft(s) {
  return !!(s && typeof s == "object" && s !== null && !Array.isArray(s));
}
function Gt(s) {
  if (!function(t) {
    return typeof t == "number" && !isNaN(new Date(t).valueOf());
  }(s)) throw new Error("updatedAt and createdAt are not valid timestamps");
  return !0;
}
var G;
(function(s) {
  s.Drawing = "drawing", s.Select = "select", s.Static = "static", s.Render = "render";
})(G || (G = {}));
class O {
  get state() {
    return this._state;
  }
  set state(t) {
    throw new Error("Please use the modes lifecycle methods");
  }
  get styles() {
    return this._styles;
  }
  set styles(t) {
    if (typeof t != "object") throw new Error("Styling must be an object");
    this.onStyleChange([], "styling"), this._styles = t;
  }
  registerBehaviors(t) {
  }
  constructor(t) {
    this._state = void 0, this._styles = void 0, this.behaviors = [], this.validate = void 0, this.pointerDistance = void 0, this.coordinatePrecision = void 0, this.onStyleChange = void 0, this.store = void 0, this.setDoubleClickToZoom = void 0, this.unproject = void 0, this.project = void 0, this.setCursor = void 0, this.projection = void 0, this.type = G.Drawing, this.mode = "base", this._state = "unregistered", this._styles = t && t.styles ? f({}, t.styles) : {}, this.pointerDistance = t && t.pointerDistance || 40, this.validate = t && t.validation, this.projection = t && t.projection || "web-mercator";
  }
  setDrawing() {
    if (this._state !== "started") throw new Error("Mode must be unregistered or stopped to start");
    this._state = "drawing";
  }
  setStarted() {
    if (this._state !== "stopped" && this._state !== "registered" && this._state !== "drawing" && this._state !== "selecting") throw new Error("Mode must be unregistered or stopped to start");
    this._state = "started", this.setDoubleClickToZoom(!1);
  }
  setStopped() {
    if (this._state !== "started") throw new Error("Mode must be started to be stopped");
    this._state = "stopped", this.setDoubleClickToZoom(!0);
  }
  register(t) {
    if (this._state !== "unregistered") throw new Error("Can not register unless mode is unregistered");
    this._state = "registered", this.store = t.store, this.store.registerOnChange(t.onChange), this.setDoubleClickToZoom = t.setDoubleClickToZoom, this.project = t.project, this.unproject = t.unproject, this.onSelect = t.onSelect, this.onDeselect = t.onDeselect, this.setCursor = t.setCursor, this.onStyleChange = t.onChange, this.onFinish = t.onFinish, this.coordinatePrecision = t.coordinatePrecision, this.registerBehaviors({ mode: t.mode, store: this.store, project: this.project, unproject: this.unproject, pointerDistance: this.pointerDistance, coordinatePrecision: t.coordinatePrecision, projection: this.projection });
  }
  validateFeature(t) {
    if (this._state === "unregistered") throw new Error("Mode must be registered");
    const e = function(i, o) {
      let n;
      if (ft(i)) if (i.id == null) n = "Feature has no id";
      else if (typeof i.id != "string" && typeof i.id != "number") n = "Feature must be string or number as per GeoJSON spec";
      else if (o(i.id)) if (ft(i.geometry)) if (ft(i.properties)) if (typeof i.geometry.type == "string" && ["Polygon", "LineString", "Point"].includes(i.geometry.type)) if (Array.isArray(i.geometry.coordinates)) {
        if (!i.properties.mode || typeof i.properties.mode != "string") throw new Error("Feature does not have a valid mode property");
      } else n = "Feature coordinates is not an array";
      else n = "Feature is not Point, LineString or Polygon";
      else n = "Feature has no properties";
      else n = "Feature has no geometry";
      else n = "Feature must match the id strategy (default is UUID4)";
      else n = "Feature is not object";
      if (n) throw new Error(n);
      return !0;
    }(t, this.store.idStrategy.isValidId);
    return this.validate ? this.validate(t, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Provisional }) : e;
  }
  onFinish(t, e) {
  }
  onDeselect(t) {
  }
  onSelect(t) {
  }
  onKeyDown(t) {
  }
  onKeyUp(t) {
  }
  onMouseMove(t) {
  }
  onClick(t) {
  }
  onDragStart(t, e) {
  }
  onDrag(t, e) {
  }
  onDragEnd(t, e) {
  }
  getHexColorStylingValue(t, e, i) {
    return this.getStylingValue(t, e, i);
  }
  getNumericStylingValue(t, e, i) {
    return this.getStylingValue(t, e, i);
  }
  getStylingValue(t, e, i) {
    return t === void 0 ? e : typeof t == "function" ? t(i) : t;
  }
}
class Ee extends O {
  constructor(...t) {
    super(...t), this.type = G.Select;
  }
}
function W(s, t) {
  const e = (d) => d * Math.PI / 180, i = e(s[1]), o = e(s[0]), n = e(t[1]), r = n - i, a = e(t[0]) - o, l = Math.sin(r / 2) * Math.sin(r / 2) + Math.cos(i) * Math.cos(n) * Math.sin(a / 2) * Math.sin(a / 2);
  return 2 * Math.atan2(Math.sqrt(l), Math.sqrt(1 - l)) * 6371e3 / 1e3;
}
const Mt = 63710088e-1;
function w(s) {
  return s % 360 * Math.PI / 180;
}
function ee(s) {
  return s / (Mt / 1e3);
}
function T(s) {
  return s % (2 * Math.PI) * 180 / Math.PI;
}
const At = 57.29577951308232, Vt = 0.017453292519943295, lt = 6378137, P = (s, t) => ({ x: s === 0 ? 0 : s * Vt * lt, y: t === 0 ? 0 : Math.log(Math.tan(Math.PI / 4 + t * Vt / 2)) * lt }), j = (s, t) => ({ lng: s === 0 ? 0 : At * (s / lt), lat: t === 0 ? 0 : (2 * Math.atan(Math.exp(t / lt)) - Math.PI / 2) * At });
function Se(s, t, e) {
  const i = w(s[0]), o = w(s[1]), n = w(e), r = ee(t), a = Math.asin(Math.sin(o) * Math.cos(r) + Math.cos(o) * Math.sin(r) * Math.cos(n));
  return [T(i + Math.atan2(Math.sin(n) * Math.sin(r) * Math.cos(o), Math.cos(r) - Math.sin(o) * Math.sin(a))), T(a)];
}
function Rt(s) {
  const { center: t, radiusKilometers: e, coordinatePrecision: i } = s, o = s.steps ? s.steps : 64, n = [];
  for (let r = 0; r < o; r++) {
    const a = Se(t, e, -360 * r / o);
    n.push([b(a[0], i), b(a[1], i)]);
  }
  return n.push(n[0]), { type: "Feature", geometry: { type: "Polygon", coordinates: [n] }, properties: {} };
}
function _t(s) {
  const t = { epsilon: 0 };
  let e;
  if (s.geometry.type === "Polygon") e = s.geometry.coordinates;
  else {
    if (s.geometry.type !== "LineString") throw new Error("Self intersects only accepts Polygons and LineStrings");
    e = [s.geometry.coordinates];
  }
  const i = [];
  for (let r = 0; r < e.length; r++) for (let a = 0; a < e[r].length - 1; a++) for (let l = 0; l < e.length; l++) for (let d = 0; d < e[l].length - 1; d++) n(r, a, l, d);
  return i.length > 0;
  function o(r) {
    return r < 0 - t.epsilon || r > 1 + t.epsilon;
  }
  function n(r, a, l, d) {
    const h = e[r][a], c = e[r][a + 1], u = e[l][d], g = e[l][d + 1], p = function(m, x, M, E) {
      if (ot(m, M) || ot(m, E) || ot(x, M) || ot(E, M)) return null;
      const _ = m[0], S = m[1], F = x[0], B = x[1], Z = M[0], Q = M[1], tt = E[0], et = E[1], yt = (_ - F) * (Q - et) - (S - B) * (Z - tt);
      return yt === 0 ? null : [((_ * B - S * F) * (Z - tt) - (_ - F) * (Z * et - Q * tt)) / yt, ((_ * B - S * F) * (Q - et) - (S - B) * (Z * et - Q * tt)) / yt];
    }(h, c, u, g);
    if (p === null) return;
    let y, v;
    y = c[0] !== h[0] ? (p[0] - h[0]) / (c[0] - h[0]) : (p[1] - h[1]) / (c[1] - h[1]), v = g[0] !== u[0] ? (p[0] - u[0]) / (g[0] - u[0]) : (p[1] - u[1]) / (g[1] - u[1]), o(y) || o(v) || (p.toString(), i.push(p));
  }
}
function ot(s, t) {
  return s[0] === t[0] && s[1] === t[1];
}
function gt(s, t) {
  return s.length === 2 && typeof s[0] == "number" && typeof s[1] == "number" && s[0] !== 1 / 0 && s[1] !== 1 / 0 && (i = s[0]) >= -180 && i <= 180 && (e = s[1]) >= -90 && e <= 90 && Ut(s[0]) <= t && Ut(s[1]) <= t;
  var e, i;
}
function Ut(s) {
  let t = 1, e = 0;
  for (; Math.round(s * t) / t !== s; ) t *= 10, e++;
  return e;
}
function q(s, t) {
  return s.geometry.type === "Polygon" && s.geometry.coordinates.length === 1 && s.geometry.coordinates[0].length >= 4 && s.geometry.coordinates[0].every((o) => gt(o, t)) && (e = s.geometry.coordinates[0][0])[0] === (i = s.geometry.coordinates[0][s.geometry.coordinates[0].length - 1])[0] && e[1] === i[1];
  var e, i;
}
function ie(s, t) {
  return q(s, t) && !_t(s);
}
class we extends O {
  constructor(t) {
    var e;
    super(t), this.mode = "circle", this.center = void 0, this.clickCount = 0, this.currentCircleId = void 0, this.keyEvents = void 0, this.cursors = void 0, this.startingRadiusKilometers = 1e-5;
    const i = { start: "crosshair" };
    if (this.cursors = t && t.cursors ? f({}, i, t.cursors) : i, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { cancel: null, finish: null };
    else {
      const o = { cancel: "Escape", finish: "Enter" };
      this.keyEvents = t && t.keyEvents ? f({}, o, t.keyEvents) : o;
    }
    this.startingRadiusKilometers = (e = t == null ? void 0 : t.startingRadiusKilometers) != null ? e : 1e-5, this.validate = t == null ? void 0 : t.validation;
  }
  close() {
    if (this.currentCircleId === void 0) return;
    const t = this.currentCircleId;
    if (this.validate && t) {
      const e = this.store.getGeometryCopy(t);
      if (!this.validate({ type: "Feature", id: t, geometry: e, properties: {} }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Finish })) return;
    }
    this.center = void 0, this.currentCircleId = void 0, this.clickCount = 0, this.state === "drawing" && this.setStarted(), this.onFinish(t, { mode: this.mode, action: "draw" });
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.start);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onClick(t) {
    if (this.clickCount === 0) {
      this.center = [t.lng, t.lat];
      const e = Rt({ center: this.center, radiusKilometers: this.startingRadiusKilometers, coordinatePrecision: this.coordinatePrecision }), [i] = this.store.create([{ geometry: e.geometry, properties: { mode: this.mode, radiusKilometers: this.startingRadiusKilometers } }]);
      this.currentCircleId = i, this.clickCount++, this.setDrawing();
    } else this.clickCount === 1 && this.center && this.currentCircleId !== void 0 && this.updateCircle(t), this.close();
  }
  onMouseMove(t) {
    this.updateCircle(t);
  }
  onKeyDown() {
  }
  onKeyUp(t) {
    t.key === this.keyEvents.cancel ? this.cleanUp() : t.key === this.keyEvents.finish && this.close();
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  cleanUp() {
    const t = this.currentCircleId;
    this.center = void 0, this.currentCircleId = void 0, this.clickCount = 0, this.state === "drawing" && this.setStarted();
    try {
      t !== void 0 && this.store.delete([t]);
    } catch {
    }
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    return t.type === "Feature" && t.geometry.type === "Polygon" && t.properties.mode === this.mode && (e.polygonFillColor = this.getHexColorStylingValue(this.styles.fillColor, e.polygonFillColor, t), e.polygonOutlineColor = this.getHexColorStylingValue(this.styles.outlineColor, e.polygonOutlineColor, t), e.polygonOutlineWidth = this.getNumericStylingValue(this.styles.outlineWidth, e.polygonOutlineWidth, t), e.polygonFillOpacity = this.getNumericStylingValue(this.styles.fillOpacity, e.polygonFillOpacity, t), e.zIndex = 10), e;
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.properties.mode === this.mode && ie(t, this.coordinatePrecision);
  }
  updateCircle(t) {
    if (this.clickCount === 1 && this.center && this.currentCircleId) {
      const e = W(this.center, [t.lng, t.lat]);
      let i;
      if (this.projection === "web-mercator") {
        const o = function(n, r) {
          const a = 1e3 * W(n, r);
          if (a === 0) return 1;
          const { x: l, y: d } = P(n[0], n[1]), { x: h, y: c } = P(r[0], r[1]);
          return Math.sqrt(Math.pow(h - l, 2) + Math.pow(c - d, 2)) / a;
        }(this.center, [t.lng, t.lat]);
        i = function(n) {
          const { center: r, radiusKilometers: a, coordinatePrecision: l } = n, d = n.steps ? n.steps : 64, h = 1e3 * a, [c, u] = r, { x: g, y: p } = P(c, u), y = [];
          for (let v = 0; v < d; v++) {
            const m = 360 * v / d * Math.PI / 180, x = h * Math.cos(m), M = h * Math.sin(m), [E, _] = [g + x, p + M], { lng: S, lat: F } = j(E, _);
            y.push([b(S, l), b(F, l)]);
          }
          return y.push(y[0]), { type: "Feature", geometry: { type: "Polygon", coordinates: [y] }, properties: {} };
        }({ center: this.center, radiusKilometers: e * o, coordinatePrecision: this.coordinatePrecision });
      } else {
        if (this.projection !== "globe") throw new Error("Invalid projection");
        i = Rt({ center: this.center, radiusKilometers: e, coordinatePrecision: this.coordinatePrecision });
      }
      if (this.validate && !this.validate({ type: "Feature", id: this.currentCircleId, geometry: i.geometry, properties: { radiusKilometers: e } }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Provisional })) return;
      this.store.updateGeometry([{ id: this.currentCircleId, geometry: i.geometry }]), this.store.updateProperty([{ id: this.currentCircleId, property: "radiusKilometers", value: e }]);
    }
  }
}
class Ie extends O {
  constructor(t) {
    super(t), this.mode = "freehand", this.startingClick = !1, this.currentId = void 0, this.closingPointId = void 0, this.minDistance = void 0, this.keyEvents = void 0, this.cursors = void 0, this.preventPointsNearClose = void 0;
    const e = { start: "crosshair", close: "pointer" };
    if (this.cursors = t && t.cursors ? f({}, e, t.cursors) : e, this.preventPointsNearClose = t && t.preventPointsNearClose || !0, this.minDistance = t && t.minDistance || 20, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { cancel: null, finish: null };
    else {
      const i = { cancel: "Escape", finish: "Enter" };
      this.keyEvents = t && t.keyEvents ? f({}, i, t.keyEvents) : i;
    }
    this.validate = t == null ? void 0 : t.validation;
  }
  close() {
    if (this.currentId === void 0) return;
    const t = this.currentId;
    if (this.validate && t) {
      const e = this.store.getGeometryCopy(t);
      if (!this.validate({ type: "Feature", id: t, geometry: e, properties: {} }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Finish })) return;
    }
    this.closingPointId && this.store.delete([this.closingPointId]), this.startingClick = !1, this.currentId = void 0, this.closingPointId = void 0, this.state === "drawing" && this.setStarted(), this.onFinish(t, { mode: this.mode, action: "draw" });
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.start);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onMouseMove(t) {
    if (this.currentId === void 0 || this.startingClick === !1) return;
    const e = this.store.getGeometryCopy(this.currentId), i = e.coordinates[0].length - 2, [o, n] = e.coordinates[0][i], { x: r, y: a } = this.project(o, n), l = I({ x: r, y: a }, { x: t.containerX, y: t.containerY }), [d, h] = e.coordinates[0][0], { x: c, y: u } = this.project(d, h);
    if (I({ x: c, y: u }, { x: t.containerX, y: t.containerY }) < this.pointerDistance) {
      if (this.setCursor(this.cursors.close), this.preventPointsNearClose) return;
    } else this.setCursor(this.cursors.start);
    if (l < this.minDistance) return;
    e.coordinates[0].pop();
    const g = { type: "Polygon", coordinates: [[...e.coordinates[0], [t.lng, t.lat], e.coordinates[0][0]]] };
    this.validate && !this.validate({ type: "Feature", id: this.currentId, geometry: g, properties: {} }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Provisional }) || this.store.updateGeometry([{ id: this.currentId, geometry: g }]);
  }
  onClick(t) {
    if (this.startingClick === !1) {
      const [e, i] = this.store.create([{ geometry: { type: "Polygon", coordinates: [[[t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat]]] }, properties: { mode: this.mode } }, { geometry: { type: "Point", coordinates: [t.lng, t.lat] }, properties: { mode: this.mode } }]);
      return this.currentId = e, this.closingPointId = i, this.startingClick = !0, void this.setDrawing();
    }
    this.close();
  }
  onKeyDown() {
  }
  onKeyUp(t) {
    t.key === this.keyEvents.cancel ? this.cleanUp() : t.key === this.keyEvents.finish && this.close();
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  cleanUp() {
    const t = this.currentId, e = this.closingPointId;
    this.closingPointId = void 0, this.currentId = void 0, this.startingClick = !1, this.state === "drawing" && this.setStarted();
    try {
      t !== void 0 && this.store.delete([t]), e !== void 0 && this.store.delete([e]);
    } catch {
    }
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    return t.type === "Feature" && t.geometry.type === "Polygon" && t.properties.mode === this.mode ? (e.polygonFillColor = this.getHexColorStylingValue(this.styles.fillColor, e.polygonFillColor, t), e.polygonOutlineColor = this.getHexColorStylingValue(this.styles.outlineColor, e.polygonOutlineColor, t), e.polygonOutlineWidth = this.getNumericStylingValue(this.styles.outlineWidth, e.polygonOutlineWidth, t), e.polygonFillOpacity = this.getNumericStylingValue(this.styles.fillOpacity, e.polygonFillOpacity, t), e.zIndex = 10, e) : (t.type === "Feature" && t.geometry.type === "Point" && t.properties.mode === this.mode && (e.pointWidth = this.getNumericStylingValue(this.styles.closingPointWidth, e.pointWidth, t), e.pointColor = this.getHexColorStylingValue(this.styles.closingPointColor, e.pointColor, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.closingPointOutlineColor, e.pointOutlineColor, t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.closingPointOutlineWidth, 2, t), e.zIndex = 40), e);
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.properties.mode === this.mode && q(t, this.coordinatePrecision);
  }
}
class D {
  constructor({ store: t, mode: e, project: i, unproject: o, pointerDistance: n, coordinatePrecision: r, projection: a }) {
    this.store = void 0, this.mode = void 0, this.project = void 0, this.unproject = void 0, this.pointerDistance = void 0, this.coordinatePrecision = void 0, this.projection = void 0, this.store = t, this.mode = e, this.project = i, this.unproject = o, this.pointerDistance = n, this.coordinatePrecision = r, this.projection = a;
  }
}
function oe({ unproject: s, point: t, pointerDistance: e }) {
  const i = e / 2, { x: o, y: n } = t;
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[s(o - i, n - i), s(o + i, n - i), s(o + i, n + i), s(o - i, n + i), s(o - i, n - i)].map((r) => [r.lng, r.lat])] } };
}
class bt extends D {
  constructor(t) {
    super(t);
  }
  create(t) {
    const { containerX: e, containerY: i } = t;
    return oe({ unproject: this.unproject, point: { x: e, y: i }, pointerDistance: this.pointerDistance });
  }
}
class pt extends D {
  constructor(t) {
    super(t);
  }
  measure(t, e) {
    const { x: i, y: o } = this.project(e[0], e[1]);
    return I({ x: i, y: o }, { x: t.containerX, y: t.containerY });
  }
}
class se extends D {
  constructor(t, e, i) {
    super(t), this.config = void 0, this.pixelDistance = void 0, this.clickBoundingBox = void 0, this.getSnappableCoordinateFirstClick = (o) => this.getSnappable(o, (n) => !!(n.properties && n.properties.mode === this.mode)), this.getSnappableCoordinate = (o, n) => this.getSnappable(o, (r) => !!(r.properties && r.properties.mode === this.mode && r.id !== n)), this.config = t, this.pixelDistance = e, this.clickBoundingBox = i;
  }
  getSnappable(t, e) {
    const i = this.clickBoundingBox.create(t), o = this.store.search(i, e), n = { coord: void 0, minDist: 1 / 0 };
    return o.forEach((r) => {
      let a;
      if (r.geometry.type === "Polygon") a = r.geometry.coordinates[0];
      else {
        if (r.geometry.type !== "LineString") return;
        a = r.geometry.coordinates;
      }
      a.forEach((l) => {
        const d = this.pixelDistance.measure(t, l);
        d < n.minDist && d < this.pointerDistance && (n.coord = l, n.minDist = d);
      });
    }), n.coord;
  }
}
function Xt(s, t, e) {
  const i = w(s[0]), o = w(s[1]), n = w(e), r = ee(t), a = Math.asin(Math.sin(o) * Math.cos(r) + Math.cos(o) * Math.sin(r) * Math.cos(n));
  return [T(i + Math.atan2(Math.sin(n) * Math.sin(r) * Math.cos(o), Math.cos(r) - Math.sin(o) * Math.sin(a))), T(a)];
}
function Tt({ x: s, y: t }, e, i) {
  const o = w(i);
  return { x: s + e * Math.cos(o), y: t + e * Math.sin(o) };
}
function Kt(s, t) {
  const e = w(s[0]), i = w(t[0]), o = w(s[1]), n = w(t[1]), r = Math.sin(i - e) * Math.cos(n), a = Math.cos(o) * Math.sin(n) - Math.sin(o) * Math.cos(n) * Math.cos(i - e);
  return T(Math.atan2(r, a));
}
function ht({ x: s, y: t }, { x: e, y: i }) {
  let o = Math.atan2(i - t, e - s);
  return o *= 180 / Math.PI, o > 180 ? o -= 360 : o < -180 && (o += 360), o;
}
function De(s, t, e) {
  const i = [], o = s.length;
  let n, r, a, l = 0;
  for (let h = 0; h < s.length && !(t >= l && h === s.length - 1); h++) {
    if (l > t && i.length === 0) {
      if (n = t - l, !n) return i.push(s[h]), i;
      r = Kt(s[h], s[h - 1]) - 180, a = Xt(s[h], n, r), i.push(a);
    }
    if (l >= e) return n = e - l, n ? (r = Kt(s[h], s[h - 1]) - 180, a = Xt(s[h], n, r), i.push(a), i) : (i.push(s[h]), i);
    if (l >= t && i.push(s[h]), h === s.length - 1) return i;
    l += W(s[h], s[h + 1]);
  }
  if (l < t && s.length === o) throw new Error("Start position is beyond line");
  const d = s[s.length - 1];
  return [d, d];
}
function st(s) {
  return s * (Math.PI / 180);
}
function Yt(s) {
  return s * (180 / Math.PI);
}
class Fe extends D {
  constructor(t) {
    super(t), this.config = void 0, this.config = t;
  }
  generateInsertionCoordinates(t, e, i) {
    const o = [t, e];
    let n = 0;
    for (let d = 0; d < o.length - 1; d++) n += W(o[0], o[1]);
    if (n <= i) return o;
    let r = n / i - 1;
    Number.isInteger(r) || (r = Math.floor(r) + 1);
    const a = [];
    for (let d = 0; d < r; d++) {
      const h = De(o, i * d, i * (d + 1));
      a.push(h);
    }
    const l = [];
    for (let d = 0; d < a.length; d++) l.push(a[d][1]);
    return this.limitCoordinates(l);
  }
  generateInsertionGeodesicCoordinates(t, e, i) {
    const o = W(t, e), n = function(r, a, l) {
      const d = [], h = st(r[1]), c = st(r[0]), u = st(a[1]), g = st(a[0]);
      l += 1;
      const p = 2 * Math.asin(Math.sqrt(Math.sin((u - h) / 2) ** 2 + Math.cos(h) * Math.cos(u) * Math.sin((g - c) / 2) ** 2));
      if (p === 0 || isNaN(p)) return d;
      for (let y = 0; y <= l; y++) {
        const v = y / l, m = Math.sin((1 - v) * p) / Math.sin(p), x = Math.sin(v * p) / Math.sin(p), M = m * Math.cos(h) * Math.cos(c) + x * Math.cos(u) * Math.cos(g), E = m * Math.cos(h) * Math.sin(c) + x * Math.cos(u) * Math.sin(g), _ = m * Math.sin(h) + x * Math.sin(u);
        if (isNaN(M) || isNaN(E) || isNaN(_)) continue;
        const S = Math.atan2(_, Math.sqrt(M ** 2 + E ** 2)), F = Math.atan2(E, M);
        isNaN(S) || isNaN(F) || d.push([Yt(F), Yt(S)]);
      }
      return d.slice(1, -1);
    }(t, e, Math.floor(o / i));
    return this.limitCoordinates(n);
  }
  limitCoordinates(t) {
    return t.map((e) => [b(e[0], this.config.coordinatePrecision), b(e[1], this.config.coordinatePrecision)]);
  }
}
function $(s, t) {
  return s[0] === t[0] && s[1] === t[1];
}
class Oe extends O {
  constructor(t) {
    super(t), this.mode = "linestring", this.currentCoordinate = 0, this.currentId = void 0, this.closingPointId = void 0, this.keyEvents = void 0, this.snappingEnabled = void 0, this.cursors = void 0, this.mouseMove = !1, this.insertCoordinates = void 0, this.lastCommitedCoordinates = void 0, this.snapping = void 0, this.insertPoint = void 0;
    const e = { start: "crosshair", close: "pointer" };
    if (this.cursors = t && t.cursors ? f({}, e, t.cursors) : e, this.snappingEnabled = !(!t || t.snapping === void 0) && t.snapping, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { cancel: null, finish: null };
    else {
      const i = { cancel: "Escape", finish: "Enter" };
      this.keyEvents = t && t.keyEvents ? f({}, i, t.keyEvents) : i;
    }
    this.validate = t == null ? void 0 : t.validation, this.insertCoordinates = t == null ? void 0 : t.insertCoordinates;
  }
  close() {
    if (this.currentId === void 0) return;
    const t = this.store.getGeometryCopy(this.currentId);
    t.coordinates.pop(), this.updateGeometries([...t.coordinates], void 0, C.Commit);
    const e = this.currentId;
    this.closingPointId && this.store.delete([this.closingPointId]), this.currentCoordinate = 0, this.currentId = void 0, this.closingPointId = void 0, this.lastCommitedCoordinates = void 0, this.state === "drawing" && this.setStarted(), this.onFinish(e, { mode: this.mode, action: "draw" });
  }
  updateGeometries(t, e, i) {
    if (!this.currentId) return;
    const o = { type: "LineString", coordinates: t };
    if (this.validate && !this.validate({ type: "Feature", geometry: o }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: i })) return;
    const n = [{ id: this.currentId, geometry: o }];
    this.closingPointId && e && n.push({ id: this.closingPointId, geometry: { type: "Point", coordinates: e } }), i === "commit" && (this.lastCommitedCoordinates = o.coordinates), this.store.updateGeometry(n);
  }
  generateInsertCoordinates(t, e) {
    if (!this.insertCoordinates || !this.lastCommitedCoordinates) throw new Error("Not able to insert coordinates");
    if (this.insertCoordinates.strategy !== "amount") throw new Error("Strategy does not exist");
    const i = W(t, e) / (this.insertCoordinates.value + 1);
    let o = [];
    return this.projection === "globe" ? o = this.insertPoint.generateInsertionGeodesicCoordinates(t, e, i) : this.projection === "web-mercator" && (o = this.insertPoint.generateInsertionCoordinates(t, e, i)), o;
  }
  createLine(t) {
    const [e] = this.store.create([{ geometry: { type: "LineString", coordinates: [t, t] }, properties: { mode: this.mode } }]);
    this.lastCommitedCoordinates = [t, t], this.currentId = e, this.currentCoordinate++, this.setDrawing();
  }
  firstUpdateToLine(t) {
    if (!this.currentId) return;
    const e = this.store.getGeometryCopy(this.currentId).coordinates, [i] = this.store.create([{ geometry: { type: "Point", coordinates: [...t] }, properties: { mode: this.mode } }]);
    this.closingPointId = i, this.setCursor(this.cursors.close);
    const o = [...e, t];
    this.updateGeometries(o, void 0, C.Commit), this.currentCoordinate++;
  }
  updateToLine(t, e) {
    if (!this.currentId) return;
    const i = this.store.getGeometryCopy(this.currentId).coordinates, [o, n] = this.lastCommitedCoordinates ? this.lastCommitedCoordinates[this.lastCommitedCoordinates.length - 1] : i[i.length - 2], { x: r, y: a } = this.project(o, n);
    if (I({ x: r, y: a }, { x: e.x, y: e.y }) < this.pointerDistance) return void this.close();
    this.setCursor(this.cursors.close);
    const l = [...i, t];
    this.updateGeometries(l, i[i.length - 1], C.Commit), this.currentCoordinate++;
  }
  registerBehaviors(t) {
    this.snapping = new se(t, new pt(t), new bt(t)), this.insertPoint = new Fe(t);
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.start);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onMouseMove(t) {
    if (this.mouseMove = !0, this.setCursor(this.cursors.start), this.currentId === void 0 || this.currentCoordinate === 0) return;
    const e = this.store.getGeometryCopy(this.currentId).coordinates;
    e.pop();
    const i = this.snappingEnabled && this.snapping.getSnappableCoordinate(t, this.currentId) || [t.lng, t.lat];
    if (this.closingPointId) {
      const [n, r] = e[e.length - 1], { x: a, y: l } = this.project(n, r);
      I({ x: a, y: l }, { x: t.containerX, y: t.containerY }) < this.pointerDistance && this.setCursor(this.cursors.close);
    }
    let o = [...e, i];
    if (this.insertCoordinates && this.currentId && this.lastCommitedCoordinates) {
      const n = this.lastCommitedCoordinates[this.lastCommitedCoordinates.length - 1], r = i;
      if (!$(n, r)) {
        const a = this.generateInsertCoordinates(n, r);
        o = [...this.lastCommitedCoordinates.slice(0, -1), ...a, i];
      }
    }
    this.updateGeometries(o, void 0, C.Provisional);
  }
  onClick(t) {
    this.currentCoordinate > 0 && !this.mouseMove && this.onMouseMove(t), this.mouseMove = !1;
    const e = this.currentId && this.snappingEnabled && this.snapping.getSnappableCoordinate(t, this.currentId) || [t.lng, t.lat];
    this.currentCoordinate === 0 ? this.createLine(e) : this.currentCoordinate === 1 && this.currentId ? this.firstUpdateToLine(e) : this.currentId && this.updateToLine(e, { x: t.containerX, y: t.containerY });
  }
  onKeyDown() {
  }
  onKeyUp(t) {
    t.key === this.keyEvents.cancel && this.cleanUp(), t.key === this.keyEvents.finish && this.close();
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  cleanUp() {
    const t = this.currentId;
    this.closingPointId = void 0, this.currentId = void 0, this.currentCoordinate = 0, this.state === "drawing" && this.setStarted();
    try {
      t !== void 0 && this.store.delete([t]), this.closingPointId !== void 0 && this.store.delete([this.closingPointId]);
    } catch {
    }
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    return t.type === "Feature" && t.geometry.type === "LineString" && t.properties.mode === this.mode ? (e.lineStringColor = this.getHexColorStylingValue(this.styles.lineStringColor, e.lineStringColor, t), e.lineStringWidth = this.getNumericStylingValue(this.styles.lineStringWidth, e.lineStringWidth, t), e.zIndex = 10, e) : (t.type === "Feature" && t.geometry.type === "Point" && t.properties.mode === this.mode && (e.pointColor = this.getHexColorStylingValue(this.styles.closingPointColor, e.pointColor, t), e.pointWidth = this.getNumericStylingValue(this.styles.closingPointWidth, e.pointWidth, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.closingPointOutlineColor, "#ffffff", t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.closingPointOutlineWidth, 2, t), e.zIndex = 40), e);
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.geometry.type === "LineString" && t.properties.mode === this.mode && t.geometry.coordinates.length >= 2;
  }
}
function ne(s, t) {
  return s.geometry.type === "Point" && gt(s.geometry.coordinates, t);
}
class ke extends O {
  constructor(t) {
    super(t), this.mode = "point", this.cursors = void 0;
    const e = { create: "crosshair" };
    this.cursors = t && t.cursors ? f({}, e, t.cursors) : e;
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.create);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onClick(t) {
    if (!this.store) throw new Error("Mode must be registered first");
    const e = { type: "Point", coordinates: [t.lng, t.lat] }, i = { mode: this.mode };
    if (this.validate && !this.validate({ type: "Feature", geometry: e, properties: i }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Finish })) return;
    const [o] = this.store.create([{ geometry: e, properties: i }]);
    this.onFinish(o, { mode: this.mode, action: "draw" });
  }
  onMouseMove() {
  }
  onKeyDown() {
  }
  onKeyUp() {
  }
  cleanUp() {
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    return t.type === "Feature" && t.geometry.type === "Point" && t.properties.mode === this.mode && (e.pointWidth = this.getNumericStylingValue(this.styles.pointWidth, e.pointWidth, t), e.pointColor = this.getHexColorStylingValue(this.styles.pointColor, e.pointColor, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.pointOutlineColor, e.pointOutlineColor, t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.pointOutlineWidth, 2, t), e.zIndex = 30), e;
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.properties.mode === this.mode && ne(t, this.coordinatePrecision);
  }
}
class je extends D {
  constructor(t, e) {
    super(t), this.config = void 0, this.pixelDistance = void 0, this._startEndPoints = [], this.config = t, this.pixelDistance = e;
  }
  get ids() {
    return this._startEndPoints.concat();
  }
  set ids(t) {
  }
  create(t, e) {
    if (this.ids.length) throw new Error("Opening and closing points already created");
    if (t.length <= 3) throw new Error("Requires at least 4 coordinates");
    this._startEndPoints = this.store.create([{ geometry: { type: "Point", coordinates: t[0] }, properties: { mode: e, [Nt]: !0 } }, { geometry: { type: "Point", coordinates: t[t.length - 2] }, properties: { mode: e, [Nt]: !0 } }]);
  }
  delete() {
    this.ids.length && (this.store.delete(this.ids), this._startEndPoints = []);
  }
  update(t) {
    if (this.ids.length !== 2) throw new Error("No closing points to update");
    this.store.updateGeometry([{ id: this.ids[0], geometry: { type: "Point", coordinates: t[0] } }, { id: this.ids[1], geometry: { type: "Point", coordinates: t[t.length - 3] } }]);
  }
  isClosingPoint(t) {
    const e = this.store.getGeometryCopy(this.ids[0]), i = this.store.getGeometryCopy(this.ids[1]), o = this.pixelDistance.measure(t, e.coordinates), n = this.pixelDistance.measure(t, i.coordinates);
    return { isClosing: o < this.pointerDistance, isPreviousClosing: n < this.pointerDistance };
  }
}
class Le extends O {
  constructor(t) {
    super(t), this.mode = "polygon", this.currentCoordinate = 0, this.currentId = void 0, this.keyEvents = void 0, this.snappingEnabled = void 0, this.snapping = void 0, this.pixelDistance = void 0, this.closingPoints = void 0, this.cursors = void 0, this.mouseMove = !1;
    const e = { start: "crosshair", close: "pointer" };
    if (this.cursors = t && t.cursors ? f({}, e, t.cursors) : e, this.snappingEnabled = !(!t || t.snapping === void 0) && t.snapping, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { cancel: null, finish: null };
    else {
      const i = { cancel: "Escape", finish: "Enter" };
      this.keyEvents = t && t.keyEvents ? f({}, i, t.keyEvents) : i;
    }
  }
  close() {
    if (this.currentId === void 0) return;
    const t = this.store.getGeometryCopy(this.currentId).coordinates[0];
    if (t.length < 5 || !this.updatePolygonGeometry([...t.slice(0, -2), t[0]], C.Finish)) return;
    const e = this.currentId;
    this.currentCoordinate = 0, this.currentId = void 0, this.closingPoints.delete(), this.state === "drawing" && this.setStarted(), this.onFinish(e, { mode: this.mode, action: "draw" });
  }
  registerBehaviors(t) {
    this.pixelDistance = new pt(t), this.snapping = new se(t, this.pixelDistance, new bt(t)), this.closingPoints = new je(t, this.pixelDistance);
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.start);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onMouseMove(t) {
    if (this.mouseMove = !0, this.setCursor(this.cursors.start), this.currentId === void 0 || this.currentCoordinate === 0) return;
    const e = this.snappingEnabled ? this.snapping.getSnappableCoordinate(t, this.currentId) : void 0, i = this.store.getGeometryCopy(this.currentId).coordinates[0];
    let o;
    if (e && (t.lng = e[0], t.lat = e[1]), this.currentCoordinate === 1) {
      const n = 1 / Math.pow(10, this.coordinatePrecision - 1), r = Math.max(1e-6, n);
      o = [i[0], [t.lng, t.lat], [t.lng, t.lat - r], i[0]];
    } else if (this.currentCoordinate === 2) o = [i[0], i[1], [t.lng, t.lat], i[0]];
    else {
      const { isClosing: n, isPreviousClosing: r } = this.closingPoints.isClosingPoint(t);
      r || n ? (this.setCursor(this.cursors.close), o = [...i.slice(0, -2), i[0], i[0]]) : o = [...i.slice(0, -2), [t.lng, t.lat], i[0]];
    }
    this.updatePolygonGeometry(o, C.Provisional);
  }
  updatePolygonGeometry(t, e) {
    if (!this.currentId) return !1;
    const i = { type: "Polygon", coordinates: [t] };
    return !(this.validate && !this.validate({ type: "Feature", geometry: i }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: e }) || (this.store.updateGeometry([{ id: this.currentId, geometry: i }]), 0));
  }
  onClick(t) {
    if (this.currentCoordinate > 0 && !this.mouseMove && this.onMouseMove(t), this.mouseMove = !1, this.currentCoordinate === 0) {
      const e = this.snappingEnabled ? this.snapping.getSnappableCoordinateFirstClick(t) : void 0;
      e && (t.lng = e[0], t.lat = e[1]);
      const [i] = this.store.create([{ geometry: { type: "Polygon", coordinates: [[[t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat]]] }, properties: { mode: this.mode } }]);
      this.currentId = i, this.currentCoordinate++, this.setDrawing();
    } else if (this.currentCoordinate === 1 && this.currentId) {
      const e = this.snappingEnabled ? this.snapping.getSnappableCoordinate(t, this.currentId) : void 0;
      e && (t.lng = e[0], t.lat = e[1]);
      const i = this.store.getGeometryCopy(this.currentId);
      if ($([t.lng, t.lat], i.coordinates[0][0]) || !this.updatePolygonGeometry([i.coordinates[0][0], [t.lng, t.lat], [t.lng, t.lat], i.coordinates[0][0]], C.Commit)) return;
      this.currentCoordinate++;
    } else if (this.currentCoordinate === 2 && this.currentId) {
      const e = this.snappingEnabled ? this.snapping.getSnappableCoordinate(t, this.currentId) : void 0;
      e && (t.lng = e[0], t.lat = e[1]);
      const i = this.store.getGeometryCopy(this.currentId).coordinates[0];
      if ($([t.lng, t.lat], i[1]) || !this.updatePolygonGeometry([i[0], i[1], [t.lng, t.lat], [t.lng, t.lat], i[0]], C.Commit)) return;
      this.currentCoordinate === 2 && this.closingPoints.create(i, "polygon"), this.currentCoordinate++;
    } else if (this.currentId) {
      const e = this.snappingEnabled ? this.snapping.getSnappableCoordinate(t, this.currentId) : void 0, i = this.store.getGeometryCopy(this.currentId).coordinates[0], { isClosing: o, isPreviousClosing: n } = this.closingPoints.isClosingPoint(t);
      if (n || o) this.close();
      else {
        if (e && (t.lng = e[0], t.lat = e[1]), $([t.lng, t.lat], i[this.currentCoordinate - 1])) return;
        const r = /* @__PURE__ */ function(a = [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]) {
          return { type: "Feature", geometry: { type: "Polygon", coordinates: a }, properties: {} };
        }([[...i.slice(0, -1), [t.lng, t.lat], i[0]]]);
        if (!this.updatePolygonGeometry(r.geometry.coordinates[0], C.Commit)) return;
        this.currentCoordinate++, this.closingPoints.ids.length && this.closingPoints.update(r.geometry.coordinates[0]);
      }
    }
  }
  onKeyUp(t) {
    t.key === this.keyEvents.cancel ? this.cleanUp() : t.key === this.keyEvents.finish && this.close();
  }
  onKeyDown() {
  }
  onDragStart() {
    this.setCursor("unset");
  }
  onDrag() {
  }
  onDragEnd() {
    this.setCursor(this.cursors.start);
  }
  cleanUp() {
    const t = this.currentId;
    this.currentId = void 0, this.currentCoordinate = 0, this.state === "drawing" && this.setStarted();
    try {
      t !== void 0 && this.store.delete([t]), this.closingPoints.ids.length && this.closingPoints.delete();
    } catch {
    }
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    if (t.properties.mode === this.mode) {
      if (t.geometry.type === "Polygon") return e.polygonFillColor = this.getHexColorStylingValue(this.styles.fillColor, e.polygonFillColor, t), e.polygonOutlineColor = this.getHexColorStylingValue(this.styles.outlineColor, e.polygonOutlineColor, t), e.polygonOutlineWidth = this.getNumericStylingValue(this.styles.outlineWidth, e.polygonOutlineWidth, t), e.polygonFillOpacity = this.getNumericStylingValue(this.styles.fillOpacity, e.polygonFillOpacity, t), e.zIndex = 10, e;
      if (t.geometry.type === "Point") return e.pointWidth = this.getNumericStylingValue(this.styles.closingPointWidth, e.pointWidth, t), e.pointColor = this.getHexColorStylingValue(this.styles.closingPointColor, e.pointColor, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.closingPointOutlineColor, e.pointOutlineColor, t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.closingPointOutlineWidth, 2, t), e.zIndex = 30, e;
    }
    return e;
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.properties.mode === this.mode && q(t, this.coordinatePrecision);
  }
}
class We extends O {
  constructor(t) {
    super(t), this.mode = "rectangle", this.center = void 0, this.clickCount = 0, this.currentRectangleId = void 0, this.keyEvents = void 0, this.cursors = void 0;
    const e = { start: "crosshair" };
    if (this.cursors = t && t.cursors ? f({}, e, t.cursors) : e, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { cancel: null, finish: null };
    else {
      const i = { cancel: "Escape", finish: "Enter" };
      this.keyEvents = t && t.keyEvents ? f({}, i, t.keyEvents) : i;
    }
  }
  updateRectangle(t, e) {
    if (this.clickCount === 1 && this.center && this.currentRectangleId) {
      const i = this.store.getGeometryCopy(this.currentRectangleId).coordinates[0][0], o = { type: "Polygon", coordinates: [[i, [t.lng, i[1]], [t.lng, t.lat], [i[0], t.lat], i]] };
      if (this.validate && !this.validate({ id: this.currentRectangleId, geometry: o }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: e })) return;
      this.store.updateGeometry([{ id: this.currentRectangleId, geometry: o }]);
    }
  }
  close() {
    const t = this.currentRectangleId;
    this.center = void 0, this.currentRectangleId = void 0, this.clickCount = 0, this.state === "drawing" && this.setStarted(), t && this.onFinish(t, { mode: this.mode, action: "draw" });
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.start);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onClick(t) {
    if (this.clickCount === 0) {
      this.center = [t.lng, t.lat];
      const [e] = this.store.create([{ geometry: { type: "Polygon", coordinates: [[[t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat]]] }, properties: { mode: this.mode } }]);
      this.currentRectangleId = e, this.clickCount++, this.setDrawing();
    } else this.updateRectangle(t, C.Finish), this.close();
  }
  onMouseMove(t) {
    this.updateRectangle(t, C.Provisional);
  }
  onKeyDown() {
  }
  onKeyUp(t) {
    t.key === this.keyEvents.cancel ? this.cleanUp() : t.key === this.keyEvents.finish && this.close();
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  cleanUp() {
    const t = this.currentRectangleId;
    this.center = void 0, this.currentRectangleId = void 0, this.clickCount = 0, this.state === "drawing" && this.setStarted(), t !== void 0 && this.store.delete([t]);
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    return t.type === "Feature" && t.geometry.type === "Polygon" && t.properties.mode === this.mode && (e.polygonFillColor = this.getHexColorStylingValue(this.styles.fillColor, e.polygonFillColor, t), e.polygonOutlineColor = this.getHexColorStylingValue(this.styles.outlineColor, e.polygonOutlineColor, t), e.polygonOutlineWidth = this.getNumericStylingValue(this.styles.outlineWidth, e.polygonOutlineWidth, t), e.polygonFillOpacity = this.getNumericStylingValue(this.styles.fillOpacity, e.polygonFillOpacity, t), e.zIndex = 10), e;
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.properties.mode === this.mode && ie(t, this.coordinatePrecision);
  }
}
class Be extends O {
  constructor(t) {
    super({ styles: t.styles }), this.type = G.Render, this.mode = "render", this.mode = t.modeName;
  }
  registerBehaviors(t) {
    this.mode = t.mode;
  }
  start() {
    this.setStarted();
  }
  stop() {
    this.setStopped();
  }
  onKeyUp() {
  }
  onKeyDown() {
  }
  onClick() {
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  onMouseMove() {
  }
  cleanUp() {
  }
  styleFeature(t) {
    return { pointColor: this.getHexColorStylingValue(this.styles.pointColor, "#3f97e0", t), pointWidth: this.getNumericStylingValue(this.styles.pointWidth, 6, t), pointOutlineColor: this.getHexColorStylingValue(this.styles.pointOutlineColor, "#ffffff", t), pointOutlineWidth: this.getNumericStylingValue(this.styles.pointOutlineWidth, 0, t), polygonFillColor: this.getHexColorStylingValue(this.styles.polygonFillColor, "#3f97e0", t), polygonFillOpacity: this.getNumericStylingValue(this.styles.polygonFillOpacity, 0.3, t), polygonOutlineColor: this.getHexColorStylingValue(this.styles.polygonOutlineColor, "#3f97e0", t), polygonOutlineWidth: this.getNumericStylingValue(this.styles.polygonOutlineWidth, 4, t), lineStringWidth: this.getNumericStylingValue(this.styles.lineStringWidth, 4, t), lineStringColor: this.getHexColorStylingValue(this.styles.lineStringColor, "#3f97e0", t), zIndex: this.getNumericStylingValue(this.styles.zIndex, 0, t) };
  }
  validateFeature(t) {
    return super.validateFeature(t) && (ne(t, this.coordinatePrecision) || q(t, this.coordinatePrecision) || function(e, i) {
      return e.geometry.type === "LineString" && e.geometry.coordinates.length >= 2 && e.geometry.coordinates.every((o) => gt(o, i));
    }(t, this.coordinatePrecision));
  }
}
function dt(s, t) {
  const e = s, i = t, o = w(e[1]), n = w(i[1]);
  let r = w(i[0] - e[0]);
  r > Math.PI && (r -= 2 * Math.PI), r < -Math.PI && (r += 2 * Math.PI);
  const a = Math.log(Math.tan(n / 2 + Math.PI / 4) / Math.tan(o / 2 + Math.PI / 4)), l = (T(Math.atan2(r, a)) + 360) % 360;
  return l > 180 ? -(360 - l) : l;
}
function Et(s, t, e) {
  let i = t;
  t < 0 && (i = -Math.abs(i));
  const o = i / Mt, n = s[0] * Math.PI / 180, r = w(s[1]), a = w(e), l = o * Math.cos(a);
  let d = r + l;
  Math.abs(d) > Math.PI / 2 && (d = d > 0 ? Math.PI - d : -Math.PI - d);
  const h = Math.log(Math.tan(d / 2 + Math.PI / 4) / Math.tan(r / 2 + Math.PI / 4)), c = Math.abs(h) > 1e-11 ? l / h : Math.cos(r), u = [(180 * (n + o * Math.sin(a) / c) / Math.PI + 540) % 360 - 180, 180 * d / Math.PI];
  return u[0] += u[0] - s[0] > 180 ? -360 : s[0] - u[0] > 180 ? 360 : 0, u;
}
function re(s, t, e, i, o) {
  const n = i(s[0], s[1]), r = i(t[0], t[1]), { lng: a, lat: l } = o((n.x + r.x) / 2, (n.y + r.y) / 2);
  return [b(a, e), b(l, e)];
}
function Ne(s, t, e) {
  const i = Et(s, 1e3 * W(s, t) / 2, dt(s, t));
  return [b(i[0], e), b(i[1], e)];
}
function zt({ featureCoords: s, precision: t, unproject: e, project: i, projection: o }) {
  const n = [];
  for (let r = 0; r < s.length - 1; r++) {
    let a;
    if (o === "web-mercator") a = re(s[r], s[r + 1], t, i, e);
    else {
      if (o !== "globe") throw new Error("Invalid projection");
      a = Ne(s[r], s[r + 1], t);
    }
    n.push(a);
  }
  return n;
}
class Ge extends D {
  constructor(t, e) {
    super(t), this.config = void 0, this.selectionPointBehavior = void 0, this._midPoints = [], this.config = t, this.selectionPointBehavior = e;
  }
  get ids() {
    return this._midPoints.concat();
  }
  set ids(t) {
  }
  insert(t, e) {
    const i = this.store.getGeometryCopy(t), { midPointFeatureId: o, midPointSegment: n } = this.store.getPropertiesCopy(t), r = this.store.getGeometryCopy(o), a = r.type === "Polygon" ? r.coordinates[0] : r.coordinates;
    a.splice(n + 1, 0, i.coordinates), r.coordinates = r.type === "Polygon" ? [a] : a, this.store.updateGeometry([{ id: o, geometry: r }]), this.store.delete([...this._midPoints, ...this.selectionPointBehavior.ids]), this.create(a, o, e), this.selectionPointBehavior.create(a, r.type, o);
  }
  create(t, e, i) {
    if (!this.store.has(e)) throw new Error("Store does not have feature with this id");
    this._midPoints = this.store.create(function(o, n, r, a, l, d) {
      return zt({ featureCoords: o, precision: r, project: a, unproject: l, projection: d }).map((h, c) => ({ geometry: { type: "Point", coordinates: h }, properties: n(c) }));
    }(t, (o) => ({ mode: this.mode, [H]: !0, midPointSegment: o, midPointFeatureId: e }), i, this.config.project, this.config.unproject, this.projection));
  }
  delete() {
    this._midPoints.length && (this.store.delete(this._midPoints), this._midPoints = []);
  }
  getUpdated(t) {
    if (this._midPoints.length !== 0) return zt({ featureCoords: t, precision: this.coordinatePrecision, project: this.config.project, unproject: this.config.unproject, projection: this.config.projection }).map((e, i) => ({ id: this._midPoints[i], geometry: { type: "Point", coordinates: e } }));
  }
}
class Ae extends D {
  constructor(t) {
    super(t), this._selectionPoints = [];
  }
  get ids() {
    return this._selectionPoints.concat();
  }
  set ids(t) {
  }
  create(t, e, i) {
    this._selectionPoints = this.store.create(function(o, n, r) {
      const a = [], l = n === "Polygon" ? o.length - 1 : o.length;
      for (let d = 0; d < l; d++) a.push({ geometry: { type: "Point", coordinates: o[d] }, properties: r(d) });
      return a;
    }(t, e, (o) => ({ mode: this.mode, selectionPoint: !0, selectionPointFeatureId: i, index: o })));
  }
  delete() {
    this.ids.length && (this.store.delete(this.ids), this._selectionPoints = []);
  }
  getUpdated(t) {
    if (this._selectionPoints.length !== 0) return this._selectionPoints.map((e, i) => ({ id: e, geometry: { type: "Point", coordinates: t[i] } }));
  }
  getOneUpdated(t, e) {
    if (this._selectionPoints[t] !== void 0) return { id: this._selectionPoints[t], geometry: { type: "Point", coordinates: e } };
  }
}
function ae(s, t) {
  let e = !1;
  for (let r = 0, a = t.length; r < a; r++) {
    const l = t[r];
    for (let d = 0, h = l.length, c = h - 1; d < h; c = d++) (o = l[d])[1] > (i = s)[1] != (n = l[c])[1] > i[1] && i[0] < (n[0] - o[0]) * (i[1] - o[1]) / (n[1] - o[1]) + o[0] && (e = !e);
  }
  var i, o, n;
  return e;
}
const le = (s, t, e) => {
  const i = (n) => n * n, o = (n, r) => i(n.x - r.x) + i(n.y - r.y);
  return Math.sqrt(((n, r, a) => {
    const l = o(r, a);
    if (l === 0) return o(n, r);
    let d = ((n.x - r.x) * (a.x - r.x) + (n.y - r.y) * (a.y - r.y)) / l;
    return d = Math.max(0, Math.min(1, d)), o(n, { x: r.x + d * (a.x - r.x), y: r.y + d * (a.y - r.y) });
  })(s, t, e));
};
class Ve extends D {
  constructor(t, e, i) {
    super(t), this.config = void 0, this.createClickBoundingBox = void 0, this.pixelDistance = void 0, this.config = t, this.createClickBoundingBox = e, this.pixelDistance = i;
  }
  find(t, e) {
    let i, o, n = 1 / 0, r = 1 / 0;
    const a = this.createClickBoundingBox.create(t), l = this.store.search(a);
    for (let d = 0; d < l.length; d++) {
      const h = l[d], c = h.geometry;
      if (c.type === "Point") {
        if (h.properties.selectionPoint || !e && h.properties[H]) continue;
        const u = this.pixelDistance.measure(t, c.coordinates);
        h.properties[H] && u < this.pointerDistance && u < r ? (r = u, o = h) : !h.properties[H] && u < this.pointerDistance && u < n && (n = u, i = h);
      } else if (c.type === "LineString") for (let u = 0; u < c.coordinates.length - 1; u++) {
        const g = c.coordinates[u], p = c.coordinates[u + 1], y = le({ x: t.containerX, y: t.containerY }, this.project(g[0], g[1]), this.project(p[0], p[1]));
        y < this.pointerDistance && y < n && (n = y, i = h);
      }
      else c.type === "Polygon" && ae([t.lng, t.lat], c.coordinates) && (n = 0, i = h);
    }
    return { clickedFeature: i, clickedMidPoint: o };
  }
}
class Re extends D {
  constructor(t, e, i, o) {
    super(t), this.config = void 0, this.featuresAtMouseEvent = void 0, this.selectionPoints = void 0, this.midPoints = void 0, this.draggedFeatureId = null, this.dragPosition = void 0, this.config = t, this.featuresAtMouseEvent = e, this.selectionPoints = i, this.midPoints = o;
  }
  startDragging(t, e) {
    this.draggedFeatureId = e, this.dragPosition = [t.lng, t.lat];
  }
  stopDragging() {
    this.draggedFeatureId = null, this.dragPosition = void 0;
  }
  isDragging() {
    return this.draggedFeatureId !== null;
  }
  canDrag(t, e) {
    const { clickedFeature: i } = this.featuresAtMouseEvent.find(t, !0);
    return !(!i || i.id !== e);
  }
  drag(t, e) {
    if (!this.draggedFeatureId) return;
    const i = this.store.getGeometryCopy(this.draggedFeatureId), o = [t.lng, t.lat];
    if (i.type === "Polygon" || i.type === "LineString") {
      let n, r;
      if (i.type === "Polygon" ? (n = i.coordinates[0], r = n.length - 1) : (n = i.coordinates, r = n.length), !this.dragPosition) return !1;
      for (let d = 0; d < r; d++) {
        const h = n[d], c = [this.dragPosition[0] - o[0], this.dragPosition[1] - o[1]], u = b(h[0] - c[0], this.config.coordinatePrecision), g = b(h[1] - c[1], this.config.coordinatePrecision);
        if (u > 180 || u < -180 || g > 90 || g < -90) return !1;
        n[d] = [u, g];
      }
      i.type === "Polygon" && (n[n.length - 1] = [n[0][0], n[0][1]]);
      const a = this.selectionPoints.getUpdated(n) || [], l = this.midPoints.getUpdated(n) || [];
      if (e && !e({ type: "Feature", id: this.draggedFeatureId, geometry: i, properties: {} }, { project: this.config.project, unproject: this.config.unproject, coordinatePrecision: this.config.coordinatePrecision, updateType: C.Provisional })) return !1;
      this.store.updateGeometry([{ id: this.draggedFeatureId, geometry: i }, ...a, ...l]), this.dragPosition = [t.lng, t.lat];
    } else i.type === "Point" && (this.store.updateGeometry([{ id: this.draggedFeatureId, geometry: { type: "Point", coordinates: o } }]), this.dragPosition = [t.lng, t.lat]);
  }
}
class Ue extends D {
  constructor(t, e, i, o) {
    super(t), this.config = void 0, this.pixelDistance = void 0, this.selectionPoints = void 0, this.midPoints = void 0, this.draggedCoordinate = { id: null, index: -1 }, this.config = t, this.pixelDistance = e, this.selectionPoints = i, this.midPoints = o;
  }
  getClosestCoordinate(t, e) {
    const i = { dist: 1 / 0, index: -1, isFirstOrLastPolygonCoord: !1 };
    let o;
    if (e.type === "LineString") o = e.coordinates;
    else {
      if (e.type !== "Polygon") return i;
      o = e.coordinates[0];
    }
    for (let n = 0; n < o.length; n++) {
      const r = this.pixelDistance.measure(t, o[n]);
      if (r < this.pointerDistance && r < i.dist) {
        const a = e.type === "Polygon" && (n === o.length - 1 || n === 0);
        i.dist = r, i.index = a ? 0 : n, i.isFirstOrLastPolygonCoord = a;
      }
    }
    return i;
  }
  getDraggableIndex(t, e) {
    const i = this.store.getGeometryCopy(e), o = this.getClosestCoordinate(t, i);
    return o.index === -1 ? -1 : o.index;
  }
  drag(t, e, i) {
    if (!this.draggedCoordinate.id) return !1;
    const o = this.draggedCoordinate.index, n = this.store.getGeometryCopy(this.draggedCoordinate.id), r = n.type === "LineString" ? n.coordinates : n.coordinates[0], a = [t.lng, t.lat];
    if (t.lng > 180 || t.lng < -180 || t.lat > 90 || t.lat < -90) return !1;
    if (n.type !== "Polygon" || o !== r.length - 1 && o !== 0) r[o] = a;
    else {
      const c = r.length - 1;
      r[0] = a, r[c] = a;
    }
    const l = this.selectionPoints.getOneUpdated(o, a), d = l ? [l] : [], h = this.midPoints.getUpdated(r) || [];
    return !(n.type !== "Point" && !e && _t({ type: "Feature", geometry: n, properties: {} }) || i && !i({ type: "Feature", id: this.draggedCoordinate.id, geometry: n, properties: {} }, { project: this.config.project, unproject: this.config.unproject, coordinatePrecision: this.config.coordinatePrecision, updateType: C.Provisional }) || (this.store.updateGeometry([{ id: this.draggedCoordinate.id, geometry: n }, ...d, ...h]), 0));
  }
  isDragging() {
    return this.draggedCoordinate.id !== null;
  }
  startDragging(t, e) {
    this.draggedCoordinate = { id: t, index: e };
  }
  stopDragging() {
    this.draggedCoordinate = { id: null, index: -1 };
  }
}
function ct(s) {
  let t = 0, e = 0, i = 0;
  return (s.geometry.type === "Polygon" ? s.geometry.coordinates[0].slice(0, -1) : s.geometry.coordinates).forEach((o) => {
    t += o[0], e += o[1], i++;
  }, !0), [t / i, e / i];
}
function he(s, t) {
  s[0] += s[0] - t[0] > 180 ? -360 : t[0] - s[0] > 180 ? 360 : 0;
  const e = Mt, i = t[1] * Math.PI / 180, o = s[1] * Math.PI / 180, n = o - i;
  let r = Math.abs(s[0] - t[0]) * Math.PI / 180;
  r > Math.PI && (r -= 2 * Math.PI);
  const a = Math.log(Math.tan(o / 2 + Math.PI / 4) / Math.tan(i / 2 + Math.PI / 4)), l = Math.abs(a) > 1e-11 ? n / a : Math.cos(i);
  return Math.sqrt(n * n + l * l * r * r) * e;
}
function ut(s) {
  const t = (s.geometry.type === "Polygon" ? s.geometry.coordinates[0] : s.geometry.coordinates).map((e) => {
    const { x: i, y: o } = P(e[0], e[1]);
    return [i, o];
  });
  return s.geometry.type === "Polygon" ? function(e) {
    let i = 0, o = 0, n = 0;
    const r = e.length;
    for (let a = 0; a < r - 1; a++) {
      const [l, d] = e[a], [h, c] = e[a + 1], u = l * c - h * d;
      i += u, o += (l + h) * u, n += (d + c) * u;
    }
    return i /= 2, o /= 6 * i, n /= 6 * i, { x: o, y: n };
  }(t) : function(e) {
    const i = e.length;
    let o = 0, n = 0;
    for (let r = 0; r < i; r++) {
      const [a, l] = e[r];
      o += a, n += l;
    }
    return { x: o / i, y: n / i };
  }(t);
}
class Xe extends D {
  constructor(t, e, i) {
    super(t), this.config = void 0, this.selectionPoints = void 0, this.midPoints = void 0, this.lastBearing = void 0, this.config = t, this.selectionPoints = e, this.midPoints = i;
  }
  reset() {
    this.lastBearing = void 0;
  }
  rotate(t, e, i) {
    const o = this.store.getGeometryCopy(e);
    if (o.type !== "Polygon" && o.type !== "LineString") return;
    const n = [t.lng, t.lat];
    let r;
    const a = { type: "Feature", geometry: o, properties: {} };
    if (this.config.projection === "web-mercator") {
      if (r = ht(ut(a), P(t.lng, t.lat)), !this.lastBearing) return void (this.lastBearing = r);
      ((c, u) => {
        if (u === 0 || u === 360 || u === -360) return c;
        const g = 0.017453292519943295 * u, p = (c.geometry.type === "Polygon" ? c.geometry.coordinates[0] : c.geometry.coordinates).map(([m, x]) => P(m, x)), y = p.reduce((m, x) => ({ x: m.x + x.x, y: m.y + x.y }), { x: 0, y: 0 });
        y.x /= p.length, y.y /= p.length;
        const v = p.map((m) => ({ x: y.x + (m.x - y.x) * Math.cos(g) - (m.y - y.y) * Math.sin(g), y: y.y + (m.x - y.x) * Math.sin(g) + (m.y - y.y) * Math.cos(g) })).map(({ x: m, y: x }) => [j(m, x).lng, j(m, x).lat]);
        c.geometry.type === "Polygon" ? c.geometry.coordinates[0] = v : (console.log("rotatedCoordinates linestring", v), c.geometry.coordinates = v);
      })(a, -(this.lastBearing - r));
    } else {
      if (this.config.projection !== "globe") throw new Error("Unsupported projection");
      if (r = dt(ct({ type: "Feature", geometry: o, properties: {} }), n), !this.lastBearing) return void (this.lastBearing = r + 180);
      (function(c, u) {
        if (u === 0 || u === 360 || u === -360) return c;
        const g = ct(c);
        (c.geometry.type === "Polygon" ? c.geometry.coordinates[0] : c.geometry.coordinates).forEach((p) => {
          const y = dt(g, p) + u, v = he(g, p), m = Et(g, v, y);
          p[0] = m[0], p[1] = m[1];
        });
      })(a, -(this.lastBearing - (r + 180)));
    }
    const l = o.type === "Polygon" ? o.coordinates[0] : o.coordinates;
    l.forEach((c) => {
      c[0] = b(c[0], this.coordinatePrecision), c[1] = b(c[1], this.coordinatePrecision);
    });
    const d = this.midPoints.getUpdated(l) || [], h = this.selectionPoints.getUpdated(l) || [];
    if (i && !i({ id: e, type: "Feature", geometry: o, properties: {} }, { project: this.config.project, unproject: this.config.unproject, coordinatePrecision: this.config.coordinatePrecision, updateType: C.Provisional })) return !1;
    this.store.updateGeometry([{ id: e, geometry: o }, ...h, ...d]), this.projection === "web-mercator" ? this.lastBearing = r : this.projection === "globe" && (this.lastBearing = r + 180);
  }
}
class Te extends D {
  constructor(t, e, i) {
    super(t), this.config = void 0, this.selectionPoints = void 0, this.midPoints = void 0, this.lastDistance = void 0, this.config = t, this.selectionPoints = e, this.midPoints = i;
  }
  reset() {
    this.lastDistance = void 0;
  }
  scale(t, e, i) {
    const o = this.store.getGeometryCopy(e);
    if (o.type !== "Polygon" && o.type !== "LineString") return;
    const n = [t.lng, t.lat], r = { type: "Feature", geometry: o, properties: {} };
    let a;
    const l = ut(r);
    if (this.config.projection === "web-mercator") {
      const g = P(t.lng, t.lat);
      a = I(l, g);
    } else {
      if (this.config.projection !== "globe") throw new Error("Invalid projection");
      a = W(ct({ type: "Feature", geometry: o, properties: {} }), n);
    }
    if (!this.lastDistance) return void (this.lastDistance = a);
    const d = 1 - (this.lastDistance - a) / a;
    if (this.config.projection === "web-mercator") {
      const { lng: g, lat: p } = j(l.x, l.y);
      (function(y, v, m) {
        if (v === 1) return y;
        const x = (y.geometry.type === "Polygon" ? y.geometry.coordinates[0] : y.geometry.coordinates).map(([_, S]) => P(_, S)), M = P(m[0], m[1]), E = x.map((_) => ({ x: M.x + (_.x - M.x) * v, y: M.y + (_.y - M.y) * v })).map(({ x: _, y: S }) => [j(_, S).lng, j(_, S).lat]);
        y.geometry.type === "Polygon" ? y.geometry.coordinates[0] = E : y.geometry.coordinates = E;
      })(r, d, [g, p]);
    } else this.config.projection === "globe" && function(g, p, y, v = "xy") {
      p === 1 || (g.geometry.type === "Polygon" ? g.geometry.coordinates[0] : g.geometry.coordinates).forEach((m) => {
        const x = he(y, m), M = dt(y, m), E = Et(y, x * p, M);
        v !== "x" && v !== "xy" || (m[0] = E[0]), v !== "y" && v !== "xy" || (m[1] = E[1]);
      });
    }(r, d, ct(r));
    const h = o.type === "Polygon" ? o.coordinates[0] : o.coordinates;
    h.forEach((g) => {
      g[0] = b(g[0], this.coordinatePrecision), g[1] = b(g[1], this.coordinatePrecision);
    });
    const c = this.midPoints.getUpdated(h) || [], u = this.selectionPoints.getUpdated(h) || [];
    if (i && !i({ id: e, type: "Feature", geometry: o, properties: {} }, { project: this.config.project, unproject: this.config.unproject, coordinatePrecision: this.config.coordinatePrecision, updateType: C.Provisional })) return !1;
    this.store.updateGeometry([{ id: e, geometry: o }, ...u, ...c]), this.lastDistance = a;
  }
}
class Ke extends D {
  constructor(t, e, i, o) {
    super(t), this.config = void 0, this.pixelDistance = void 0, this.selectionPoints = void 0, this.midPoints = void 0, this.minimumScale = 1e-4, this.draggedCoordinate = { id: null, index: -1 }, this.boundingBoxMaps = { opposite: { 0: 4, 1: 5, 2: 6, 3: 7, 4: 0, 5: 1, 6: 2, 7: 3 } }, this.config = t, this.pixelDistance = e, this.selectionPoints = i, this.midPoints = o;
  }
  getClosestCoordinate(t, e) {
    const i = { dist: 1 / 0, index: -1, isFirstOrLastPolygonCoord: !1 };
    let o;
    if (e.type === "LineString") o = e.coordinates;
    else {
      if (e.type !== "Polygon") return i;
      o = e.coordinates[0];
    }
    for (let n = 0; n < o.length; n++) {
      const r = this.pixelDistance.measure(t, o[n]);
      if (r < this.pointerDistance && r < i.dist) {
        const a = e.type === "Polygon" && (n === o.length - 1 || n === 0);
        i.dist = r, i.index = a ? 0 : n, i.isFirstOrLastPolygonCoord = a;
      }
    }
    return i;
  }
  isValidDragWebMercator(t, e, i) {
    switch (t) {
      case 0:
        if (e <= 0 || i >= 0) return !1;
        break;
      case 1:
        if (i >= 0) return !1;
        break;
      case 2:
        if (e >= 0 || i >= 0) return !1;
        break;
      case 3:
        if (e >= 0) return !1;
        break;
      case 4:
        if (e >= 0 || i <= 0) return !1;
        break;
      case 5:
        if (i <= 0) return !1;
        break;
      case 6:
        if (e <= 0 || i <= 0) return !1;
        break;
      case 7:
        if (e <= 0) return !1;
    }
    return !0;
  }
  getSelectedFeatureDataWebMercator() {
    if (!this.draggedCoordinate.id || this.draggedCoordinate.index === -1) return null;
    const t = this.getFeature(this.draggedCoordinate.id);
    if (!t) return null;
    const e = this.getNormalisedCoordinates(t.geometry);
    return { boundingBox: this.getBBoxWebMercator(e), feature: t, updatedCoords: e, selectedCoordinate: e[this.draggedCoordinate.index] };
  }
  centerWebMercatorDrag(t) {
    const e = this.getSelectedFeatureDataWebMercator();
    if (!e) return null;
    const { feature: i, boundingBox: o, updatedCoords: n, selectedCoordinate: r } = e, a = ut(i);
    if (!a) return null;
    const l = P(r[0], r[1]), { closestBBoxIndex: d } = this.getIndexesWebMercator(o, l), h = P(t.lng, t.lat);
    return this.scaleWebMercator({ closestBBoxIndex: d, updatedCoords: n, webMercatorCursor: h, webMercatorSelected: l, webMercatorOrigin: a }), n;
  }
  centerFixedWebMercatorDrag(t) {
    const e = this.getSelectedFeatureDataWebMercator();
    if (!e) return null;
    const { feature: i, boundingBox: o, updatedCoords: n, selectedCoordinate: r } = e, a = ut(i);
    if (!a) return null;
    const l = P(r[0], r[1]), { closestBBoxIndex: d } = this.getIndexesWebMercator(o, l), h = P(t.lng, t.lat);
    return this.scaleFixedWebMercator({ closestBBoxIndex: d, updatedCoords: n, webMercatorCursor: h, webMercatorSelected: l, webMercatorOrigin: a }), n;
  }
  scaleFixedWebMercator({ closestBBoxIndex: t, webMercatorOrigin: e, webMercatorSelected: i, webMercatorCursor: o, updatedCoords: n }) {
    if (!this.isValidDragWebMercator(t, e.x - o.x, e.y - o.y)) return null;
    let r = I(e, o) / I(e, i);
    return r < 0 && (r = this.minimumScale), this.performWebMercatorScale(n, e.x, e.y, r, r), n;
  }
  oppositeFixedWebMercatorDrag(t) {
    const e = this.getSelectedFeatureDataWebMercator();
    if (!e) return null;
    const { boundingBox: i, updatedCoords: o, selectedCoordinate: n } = e, r = P(n[0], n[1]), { oppositeBboxIndex: a, closestBBoxIndex: l } = this.getIndexesWebMercator(i, r), d = { x: i[a][0], y: i[a][1] }, h = P(t.lng, t.lat);
    return this.scaleFixedWebMercator({ closestBBoxIndex: l, updatedCoords: o, webMercatorCursor: h, webMercatorSelected: r, webMercatorOrigin: d }), o;
  }
  oppositeWebMercatorDrag(t) {
    const e = this.getSelectedFeatureDataWebMercator();
    if (!e) return null;
    const { boundingBox: i, updatedCoords: o, selectedCoordinate: n } = e, r = P(n[0], n[1]), { oppositeBboxIndex: a, closestBBoxIndex: l } = this.getIndexesWebMercator(i, r), d = { x: i[a][0], y: i[a][1] }, h = P(t.lng, t.lat);
    return this.scaleWebMercator({ closestBBoxIndex: l, updatedCoords: o, webMercatorCursor: h, webMercatorSelected: r, webMercatorOrigin: d }), o;
  }
  scaleWebMercator({ closestBBoxIndex: t, webMercatorOrigin: e, webMercatorSelected: i, webMercatorCursor: o, updatedCoords: n }) {
    const r = e.x - o.x, a = e.y - o.y;
    if (!this.isValidDragWebMercator(t, r, a)) return null;
    let l = 1;
    r !== 0 && t !== 1 && t !== 5 && (l = 1 - (e.x - i.x - r) / r);
    let d = 1;
    return a !== 0 && t !== 3 && t !== 7 && (d = 1 - (e.y - i.y - a) / a), this.validateScale(l, d) ? (l < 0 && (l = this.minimumScale), d < 0 && (d = this.minimumScale), this.performWebMercatorScale(n, e.x, e.y, l, d), n) : null;
  }
  getFeature(t) {
    if (this.draggedCoordinate.id === null) return null;
    const e = this.store.getGeometryCopy(t);
    return e.type !== "Polygon" && e.type !== "LineString" ? null : { type: "Feature", geometry: e, properties: {} };
  }
  getNormalisedCoordinates(t) {
    return t.type === "Polygon" ? t.coordinates[0] : t.coordinates;
  }
  validateScale(t, e) {
    const i = !isNaN(t) && e < Number.MAX_SAFE_INTEGER, o = !isNaN(e) && e < Number.MAX_SAFE_INTEGER;
    return i && o;
  }
  performWebMercatorScale(t, e, i, o, n) {
    t.forEach((r) => {
      const { x: a, y: l } = P(r[0], r[1]), d = e + (a - e) * o, h = i + (l - i) * n, { lng: c, lat: u } = j(d, h);
      r[0] = c, r[1] = u;
    });
  }
  getBBoxWebMercator(t) {
    const e = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
    (t = t.map((a) => {
      const { x: l, y: d } = P(a[0], a[1]);
      return [l, d];
    })).forEach(([a, l]) => {
      a < e[0] && (e[0] = a), l < e[1] && (e[1] = l), a > e[2] && (e[2] = a), l > e[3] && (e[3] = l);
    });
    const [i, o, n, r] = e;
    return [[i, r], [(i + n) / 2, r], [n, r], [n, r + (o - r) / 2], [n, o], [(i + n) / 2, o], [i, o], [i, r + (o - r) / 2]];
  }
  getIndexesWebMercator(t, e) {
    let i, o = 1 / 0;
    for (let n = 0; n < t.length; n++) {
      const r = I({ x: e.x, y: e.y }, { x: t[n][0], y: t[n][1] });
      r < o && (i = n, o = r);
    }
    if (i === void 0) throw new Error("No closest coordinate found");
    return { oppositeBboxIndex: this.boundingBoxMaps.opposite[i], closestBBoxIndex: i };
  }
  isDragging() {
    return this.draggedCoordinate.id !== null;
  }
  startDragging(t, e) {
    this.draggedCoordinate = { id: t, index: e };
  }
  stopDragging() {
    this.draggedCoordinate = { id: null, index: -1 };
  }
  getDraggableIndex(t, e) {
    const i = this.store.getGeometryCopy(e), o = this.getClosestCoordinate(t, i);
    return o.index === -1 ? -1 : o.index;
  }
  drag(t, e, i) {
    if (!this.draggedCoordinate.id) return !1;
    const o = this.getFeature(this.draggedCoordinate.id);
    if (!o) return !1;
    let n = null;
    if (e === "center" ? n = this.centerWebMercatorDrag(t) : e === "opposite" ? n = this.oppositeWebMercatorDrag(t) : e === "center-fixed" ? n = this.centerFixedWebMercatorDrag(t) : e === "opposite-fixed" && (n = this.oppositeFixedWebMercatorDrag(t)), !n) return !1;
    for (let d = 0; d < n.length; d++) {
      const h = n[d];
      if (h[0] = b(h[0], this.coordinatePrecision), h[1] = b(h[1], this.coordinatePrecision), !gt(h, this.coordinatePrecision)) return !1;
    }
    const r = this.midPoints.getUpdated(n) || [], a = this.selectionPoints.getUpdated(n) || [], l = { type: o.geometry.type, coordinates: o.geometry.type === "Polygon" ? [n] : n };
    return !(i && !i({ id: this.draggedCoordinate.id, type: "Feature", geometry: l, properties: {} }, { project: this.config.project, unproject: this.config.unproject, coordinatePrecision: this.config.coordinatePrecision, updateType: C.Provisional }) || (this.store.updateGeometry([{ id: this.draggedCoordinate.id, geometry: l }, ...a, ...r]), 0));
  }
}
class Ye extends Ee {
  constructor(t) {
    var e;
    super(t), this.mode = "select", this.allowManualDeselection = !0, this.dragEventThrottle = 5, this.dragEventCount = 0, this.selected = [], this.flags = void 0, this.keyEvents = void 0, this.selectionPoints = void 0, this.midPoints = void 0, this.featuresAtMouseEvent = void 0, this.pixelDistance = void 0, this.clickBoundingBox = void 0, this.dragFeature = void 0, this.dragCoordinate = void 0, this.rotateFeature = void 0, this.scaleFeature = void 0, this.dragCoordinateResizeFeature = void 0, this.cursors = void 0, this.validations = {}, this.flags = t && t.flags ? t.flags : {};
    const i = { pointerOver: "move", dragStart: "move", dragEnd: "move", insertMidpoint: "crosshair" };
    if (this.cursors = t && t.cursors ? f({}, i, t.cursors) : i, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { deselect: null, delete: null, rotate: null, scale: null };
    else {
      const o = { deselect: "Escape", delete: "Delete", rotate: ["Control", "r"], scale: ["Control", "s"] };
      this.keyEvents = t && t.keyEvents ? f({}, o, t.keyEvents) : o;
    }
    if (this.dragEventThrottle = t && t.dragEventThrottle !== void 0 && t.dragEventThrottle || 5, this.allowManualDeselection = (e = t == null ? void 0 : t.allowManualDeselection) == null || e, t && t.flags && t.flags) for (const o in t.flags) {
      const n = t.flags[o].feature;
      n && n.validation && (this.validations[o] = n.validation);
    }
  }
  selectFeature(t) {
    this.select(t, !1);
  }
  setSelecting() {
    if (this._state !== "started") throw new Error("Mode must be started to move to selecting state");
    this._state = "selecting";
  }
  registerBehaviors(t) {
    this.pixelDistance = new pt(t), this.clickBoundingBox = new bt(t), this.featuresAtMouseEvent = new Ve(t, this.clickBoundingBox, this.pixelDistance), this.selectionPoints = new Ae(t), this.midPoints = new Ge(t, this.selectionPoints), this.rotateFeature = new Xe(t, this.selectionPoints, this.midPoints), this.scaleFeature = new Te(t, this.selectionPoints, this.midPoints), this.dragFeature = new Re(t, this.featuresAtMouseEvent, this.selectionPoints, this.midPoints), this.dragCoordinate = new Ue(t, this.pixelDistance, this.selectionPoints, this.midPoints), this.dragCoordinateResizeFeature = new Ke(t, this.pixelDistance, this.selectionPoints, this.midPoints);
  }
  deselectFeature() {
    this.deselect();
  }
  deselect() {
    const t = this.selected.filter((e) => this.store.has(e)).map((e) => ({ id: e, property: Pt, value: !1 }));
    this.store.updateProperty(t), this.onDeselect(this.selected[0]), this.selected = [], this.selectionPoints.delete(), this.midPoints.delete();
  }
  deleteSelected() {
    this.store.delete(this.selected), this.selected = [];
  }
  onRightClick(t) {
    if (!this.selectionPoints.ids.length) return;
    let e, i = 1 / 0;
    if (this.selectionPoints.ids.forEach((c) => {
      const u = this.store.getGeometryCopy(c), g = this.pixelDistance.measure(t, u.coordinates);
      g < this.pointerDistance && g < i && (i = g, e = this.store.getPropertiesCopy(c));
    }), !e) return;
    const o = e.selectionPointFeatureId, n = e.index, r = this.store.getPropertiesCopy(o), a = this.flags[r.mode], l = this.validations[r.mode];
    if (!(a && a.feature && a.feature.coordinates && a.feature.coordinates.deletable)) return;
    const d = this.store.getGeometryCopy(o);
    let h;
    if (d.type === "Polygon") {
      if (h = d.coordinates[0], h.length <= 4) return;
    } else if (d.type === "LineString" && (h = d.coordinates, h.length <= 3)) return;
    if (h) {
      if (d.type === "Polygon" && n === 0 || n === h.length - 1 ? (h.shift(), h.pop(), h.push([h[0][0], h[0][1]])) : h.splice(n, 1), l && !l({ id: o, type: "Feature", geometry: d, properties: r }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: C.Commit })) return;
      this.store.delete([...this.midPoints.ids, ...this.selectionPoints.ids]), this.store.updateGeometry([{ id: o, geometry: d }]), this.selectionPoints.create(h, d.type, o), a && a.feature && a.feature.coordinates && a.feature.coordinates.midpoints && this.midPoints.create(h, o, this.coordinatePrecision);
    }
  }
  select(t, e = !0) {
    if (this.selected[0] === t) return;
    const { mode: i } = this.store.getPropertiesCopy(t), o = this.flags[i];
    if (!o || !o.feature) return;
    const n = this.selected[0];
    if (n) {
      if (n === t) return;
      this.deselect();
    }
    e && this.setCursor(this.cursors.pointerOver), this.selected = [t], this.store.updateProperty([{ id: t, property: "selected", value: !0 }]), this.onSelect(t);
    const { type: r, coordinates: a } = this.store.getGeometryCopy(t);
    if (r !== "LineString" && r !== "Polygon") return;
    const l = r === "LineString" ? a : a[0];
    l && o && o.feature.coordinates && (this.selectionPoints.create(l, r, t), o.feature.coordinates.midpoints && this.midPoints.create(l, t, this.coordinatePrecision));
  }
  onLeftClick(t) {
    const { clickedFeature: e, clickedMidPoint: i } = this.featuresAtMouseEvent.find(t, this.selected.length > 0);
    if (this.selected.length && i) this.midPoints.insert(i.id, this.coordinatePrecision);
    else if (e && e.id) this.select(e.id, !0);
    else if (this.selected.length && this.allowManualDeselection) return void this.deselect();
  }
  start() {
    this.setStarted(), this.setSelecting();
  }
  stop() {
    this.cleanUp(), this.setStarted(), this.setStopped();
  }
  onClick(t) {
    t.button !== "right" ? t.button === "left" && this.onLeftClick(t) : this.onRightClick(t);
  }
  canScale(t) {
    return this.keyEvents.scale && this.keyEvents.scale.every((e) => t.heldKeys.includes(e));
  }
  canRotate(t) {
    return this.keyEvents.rotate && this.keyEvents.rotate.every((e) => t.heldKeys.includes(e));
  }
  preventDefaultKeyEvent(t) {
    const e = this.canRotate(t), i = this.canScale(t);
    (e || i) && t.preventDefault();
  }
  onKeyDown(t) {
    this.preventDefaultKeyEvent(t);
  }
  onKeyUp(t) {
    if (this.preventDefaultKeyEvent(t), this.keyEvents.delete && t.key === this.keyEvents.delete) {
      if (!this.selected.length) return;
      this.onDeselect(this.selected[0]), this.deleteSelected(), this.selectionPoints.delete(), this.midPoints.delete();
    } else this.keyEvents.deselect && t.key === this.keyEvents.deselect && this.cleanUp();
  }
  cleanUp() {
    this.selected.length && this.deselect();
  }
  onDragStart(t, e) {
    if (!this.selected.length) return;
    const i = this.store.getPropertiesCopy(this.selected[0]), o = this.flags[i.mode];
    if (!(o && o.feature && (o.feature.draggable || o.feature.coordinates && o.feature.coordinates.draggable || o.feature.coordinates && o.feature.coordinates.resizable))) return;
    this.dragEventCount = 0;
    const n = this.selected[0], r = this.dragCoordinate.getDraggableIndex(t, n);
    return o && o.feature && o.feature.coordinates && (o.feature.coordinates.draggable || o.feature.coordinates.resizable) && r !== -1 ? (this.setCursor(this.cursors.dragStart), o.feature.coordinates.resizable ? this.dragCoordinateResizeFeature.startDragging(n, r) : this.dragCoordinate.startDragging(n, r), void e(!1)) : o && o.feature && o.feature.draggable && this.dragFeature.canDrag(t, n) ? (this.setCursor(this.cursors.dragStart), this.dragFeature.startDragging(t, n), void e(!1)) : void 0;
  }
  onDrag(t, e) {
    const i = this.selected[0];
    if (!i) return;
    const o = this.store.getPropertiesCopy(i), n = this.flags[o.mode], r = (n && n.feature && n.feature.selfIntersectable) === !0;
    if (this.dragEventCount++, this.dragEventCount % this.dragEventThrottle == 0) return;
    const a = this.validations[o.mode];
    if (n && n.feature && n.feature.rotateable && this.canRotate(t)) return e(!1), void this.rotateFeature.rotate(t, i, a);
    if (n && n.feature && n.feature.scaleable && this.canScale(t)) return e(!1), void this.scaleFeature.scale(t, i, a);
    if (this.dragCoordinateResizeFeature.isDragging() && n.feature && n.feature.coordinates && n.feature.coordinates.resizable) {
      if (this.projection === "globe") throw new Error("Globe is currently unsupported projection for resizable");
      return e(!1), void this.dragCoordinateResizeFeature.drag(t, n.feature.coordinates.resizable, a);
    }
    this.dragCoordinate.isDragging() ? this.dragCoordinate.drag(t, r, a) : this.dragFeature.isDragging() ? this.dragFeature.drag(t, a) : e(!0);
  }
  onDragEnd(t, e) {
    this.setCursor(this.cursors.dragEnd), this.dragCoordinate.isDragging() ? this.onFinish(this.selected[0], { mode: this.mode, action: "dragCoordinate" }) : this.dragFeature.isDragging() ? this.onFinish(this.selected[0], { mode: this.mode, action: "dragFeature" }) : this.dragCoordinateResizeFeature.isDragging() && this.onFinish(this.selected[0], { mode: this.mode, action: "dragCoordinateResize" }), this.dragCoordinate.stopDragging(), this.dragFeature.stopDragging(), this.dragCoordinateResizeFeature.stopDragging(), this.rotateFeature.reset(), this.scaleFeature.reset(), e(!0);
  }
  onMouseMove(t) {
    if (!this.selected.length) return void this.setCursor("unset");
    if (this.dragFeature.isDragging()) return;
    let e = !1;
    this.midPoints.ids.forEach((n) => {
      if (e) return;
      const r = this.store.getGeometryCopy(n);
      this.pixelDistance.measure(t, r.coordinates) < this.pointerDistance && (e = !0);
    });
    let i = !1;
    if (this.selectionPoints.ids.forEach((n) => {
      const r = this.store.getGeometryCopy(n);
      this.pixelDistance.measure(t, r.coordinates) < this.pointerDistance && (e = !1, i = !0);
    }), e) return void this.setCursor(this.cursors.insertMidpoint);
    const { clickedFeature: o } = this.featuresAtMouseEvent.find(t, !0);
    this.setCursor(this.selected.length > 0 && (o && o.id === this.selected[0] || i) ? this.cursors.pointerOver : "unset");
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    if (t.properties.mode === this.mode && t.geometry.type === "Point") {
      if (t.properties.selectionPoint) return e.pointColor = this.getHexColorStylingValue(this.styles.selectionPointColor, e.pointColor, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.selectionPointOutlineColor, e.pointOutlineColor, t), e.pointWidth = this.getNumericStylingValue(this.styles.selectionPointWidth, e.pointWidth, t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.selectionPointOutlineWidth, 2, t), e.zIndex = 30, e;
      if (t.properties.midPoint) return e.pointColor = this.getHexColorStylingValue(this.styles.midPointColor, e.pointColor, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.midPointOutlineColor, e.pointOutlineColor, t), e.pointWidth = this.getNumericStylingValue(this.styles.midPointWidth, 4, t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.midPointOutlineWidth, 2, t), e.zIndex = 40, e;
    } else if (t.properties[Pt]) {
      if (t.geometry.type === "Polygon") return e.polygonFillColor = this.getHexColorStylingValue(this.styles.selectedPolygonColor, e.polygonFillColor, t), e.polygonOutlineWidth = this.getNumericStylingValue(this.styles.selectedPolygonOutlineWidth, e.polygonOutlineWidth, t), e.polygonOutlineColor = this.getHexColorStylingValue(this.styles.selectedPolygonOutlineColor, e.polygonOutlineColor, t), e.polygonFillOpacity = this.getNumericStylingValue(this.styles.selectedPolygonFillOpacity, e.polygonFillOpacity, t), e.zIndex = 10, e;
      if (t.geometry.type === "LineString") return e.lineStringColor = this.getHexColorStylingValue(this.styles.selectedLineStringColor, e.lineStringColor, t), e.lineStringWidth = this.getNumericStylingValue(this.styles.selectedLineStringWidth, e.lineStringWidth, t), e.zIndex = 10, e;
      if (t.geometry.type === "Point") return e.pointWidth = this.getNumericStylingValue(this.styles.selectedPointWidth, e.pointWidth, t), e.pointColor = this.getHexColorStylingValue(this.styles.selectedPointColor, e.pointColor, t), e.pointOutlineColor = this.getHexColorStylingValue(this.styles.selectedPointOutlineColor, e.pointOutlineColor, t), e.pointOutlineWidth = this.getNumericStylingValue(this.styles.selectedPointOutlineWidth, e.pointOutlineWidth, t), e.zIndex = 10, e;
    }
    return e;
  }
}
class ze extends O {
  constructor(...t) {
    super(...t), this.type = G.Static, this.mode = "static";
  }
  start() {
  }
  stop() {
  }
  onKeyUp() {
  }
  onKeyDown() {
  }
  onClick() {
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  onMouseMove() {
  }
  cleanUp() {
  }
  styleFeature() {
    return f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
  }
}
function de(s, t, e, i, o) {
  for (; i > e; ) {
    if (i - e > 600) {
      const l = i - e + 1, d = t - e + 1, h = Math.log(l), c = 0.5 * Math.exp(2 * h / 3), u = 0.5 * Math.sqrt(h * c * (l - c) / l) * (d - l / 2 < 0 ? -1 : 1);
      de(s, t, Math.max(e, Math.floor(t - d * c / l + u)), Math.min(i, Math.floor(t + (l - d) * c / l + u)), o);
    }
    const n = s[t];
    let r = e, a = i;
    for (K(s, e, t), o(s[i], n) > 0 && K(s, e, i); r < a; ) {
      for (K(s, r, a), r++, a--; o(s[r], n) < 0; ) r++;
      for (; o(s[a], n) > 0; ) a--;
    }
    o(s[e], n) === 0 ? K(s, e, a) : (a++, K(s, a, i)), a <= t && (e = a + 1), t <= a && (i = a - 1);
  }
}
function K(s, t, e) {
  const i = s[t];
  s[t] = s[e], s[e] = i;
}
function R(s, t) {
  Y(s, 0, s.children.length, t, s);
}
function Y(s, t, e, i, o) {
  o || (o = U([])), o.minX = 1 / 0, o.minY = 1 / 0, o.maxX = -1 / 0, o.maxY = -1 / 0;
  for (let n = t; n < e; n++) {
    const r = s.children[n];
    z(o, s.leaf ? i(r) : r);
  }
  return o;
}
function z(s, t) {
  return s.minX = Math.min(s.minX, t.minX), s.minY = Math.min(s.minY, t.minY), s.maxX = Math.max(s.maxX, t.maxX), s.maxY = Math.max(s.maxY, t.maxY), s;
}
function He(s, t) {
  return s.minX - t.minX;
}
function $e(s, t) {
  return s.minY - t.minY;
}
function vt(s) {
  return (s.maxX - s.minX) * (s.maxY - s.minY);
}
function nt(s) {
  return s.maxX - s.minX + (s.maxY - s.minY);
}
function Je(s, t) {
  const e = Math.max(s.minX, t.minX), i = Math.max(s.minY, t.minY), o = Math.min(s.maxX, t.maxX), n = Math.min(s.maxY, t.maxY);
  return Math.max(0, o - e) * Math.max(0, n - i);
}
function Ct(s, t) {
  return s.minX <= t.minX && s.minY <= t.minY && t.maxX <= s.maxX && t.maxY <= s.maxY;
}
function rt(s, t) {
  return t.minX <= s.maxX && t.minY <= s.maxY && t.maxX >= s.minX && t.maxY >= s.minY;
}
function U(s) {
  return { children: s, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function Ht(s, t, e, i, o) {
  const n = [t, e];
  for (; n.length; ) {
    if ((e = n.pop()) - (t = n.pop()) <= i) continue;
    const r = t + Math.ceil((e - t) / i / 2) * i;
    de(s, r, t, e, o), n.push(t, r, r, e);
  }
}
class qe {
  constructor(t) {
    this._maxEntries = void 0, this._minEntries = void 0, this.data = void 0, this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
  }
  search(t) {
    let e = this.data;
    const i = [];
    if (!rt(t, e)) return i;
    const o = this.toBBox, n = [];
    for (; e; ) {
      for (let r = 0; r < e.children.length; r++) {
        const a = e.children[r], l = e.leaf ? o(a) : a;
        rt(t, l) && (e.leaf ? i.push(a) : Ct(t, l) ? this._all(a, i) : n.push(a));
      }
      e = n.pop();
    }
    return i;
  }
  collides(t) {
    let e = this.data;
    if (rt(t, e)) {
      const i = [];
      for (; e; ) {
        for (let o = 0; o < e.children.length; o++) {
          const n = e.children[o], r = e.leaf ? this.toBBox(n) : n;
          if (rt(t, r)) {
            if (e.leaf || Ct(t, r)) return !0;
            i.push(n);
          }
        }
        e = i.pop();
      }
    }
    return !1;
  }
  load(t) {
    if (t.length < this._minEntries) {
      for (let i = 0; i < t.length; i++) this.insert(t[i]);
      return;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (this.data.children.length) if (this.data.height === e.height) this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const i = this.data;
        this.data = e, e = i;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    else this.data = e;
  }
  insert(t) {
    this._insert(t, this.data.height - 1);
  }
  clear() {
    this.data = U([]);
  }
  remove(t) {
    let e = this.data;
    const i = this.toBBox(t), o = [], n = [];
    let r, a, l = !1;
    for (; e || o.length; ) {
      if (e || (e = o.pop(), a = o[o.length - 1], r = n.pop(), l = !0), e.leaf) {
        const d = e.children.indexOf(t);
        d !== -1 && (e.children.splice(d, 1), o.push(e), this._condense(o));
      }
      l || e.leaf || !Ct(e, i) ? a ? (r++, e = a.children[r], l = !1) : e = null : (o.push(e), n.push(r), r = 0, a = e, e = e.children[0]);
    }
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  _all(t, e) {
    const i = [];
    for (; t; ) t.leaf ? e.push(...t.children) : i.push(...t.children), t = i.pop();
    return e;
  }
  _build(t, e, i, o) {
    const n = i - e + 1;
    let r, a = this._maxEntries;
    if (n <= a) return r = U(t.slice(e, i + 1)), R(r, this.toBBox), r;
    o || (o = Math.ceil(Math.log(n) / Math.log(a)), a = Math.ceil(n / Math.pow(a, o - 1))), r = U([]), r.leaf = !1, r.height = o;
    const l = Math.ceil(n / a), d = l * Math.ceil(Math.sqrt(a));
    Ht(t, e, i, d, this.compareMinX);
    for (let h = e; h <= i; h += d) {
      const c = Math.min(h + d - 1, i);
      Ht(t, h, c, l, this.compareMinY);
      for (let u = h; u <= c; u += l) {
        const g = Math.min(u + l - 1, c);
        r.children.push(this._build(t, u, g, o - 1));
      }
    }
    return R(r, this.toBBox), r;
  }
  _chooseSubtree(t, e, i, o) {
    for (; o.push(e), !e.leaf && o.length - 1 !== i; ) {
      let a, l = 1 / 0, d = 1 / 0;
      for (let h = 0; h < e.children.length; h++) {
        const c = e.children[h], u = vt(c), g = (n = t, r = c, (Math.max(r.maxX, n.maxX) - Math.min(r.minX, n.minX)) * (Math.max(r.maxY, n.maxY) - Math.min(r.minY, n.minY)) - u);
        g < d ? (d = g, l = u < l ? u : l, a = c) : g === d && u < l && (l = u, a = c);
      }
      e = a || e.children[0];
    }
    var n, r;
    return e;
  }
  _insert(t, e, i) {
    const o = i ? t : this.toBBox(t), n = [], r = this._chooseSubtree(o, this.data, e, n);
    for (r.children.push(t), z(r, o); e >= 0 && n[e].children.length > this._maxEntries; ) this._split(n, e), e--;
    this._adjustParentBBoxes(o, n, e);
  }
  _split(t, e) {
    const i = t[e], o = i.children.length, n = this._minEntries;
    this._chooseSplitAxis(i, n, o);
    const r = this._chooseSplitIndex(i, n, o), a = U(i.children.splice(r, i.children.length - r));
    a.height = i.height, a.leaf = i.leaf, R(i, this.toBBox), R(a, this.toBBox), e ? t[e - 1].children.push(a) : this._splitRoot(i, a);
  }
  _splitRoot(t, e) {
    this.data = U([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, R(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, i) {
    let o, n = 1 / 0, r = 1 / 0;
    for (let a = e; a <= i - e; a++) {
      const l = Y(t, 0, a, this.toBBox), d = Y(t, a, i, this.toBBox), h = Je(l, d), c = vt(l) + vt(d);
      h < n ? (n = h, o = a, r = c < r ? c : r) : h === n && c < r && (r = c, o = a);
    }
    return o || i - e;
  }
  _chooseSplitAxis(t, e, i) {
    const o = t.leaf ? this.compareMinX : He, n = t.leaf ? this.compareMinY : $e;
    this._allDistMargin(t, e, i, o) < this._allDistMargin(t, e, i, n) && t.children.sort(o);
  }
  _allDistMargin(t, e, i, o) {
    t.children.sort(o);
    const n = this.toBBox, r = Y(t, 0, e, n), a = Y(t, i - e, i, n);
    let l = nt(r) + nt(a);
    for (let d = e; d < i - e; d++) {
      const h = t.children[d];
      z(r, t.leaf ? n(h) : h), l += nt(r);
    }
    for (let d = i - e - 1; d >= e; d--) {
      const h = t.children[d];
      z(a, t.leaf ? n(h) : h), l += nt(a);
    }
    return l;
  }
  _adjustParentBBoxes(t, e, i) {
    for (let o = i; o >= 0; o--) z(e[o], t);
  }
  _condense(t) {
    for (let e, i = t.length - 1; i >= 0; i--) t[i].children.length === 0 ? i > 0 ? (e = t[i - 1].children, e.splice(e.indexOf(t[i]), 1)) : this.clear() : R(t[i], this.toBBox);
  }
}
class Ze {
  constructor(t) {
    this.tree = void 0, this.idToNode = void 0, this.nodeToId = void 0, this.tree = new qe(t && t.maxEntries ? t.maxEntries : 9), this.idToNode = /* @__PURE__ */ new Map(), this.nodeToId = /* @__PURE__ */ new Map();
  }
  setMaps(t, e) {
    this.idToNode.set(t.id, e), this.nodeToId.set(e, t.id);
  }
  toBBox(t) {
    const e = [], i = [];
    let o;
    if (t.geometry.type === "Polygon") o = t.geometry.coordinates[0];
    else if (t.geometry.type === "LineString") o = t.geometry.coordinates;
    else {
      if (t.geometry.type !== "Point") throw new Error("Not a valid feature to turn into a bounding box");
      o = [t.geometry.coordinates];
    }
    for (let a = 0; a < o.length; a++) i.push(o[a][1]), e.push(o[a][0]);
    const n = Math.min(...i), r = Math.max(...i);
    return { minX: Math.min(...e), minY: n, maxX: Math.max(...e), maxY: r };
  }
  insert(t) {
    if (this.idToNode.get(String(t.id))) throw new Error("Feature already exists");
    const e = this.toBBox(t);
    this.setMaps(t, e), this.tree.insert(e);
  }
  load(t) {
    const e = [], i = /* @__PURE__ */ new Set();
    t.forEach((o) => {
      const n = this.toBBox(o);
      if (this.setMaps(o, n), i.has(String(o.id))) throw new Error(`Duplicate feature ID found ${o.id}`);
      i.add(String(o.id)), e.push(n);
    }), this.tree.load(e);
  }
  update(t) {
    this.remove(t.id);
    const e = this.toBBox(t);
    this.setMaps(t, e), this.tree.insert(e);
  }
  remove(t) {
    const e = this.idToNode.get(t);
    if (!e) throw new Error(`${t} not inserted into the spatial index`);
    this.tree.remove(e);
  }
  clear() {
    this.tree.clear();
  }
  search(t) {
    return this.tree.search(this.toBBox(t)).map((e) => this.nodeToId.get(e));
  }
  collides(t) {
    return this.tree.collides(this.toBBox(t));
  }
}
const Qe = { getId: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(s) {
  const t = 16 * Math.random() | 0;
  return (s == "x" ? t : 3 & t | 8).toString(16);
}), isValidId: (s) => typeof s == "string" && s.length === 36 };
class ti {
  constructor(t) {
    this.idStrategy = void 0, this.tracked = void 0, this.spatialIndex = void 0, this.store = void 0, this._onChange = () => {
    }, this.store = {}, this.spatialIndex = new Ze(), this.tracked = !t || t.tracked !== !1, this.idStrategy = t && t.idStrategy ? t.idStrategy : Qe;
  }
  clone(t) {
    return JSON.parse(JSON.stringify(t));
  }
  getId() {
    return this.idStrategy.getId();
  }
  has(t) {
    return !!this.store[t];
  }
  load(t, e) {
    if (t.length === 0) return;
    const i = this.clone(t);
    i.forEach((n) => {
      n.id == null && (n.id = this.idStrategy.getId()), this.tracked && (n.properties.createdAt ? Gt(n.properties.createdAt) : n.properties.createdAt = +/* @__PURE__ */ new Date(), n.properties.updatedAt ? Gt(n.properties.updatedAt) : n.properties.updatedAt = +/* @__PURE__ */ new Date());
    });
    const o = [];
    i.forEach((n) => {
      const r = n.id;
      if (e && !e(n)) throw new Error(`Feature is not ${r} valid: ${JSON.stringify(n)}`);
      if (this.has(r)) throw new Error(`Feature already exists with this id: ${r}`);
      this.store[r] = n, o.push(r);
    }), this.spatialIndex.load(i), this._onChange(o, "create");
  }
  search(t, e) {
    const i = this.spatialIndex.search(t).map((o) => this.store[o]);
    return this.clone(e ? i.filter(e) : i);
  }
  registerOnChange(t) {
    this._onChange = (e, i) => {
      t(e, i);
    };
  }
  getGeometryCopy(t) {
    const e = this.store[t];
    if (!e) throw new Error(`No feature with this id (${t}), can not get geometry copy`);
    return this.clone(e.geometry);
  }
  getPropertiesCopy(t) {
    const e = this.store[t];
    if (!e) throw new Error(`No feature with this id (${t}), can not get properties copy`);
    return this.clone(e.properties);
  }
  updateProperty(t) {
    const e = [];
    t.forEach(({ id: i, property: o, value: n }) => {
      const r = this.store[i];
      if (!r) throw new Error(`No feature with this (${i}), can not update geometry`);
      e.push(i), r.properties[o] = n, this.tracked && (r.properties.updatedAt = +/* @__PURE__ */ new Date());
    }), this._onChange && this._onChange(e, "update");
  }
  updateGeometry(t) {
    const e = [];
    t.forEach(({ id: i, geometry: o }) => {
      e.push(i);
      const n = this.store[i];
      if (!n) throw new Error(`No feature with this (${i}), can not update geometry`);
      n.geometry = this.clone(o), this.spatialIndex.update(n), this.tracked && (n.properties.updatedAt = +/* @__PURE__ */ new Date());
    }), this._onChange && this._onChange(e, "update");
  }
  create(t) {
    const e = [];
    return t.forEach(({ geometry: i, properties: o }) => {
      let n, r = f({}, o);
      this.tracked && (n = +/* @__PURE__ */ new Date(), o ? (r.createdAt = typeof o.createdAt == "number" ? o.createdAt : n, r.updatedAt = typeof o.updatedAt == "number" ? o.updatedAt : n) : r = { createdAt: n, updatedAt: n });
      const a = this.getId(), l = { id: a, type: "Feature", geometry: i, properties: r };
      this.store[a] = l, this.spatialIndex.insert(l), e.push(a);
    }), this._onChange && this._onChange([...e], "create"), e;
  }
  delete(t) {
    t.forEach((e) => {
      if (!this.store[e]) throw new Error("No feature with this id, can not delete");
      delete this.store[e], this.spatialIndex.remove(e);
    }), this._onChange && this._onChange([...t], "delete");
  }
  copyAll() {
    return this.clone(Object.keys(this.store).map((t) => this.store[t]));
  }
  clear() {
    this.store = {}, this.spatialIndex.clear();
  }
  size() {
    return Object.keys(this.store).length;
  }
}
const ei = (s) => (s.geometry.type === "Polygon" || s.geometry.type === "LineString") && !_t(s);
function $t(s, t, e) {
  const i = ht(s, t);
  let o = ht(t, e) - i;
  return o < 0 && (o += 360), 180 - Math.abs(o - 90 - 90);
}
class ii extends O {
  constructor(t) {
    super(t), this.mode = "angled-rectangle", this.currentCoordinate = 0, this.currentId = void 0, this.keyEvents = void 0, this.pixelDistance = void 0, this.cursors = void 0, this.mouseMove = !1;
    const e = { start: "crosshair", close: "pointer" };
    if (this.cursors = t && t.cursors ? f({}, e, t.cursors) : e, (t == null ? void 0 : t.keyEvents) === null) this.keyEvents = { cancel: null, finish: null };
    else {
      const i = { cancel: "Escape", finish: "Enter" };
      this.keyEvents = t && t.keyEvents ? f({}, i, t.keyEvents) : i;
    }
  }
  close() {
    if (this.currentId === void 0) return;
    const t = this.currentId;
    this.currentCoordinate = 0, this.currentId = void 0, this.state === "drawing" && this.setStarted(), this.onFinish(t, { mode: this.mode, action: "draw" });
  }
  registerBehaviors(t) {
    this.pixelDistance = new pt(t);
  }
  start() {
    this.setStarted(), this.setCursor(this.cursors.start);
  }
  stop() {
    this.cleanUp(), this.setStopped(), this.setCursor("unset");
  }
  onMouseMove(t) {
    if (this.mouseMove = !0, this.setCursor(this.cursors.start), this.currentId === void 0 || this.currentCoordinate === 0) return;
    const e = this.store.getGeometryCopy(this.currentId).coordinates[0];
    let i;
    if (this.currentCoordinate === 1) {
      const o = 1 / Math.pow(10, this.coordinatePrecision - 1), n = Math.max(1e-6, o);
      i = [e[0], [t.lng, t.lat], [t.lng, t.lat - n], e[0]];
    } else if (this.currentCoordinate === 2) {
      const o = e[0], n = e[1], r = re(o, n, this.coordinatePrecision, this.project, this.unproject), a = P(o[0], o[1]), l = P(r[0], r[1]), d = P(n[0], n[1]), h = P(t.lng, t.lat), c = I(h, a) < I(h, d), u = $t(a, l, h), g = c ? 90 - u : $t(a, l, h) - 90, p = I(l, h), y = Math.cos(w(g)) * p, v = ht(a, d) + (function(_, S, F) {
        const B = (F.x - S.x) * (_.y - S.y) - (F.y - S.y) * (_.x - S.x);
        return B > 1e-10 ? "left" : B < -1e-10 ? "right" : "left";
      }(a, d, h) === "right" ? -90 : 90), m = Tt(a, y, v), x = Tt(d, y, v), M = j(m.x, m.y), E = j(x.x, x.y);
      i = [e[0], e[1], [E.lng, E.lat], [M.lng, M.lat], e[0]];
    }
    i && this.updatePolygonGeometry(this.currentId, i, C.Provisional);
  }
  updatePolygonGeometry(t, e, i) {
    const o = { type: "Polygon", coordinates: [e] };
    return !(this.validate && !this.validate({ type: "Feature", geometry: o }, { project: this.project, unproject: this.unproject, coordinatePrecision: this.coordinatePrecision, updateType: i }) || (this.store.updateGeometry([{ id: t, geometry: o }]), 0));
  }
  onClick(t) {
    if (this.currentCoordinate > 0 && !this.mouseMove && this.onMouseMove(t), this.mouseMove = !1, this.currentCoordinate === 0) {
      const [e] = this.store.create([{ geometry: { type: "Polygon", coordinates: [[[t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat], [t.lng, t.lat]]] }, properties: { mode: this.mode } }]);
      this.currentId = e, this.currentCoordinate++, this.setDrawing();
    } else if (this.currentCoordinate === 1 && this.currentId) {
      const e = this.store.getGeometryCopy(this.currentId);
      if ($([t.lng, t.lat], e.coordinates[0][0]) || !this.updatePolygonGeometry(this.currentId, [e.coordinates[0][0], [t.lng, t.lat], [t.lng, t.lat], e.coordinates[0][0]], C.Commit)) return;
      this.currentCoordinate++;
    } else this.currentCoordinate === 2 && this.currentId && this.close();
  }
  onKeyUp(t) {
    t.key === this.keyEvents.cancel ? this.cleanUp() : t.key === this.keyEvents.finish && this.close();
  }
  onKeyDown() {
  }
  onDragStart() {
  }
  onDrag() {
  }
  onDragEnd() {
  }
  cleanUp() {
    try {
      this.currentId && this.store.delete([this.currentId]);
    } catch {
    }
    this.currentId = void 0, this.currentCoordinate = 0, this.state === "drawing" && this.setStarted();
  }
  styleFeature(t) {
    const e = f({}, { polygonFillColor: "#3f97e0", polygonOutlineColor: "#3f97e0", polygonOutlineWidth: 4, polygonFillOpacity: 0.3, pointColor: "#3f97e0", pointOutlineColor: "#ffffff", pointOutlineWidth: 0, pointWidth: 6, lineStringColor: "#3f97e0", lineStringWidth: 4, zIndex: 0 });
    return t.properties.mode === this.mode && t.geometry.type === "Polygon" && (e.polygonFillColor = this.getHexColorStylingValue(this.styles.fillColor, e.polygonFillColor, t), e.polygonOutlineColor = this.getHexColorStylingValue(this.styles.outlineColor, e.polygonOutlineColor, t), e.polygonOutlineWidth = this.getNumericStylingValue(this.styles.outlineWidth, e.polygonOutlineWidth, t), e.polygonFillOpacity = this.getNumericStylingValue(this.styles.fillOpacity, e.polygonFillOpacity, t), e.zIndex = 10), e;
  }
  validateFeature(t) {
    return !!super.validateFeature(t) && t.properties.mode === this.mode && q(t, this.coordinatePrecision);
  }
}
class oi {
  constructor(t) {
    this._modes = void 0, this._mode = void 0, this._adapter = void 0, this._enabled = !1, this._store = void 0, this._eventListeners = void 0, this._instanceSelectMode = void 0, this._adapter = t.adapter, this._mode = new ze();
    const e = /* @__PURE__ */ new Set(), i = t.modes.reduce((h, c) => {
      if (e.has(c.mode)) throw new Error(`There is already a ${c.mode} mode provided`);
      return e.add(c.mode), h[c.mode] = c, h;
    }, {}), o = Object.keys(i);
    if (o.length === 0) throw new Error("No modes provided");
    o.forEach((h) => {
      if (i[h].type === G.Select) {
        if (this._instanceSelectMode) throw new Error("only one type of select mode can be provided");
        this._instanceSelectMode = h;
      }
    }), this._modes = f({}, i, { static: this._mode }), this._eventListeners = { change: [], select: [], deselect: [], finish: [], ready: [] }, this._store = new ti({ tracked: !!t.tracked, idStrategy: t.idStrategy ? t.idStrategy : void 0 });
    const n = (h) => {
      const c = [], u = this._store.copyAll().filter((g) => !h.includes(g.id) || (c.push(g), !1));
      return { changed: c, unchanged: u };
    }, r = (h, c) => {
      this._enabled && this._eventListeners.finish.forEach((u) => {
        u(h, c);
      });
    }, a = (h, c) => {
      if (!this._enabled) return;
      this._eventListeners.change.forEach((p) => {
        p(h, c);
      });
      const { changed: u, unchanged: g } = n(h);
      c === "create" ? this._adapter.render({ created: u, deletedIds: [], unchanged: g, updated: [] }, this.getModeStyles()) : c === "update" ? this._adapter.render({ created: [], deletedIds: [], unchanged: g, updated: u }, this.getModeStyles()) : c === "delete" ? this._adapter.render({ created: [], deletedIds: h, unchanged: g, updated: [] }, this.getModeStyles()) : c === "styling" && this._adapter.render({ created: [], deletedIds: [], unchanged: g, updated: [] }, this.getModeStyles());
    }, l = (h) => {
      if (!this._enabled) return;
      this._eventListeners.select.forEach((g) => {
        g(h);
      });
      const { changed: c, unchanged: u } = n([h]);
      this._adapter.render({ created: [], deletedIds: [], unchanged: u, updated: c }, this.getModeStyles());
    }, d = (h) => {
      if (!this._enabled) return;
      this._eventListeners.deselect.forEach((g) => {
        g();
      });
      const { changed: c, unchanged: u } = n([h]);
      c && this._adapter.render({ created: [], deletedIds: [], unchanged: u, updated: c }, this.getModeStyles());
    };
    Object.keys(this._modes).forEach((h) => {
      this._modes[h].register({ mode: h, store: this._store, setCursor: this._adapter.setCursor.bind(this._adapter), project: this._adapter.project.bind(this._adapter), unproject: this._adapter.unproject.bind(this._adapter), setDoubleClickToZoom: this._adapter.setDoubleClickToZoom.bind(this._adapter), onChange: a, onSelect: l, onDeselect: d, onFinish: r, coordinatePrecision: this._adapter.getCoordinatePrecision() });
    });
  }
  checkEnabled() {
    if (!this._enabled) throw new Error("Terra Draw is not enabled");
  }
  getModeStyles() {
    const t = {};
    return Object.keys(this._modes).forEach((e) => {
      t[e] = (i) => this._instanceSelectMode && i.properties[Pt] ? this._modes[this._instanceSelectMode].styleFeature.bind(this._modes[this._instanceSelectMode])(i) : this._modes[e].styleFeature.bind(this._modes[e])(i);
    }), t;
  }
  featuresAtLocation({ lng: t, lat: e }, i) {
    const o = i && i.pointerDistance !== void 0 ? i.pointerDistance : 30, n = !i || i.ignoreSelectFeatures === void 0 || i.ignoreSelectFeatures, r = this._adapter.unproject.bind(this._adapter), a = this._adapter.project.bind(this._adapter), l = a(t, e), d = oe({ unproject: r, point: l, pointerDistance: o });
    return this._store.search(d).filter((h) => {
      if (n && (h.properties[H] || h.properties.selectionPoint)) return !1;
      if (h.geometry.type === "Point") {
        const c = h.geometry.coordinates, u = a(c[0], c[1]);
        return I(l, u) < o;
      }
      if (h.geometry.type === "LineString") {
        const c = h.geometry.coordinates;
        for (let u = 0; u < c.length - 1; u++) {
          const g = c[u], p = c[u + 1];
          if (le(l, a(g[0], g[1]), a(p[0], p[1])) < o) return !0;
        }
        return !1;
      }
      return !!ae([t, e], h.geometry.coordinates) || void 0;
    });
  }
  getSelectMode() {
    if (this.checkEnabled(), !this._instanceSelectMode) throw new Error("No select mode defined in instance");
    return this.getMode() !== this._instanceSelectMode && this.setMode(this._instanceSelectMode), this._modes[this._instanceSelectMode];
  }
  setModeStyles(t, e) {
    if (this.checkEnabled(), !this._modes[t]) throw new Error("No mode with this name present");
    this._modes[t].styles = e;
  }
  getSnapshot() {
    return this._store.copyAll();
  }
  clear() {
    this.checkEnabled(), this._adapter.clear();
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(t) {
    throw new Error("Enabled is read only");
  }
  getMode() {
    return this._mode.mode;
  }
  setMode(t) {
    if (this.checkEnabled(), !this._modes[t]) throw new Error("No mode with this name present");
    this._mode.stop(), this._mode = this._modes[t], this._mode.start();
  }
  removeFeatures(t) {
    this.checkEnabled(), this._store.delete(t);
  }
  selectFeature(t) {
    this.getSelectMode().selectFeature(t);
  }
  deselectFeature(t) {
    this.getSelectMode().deselectFeature(t);
  }
  getFeatureId() {
    return this._store.getId();
  }
  hasFeature(t) {
    return this._store.has(t);
  }
  addFeatures(t) {
    this.checkEnabled(), t.length !== 0 && this._store.load(t, (e) => {
      if (e && typeof e == "object" && "properties" in e && typeof e.properties == "object" && e.properties !== null && "mode" in e.properties) {
        const i = this._modes[e.properties.mode];
        return !!i && i.validateFeature.bind(i)(e);
      }
      return !1;
    });
  }
  start() {
    this._enabled = !0, this._adapter.register({ onReady: () => {
      this._eventListeners.ready.forEach((t) => {
        t();
      });
    }, getState: () => this._mode.state, onClick: (t) => {
      this._mode.onClick(t);
    }, onMouseMove: (t) => {
      this._mode.onMouseMove(t);
    }, onKeyDown: (t) => {
      this._mode.onKeyDown(t);
    }, onKeyUp: (t) => {
      this._mode.onKeyUp(t);
    }, onDragStart: (t, e) => {
      this._mode.onDragStart(t, e);
    }, onDrag: (t, e) => {
      this._mode.onDrag(t, e);
    }, onDragEnd: (t, e) => {
      this._mode.onDragEnd(t, e);
    }, onClear: () => {
      this._mode.cleanUp(), this._store.clear();
    } });
  }
  getFeaturesAtLngLat(t, e) {
    const { lng: i, lat: o } = t;
    return this.featuresAtLocation({ lng: i, lat: o }, e);
  }
  getFeaturesAtPointerEvent(t, e) {
    const i = this._adapter.getLngLatFromEvent.bind(this._adapter)(t);
    return i === null ? [] : this.featuresAtLocation(i, e);
  }
  stop() {
    this._enabled = !1, this._adapter.unregister();
  }
  on(t, e) {
    const i = this._eventListeners[t];
    i.includes(e) || i.push(e);
  }
  off(t, e) {
    const i = this._eventListeners[t];
    i.includes(e) && i.splice(i.indexOf(e), 1);
  }
}
const si = {
  modes: [
    "point",
    "linestring",
    "polygon",
    "rectangle",
    "angled-rectangle",
    "circle",
    "freehand",
    "select"
  ],
  open: !1
}, ni = () => ({
  render: new Be({
    modeName: "render",
    styles: {}
  }),
  point: new ke(),
  linestring: new Oe(),
  polygon: new Le({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    validation: (t, e) => {
      const i = e.updateType;
      return i === "finish" || i === "commit" ? ei(t) : !0;
    }
  }),
  rectangle: new We(),
  "angled-rectangle": new ii(),
  circle: new we(),
  freehand: new Ie(),
  select: new Ye({
    flags: {
      point: {
        feature: {
          draggable: !0
        }
      },
      polygon: {
        feature: {
          draggable: !0,
          rotateable: !0,
          scaleable: !0,
          coordinates: {
            midpoints: !0,
            draggable: !0,
            deletable: !0
          }
        }
      },
      linestring: {
        feature: {
          draggable: !0,
          coordinates: {
            midpoints: !0,
            draggable: !0,
            deletable: !0
          }
        }
      },
      freehand: {
        feature: {
          draggable: !0,
          coordinates: {
            midpoints: !0,
            draggable: !0,
            deletable: !0
          }
        }
      },
      circle: {
        feature: {
          draggable: !0,
          coordinates: {
            midpoints: !0,
            draggable: !0,
            deletable: !0
          }
        }
      },
      rectangle: {
        feature: {
          draggable: !0,
          rotateable: !0,
          scaleable: !0,
          coordinates: {
            midpoints: !0,
            draggable: !0,
            deletable: !0
          }
        }
      },
      "angled-rectangle": {
        feature: {
          draggable: !0,
          rotateable: !0,
          scaleable: !0,
          coordinates: {
            midpoints: !0,
            draggable: !0,
            deletable: !0
          }
        }
      }
    }
  })
});
class ai {
  /**
   * Constructor
   * @param options Plugin control options
   */
  constructor(t) {
    k(this, "controlContainer");
    k(this, "map");
    k(this, "addButton");
    k(this, "modeButtons", {});
    k(this, "deleteButton");
    k(this, "isExpanded", !1);
    k(this, "terradraw");
    k(this, "options", si);
    this.modeButtons = {}, t && (this.options = Object.assign(this.options, t));
  }
  getDefaultPosition() {
    return "top-right";
  }
  onAdd(t) {
    var o, n;
    if (this.options && this.options.modes && this.options.modes.length === 0)
      throw new Error("At least a mode must be enabled.");
    this.map = t;
    const e = ni(), i = [e.render];
    return (n = (o = this.options) == null ? void 0 : o.modes) == null || n.forEach((r) => {
      if (this.options.modeOptions && this.options.modeOptions[r]) {
        const a = this.options.modeOptions[r];
        if (r === "select") {
          const l = e[r];
          if (l) {
            const d = l.flags;
            Object.keys(d).forEach((h) => {
              a.flags[h] || (a.flags[h] = d[h]);
            });
          }
        }
        i.push(a);
      } else e[r] && i.push(e[r]);
    }), this.isExpanded = this.options.open === !0, this.terradraw = new oi({
      adapter: new pe({ map: t }),
      modes: i
    }), this.terradraw.start(), this.controlContainer = document.createElement("div"), this.controlContainer.classList.add("maplibregl-ctrl"), this.controlContainer.classList.add("maplibregl-ctrl-group"), this.addButton = document.createElement("button"), this.addButton.classList.add("maplibregl-terradraw-add-button"), this.isExpanded && this.addButton.classList.add("enabled"), this.addButton.type = "button", this.addButton.addEventListener("click", this.toggleEditor.bind(this)), i.forEach((r) => {
      r.mode !== "render" && this.addTerradrawButton(r.mode);
    }), this.deleteButton = document.createElement("button"), this.deleteButton.classList.add("maplibregl-terradraw-add-control"), this.deleteButton.classList.add("maplibregl-terradraw-delete-button"), this.isExpanded || this.deleteButton.classList.add("hidden"), this.deleteButton.type = "button", this.deleteButton.addEventListener("click", () => {
      this.terradraw && this.terradraw.enabled && (this.terradraw.clear(), this.deactivate());
    }), this.controlContainer.appendChild(this.addButton), Object.values(this.modeButtons).forEach((r) => {
      var a;
      (a = this.controlContainer) == null || a.appendChild(r);
    }), this.controlContainer.appendChild(this.deleteButton), this.controlContainer;
  }
  onRemove() {
    !this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.addButton || (this.deactivate(), this.modeButtons = {}, this.terradraw = void 0, this.map = void 0, this.controlContainer.parentNode.removeChild(this.controlContainer));
  }
  /**
   * Activate Terra Draw to start drawing
   */
  activate() {
    this.terradraw && (this.terradraw.enabled || this.terradraw.start());
  }
  /**
   * Deactivate Terra Draw to stop drawing
   */
  deactivate() {
    this.terradraw && this.terradraw.enabled && (this.resetActiveMode(), this.terradraw.stop());
  }
  /**
   * Get the Terra Draw instance.
   * For the Terra Draw API, please refer to https://terradraw.io/#/api
   * @returns Terra Draw instance
   */
  getTerraDrawInstance() {
    return this.terradraw;
  }
  /**
   * Toggle editor control
   */
  toggleEditor() {
    var e, i;
    if (!this.terradraw) return;
    const t = document.getElementsByClassName("maplibregl-terradraw-add-control");
    for (let o = 0; o < t.length; o++) {
      const n = t.item(o);
      n && (this.isExpanded ? n.classList.add("hidden") : n.classList.remove("hidden"));
    }
    this.isExpanded ? ((e = this.addButton) == null || e.classList.remove("enabled"), this.resetActiveMode()) : (i = this.addButton) == null || i.classList.add("enabled"), this.isExpanded = !this.isExpanded;
  }
  /**
   * Reset active mode to back to render mode
   */
  resetActiveMode() {
    var e;
    if (!this.terradraw) return;
    this.terradraw.enabled || this.terradraw.start();
    const t = document.getElementsByClassName("maplibregl-terradraw-add-control");
    for (let i = 0; i < t.length; i++) {
      const o = t.item(i);
      o && o.classList.remove("active");
    }
    (e = this.terradraw) == null || e.setMode("render");
  }
  /**
   * Add Terra Draw drawing mode button
   * @param mode Terra Draw mode name
   */
  addTerradrawButton(t) {
    const e = document.createElement("button");
    e.classList.add("maplibregl-terradraw-add-control"), e.classList.add(`maplibregl-terradraw-add-${t}-button`), this.isExpanded || e.classList.add("hidden"), e.type = "button", e.addEventListener("click", () => {
      if (!this.terradraw) return;
      const i = e.classList.contains("active");
      this.activate(), this.resetActiveMode(), i || (this.terradraw.setMode(t), e.classList.add("active"));
    }), this.modeButtons[t] = e;
  }
}
export {
  ai as default
};
//# sourceMappingURL=maplibre-gl-terradraw.es.js.map
