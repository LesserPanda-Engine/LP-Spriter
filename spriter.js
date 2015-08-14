/**
 * Spriter plugin for LesserPanda
 * @version 0.0.1
 * @author Sean Bohan (pixelpicosean@gmail.com)
 *
 * Based on Spriter.js by:
 * - Jason Andersen jgandersen@gmail.com
 * - Isaac Burns isaacburns@gmail.com
 */

/**
 * A JavaScript API for the Spriter SCON animation data format.
 */
(function(spriter) { 'use strict';

  /**
   * Stores animation data (scon objects)
   * @type {Object}
   */
  var scons = {};

  function loaderMiddleWare(res, next) {
    if (res.url.match(/\.scon$/)) {
      // console.log('%s is scon', res.url);
      var path = res.url.replace(/[^\/]*$/, '');
      var atlasUrl = res.url.replace(/\.scon$/, '.json');
      // console.log(atlasUrl);
      PIXI.loader.add(atlasUrl);

      var scon = JSON.parse(res.data);
      scons[res.name] = new Data(scon);
    }
    next();
  };

  /**
   * Get the data object of a specific scon file asset key
   * @param  {String} sconKey Key of the scon file
   * @return {Data}   Data object created for the scon file
   */
  function getData(sconKey) {
    return scons[sconKey];
  };

  /**
   * @constructor
   * @param {number=} rad
   */
  function Angle(rad) {
    this.rad = rad || 0;
  }

  Object.defineProperty(Angle.prototype, 'deg', {
    /** @this {Angle} */
    get: function() {
      return this.rad * 180 / Math.PI;
    },
    /** @this {Angle} */
    set: function(value) {
      this.rad = value * Math.PI / 180;
    }
  });

  Object.defineProperty(Angle.prototype, 'cos', {
    /** @this {Angle} */
    get: function() {
      return Math.cos(this.rad);
    }
  });

  Object.defineProperty(Angle.prototype, 'sin', {
    /** @this {Angle} */
    get: function() {
      return Math.sin(this.rad);
    }
  });

  /**
   * @return {Angle}
   */
  Angle.prototype.selfIdentity = function() {
    this.rad = 0;
    return this;
  }

  /**
   * @return {Angle}
   * @param {Angle} other
   */
  Angle.prototype.copy = function(other) {
    this.rad = other.rad;
    return this;
  }

  /**
   * @return {Angle}
   * @param {Angle} a
   * @param {Angle} b
   * @param {Angle=} out
   */
  Angle.add = function(a, b, out) {
    out = out || new Angle();
    out.rad = spine.wrapAngleRadians(a.rad + b.rad);
    return out;
  }

  /**
   * @return {Angle}
   * @param {Angle} other
   * @param {Angle=} out
   */
  Angle.prototype.add = function(other, out) {
    return Angle.add(this, other, out);
  }

  /**
   * @return {Angle}
   * @param {Angle} other
   */
  Angle.prototype.selfAdd = function(other) {
    return Angle.add(this, other, this);
  }

  /**
   * @return {Angle}
   * @param {Angle} a
   * @param {Angle} b
   * @param {number} pct
   * @param {number} spin
   * @param {Angle=} out
   */
  Angle.tween = function(a, b, pct, spin, out) {
    out = out || new Angle();
    out.rad = tweenAngleRadians(a.rad, b.rad, pct, spin);
    return out;
  }

  /**
   * @return {Angle}
   * @param {Angle} other
   * @param {number} pct
   * @param {number} spin
   * @param {Angle=} out
   */
  Angle.prototype.tween = function(other, pct, spin, out) {
    return Angle.tween(this, other, pct, spin, out);
  }

  /**
   * @return {Angle}
   * @param {Angle} other
   * @param {number} pct
   * @param {number} spin
   */
  Angle.prototype.selfTween = function(other, pct, spin) {
    return Angle.tween(this, other, pct, spin, this);
  }

  /**
   * @constructor
   * @param {number=} x
   * @param {number=} y
   */
  function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * @return {Vector}
   * @param {Vector} other
   */
  Vector.prototype.copy = function(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  /**
   * @return {Vector}
   * @param {Vector} a
   * @param {Vector} b
   * @param {Vector=} out
   */
  Vector.add = function(a, b, out) {
    out = out || new Vector();
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }

  /**
   * @return {Vector}
   * @param {Vector} other
   * @param {Vector=} out
   */
  Vector.prototype.add = function(other, out) {
    return Vector.add(this, other, out);
  }

  /**
   * @return {Vector}
   * @param {Vector} other
   */
  Vector.prototype.selfAdd = function(other) {
    //return Vector.add(this, other, this);
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * @return {Vector}
   * @param {Vector} a
   * @param {Vector} b
   * @param {number} pct
   * @param {Vector=} out
   */
  Vector.tween = function(a, b, pct, out) {
    out = out || new Vector();
    out.x = tween(a.x, b.x, pct);
    out.y = tween(a.y, b.y, pct);
    return out;
  }

  /**
   * @return {Vector}
   * @param {Vector} other
   * @param {number} pct
   * @param {Vector=} out
   */
  Vector.prototype.tween = function(other, pct, out) {
    return Vector.tween(this, other, pct, out);
  }

  /**
   * @return {Vector}
   * @param {Vector} other
   * @param {number} pct
   */
  Vector.prototype.selfTween = function(other, pct) {
    return Vector.tween(this, other, pct, this);
  }

  /**
   * @constructor
   * @extends {Vector}
   */
  function Scale() {
    Vector.call(this, 1, 1);
  }

  Scale.prototype = Object.create(Vector.prototype);
  Scale.prototype.constructor = Scale;

  /**
   * @return {Scale}
   */
  Scale.prototype.selfIdentity = function() {
    this.x = 1;
    this.y = 1;
    return this;
  }

  /**
   * @constructor
   * @extends {Vector}
   */
  function Pivot() {
    Vector.call(this, 0, 1);
  }

  Pivot.prototype = Object.create(Vector.prototype);
  Pivot.prototype.constructor = Pivot;

  /**
   * @return {Pivot}
   */
  Pivot.prototype.selfIdentity = function() {
    this.x = 0;
    this.y = 1;
    return this;
  }

  /**
   * @constructor
   */
  function Transform() {
    this.position = new Vector();
    this.rotation = new Angle();
    this.scale = new Scale();
  }

  /**
   * @return {Transform}
   * @param {Transform} other
   */
  Transform.prototype.copy = function(other) {
    this.position.copy(other.position);
    this.rotation.copy(other.rotation);
    this.scale.copy(other.scale);
    return this;
  }

  /**
   * @return {Transform}
   * @param {Object.<string,?>} json
   */
  Transform.prototype.load = function(json) {
    this.position.x = loadFloat(json, 'x', 0);
    this.position.y = loadFloat(json, 'y', 0);
    this.rotation.deg = loadFloat(json, 'angle', 0);
    this.scale.x = loadFloat(json, 'scale_x', 1);
    this.scale.y = loadFloat(json, 'scale_y', 1);
    return this;
  }

  /**
   * @return {boolean}
   * @param {Transform} a
   * @param {Transform} b
   * @param {number=} epsilon
   */
  Transform.equal = function(a, b, epsilon) {
    epsilon = epsilon || 1e-6;
    if (Math.abs(a.position.x - b.position.x) > epsilon) {
      return false;
    }
    if (Math.abs(a.position.y - b.position.y) > epsilon) {
      return false;
    }
    if (Math.abs(a.rotation.rad - b.rotation.rad) > epsilon) {
      return false;
    }
    if (Math.abs(a.scale.x - b.scale.x) > epsilon) {
      return false;
    }
    if (Math.abs(a.scale.y - b.scale.y) > epsilon) {
      return false;
    }
    return true;
  }

  /**
   * @return {Transform}
   * @param {Transform=} out
   */
  Transform.identity = function(out) {
    out = out || new Transform();
    out.position.x = 0;
    out.position.y = 0;
    out.rotation.rad = 0;
    out.scale.x = 1;
    out.scale.y = 1;
    return out;
  }

  /**
   * @return {Transform}
   * @param {Transform} space
   * @param {number} x
   * @param {number} y
   */
  Transform.translate = function(space, x, y) {
    x *= space.scale.x;
    y *= space.scale.y;
    var rad = space.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    space.position.x += tx;
    space.position.y += ty;
    return space;
  }

  /**
   * @return {Transform}
   * @param {Transform} space
   * @param {number} rad
   */
  Transform.rotate = function(space, rad) {
    space.rotation.rad = wrapAngleRadians(space.rotation.rad + rad);
    return space;
  }

  /**
   * @return {Transform}
   * @param {Transform} space
   * @param {number} x
   * @param {number} y
   */
  Transform.scale = function(space, x, y) {
    space.scale.x *= x;
    space.scale.y *= y;
    return space;
  }

  /**
   * @return {Transform}
   * @param {Transform} space
   * @param {Transform=} out
   */
  Transform.invert = function(space, out) {
    // invert
    // out.sca = space.sca.inv();
    // out.rot = space.rot.inv();
    // out.pos = space.pos.neg().rotate(space.rot.inv()).mul(space.sca.inv());

    out = out || new Transform();
    var inv_scale_x = 1 / space.scale.x;
    var inv_scale_y = 1 / space.scale.y;
    var inv_rotation = -space.rotation.rad;
    var inv_x = -space.position.x;
    var inv_y = -space.position.y;
    out.scale.x = inv_scale_x;
    out.scale.y = inv_scale_y;
    out.rotation.rad = inv_rotation;
    var x = inv_x;
    var y = inv_y;
    var rad = inv_rotation;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx * inv_scale_x;
    out.position.y = ty * inv_scale_y;
    return out;
  }

  /**
   * @return {Transform}
   * @param {Transform} a
   * @param {Transform} b
   * @param {Transform=} out
   */
  Transform.combine = function(a, b, out) {
    // combine
    // out.pos = b.pos.mul(a.sca).rotate(a.rot).add(a.pos);
    // out.rot = b.rot.mul(a.rot);
    // out.sca = b.sca.mul(a.sca);

    out = out || new Transform();
    var x = b.position.x * a.scale.x;
    var y = b.position.y * a.scale.y;
    var rad = a.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx + a.position.x;
    out.position.y = ty + a.position.y;
    if ((a.scale.x * a.scale.y) < 0) {
      out.rotation.rad = wrapAngleRadians(a.rotation.rad - b.rotation.rad);
    } else {
      out.rotation.rad = wrapAngleRadians(b.rotation.rad + a.rotation.rad);
    }
    out.scale.x = b.scale.x * a.scale.x;
    out.scale.y = b.scale.y * a.scale.y;
    return out;
  }

  /**
   * @return {Transform}
   * @param {Transform} ab
   * @param {Transform} a
   * @param {Transform=} out
   */
  Transform.extract = function(ab, a, out) {
    // extract
    // out.sca = ab.sca.mul(a.sca.inv());
    // out.rot = ab.rot.mul(a.rot.inv());
    // out.pos = ab.pos.add(a.pos.neg()).rotate(a.rot.inv()).mul(a.sca.inv());

    out = out || new Transform();
    out.scale.x = ab.scale.x / a.scale.x;
    out.scale.y = ab.scale.y / a.scale.y;
    if ((a.scale.x * a.scale.y) < 0) {
      out.rotation.rad = wrapAngleRadians(a.rotation.rad + ab.rotation.rad);
    } else {
      out.rotation.rad = wrapAngleRadians(ab.rotation.rad - a.rotation.rad);
    }
    var x = ab.position.x - a.position.x;
    var y = ab.position.y - a.position.y;
    var rad = -a.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx / a.scale.x;
    out.position.y = ty / a.scale.y;
    return out;
  }

  /**
   * @return {Vector}
   * @param {Transform} space
   * @param {Vector} v
   * @param {Vector=} out
   */
  Transform.transform = function(space, v, out) {
    out = out || new Vector();
    var x = v.x * space.scale.x;
    var y = v.y * space.scale.y;
    var rad = space.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.x = tx + space.position.x;
    out.y = ty + space.position.y;
    return out;
  }

  /**
   * @return {Vector}
   * @param {Transform} space
   * @param {Vector} v
   * @param {Vector=} out
   */
  Transform.untransform = function(space, v, out) {
    out = out || new Vector();
    var x = v.x - space.position.x;
    var y = v.y - space.position.y;
    var rad = -space.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.x = tx / space.scale.x;
    out.y = ty / space.scale.y;
    return out;
  }

  /**
   * @return {Transform}
   * @param {Transform} a
   * @param {Transform} b
   * @param {number} tween
   * @param {number} spin
   * @param {Transform=} out
   */
  Transform.tween = function(a, b, twn, spin, out) {
    out.position.x = tween(a.position.x, b.position.x, twn);
    out.position.y = tween(a.position.y, b.position.y, twn);
    out.rotation.rad = tweenAngleRadians(a.rotation.rad, b.rotation.rad, twn, spin);
    out.scale.x = tween(a.scale.x, b.scale.x, twn);
    out.scale.y = tween(a.scale.y, b.scale.y, twn);
    return out;
  }

  /**
   * @constructor
   */
  function File() {
    /** @type {number} */
    this.id = -1;
    /** @type {string} */
    this.name = '';
    /** @type {number} */
    this.width = 0;
    /** @type {number} */
    this.height = 0;
    /** @type {Pivot} */
    this.pivot = new Pivot();
  }

  /**
   * @return {File}
   * @param {Object.<string,?>} json
   */
  File.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.name = loadString(json, 'name', '');
    this.width = loadInt(json, 'width', 0);
    this.height = loadInt(json, 'height', 0);
    this.pivot.x = loadFloat(json, 'pivot_x', 0);
    this.pivot.y = loadFloat(json, 'pivot_y', 1);
    return this;
  }

  /**
   * @constructor
   */
  function Folder() {
    /** @type {number} */
    this.id = -1;
    /** @type {Array.<File>} */
    this.files = [];
  }

  /**
   * @return {Folder}
   * @param {Object.<string,?>} json
   */
  Folder.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.files.length = 0;
    json.file = makeArray(json.file);
    var file;
    for (var i = 0; i < json.file.length; i++) {
      file = json.file[i];
      this.files.push(new File().load(file));
    }
    return this;
  }

  /**
   * @constructor
   */
  function Bone() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parentID = -1;
    /** @type {Transform} */
    this.localSpace = new Transform();
    /** @type {Transform} */
    this.worldSpace = new Transform();
  }

  /**
   * @return {Bone}
   * @param {Object.<string,?>} json
   */
  Bone.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.parentID = loadInt(json, 'parent', -1);
    this.localSpace.load(json);
    this.worldSpace.copy(this.localSpace);
    return this;
  }

  /**
   * @return {Bone}
   * @param {Bone=} other
   */
  Bone.prototype.clone = function(other) {
    return (other || new Bone()).copy(this);
  }

  /**
   * @return {Bone}
   * @param {Bone} other
   */
  Bone.prototype.copy = function(other) {
    this.id = other.id;
    this.parentID = other.parentID;
    this.localSpace.copy(other.localSpace);
    this.worldSpace.copy(other.worldSpace);
    return this;
  }

  /**
   * @return {void}
   * @param {Bone} other
   * @param {number} tween
   * @param {number} spin
   */
  Bone.prototype.tween = function(other, tween, spin) {
    Transform.tween(this.localSpace, other.localSpace, tween, spin, this.localSpace);
  }

  /**
   * @return {Transform}
   * @param {Bone} bone
   * @param {Array.<Bone>} bones
   * @param {Transform=} out
   */
  Bone.flatten = function(bone, bones, out) {
    out = out || new Transform();

    var parent_bone = bones[bone.parentID];
    if (parent_bone) {
      Bone.flatten(parent_bone, bones, out);
    } else {
      Transform.identity(out);
    }

    Transform.combine(out, bone.localSpace, out);

    return out;
  }

  /**
   * @constructor
   */
  function BoneRef() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parentID = -1;
    /** @type {number} */
    this.timelineID = -1;
    /** @type {number} */
    this.keyframeID = -1;
  }

  /**
   * @return {BoneRef}
   * @param {Object.<string,?>} json
   */
  BoneRef.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.parentID = loadInt(json, 'parent', -1);
    this.timelineID = loadInt(json, 'timeline', -1);
    this.keyframeID = loadInt(json, 'key', -1);
    return this;
  }

  /**
   * @return {BoneRef}
   * @param {BoneRef=} other
   */
  BoneRef.prototype.clone = function(other) {
    return (other || new BoneRef()).copy(this);
  }

  /**
   * @return {BoneRef}
   * @param {BoneRef} other
   */
  BoneRef.prototype.copy = function(other) {
    this.id = other.id;
    this.parentID = other.parentID;
    this.timelineID = other.timelineID;
    this.keyframeID = other.keyframeID;
    return this;
  }

  /**
   * @constructor
   */
  function Obj() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parentID = -1;
    /** @type {number} */
    this.folderID = -1;
    /** @type {number} */
    this.fileID = -1;
    /** @type {Transform} */
    this.localSpace = new Transform();
    /** @type {Transform} */
    this.worldSpace = new Transform();
    /** @type {boolean} */
    this.defaultPivot = false;
    /** @type {Pivot} */
    this.pivot = new Pivot();
    /** @type {number} */
    this.zIndex = 0;
    /** @type {number} */
    this.alpha = 1;
  }

  /**
   * @return {Obj}
   * @param {Object.<string,?>} json
   */
  Obj.prototype.load = function(data, json) {
    this.id = loadInt(json, 'id', -1);
    this.parentID = loadInt(json, 'parent', -1);
    this.folderID = loadInt(json, 'folder', -1);
    this.fileID = loadInt(json, 'file', -1);
    this.localSpace.load(json);
    this.worldSpace.copy(this.localSpace);
    if ((typeof(json['pivot_x']) !== 'undefined') ||
      (typeof(json['pivot_y']) !== 'undefined')) {
      this.pivot.x = loadFloat(json, 'pivot_x', 0);
      this.pivot.y = loadFloat(json, 'pivot_y', 1);
    } else {
      this.defaultPivot = true;
      var file = data.getFile(this.folderID, this.fileID);
      this.pivot.copy(file.pivot);
    }
    this.zIndex = loadInt(json, 'zIndex', 0);
    this.alpha = loadFloat(json, 'a', 1);
    return this;
  }

  /**
   * @return {Obj}
   * @param {Obj=} other
   */
  Obj.prototype.clone = function(other) {
    return (other || new Obj()).copy(this);
  }

  /**
   * @return {Obj}
   * @param {Obj} other
   */
  Obj.prototype.copy = function(other) {
    this.id = other.id;
    this.parentID = other.parentID;
    this.folderID = other.folderID;
    this.fileID = other.fileID;
    this.localSpace.copy(other.localSpace);
    this.worldSpace.copy(other.worldSpace);
    this.defaultPivot = other.defaultPivot;
    this.pivot.copy(other.pivot);
    this.zIndex = other.zIndex;
    this.alpha = other.alpha;
    return this;
  }

  /**
   * @return {void}
   * @param {Obj} other
   * @param {number} twn
   * @param {number} spin
   */
  Obj.prototype.tween = function(other, twn, spin) {
    Transform.tween(this.localSpace, other.localSpace, twn, spin, this.localSpace);
    Vector.tween(this.pivot, other.pivot, twn, this.pivot);
    this.alpha = tween(this.alpha, other.alpha, twn);
  }

  /**
   * @constructor
   */
  function ObjRef() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parentID = -1;
    /** @type {number} */
    this.timelineID = -1;
    /** @type {number} */
    this.keyframeID = -1;
    /** @type {number} */
    this.zIndex = 0;
  }

  /**
   * @return {ObjRef}
   * @param {Object.<string,?>} json
   */
  ObjRef.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.parentID = loadInt(json, 'parent', -1);
    this.timelineID = loadInt(json, 'timeline', -1);
    this.keyframeID = loadInt(json, 'key', -1);
    this.zIndex = loadInt(json, 'zIndex', 0);
    return this;
  }

  /**
   * @return {ObjRef}
   * @param {ObjRef=} other
   */
  ObjRef.prototype.clone = function(other) {
    return (other || new ObjRef()).copy(this);
  }

  /**
   * @return {ObjRef}
   * @param {ObjRef} other
   */
  ObjRef.prototype.copy = function(other) {
    this.id = other.id;
    this.parentID = other.parentID;
    this.timelineID = other.timelineID;
    this.keyframeID = other.keyframeID;
    this.zIndex = other.zIndex;
    return this;
  }

  /**
   * @constructor
   */
  function Keyframe() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.time = 0;
  }

  /**
   * @return {Keyframe}
   * @param {Object.<string,?>} json
   */
  Keyframe.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.time = loadInt(json, 'time', 0);
    return this;
  }

  /**
   * @return {number}
   * @param {Array.<Keyframe>} array
   * @param {number} time
   */
  Keyframe.find = function(array, time) {
    if (array.length <= 0) {
      return -1;
    }
    if (time < array[0].time) {
      return -1;
    }
    var last = array.length - 1;
    if (time >= array[last].time) {
      return last;
    }
    var lo = 0;
    var hi = last;
    if (hi === 0) {
      return 0;
    }
    var current = hi >> 1;
    while (true) {
      if (array[current + 1].time <= time) {
        lo = current + 1;
      } else {
        hi = current;
      }
      if (lo === hi) {
        return lo;
      }
      current = (lo + hi) >> 1;
    }
  }

  /**
   * @return {number}
   * @param {Keyframe} a
   * @param {Keyframe} b
   */
  Keyframe.compare = function(a, b) {
    return a.time - b.time;
  }

  /**
   * @constructor
   * @extends {Keyframe}
   */
  function MainlineKeyframe() {
    Keyframe.call(this);

    /** @type {Array.<Bone|BoneRef>} */
    this.bones = null;
    /** @type {Array.<Object|ObjRef>} */
    this.objects = null;
  }

  MainlineKeyframe.prototype = Object.create(Keyframe.prototype);
  MainlineKeyframe.prototype.constructor = MainlineKeyframe;

  /**
   * @return {MainlineKeyframe}
   * @param {Object.<string,?>} json
   */
  MainlineKeyframe.prototype.load = function(data, json) {
    var i, len;

    Keyframe.prototype.load.call(this, json)

    // combine bones and bone_refs into one array and sort by id
    this.bones = [];

    json.bone = makeArray(json.bone);
    for (i = 0, len = json.bone.length; i < len; i++) {
      this.bones.push(new Bone().load(json.bone[i]));
    }

    json.bone_ref = makeArray(json.bone_ref);
    for (i = 0, len = json.bone_ref.length; i < len; i++) {
      this.bones.push(new BoneRef().load(json.bone_ref[i]));
    }

    this.bones = this.bones.sort(function(a, b) {
      return a.id - b.id;
    });

    // combine objects and object_refs into one array and sort by id
    this.objects = [];

    json.object = makeArray(json.object);
    json.object.forEach(function(object_json) {
    });
    for (i = 0, len = json.object.length; i < len; i++) {
      this.objects.push(new Obj().load(data, json.object[i]));
    }

    json.object_ref = makeArray(json.object_ref);
    for (i = 0, len = json.object_ref.length; i < len; i++) {
      this.objects.push(new ObjRef().load(json.object_ref[i]));
    }

    this.objects = this.objects.sort(function(a, b) {
      return a.id - b.id;
    });

    return this;
  }

  /**
   * @constructor
   */
  function Mainline() {
    /** @type {Array.<MainlineKeyframe>} */
    this.keyframes = [];
  }

  /**
   * @return {Mainline}
   * @param {Object.<string,?>} json
   */
  Mainline.prototype.load = function(data, json) {
    json.key = makeArray(json.key);
    for (var i = 0, len = json.key.length; i < len; i++) {
      this.keyframes.push(new MainlineKeyframe().load(data, json.key[i]));
    }
    this.keyframes = this.keyframes.sort(Keyframe.compare);
    return this;
  }

  /**
   * @constructor
   * @extends {Keyframe}
   * @param {string} type
   */
  function TimelineKeyframe(type) {
    Keyframe.call(this);
    this.type = type;

    /** @type {string} */
    this.type = '';
    /** @type {number} */
    this.spin = 1; // 1: counter-clockwise, -1: clockwise
    /** @type {number} */
    this.curve = 1; // 0: instant, 1: linear, 2: quadratic, 3: cubic
    /** @type {number} */
    this.c1 = 0;
    /** @type {number} */
    this.c2 = 0;
  }

  TimelineKeyframe.prototype = Object.create(Keyframe.prototype);
  TimelineKeyframe.prototype.constructor = TimelineKeyframe;

  /**
   * @return {TimelineKeyframe}
   * @param {Object.<string,?>} json
   */
  TimelineKeyframe.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.time = loadInt(json, 'time', 0);
    this.spin = loadInt(json, 'spin', 1);
    this.curve = loadInt(json, 'curve_type', 1);
    this.c1 = loadInt(json, 'c1', 0);
    this.c2 = loadInt(json, 'c2', 0);
    return this;
  }

  TimelineKeyframe.prototype.evaluateCurve = function(time, time1, time2) {
    if (time1 === time2) {
      return 0;
    }
    if (this.curve === 0) {
      return 0;
    } // instant
    var tween = (time - time1) / (time2 - time1);
    if (this.curve === 1) {
      return tween;
    } // linear
    if (this.curve === 2) {
      return interpolateQuadratic(0.0, this.c1, 1.0, tween);
    }
    if (this.curve === 3) {
      return interpolateCubic(0.0, this.c1, this.c2, 1.0, tween);
    }
    return 0;
  }

  /**
   * @constructor
   * @extends {TimelineKeyframe}
   */
  function BoneTimelineKeyframe() {
    TimelineKeyframe.call(this, 'bone');

    /** @type {Bone} */
    this.bone = null;
  }

  BoneTimelineKeyframe.prototype = Object.create(TimelineKeyframe.prototype);
  BoneTimelineKeyframe.prototype.constructor = BoneTimelineKeyframe;

  /**
   * @return {TimelineKeyframe}
   * @param {Object.<string,?>} json
   */
  BoneTimelineKeyframe.prototype.load = function(json) {
    TimelineKeyframe.prototype.load.call(this, json);
    this.bone = new Bone().load(json.bone || {});
    return this;
  }

  /**
   * @constructor
   * @extends {TimelineKeyframe}
   */
  function ObjectTimelineKeyframe() {
    TimelineKeyframe.call(this, 'object');

    /** @type {Object} */
    this.object = null;
  }

  ObjectTimelineKeyframe.prototype = Object.create(TimelineKeyframe.prototype);
  ObjectTimelineKeyframe.prototype.constructor = ObjectTimelineKeyframe;

  /**
   * @return {TimelineKeyframe}
   * @param {Object.<string,?>} json
   */
  ObjectTimelineKeyframe.prototype.load = function(data, json) {
    TimelineKeyframe.prototype.load.call(this, json);
    this.object = new Obj().load(data, json.object || {});
    return this;
  }

  /**
   * @constructor
   */
  function Timeline(animation) {
    this.animation = animation;

    /** @type {number} */
    this.id = -1;
    /** @type {string} */
    this.name = '';
    /** @type {string} */
    this.type = '';
    /** @type {number} */
    this.index = -1;

    /** @type {Array.<TimelineKeyframe>} */
    this.keyframes = null;
  }

  /**
   * @return {Timeline}
   * @param {Object.<string,?>} json
   */
  Timeline.prototype.load = function(data, json) {
    var i, len;

    this.id = loadInt(json, 'id', -1);
    this.name = loadString(json, 'name', '');
    this.type = loadString(json, 'object_type', 'sprite');
    this.index = loadInt(json, 'obj', -1);

    this.keyframes = [];
    json.key = makeArray(json.key);
    switch (this.type) {
      case 'sprite':
        for (i = 0, len = json.key.length; i < len; i++) {
          this.keyframes.push(new ObjectTimelineKeyframe().load(data, json.key[i]));
        }
        var sprites = this.animation.entity.sprites;
        var sprite = sprites[this.name];
        if (!sprite) {
          sprite = new PIXI.Sprite(getTextureForObject(data, this.keyframes[0].object));
          sprite.anchor.set(0.5, 0.5);
          sprite.name = this.name;
          sprites[this.name] = sprite;
        }
        break;
      case 'bone':
        for (i = 0, len = json.key.length; i < len; i++) {
          this.keyframes.push(new BoneTimelineKeyframe().load(json.key[i]));
        }
        break;
      case 'box':
      case 'point':
      case 'sound':
      case 'entity':
      case 'variable':
      default:
        console.log('TODO: Timeline::load', this.type);
        break;
    }
    this.keyframes = this.keyframes.sort(Keyframe.compare);

    return this;
  }

  /**
   * @constructor
   */
  function Animation(entity) {
    this.entity = entity;
    /** @type {number} */
    this.id = -1;
    /** @type {string} */
    this.name = '';
    /** @type {number} */
    this.length = 0;
    /** @type {string} */
    this.looping = 'true'; // 'true', 'false' or 'ping_pong'
    /** @type {number} */
    this.loopTo = 0;
    /** @type {Mainline} */
    this.mainline = null;
    /** @type {Array.<Timeline>} */
    this.timelines = null;
    /** @type {number} */
    this.minTime = 0;
    /** @type {number} */
    this.maxTime = 0;
  }

  /**
   * @return {Animation}
   * @param {Object.<string,?>} json
   */
  Animation.prototype.load = function(data, json) {
    this.id = loadInt(json, 'id', -1);
    this.name = loadString(json, 'name', '');
    this.length = loadInt(json, 'length', 0);
    this.looping = loadString(json, 'looping', 'true');
    this.loopTo = loadInt(json, 'loop_to', 0);

    json.mainline = json.mainline || {};
    this.mainline = new Mainline().load(data, json.mainline);

    this.timelines = [];
    json.timeline = makeArray(json.timeline);
    for (var i = 0, len = json.timeline.length; i < len; i++) {
      this.timelines.push(new Timeline(this).load(data, json.timeline[i]));
    }

    this.minTime = 0;
    this.maxTime = this.length;

    return this;
  }

  /**
   * SpriterAnimation is the represent of "entity" in Spriter
   * @param {String} sconKey    Which scon file to use for this animation
   * @param {String} entityName Name of the entity you want to create
   * @constructor
   */
  function SpriterAnimation(sconKey, entityName) {
    PIXI.Container.call(this);
    this.scale.y = -1; // FIXME: inverse the transform instead of set y scale

    var data = spriter.getData(sconKey);
    var entityDef = data.getEntityData(entityName);

    /** @type {Object} definitation data */
    this.data = data;
    /** @type {number} */
    this.id = loadInt(entityDef, 'id', -1);
    /** @type {string} */
    this.name = loadString(entityDef, 'name', '');
    /** @type {Object.<string,Animation>} */
    this.anims = {};
    /** @type {Array.<string>} */
    this.animNames = [];

    /** @type {Array.<Bone>} */
    this.bones = [];
    /** @type {Array.<Object>} */
    this.objects = [];
    /** @type {string} */
    this.currAnimName = '';
    /** @type {number} */
    this.time = 0;
    /** @type {number} */
    this.elapsedTime = 0;

    /** @type {Boolean} Whether current animation is ended */
    this.isEnd = true;
    /** @type {Boolean} Whether stop instead of loop at the end of current animation */
    this.stopAtEnd = false;

    /** @type {boolean} */
    this.dirty = true;

    /**
     * Stores all the sprite instances for this entity
     * @type {PIXI.Sprite}
     * @private
     */
    this.sprites = {};

    // Create animations
    for (var i = 0, len = entityDef.animation.length; i < len; i++) {
      var animation = new Animation(this).load(data, entityDef.animation[i]);
      this.anims[animation.name] = animation;
      this.animNames.push(animation.name);
    }
  }

  SpriterAnimation.prototype = Object.create(PIXI.Container.prototype);
  SpriterAnimation.prototype.constructor = SpriterAnimation;

  /**
   * Play an animation by its name
   * @param  {String} anim        Name of the animation
   * @param  {Boolean} stopAtEnd  Whether stop when animation is finished
   */
  SpriterAnimation.prototype.play = function(anim, stopAtEnd) {
    this.stopAtEnd = !!stopAtEnd;
    this.isEnd = false;
    this.currAnimName = anim;

    var anim = this.currAnim();
    if (anim) {
      this.time = anim.minTime;
    }

    this.elapsedTime = 0;
    this.dirty = true;
  };
  /**
   * Get current animation object
   * @return {Animation}
   */
  SpriterAnimation.prototype.currAnim = function() {
    return this.anims[this.currAnimName];
  };
  /**
   * Set time of current animation
   * @param {Number} time Time(ms)
   */
  SpriterAnimation.prototype.setTime = function(time) {
    var anim = this.currAnim();
    if (anim) {
      if (time >= anim.maxTime) {
        if (this.stopAtEnd) {
          time = anim.maxTime;
          if (!this.isEnd) {
            this.isEnd = true;
            this.emit('end', this.currAnimName);
          }
        }
        else {
          time = wrap(time, anim.minTime, anim.maxTime);
          this.emit('loop', this.currAnimName);
        }
      }
    }

    if (this.time !== time) {
      this.time = time;
      this.elapsedTime = 0;
      this.dirty = true;
    }
  };
  SpriterAnimation.prototype.update = function(elapsed) {
    // Update timer
    this.setTime(this.time + elapsed);

    // Update body parts
    if (!this.dirty) {
      return;
    }
    this.dirty = false;

    var anim = this.currAnim();

    var time = this.time;
    var elapsedTime = this.elapsedTime;
    this.elapsedTime = 0; // reset for next update

    var sprAnim = this;
    var i, len;

    if (anim) {
      var mainline_keyframe_array = anim.mainline.keyframes;
      var mainline_keyframe_index = Keyframe.find(mainline_keyframe_array, time);
      var mainline_keyframe = mainline_keyframe_array[mainline_keyframe_index];

      var timelines = anim.timelines;

      var data_bone_array = mainline_keyframe.bones;
      var pose_bone_array = sprAnim.bones;

      data_bone_array.forEach(function(data_bone, bone_index) {
        var pose_bone = pose_bone_array[bone_index] = (pose_bone_array[bone_index] || new Bone());

        if (data_bone instanceof BoneRef) {
          // bone is a BoneRef, dereference
          var timelineID = data_bone.timelineID;
          var keyframeID = data_bone.keyframeID;
          var timeline = timelines[timelineID];
          var timeline_keyframe_array = timeline.keyframes;
          var timeline_keyframe = timeline_keyframe_array[keyframeID];

          var time1 = timeline_keyframe.time;
          var bone1 = timeline_keyframe.bone;
          pose_bone.copy(bone1);
          pose_bone.parentID = data_bone.parentID; // set parent from bone_ref

          // see if there's something to tween with
          var keyframe_index2 = (keyframeID + 1) % timeline_keyframe_array.length;
          if (keyframeID !== keyframe_index2) {
            var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
            var time2 = timeline_keyframe2.time;
            if (time2 < time1) {
              time2 = anim.length;
            }
            var bone2 = timeline_keyframe2.bone;

            var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
            pose_bone.tween(bone2, tween, timeline_keyframe.spin);
          }
        } else if (data_bone instanceof Bone) {
          // bone is a Bone, copy
          pose_bone.copy(data_bone);
        } else {
          throw new Error();
        }
      });

      // clamp output bone array
      pose_bone_array.length = data_bone_array.length;

      pose_bone_array.forEach(function(bone) {
        var parent_bone = pose_bone_array[bone.parentID];
        if (parent_bone) {
          Transform.combine(parent_bone.worldSpace, bone.localSpace, bone.worldSpace);
        } else {
          bone.worldSpace.copy(bone.localSpace);
        }
      });

      var data_object_array = mainline_keyframe.objects;
      var pose_object_array = sprAnim.objects;

      data_object_array.forEach(function(data_object, object_index) {
        var pose_object = pose_object_array[object_index] = (pose_object_array[object_index] || new Obj());

        if (data_object instanceof ObjRef) {
          // object is a ObjRef, dereference
          var timelineID = data_object.timelineID;
          var keyframeID = data_object.keyframeID;
          var timeline = timelines[timelineID];
          var timeline_keyframe_array = timeline.keyframes;
          var timeline_keyframe = timeline_keyframe_array[keyframeID];

          var time1 = timeline_keyframe.time;
          var object1 = timeline_keyframe.object;

          pose_object.copy(object1);
          pose_object.parentID = data_object.parentID; // set parent from object_ref

          // see if there's something to tween with
          var keyframe_index2 = (keyframeID + 1) % timeline_keyframe_array.length;
          if (keyframeID !== keyframe_index2) {
            var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
            var time2 = timeline_keyframe2.time;
            if (time2 < time1) {
              time2 = anim.length;
            }
            var object2 = timeline_keyframe2.object;

            var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
            pose_object.tween(object2, tween, timeline_keyframe.spin);
          }
        } else if (data_object instanceof Object) {
          // object is a Object, copy
          pose_object.copy(data_object);
        } else {
          throw new Error();
        }
      });

      // Clamp output object array
      pose_object_array.length = data_object_array.length;

      // Remove children, add them back later to ensure the
      // correct z-index
      for (i = 0, len = this.children.length; i < len; i++) {
        this.children[i].parent = null;
      }
      this.children.length = 0;

      // Update transform of objects
      pose_object_array.forEach(function(object, idx) {
        var bone = pose_bone_array[object.parentID];
        if (bone) {
          Transform.combine(bone.worldSpace, object.localSpace, object.worldSpace);
          var folder = sprAnim.data.folder_array[object.folderID];
          var file = folder.files[object.fileID];
          var offset_x = (0.5 - object.pivot.x) * file.width;
          var offset_y = (0.5 - object.pivot.y) * file.height;
          Transform.translate(object.worldSpace, offset_x, offset_y);
        } else {
          object.worldSpace.copy(object.localSpace);
        }

        // TODO: update object transform
        var timelineID = data_object_array[idx].timelineID;
        var timeline = timelines[timelineID];

        var sprites = sprAnim.sprites;
        var sprite = sprites[timeline.name];
        // Apply transform
        var model = object.worldSpace;
        sprite.position.set(model.position.x, model.position.y);
        sprite.rotation = model.rotation.rad;
        sprite.scale.set(model.scale.x, -model.scale.y);
        sprite.alpha = object.alpha;

        sprite.parent = sprAnim;
        sprAnim.children.push(sprite);
      });
    }
  };

  /**
   * Data is the in memory structure that stores data of a scon file
   * @constructor
   */
  function Data(scon) {
    /**
     * Scon data object
     * @type {Object}
     */
    this.scon = scon;

    /** @type {Array.<Folder>} */
    this.folder_array = [];

    /** @type {Object} entityName -> entityData map */
    this.entityDataMap = {};
    /** @type {Array.<String>} entity definiation names */
    this.entityNames = [];

    /** Scon file version */
    this.sconVersion = loadString(scon, 'scon_version', '');
    /** Scon file generator application */
    this.generator = loadString(scon, 'generator', '');
    /** Scon file generator application version */
    this.generatorVersion = loadString(scon, 'generator_version', '');

    var i, len;
    // Fetch folder and file data
    for (i = 0, len = scon.folder.length; i < len; i++) {
      this.folder_array.push(new Folder().load(scon.folder[i]));
    }

    // Construct entity data map
    var entity;
    for (i = 0, len = scon.entity.length; i < len; i++) {
      entity = scon.entity[i];
      this.entityDataMap[entity.name] = entity;
      this.entityNames.push(entity.name);
    }
  }

  Data.prototype.getFile = function(folderIdx, fileIdx) {
    return this.folder_array[folderIdx].files[fileIdx];
  };

  /**
   * Get entity data
   * @param  {String} entityName Name of the entity
   * @return {Object}            Defination data object
   */
  Data.prototype.getEntityData = function(entityName) {
    return this.entityDataMap[entityName];
  };

  /**
   * @return {Array.<string>}
   */
  Data.prototype.getEntityKeys = function() {
    return this.entityNames;
  }

  /**
   * @return {number}
   * @param {Object.<string,?>|Array.<?>} json
   * @param {string|number} key
   * @param {number=} def
   */
  function loadFloat(json, key, def) {
    var value = json[key];
    switch (typeof(value)) {
      case 'string':
        return parseFloat(value);
      case 'number':
        return value;
      default:
        return def || 0;
    }
  }

  /**
   * @return {number}
   * @param {Object.<string,?>|Array.<?>} json
   * @param {string|number} key
   * @param {number=} def
   */
  function loadInt(json, key, def) {
    var value = json[key];
    switch (typeof(value)) {
      case 'string':
        return parseInt(value, 10);
      case 'number':
        return 0 | value;
      default:
        return def || 0;
    }
  }

  /**
   * @return {string}
   * @param {Object.<string,?>|Array.<?>} json
   * @param {string|number} key
   * @param {string=} def
   */
  function loadString(json, key, def) {
    var value = json[key];
    switch (typeof(value)) {
      case 'string':
        return value;
      default:
        return def || '';
    }
  }

  /**
   * @return {Array}
   * @param {*} value
   */
  function makeArray(value) {
    if ((typeof(value) === 'object') && (typeof(value.length) === 'number')) // (Object.isArray(value))
    {
      return /** @type {Array} */ (value);
    }
    if (typeof(value) !== 'undefined') {
      return [value];
    }
    return [];
  }

  /**
   * @return {number}
   * @param {number} num
   * @param {number} min
   * @param {number} max
   */
  function wrap(num, min, max) {
    if (min < max) {
      if (num < min) {
        return max - ((min - num) % (max - min));
      } else {
        return min + ((num - min) % (max - min));
      }
    } else if (min === max) {
      return min;
    } else {
      return num;
    }
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} t
   */
  function interpolateLinear(a, b, t) {
    return a + ((b - a) * t);
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} t
   */
  function interpolateQuadratic(a, b, c, t) {
      return interpolateLinear(interpolateLinear(a, b, t), interpolateLinear(b, c, t), t);
    }
  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} t
   */
  function interpolateCubic(a, b, c, d, t) {
    return interpolateLinear(interpolateQuadratic(a, b, c, t), interpolateQuadratic(b, c, d, t), t);
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} t
   */
  function tween(a, b, t) {
    return a + ((b - a) * t);
  }

  /**
   * @return {number}
   * @param {number} angle
   */
  function wrapAngleRadians(angle) {
    if (angle <= 0) {
      return ((angle - Math.PI) % (2 * Math.PI)) + Math.PI;
    } else {
      return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} t
   * @param {number} spin
   */
  function tweenAngleRadians(a, b, t, spin) {
    if ((spin > 0) && (a > b)) {
      return a + ((b + 2 * Math.PI - a) * t); // counter clockwise
    } else if ((spin < 0) && (a < b)) {
      return a + ((b - 2 * Math.PI - a) * t); // clockwise
    }
    return a + ((b - a) * t);
  }

  /**
   * Get texture for a Object instance
   * @param  {Data} data      Spriter data instance
   * @param  {Object} object  Texture for this object
   * @return {PIXI.Texture}
   */
  function getTextureForObject(data, object) {
    var folder = data.folder_array[object.folderID];
    var file = folder.files[object.fileID];
    return PIXI.utils.TextureCache[file.name];
  }

  // Export
  spriter.loaderMiddleWare = loaderMiddleWare;
  spriter.getData = getData;

  spriter.SpriterAnimation = SpriterAnimation;

})(window.spriter = {});
