// Note: changed all 'd3' references to '/kernelspecs/rails_notebook/d3.min.js'
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('/kernelspecs/rails_notebook/d3.min.js'));
  }
  else if (typeof define === 'function' && define.amd) {
    define(['/kernelspecs/rails_notebook/d3.min.js'], factory);
  }
  else {
    root['dagreD3'] = factory(root['/kernelspecs/rails_notebook/d3.min.js']);
  }
}(this, function(d3) {
  function _requireDep(name) {
    return {'/kernelspecs/rails_notebook/d3.min.js': d3}[name];
  }

  var _bundleExports = (function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            module.exports = {
                Digraph: _require(25).Digraph,
                Renderer: _require(1),
                json: _require(25).converter.json,
                layout: _require(8).layout,
                version: _require(2),
                debug: _require(8).debug
            };
        },
        function (module, exports) {
            var layout = _require(8).layout;
            var d3;
            try {
                d3 = _requireDep('d3');
            } catch (_) {
                d3 = window.d3;
            }
            module.exports = Renderer;
            function Renderer() {
                this._layout = layout();
                this.drawNodes(defaultDrawNodes);
                this.drawEdgeLabels(defaultDrawEdgeLabels);
                this.drawEdgePaths(defaultDrawEdgePaths);
                this.positionNodes(defaultPositionNodes);
                this.positionEdgeLabels(defaultPositionEdgeLabels);
                this.positionEdgePaths(defaultPositionEdgePaths);
                this.zoomSetup(defaultZoomSetup);
                this.zoom(defaultZoom);
                this.transition(defaultTransition);
                this.postLayout(defaultPostLayout);
                this.postRender(defaultPostRender);
                this.edgeInterpolate('bundle');
                this.edgeTension(0.95);
            }
            Renderer.prototype.layout = function (layout) {
                if (!arguments.length) {
                    return this._layout;
                }
                this._layout = layout;
                return this;
            };
            Renderer.prototype.drawNodes = function (drawNodes) {
                if (!arguments.length) {
                    return this._drawNodes;
                }
                this._drawNodes = bind(drawNodes, this);
                return this;
            };
            Renderer.prototype.drawEdgeLabels = function (drawEdgeLabels) {
                if (!arguments.length) {
                    return this._drawEdgeLabels;
                }
                this._drawEdgeLabels = bind(drawEdgeLabels, this);
                return this;
            };
            Renderer.prototype.drawEdgePaths = function (drawEdgePaths) {
                if (!arguments.length) {
                    return this._drawEdgePaths;
                }
                this._drawEdgePaths = bind(drawEdgePaths, this);
                return this;
            };
            Renderer.prototype.positionNodes = function (positionNodes) {
                if (!arguments.length) {
                    return this._positionNodes;
                }
                this._positionNodes = bind(positionNodes, this);
                return this;
            };
            Renderer.prototype.positionEdgeLabels = function (positionEdgeLabels) {
                if (!arguments.length) {
                    return this._positionEdgeLabels;
                }
                this._positionEdgeLabels = bind(positionEdgeLabels, this);
                return this;
            };
            Renderer.prototype.positionEdgePaths = function (positionEdgePaths) {
                if (!arguments.length) {
                    return this._positionEdgePaths;
                }
                this._positionEdgePaths = bind(positionEdgePaths, this);
                return this;
            };
            Renderer.prototype.transition = function (transition) {
                if (!arguments.length) {
                    return this._transition;
                }
                this._transition = bind(transition, this);
                return this;
            };
            Renderer.prototype.zoomSetup = function (zoomSetup) {
                if (!arguments.length) {
                    return this._zoomSetup;
                }
                this._zoomSetup = bind(zoomSetup, this);
                return this;
            };
            Renderer.prototype.zoom = function (zoom) {
                if (!arguments.length) {
                    return this._zoom;
                }
                if (zoom) {
                    this._zoom = bind(zoom, this);
                } else {
                    delete this._zoom;
                }
                return this;
            };
            Renderer.prototype.postLayout = function (postLayout) {
                if (!arguments.length) {
                    return this._postLayout;
                }
                this._postLayout = bind(postLayout, this);
                return this;
            };
            Renderer.prototype.postRender = function (postRender) {
                if (!arguments.length) {
                    return this._postRender;
                }
                this._postRender = bind(postRender, this);
                return this;
            };
            Renderer.prototype.edgeInterpolate = function (edgeInterpolate) {
                if (!arguments.length) {
                    return this._edgeInterpolate;
                }
                this._edgeInterpolate = edgeInterpolate;
                return this;
            };
            Renderer.prototype.edgeTension = function (edgeTension) {
                if (!arguments.length) {
                    return this._edgeTension;
                }
                this._edgeTension = edgeTension;
                return this;
            };
            Renderer.prototype.run = function (graph, svg) {
                graph = copyAndInitGraph(graph);
                svg = this._zoomSetup(graph, svg);
                svg.selectAll('g.edgePaths, g.edgeLabels, g.nodes').data([
                    'edgePaths',
                    'edgeLabels',
                    'nodes'
                ]).enter().append('g').attr('class', function (d) {
                    return d;
                });
                var svgNodes = this._drawNodes(graph, svg.select('g.nodes'));
                var svgEdgeLabels = this._drawEdgeLabels(graph, svg.select('g.edgeLabels'));
                svgNodes.each(function (u) {
                    calculateDimensions(this, graph.node(u));
                });
                svgEdgeLabels.each(function (e) {
                    calculateDimensions(this, graph.edge(e));
                });
                var result = runLayout(graph, this._layout);
                this._postLayout(result, svg);
                var svgEdgePaths = this._drawEdgePaths(graph, svg.select('g.edgePaths'));
                this._positionNodes(result, svgNodes);
                this._positionEdgeLabels(result, svgEdgeLabels);
                this._positionEdgePaths(result, svgEdgePaths);
                this._postRender(result, svg);
                return result;
            };
            function copyAndInitGraph(graph) {
                var copy = graph.copy();
                copy.nodes().forEach(function (u) {
                    var value = copy.node(u);
                    if (value === undefined) {
                        value = {};
                        copy.node(u, value);
                    }
                    if (!('label' in value)) {
                        value.label = '';
                    }
                });
                copy.edges().forEach(function (e) {
                    var value = copy.edge(e);
                    if (value === undefined) {
                        value = {};
                        copy.edge(e, value);
                    }
                    if (!('label' in value)) {
                        value.label = '';
                    }
                });
                return copy;
            }
            function calculateDimensions(group, value) {
                var bbox = group.getBBox();
                value.width = bbox.width;
                value.height = bbox.height;
            }
            function runLayout(graph, layout) {
                var result = layout.run(graph);
                graph.eachNode(function (u, value) {
                    result.node(u).label = value.label;
                });
                graph.eachEdge(function (e, u, v, value) {
                    result.edge(e).label = value.label;
                });
                return result;
            }
            function defaultDrawNodes(g, root) {
                var nodes = g.nodes().filter(function (u) {
                        return !isComposite(g, u);
                    });
                var svgNodes = root.selectAll('g.node').classed('enter', false).data(nodes, function (u) {
                        return u;
                    });
                svgNodes.selectAll('*').remove();
                svgNodes.enter().append('g').style('opacity', 0).attr('class', 'node enter');
                svgNodes.each(function (u) {
                    addLabel(g.node(u), d3.select(this), 10, 10);
                });
                this._transition(svgNodes.exit()).style('opacity', 0).remove();
                return svgNodes;
            }
            function defaultDrawEdgeLabels(g, root) {
                var svgEdgeLabels = root.selectAll('g.edgeLabel').classed('enter', false).data(g.edges(), function (e) {
                        return e;
                    });
                svgEdgeLabels.selectAll('*').remove();
                svgEdgeLabels.enter().append('g').style('opacity', 0).attr('class', 'edgeLabel enter');
                svgEdgeLabels.each(function (e) {
                    addLabel(g.edge(e), d3.select(this), 0, 0);
                });
                this._transition(svgEdgeLabels.exit()).style('opacity', 0).remove();
                return svgEdgeLabels;
            }
            var defaultDrawEdgePaths = function (g, root) {
                var svgEdgePaths = root.selectAll('g.edgePath').classed('enter', false).data(g.edges(), function (e) {
                        return e;
                    });
                svgEdgePaths.enter().append('g').attr('class', 'edgePath enter').append('path').style('opacity', 0).attr('marker-end', 'url(#arrowhead)');
                this._transition(svgEdgePaths.exit()).style('opacity', 0).remove();
                return svgEdgePaths;
            };
            function defaultPositionNodes(g, svgNodes) {
                function transform(u) {
                    var value = g.node(u);
                    return 'translate(' + value.x + ',' + value.y + ')';
                }
                svgNodes.filter('.enter').attr('transform', transform);
                this._transition(svgNodes).style('opacity', 1).attr('transform', transform);
            }
            function defaultPositionEdgeLabels(g, svgEdgeLabels) {
                function transform(e) {
                    var value = g.edge(e);
                    var point = findMidPoint(value.points);
                    return 'translate(' + point.x + ',' + point.y + ')';
                }
                svgEdgeLabels.filter('.enter').attr('transform', transform);
                this._transition(svgEdgeLabels).style('opacity', 1).attr('transform', transform);
            }
            function defaultPositionEdgePaths(g, svgEdgePaths) {
                var interpolate = this._edgeInterpolate, tension = this._edgeTension;
                function calcPoints(e) {
                    var value = g.edge(e);
                    var source = g.node(g.incidentNodes(e)[0]);
                    var target = g.node(g.incidentNodes(e)[1]);
                    var points = value.points.slice();
                    var p0 = points.length === 0 ? target : points[0];
                    var p1 = points.length === 0 ? source : points[points.length - 1];
                    points.unshift(intersectRect(source, p0));
                    points.push(intersectRect(target, p1));
                    return d3.svg.line().x(function (d) {
                        return d.x;
                    }).y(function (d) {
                        return d.y;
                    }).interpolate(interpolate).tension(tension)(points);
                }
                svgEdgePaths.filter('.enter').selectAll('path').attr('d', calcPoints);
                this._transition(svgEdgePaths.selectAll('path')).attr('d', calcPoints).style('opacity', 1);
            }
            function defaultTransition(selection) {
                return selection;
            }
            function defaultZoomSetup(graph, svg) {
                var root = svg.property('ownerSVGElement');
                if (!root) {
                    root = svg;
                }
                root = d3.select(root);
                if (root.select('rect.overlay').empty()) {
                    root.append('rect').attr('class', 'overlay').attr('width', '100%').attr('height', '100%').style('fill', 'none');
                    svg = svg.append('g').attr('class', 'zoom');
                    if (this._zoom) {
                        root.call(this._zoom(graph, svg));
                    }
                }
                return svg;
            }
            function defaultZoom(graph, svg) {
                return d3.behavior.zoom().on('zoom', function () {
                    svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
                });
            }
            function defaultPostLayout() {
            }
            function defaultPostRender(graph, root) {
                if (graph.isDirected() && root.select('#arrowhead').empty()) {
                    root.append('svg:defs').append('svg:marker').attr('id', 'arrowhead').attr('viewBox', '0 0 10 10').attr('refX', 8).attr('refY', 5).attr('markerUnits', 'strokeWidth').attr('markerWidth', 8).attr('markerHeight', 5).attr('orient', 'auto').attr('style', 'fill: #333').append('svg:path').attr('d', 'M 0 0 L 10 5 L 0 10 z');
                }
            }
            function addLabel(node, root, marginX, marginY) {
                var label = node.label;
                var rect = root.append('rect');
                var labelSvg = root.append('g');
                if (label[0] === '<') {
                    addForeignObjectLabel(label, labelSvg);
                    marginX = marginY = 0;
                } else {
                    addTextLabel(label, labelSvg, Math.floor(node.labelCols), node.labelCut);
                }
                var bbox = root.node().getBBox();
                labelSvg.attr('transform', 'translate(' + -bbox.width / 2 + ',' + -bbox.height / 2 + ')');
                rect.attr('rx', 5).attr('ry', 5).attr('x', -(bbox.width / 2 + marginX)).attr('y', -(bbox.height / 2 + marginY)).attr('width', bbox.width + 2 * marginX).attr('height', bbox.height + 2 * marginY);
            }
            function addForeignObjectLabel(label, root) {
                var fo = root.append('foreignObject').attr('width', '100000');
                var w, h;
                fo.append('xhtml:div').style('float', 'left').html(function () {
                    return label;
                }).each(function () {
                    w = this.clientWidth;
                    h = this.clientHeight;
                });
                fo.attr('width', w).attr('height', h);
            }
            function addTextLabel(label, root, labelCols, labelCut) {
                if (labelCut === undefined)
                    labelCut = 'false';
                labelCut = labelCut.toString().toLowerCase() === 'true';
                var node = root.append('text').attr('text-anchor', 'left');
                label = label.replace(/\\n/g, '\n');
                var arr = labelCols ? wordwrap(label, labelCols, labelCut) : label;
                arr = arr.split('\n');
                for (var i = 0; i < arr.length; i++) {
                    node.append('tspan').attr('dy', '1em').attr('x', '1').text(arr[i]);
                }
            }
            function wordwrap(str, width, cut, brk) {
                brk = brk || '\n';
                width = width || 75;
                cut = cut || false;
                if (!str) {
                    return str;
                }
                var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
                return str.match(new RegExp(regex, 'g')).join(brk);
            }
            function findMidPoint(points) {
                var midIdx = points.length / 2;
                if (points.length % 2) {
                    return points[Math.floor(midIdx)];
                } else {
                    var p0 = points[midIdx - 1];
                    var p1 = points[midIdx];
                    return {
                        x: (p0.x + p1.x) / 2,
                        y: (p0.y + p1.y) / 2
                    };
                }
            }
            function intersectRect(rect, point) {
                var x = rect.x;
                var y = rect.y;
                var dx = point.x - x;
                var dy = point.y - y;
                var w = rect.width / 2;
                var h = rect.height / 2;
                var sx, sy;
                if (Math.abs(dy) * w > Math.abs(dx) * h) {
                    if (dy < 0) {
                        h = -h;
                    }
                    sx = dy === 0 ? 0 : h * dx / dy;
                    sy = h;
                } else {
                    if (dx < 0) {
                        w = -w;
                    }
                    sx = w;
                    sy = dx === 0 ? 0 : w * dy / dx;
                }
                return {
                    x: x + sx,
                    y: y + sy
                };
            }
            function isComposite(g, u) {
                return 'children' in g && g.children(u).length;
            }
            function bind(func, thisArg) {
                if (func.bind) {
                    return func.bind(thisArg);
                }
                return function () {
                    return func.apply(thisArg, arguments);
                };
            }
        },
        function (module, exports) {
            module.exports = '0.2.0';
        },
        function (module, exports) {
            exports.Set = _require(5);
            exports.PriorityQueue = _require(4);
            exports.version = _require(7);
        },
        function (module, exports) {
            module.exports = PriorityQueue;
            function PriorityQueue() {
                this._arr = [];
                this._keyIndices = {};
            }
            PriorityQueue.prototype.size = function () {
                return this._arr.length;
            };
            PriorityQueue.prototype.keys = function () {
                return this._arr.map(function (x) {
                    return x.key;
                });
            };
            PriorityQueue.prototype.has = function (key) {
                return key in this._keyIndices;
            };
            PriorityQueue.prototype.priority = function (key) {
                var index = this._keyIndices[key];
                if (index !== undefined) {
                    return this._arr[index].priority;
                }
            };
            PriorityQueue.prototype.min = function () {
                if (this.size() === 0) {
                    throw new Error('Queue underflow');
                }
                return this._arr[0].key;
            };
            PriorityQueue.prototype.add = function (key, priority) {
                var keyIndices = this._keyIndices;
                if (!(key in keyIndices)) {
                    var arr = this._arr;
                    var index = arr.length;
                    keyIndices[key] = index;
                    arr.push({
                        key: key,
                        priority: priority
                    });
                    this._decrease(index);
                    return true;
                }
                return false;
            };
            PriorityQueue.prototype.removeMin = function () {
                this._swap(0, this._arr.length - 1);
                var min = this._arr.pop();
                delete this._keyIndices[min.key];
                this._heapify(0);
                return min.key;
            };
            PriorityQueue.prototype.decrease = function (key, priority) {
                var index = this._keyIndices[key];
                if (priority > this._arr[index].priority) {
                    throw new Error('New priority is greater than current priority. ' + 'Key: ' + key + ' Old: ' + this._arr[index].priority + ' New: ' + priority);
                }
                this._arr[index].priority = priority;
                this._decrease(index);
            };
            PriorityQueue.prototype._heapify = function (i) {
                var arr = this._arr;
                var l = 2 * i, r = l + 1, largest = i;
                if (l < arr.length) {
                    largest = arr[l].priority < arr[largest].priority ? l : largest;
                    if (r < arr.length) {
                        largest = arr[r].priority < arr[largest].priority ? r : largest;
                    }
                    if (largest !== i) {
                        this._swap(i, largest);
                        this._heapify(largest);
                    }
                }
            };
            PriorityQueue.prototype._decrease = function (index) {
                var arr = this._arr;
                var priority = arr[index].priority;
                var parent;
                while (index !== 0) {
                    parent = index >> 1;
                    if (arr[parent].priority < priority) {
                        break;
                    }
                    this._swap(index, parent);
                    index = parent;
                }
            };
            PriorityQueue.prototype._swap = function (i, j) {
                var arr = this._arr;
                var keyIndices = this._keyIndices;
                var origArrI = arr[i];
                var origArrJ = arr[j];
                arr[i] = origArrJ;
                arr[j] = origArrI;
                keyIndices[origArrJ.key] = i;
                keyIndices[origArrI.key] = j;
            };
        },
        function (module, exports) {
            var util = _require(6);
            module.exports = Set;
            function Set(initialKeys) {
                this._size = 0;
                this._keys = {};
                if (initialKeys) {
                    for (var i = 0, il = initialKeys.length; i < il; ++i) {
                        this.add(initialKeys[i]);
                    }
                }
            }
            Set.intersect = function (sets) {
                if (sets.length === 0) {
                    return new Set();
                }
                var result = new Set(!util.isArray(sets[0]) ? sets[0].keys() : sets[0]);
                for (var i = 1, il = sets.length; i < il; ++i) {
                    var resultKeys = result.keys(), other = !util.isArray(sets[i]) ? sets[i] : new Set(sets[i]);
                    for (var j = 0, jl = resultKeys.length; j < jl; ++j) {
                        var key = resultKeys[j];
                        if (!other.has(key)) {
                            result.remove(key);
                        }
                    }
                }
                return result;
            };
            Set.union = function (sets) {
                var totalElems = util.reduce(sets, function (lhs, rhs) {
                        return lhs + (rhs.size ? rhs.size() : rhs.length);
                    }, 0);
                var arr = new Array(totalElems);
                var k = 0;
                for (var i = 0, il = sets.length; i < il; ++i) {
                    var cur = sets[i], keys = !util.isArray(cur) ? cur.keys() : cur;
                    for (var j = 0, jl = keys.length; j < jl; ++j) {
                        arr[k++] = keys[j];
                    }
                }
                return new Set(arr);
            };
            Set.prototype.size = function () {
                return this._size;
            };
            Set.prototype.keys = function () {
                return values(this._keys);
            };
            Set.prototype.has = function (key) {
                return key in this._keys;
            };
            Set.prototype.add = function (key) {
                if (!(key in this._keys)) {
                    this._keys[key] = key;
                    ++this._size;
                    return true;
                }
                return false;
            };
            Set.prototype.remove = function (key) {
                if (key in this._keys) {
                    delete this._keys[key];
                    --this._size;
                    return true;
                }
                return false;
            };
            function values(o) {
                var ks = Object.keys(o), len = ks.length, result = new Array(len), i;
                for (i = 0; i < len; ++i) {
                    result[i] = o[ks[i]];
                }
                return result;
            }
        },
        function (module, exports) {
            if (!Array.isArray) {
                exports.isArray = function (vArg) {
                    return Object.prototype.toString.call(vArg) === '[object Array]';
                };
            } else {
                exports.isArray = Array.isArray;
            }
            if ('function' !== typeof Array.prototype.reduce) {
                exports.reduce = function (array, callback, opt_initialValue) {
                    'use strict';
                    if (null === array || 'undefined' === typeof array) {
                        throw new TypeError('Array.prototype.reduce called on null or undefined');
                    }
                    if ('function' !== typeof callback) {
                        throw new TypeError(callback + ' is not a function');
                    }
                    var index, value, length = array.length >>> 0, isValueSet = false;
                    if (1 < arguments.length) {
                        value = opt_initialValue;
                        isValueSet = true;
                    }
                    for (index = 0; length > index; ++index) {
                        if (array.hasOwnProperty(index)) {
                            if (isValueSet) {
                                value = callback(value, array[index], index, array);
                            } else {
                                value = array[index];
                                isValueSet = true;
                            }
                        }
                    }
                    if (!isValueSet) {
                        throw new TypeError('Reduce of empty array with no initial value');
                    }
                    return value;
                };
            } else {
                exports.reduce = function (array, callback, opt_initialValue) {
                    return array.reduce(callback, opt_initialValue);
                };
            }
        },
        function (module, exports) {
            module.exports = '1.1.3';
        },
        function (module, exports) {
            exports.Digraph = _require(25).Digraph;
            exports.Graph = _require(25).Graph;
            exports.layout = _require(9);
            exports.version = _require(24);
        },
        function (module, exports) {
            var util = _require(23), rank = _require(16), order = _require(10), CGraph = _require(25).CGraph, CDigraph = _require(25).CDigraph;
            module.exports = function () {
                var config = {
                        debugLevel: 0,
                        orderMaxSweeps: order.DEFAULT_MAX_SWEEPS,
                        rankSimplex: false,
                        rankDir: 'TB'
                    };
                var position = _require(15)();
                var self = {};
                self.orderIters = util.propertyAccessor(self, config, 'orderMaxSweeps');
                self.rankSimplex = util.propertyAccessor(self, config, 'rankSimplex');
                self.nodeSep = delegateProperty(position.nodeSep);
                self.edgeSep = delegateProperty(position.edgeSep);
                self.universalSep = delegateProperty(position.universalSep);
                self.rankSep = delegateProperty(position.rankSep);
                self.rankDir = util.propertyAccessor(self, config, 'rankDir');
                self.debugAlignment = delegateProperty(position.debugAlignment);
                self.debugLevel = util.propertyAccessor(self, config, 'debugLevel', function (x) {
                    util.log.level = x;
                    position.debugLevel(x);
                });
                self.run = util.time('Total layout', run);
                self._normalize = normalize;
                return self;
                function initLayoutGraph(inputGraph) {
                    var g = new CDigraph();
                    inputGraph.eachNode(function (u, value) {
                        if (value === undefined)
                            value = {};
                        g.addNode(u, {
                            width: value.width,
                            height: value.height
                        });
                        if (value.hasOwnProperty('rank')) {
                            g.node(u).prefRank = value.rank;
                        }
                    });
                    if (inputGraph.parent) {
                        inputGraph.nodes().forEach(function (u) {
                            g.parent(u, inputGraph.parent(u));
                        });
                    }
                    inputGraph.eachEdge(function (e, u, v, value) {
                        if (value === undefined)
                            value = {};
                        var newValue = {
                                e: e,
                                minLen: value.minLen || 1,
                                width: value.width || 0,
                                height: value.height || 0,
                                points: []
                            };
                        g.addEdge(null, u, v, newValue);
                    });
                    var graphValue = inputGraph.graph() || {};
                    g.graph({
                        rankDir: graphValue.rankDir || config.rankDir,
                        orderRestarts: graphValue.orderRestarts
                    });
                    return g;
                }
                function run(inputGraph) {
                    var rankSep = self.rankSep();
                    var g;
                    try {
                        g = util.time('initLayoutGraph', initLayoutGraph)(inputGraph);
                        if (g.order() === 0) {
                            return g;
                        }
                        g.eachEdge(function (e, s, t, a) {
                            a.minLen *= 2;
                        });
                        self.rankSep(rankSep / 2);
                        util.time('rank.run', rank.run)(g, config.rankSimplex);
                        util.time('normalize', normalize)(g);
                        util.time('order', order)(g, config.orderMaxSweeps);
                        util.time('position', position.run)(g);
                        util.time('undoNormalize', undoNormalize)(g);
                        util.time('fixupEdgePoints', fixupEdgePoints)(g);
                        util.time('rank.restoreEdges', rank.restoreEdges)(g);
                        return util.time('createFinalGraph', createFinalGraph)(g, inputGraph.isDirected());
                    } finally {
                        self.rankSep(rankSep);
                    }
                }
                function normalize(g) {
                    var dummyCount = 0;
                    g.eachEdge(function (e, s, t, a) {
                        var sourceRank = g.node(s).rank;
                        var targetRank = g.node(t).rank;
                        if (sourceRank + 1 < targetRank) {
                            for (var u = s, rank = sourceRank + 1, i = 0; rank < targetRank; ++rank, ++i) {
                                var v = '_D' + ++dummyCount;
                                var node = {
                                        width: a.width,
                                        height: a.height,
                                        edge: {
                                            id: e,
                                            source: s,
                                            target: t,
                                            attrs: a
                                        },
                                        rank: rank,
                                        dummy: true
                                    };
                                if (i === 0)
                                    node.index = 0;
                                else if (rank + 1 === targetRank)
                                    node.index = 1;
                                g.addNode(v, node);
                                g.addEdge(null, u, v, {});
                                u = v;
                            }
                            g.addEdge(null, u, t, {});
                            g.delEdge(e);
                        }
                    });
                }
                function undoNormalize(g) {
                    g.eachNode(function (u, a) {
                        if (a.dummy) {
                            if ('index' in a) {
                                var edge = a.edge;
                                if (!g.hasEdge(edge.id)) {
                                    g.addEdge(edge.id, edge.source, edge.target, edge.attrs);
                                }
                                var points = g.edge(edge.id).points;
                                points[a.index] = {
                                    x: a.x,
                                    y: a.y,
                                    ul: a.ul,
                                    ur: a.ur,
                                    dl: a.dl,
                                    dr: a.dr
                                };
                            }
                            g.delNode(u);
                        }
                    });
                }
                function fixupEdgePoints(g) {
                    g.eachEdge(function (e, s, t, a) {
                        if (a.reversed)
                            a.points.reverse();
                    });
                }
                function createFinalGraph(g, isDirected) {
                    var out = isDirected ? new CDigraph() : new CGraph();
                    out.graph(g.graph());
                    g.eachNode(function (u, value) {
                        out.addNode(u, value);
                    });
                    g.eachNode(function (u) {
                        out.parent(u, g.parent(u));
                    });
                    g.eachEdge(function (e, u, v, value) {
                        out.addEdge(value.e, u, v, value);
                    });
                    var maxX = 0, maxY = 0;
                    g.eachNode(function (u, value) {
                        if (!g.children(u).length) {
                            maxX = Math.max(maxX, value.x + value.width / 2);
                            maxY = Math.max(maxY, value.y + value.height / 2);
                        }
                    });
                    g.eachEdge(function (e, u, v, value) {
                        var maxXPoints = Math.max.apply(Math, value.points.map(function (p) {
                                return p.x;
                            }));
                        var maxYPoints = Math.max.apply(Math, value.points.map(function (p) {
                                return p.y;
                            }));
                        maxX = Math.max(maxX, maxXPoints + value.width / 2);
                        maxY = Math.max(maxY, maxYPoints + value.height / 2);
                    });
                    out.graph().width = maxX;
                    out.graph().height = maxY;
                    return out;
                }
                function delegateProperty(f) {
                    return function () {
                        if (!arguments.length)
                            return f();
                        f.apply(null, arguments);
                        return self;
                    };
                }
            };
        },
        function (module, exports) {
            var util = _require(23), crossCount = _require(11), initLayerGraphs = _require(12), initOrder = _require(13), sortLayer = _require(14);
            module.exports = order;
            var DEFAULT_MAX_SWEEPS = 24;
            order.DEFAULT_MAX_SWEEPS = DEFAULT_MAX_SWEEPS;
            function order(g, maxSweeps) {
                if (arguments.length < 2) {
                    maxSweeps = DEFAULT_MAX_SWEEPS;
                }
                var restarts = g.graph().orderRestarts || 0;
                var layerGraphs = initLayerGraphs(g);
                layerGraphs.forEach(function (lg) {
                    lg = lg.filterNodes(function (u) {
                        return !g.children(u).length;
                    });
                });
                var iters = 0, currentBestCC, allTimeBestCC = Number.MAX_VALUE, allTimeBest = {};
                function saveAllTimeBest() {
                    g.eachNode(function (u, value) {
                        allTimeBest[u] = value.order;
                    });
                }
                for (var j = 0; j < Number(restarts) + 1 && allTimeBestCC !== 0; ++j) {
                    currentBestCC = Number.MAX_VALUE;
                    initOrder(g, restarts > 0);
                    util.log(2, 'Order phase start cross count: ' + g.graph().orderInitCC);
                    var i, lastBest, cc;
                    for (i = 0, lastBest = 0; lastBest < 4 && i < maxSweeps && currentBestCC > 0; ++i, ++lastBest, ++iters) {
                        sweep(g, layerGraphs, i);
                        cc = crossCount(g);
                        if (cc < currentBestCC) {
                            lastBest = 0;
                            currentBestCC = cc;
                            if (cc < allTimeBestCC) {
                                saveAllTimeBest();
                                allTimeBestCC = cc;
                            }
                        }
                        util.log(3, 'Order phase start ' + j + ' iter ' + i + ' cross count: ' + cc);
                    }
                }
                Object.keys(allTimeBest).forEach(function (u) {
                    if (!g.children || !g.children(u).length) {
                        g.node(u).order = allTimeBest[u];
                    }
                });
                g.graph().orderCC = allTimeBestCC;
                util.log(2, 'Order iterations: ' + iters);
                util.log(2, 'Order phase best cross count: ' + g.graph().orderCC);
            }
            function predecessorWeights(g, nodes) {
                var weights = {};
                nodes.forEach(function (u) {
                    weights[u] = g.inEdges(u).map(function (e) {
                        return g.node(g.source(e)).order;
                    });
                });
                return weights;
            }
            function successorWeights(g, nodes) {
                var weights = {};
                nodes.forEach(function (u) {
                    weights[u] = g.outEdges(u).map(function (e) {
                        return g.node(g.target(e)).order;
                    });
                });
                return weights;
            }
            function sweep(g, layerGraphs, iter) {
                if (iter % 2 === 0) {
                    sweepDown(g, layerGraphs, iter);
                } else {
                    sweepUp(g, layerGraphs, iter);
                }
            }
            function sweepDown(g, layerGraphs) {
                var cg;
                for (i = 1; i < layerGraphs.length; ++i) {
                    cg = sortLayer(layerGraphs[i], cg, predecessorWeights(g, layerGraphs[i].nodes()));
                }
            }
            function sweepUp(g, layerGraphs) {
                var cg;
                for (i = layerGraphs.length - 2; i >= 0; --i) {
                    sortLayer(layerGraphs[i], cg, successorWeights(g, layerGraphs[i].nodes()));
                }
            }
        },
        function (module, exports) {
            var util = _require(23);
            module.exports = crossCount;
            function crossCount(g) {
                var cc = 0;
                var ordering = util.ordering(g);
                for (var i = 1; i < ordering.length; ++i) {
                    cc += twoLayerCrossCount(g, ordering[i - 1], ordering[i]);
                }
                return cc;
            }
            function twoLayerCrossCount(g, layer1, layer2) {
                var indices = [];
                layer1.forEach(function (u) {
                    var nodeIndices = [];
                    g.outEdges(u).forEach(function (e) {
                        nodeIndices.push(g.node(g.target(e)).order);
                    });
                    nodeIndices.sort(function (x, y) {
                        return x - y;
                    });
                    indices = indices.concat(nodeIndices);
                });
                var firstIndex = 1;
                while (firstIndex < layer2.length)
                    firstIndex <<= 1;
                var treeSize = 2 * firstIndex - 1;
                firstIndex -= 1;
                var tree = [];
                for (var i = 0; i < treeSize; ++i) {
                    tree[i] = 0;
                }
                var cc = 0;
                indices.forEach(function (i) {
                    var treeIndex = i + firstIndex;
                    ++tree[treeIndex];
                    while (treeIndex > 0) {
                        if (treeIndex % 2) {
                            cc += tree[treeIndex + 1];
                        }
                        treeIndex = treeIndex - 1 >> 1;
                        ++tree[treeIndex];
                    }
                });
                return cc;
            }
        },
        function (module, exports) {
            var nodesFromList = _require(25).filter.nodesFromList, Set = _require(3).Set;
            module.exports = initLayerGraphs;
            function initLayerGraphs(g) {
                var ranks = [];
                function dfs(u) {
                    if (u === null) {
                        g.children(u).forEach(function (v) {
                            dfs(v);
                        });
                        return;
                    }
                    var value = g.node(u);
                    value.minRank = 'rank' in value ? value.rank : Number.MAX_VALUE;
                    value.maxRank = 'rank' in value ? value.rank : Number.MIN_VALUE;
                    var uRanks = new Set();
                    g.children(u).forEach(function (v) {
                        var rs = dfs(v);
                        uRanks = Set.union([
                            uRanks,
                            rs
                        ]);
                        value.minRank = Math.min(value.minRank, g.node(v).minRank);
                        value.maxRank = Math.max(value.maxRank, g.node(v).maxRank);
                    });
                    if ('rank' in value)
                        uRanks.add(value.rank);
                    uRanks.keys().forEach(function (r) {
                        if (!(r in ranks))
                            ranks[r] = [];
                        ranks[r].push(u);
                    });
                    return uRanks;
                }
                dfs(null);
                var layerGraphs = [];
                ranks.forEach(function (us, rank) {
                    layerGraphs[rank] = g.filterNodes(nodesFromList(us));
                });
                return layerGraphs;
            }
        },
        function (module, exports) {
            var crossCount = _require(11), util = _require(23);
            module.exports = initOrder;
            function initOrder(g, random) {
                var layers = [];
                g.eachNode(function (u, value) {
                    var layer = layers[value.rank];
                    if (g.children && g.children(u).length > 0)
                        return;
                    if (!layer) {
                        layer = layers[value.rank] = [];
                    }
                    layer.push(u);
                });
                layers.forEach(function (layer) {
                    if (random) {
                        util.shuffle(layer);
                    }
                    layer.forEach(function (u, i) {
                        g.node(u).order = i;
                    });
                });
                var cc = crossCount(g);
                g.graph().orderInitCC = cc;
                g.graph().orderCC = Number.MAX_VALUE;
            }
        },
        function (module, exports) {
            var util = _require(23);
            module.exports = sortLayer;
            function sortLayer(g, cg, weights) {
                var ordering = [];
                var bs = {};
                g.eachNode(function (u, value) {
                    ordering[value.order] = u;
                    var ws = weights[u];
                    if (ws.length) {
                        bs[u] = util.sum(ws) / ws.length;
                    }
                });
                var toSort = g.nodes().filter(function (u) {
                        return bs[u] !== undefined;
                    });
                toSort.sort(function (x, y) {
                    return bs[x] - bs[y] || g.node(x).order - g.node(y).order;
                });
                for (var i = 0, j = 0, jl = toSort.length; j < jl; ++i) {
                    if (bs[ordering[i]] !== undefined) {
                        g.node(toSort[j++]).order = i;
                    }
                }
            }
        },
        function (module, exports) {
            var util = _require(23);
            module.exports = function () {
                var config = {
                        nodeSep: 50,
                        edgeSep: 10,
                        universalSep: null,
                        rankSep: 30
                    };
                var self = {};
                self.nodeSep = util.propertyAccessor(self, config, 'nodeSep');
                self.edgeSep = util.propertyAccessor(self, config, 'edgeSep');
                self.universalSep = util.propertyAccessor(self, config, 'universalSep');
                self.rankSep = util.propertyAccessor(self, config, 'rankSep');
                self.debugLevel = util.propertyAccessor(self, config, 'debugLevel');
                self.run = run;
                return self;
                function run(g) {
                    g = g.filterNodes(util.filterNonSubgraphs(g));
                    var layering = util.ordering(g);
                    var conflicts = findConflicts(g, layering);
                    var xss = {};
                    [
                        'u',
                        'd'
                    ].forEach(function (vertDir) {
                        if (vertDir === 'd')
                            layering.reverse();
                        [
                            'l',
                            'r'
                        ].forEach(function (horizDir) {
                            if (horizDir === 'r')
                                reverseInnerOrder(layering);
                            var dir = vertDir + horizDir;
                            var align = verticalAlignment(g, layering, conflicts, vertDir === 'u' ? 'predecessors' : 'successors');
                            xss[dir] = horizontalCompaction(g, layering, align.pos, align.root, align.align);
                            if (config.debugLevel >= 3)
                                debugPositioning(vertDir + horizDir, g, layering, xss[dir]);
                            if (horizDir === 'r')
                                flipHorizontally(xss[dir]);
                            if (horizDir === 'r')
                                reverseInnerOrder(layering);
                        });
                        if (vertDir === 'd')
                            layering.reverse();
                    });
                    balance(g, layering, xss);
                    g.eachNode(function (v) {
                        var xs = [];
                        for (var alignment in xss) {
                            var alignmentX = xss[alignment][v];
                            posXDebug(alignment, g, v, alignmentX);
                            xs.push(alignmentX);
                        }
                        xs.sort(function (x, y) {
                            return x - y;
                        });
                        posX(g, v, (xs[1] + xs[2]) / 2);
                    });
                    var y = 0, reverseY = g.graph().rankDir === 'BT' || g.graph().rankDir === 'RL';
                    layering.forEach(function (layer) {
                        var maxHeight = util.max(layer.map(function (u) {
                                return height(g, u);
                            }));
                        y += maxHeight / 2;
                        layer.forEach(function (u) {
                            posY(g, u, reverseY ? -y : y);
                        });
                        y += maxHeight / 2 + config.rankSep;
                    });
                    var minX = util.min(g.nodes().map(function (u) {
                            return posX(g, u) - width(g, u) / 2;
                        }));
                    var minY = util.min(g.nodes().map(function (u) {
                            return posY(g, u) - height(g, u) / 2;
                        }));
                    g.eachNode(function (u) {
                        posX(g, u, posX(g, u) - minX);
                        posY(g, u, posY(g, u) - minY);
                    });
                }
                function undirEdgeId(u, v) {
                    return u < v ? u.toString().length + ':' + u + '-' + v : v.toString().length + ':' + v + '-' + u;
                }
                function findConflicts(g, layering) {
                    var conflicts = {}, pos = {}, prevLayer, currLayer, k0, l, k1;
                    if (layering.length <= 2)
                        return conflicts;
                    function updateConflicts(v) {
                        var k = pos[v];
                        if (k < k0 || k > k1) {
                            conflicts[undirEdgeId(currLayer[l], v)] = true;
                        }
                    }
                    layering[1].forEach(function (u, i) {
                        pos[u] = i;
                    });
                    for (var i = 1; i < layering.length - 1; ++i) {
                        prevLayer = layering[i];
                        currLayer = layering[i + 1];
                        k0 = 0;
                        l = 0;
                        for (var l1 = 0; l1 < currLayer.length; ++l1) {
                            var u = currLayer[l1];
                            pos[u] = l1;
                            k1 = undefined;
                            if (g.node(u).dummy) {
                                var uPred = g.predecessors(u)[0];
                                if (uPred !== undefined && g.node(uPred).dummy)
                                    k1 = pos[uPred];
                            }
                            if (k1 === undefined && l1 === currLayer.length - 1)
                                k1 = prevLayer.length - 1;
                            if (k1 !== undefined) {
                                for (; l <= l1; ++l) {
                                    g.predecessors(currLayer[l]).forEach(updateConflicts);
                                }
                                k0 = k1;
                            }
                        }
                    }
                    return conflicts;
                }
                function verticalAlignment(g, layering, conflicts, relationship) {
                    var pos = {}, root = {}, align = {};
                    layering.forEach(function (layer) {
                        layer.forEach(function (u, i) {
                            root[u] = u;
                            align[u] = u;
                            pos[u] = i;
                        });
                    });
                    layering.forEach(function (layer) {
                        var prevIdx = -1;
                        layer.forEach(function (v) {
                            var related = g[relationship](v), mid;
                            if (related.length > 0) {
                                related.sort(function (x, y) {
                                    return pos[x] - pos[y];
                                });
                                mid = (related.length - 1) / 2;
                                related.slice(Math.floor(mid), Math.ceil(mid) + 1).forEach(function (u) {
                                    if (align[v] === v) {
                                        if (!conflicts[undirEdgeId(u, v)] && prevIdx < pos[u]) {
                                            align[u] = v;
                                            align[v] = root[v] = root[u];
                                            prevIdx = pos[u];
                                        }
                                    }
                                });
                            }
                        });
                    });
                    return {
                        pos: pos,
                        root: root,
                        align: align
                    };
                }
                function horizontalCompaction(g, layering, pos, root, align) {
                    var sink = {}, maybeShift = {}, shift = {}, pred = {}, xs = {};
                    layering.forEach(function (layer) {
                        layer.forEach(function (u, i) {
                            sink[u] = u;
                            maybeShift[u] = {};
                            if (i > 0)
                                pred[u] = layer[i - 1];
                        });
                    });
                    function updateShift(toShift, neighbor, delta) {
                        if (!(neighbor in maybeShift[toShift])) {
                            maybeShift[toShift][neighbor] = delta;
                        } else {
                            maybeShift[toShift][neighbor] = Math.min(maybeShift[toShift][neighbor], delta);
                        }
                    }
                    function placeBlock(v) {
                        if (!(v in xs)) {
                            xs[v] = 0;
                            var w = v;
                            do {
                                if (pos[w] > 0) {
                                    var u = root[pred[w]];
                                    placeBlock(u);
                                    if (sink[v] === v) {
                                        sink[v] = sink[u];
                                    }
                                    var delta = sep(g, pred[w]) + sep(g, w);
                                    if (sink[v] !== sink[u]) {
                                        updateShift(sink[u], sink[v], xs[v] - xs[u] - delta);
                                    } else {
                                        xs[v] = Math.max(xs[v], xs[u] + delta);
                                    }
                                }
                                w = align[w];
                            } while (w !== v);
                        }
                    }
                    util.values(root).forEach(function (v) {
                        placeBlock(v);
                    });
                    layering.forEach(function (layer) {
                        layer.forEach(function (v) {
                            xs[v] = xs[root[v]];
                            if (v === root[v] && v === sink[v]) {
                                var minShift = 0;
                                if (v in maybeShift && Object.keys(maybeShift[v]).length > 0) {
                                    minShift = util.min(Object.keys(maybeShift[v]).map(function (u) {
                                        return maybeShift[v][u] + (u in shift ? shift[u] : 0);
                                    }));
                                }
                                shift[v] = minShift;
                            }
                        });
                    });
                    layering.forEach(function (layer) {
                        layer.forEach(function (v) {
                            xs[v] += shift[sink[root[v]]] || 0;
                        });
                    });
                    return xs;
                }
                function findMinCoord(g, layering, xs) {
                    return util.min(layering.map(function (layer) {
                        var u = layer[0];
                        return xs[u];
                    }));
                }
                function findMaxCoord(g, layering, xs) {
                    return util.max(layering.map(function (layer) {
                        var u = layer[layer.length - 1];
                        return xs[u];
                    }));
                }
                function balance(g, layering, xss) {
                    var min = {}, max = {}, smallestAlignment, shift = {};
                    function updateAlignment(v) {
                        xss[alignment][v] += shift[alignment];
                    }
                    var smallest = Number.POSITIVE_INFINITY;
                    for (var alignment in xss) {
                        var xs = xss[alignment];
                        min[alignment] = findMinCoord(g, layering, xs);
                        max[alignment] = findMaxCoord(g, layering, xs);
                        var w = max[alignment] - min[alignment];
                        if (w < smallest) {
                            smallest = w;
                            smallestAlignment = alignment;
                        }
                    }
                    [
                        'u',
                        'd'
                    ].forEach(function (vertDir) {
                        [
                            'l',
                            'r'
                        ].forEach(function (horizDir) {
                            var alignment = vertDir + horizDir;
                            shift[alignment] = horizDir === 'l' ? min[smallestAlignment] - min[alignment] : max[smallestAlignment] - max[alignment];
                        });
                    });
                    for (alignment in xss) {
                        g.eachNode(updateAlignment);
                    }
                }
                function flipHorizontally(xs) {
                    for (var u in xs) {
                        xs[u] = -xs[u];
                    }
                }
                function reverseInnerOrder(layering) {
                    layering.forEach(function (layer) {
                        layer.reverse();
                    });
                }
                function width(g, u) {
                    switch (g.graph().rankDir) {
                    case 'LR':
                        return g.node(u).height;
                    case 'RL':
                        return g.node(u).height;
                    default:
                        return g.node(u).width;
                    }
                }
                function height(g, u) {
                    switch (g.graph().rankDir) {
                    case 'LR':
                        return g.node(u).width;
                    case 'RL':
                        return g.node(u).width;
                    default:
                        return g.node(u).height;
                    }
                }
                function sep(g, u) {
                    if (config.universalSep !== null) {
                        return config.universalSep;
                    }
                    var w = width(g, u);
                    var s = g.node(u).dummy ? config.edgeSep : config.nodeSep;
                    return (w + s) / 2;
                }
                function posX(g, u, x) {
                    if (g.graph().rankDir === 'LR' || g.graph().rankDir === 'RL') {
                        if (arguments.length < 3) {
                            return g.node(u).y;
                        } else {
                            g.node(u).y = x;
                        }
                    } else {
                        if (arguments.length < 3) {
                            return g.node(u).x;
                        } else {
                            g.node(u).x = x;
                        }
                    }
                }
                function posXDebug(name, g, u, x) {
                    if (g.graph().rankDir === 'LR' || g.graph().rankDir === 'RL') {
                        if (arguments.length < 3) {
                            return g.node(u)[name];
                        } else {
                            g.node(u)[name] = x;
                        }
                    } else {
                        if (arguments.length < 3) {
                            return g.node(u)[name];
                        } else {
                            g.node(u)[name] = x;
                        }
                    }
                }
                function posY(g, u, y) {
                    if (g.graph().rankDir === 'LR' || g.graph().rankDir === 'RL') {
                        if (arguments.length < 3) {
                            return g.node(u).x;
                        } else {
                            g.node(u).x = y;
                        }
                    } else {
                        if (arguments.length < 3) {
                            return g.node(u).y;
                        } else {
                            g.node(u).y = y;
                        }
                    }
                }
                function debugPositioning(align, g, layering, xs) {
                    layering.forEach(function (l, li) {
                        var u, xU;
                        l.forEach(function (v) {
                            var xV = xs[v];
                            if (u) {
                                var s = sep(g, u) + sep(g, v);
                                if (xV - xU < s)
                                    console.log('Position phase: sep violation. Align: ' + align + '. Layer: ' + li + '. ' + 'U: ' + u + ' V: ' + v + '. Actual sep: ' + (xV - xU) + ' Expected sep: ' + s);
                            }
                            u = v;
                            xU = xV;
                        });
                    });
                }
            };
        },
        function (module, exports) {
            var util = _require(23), acyclic = _require(17), initRank = _require(20), feasibleTree = _require(19), constraints = _require(18), simplex = _require(22), components = _require(25).alg.components, filter = _require(25).filter;
            exports.run = run;
            exports.restoreEdges = restoreEdges;
            function run(g, useSimplex) {
                expandSelfLoops(g);
                util.time('constraints.apply', constraints.apply)(g);
                expandSidewaysEdges(g);
                util.time('acyclic', acyclic)(g);
                var flatGraph = g.filterNodes(util.filterNonSubgraphs(g));
                initRank(flatGraph);
                components(flatGraph).forEach(function (cmpt) {
                    var subgraph = flatGraph.filterNodes(filter.nodesFromList(cmpt));
                    rankComponent(subgraph, useSimplex);
                });
                util.time('constraints.relax', constraints.relax(g));
                util.time('reorientEdges', reorientEdges)(g);
            }
            function restoreEdges(g) {
                acyclic.undo(g);
            }
            function expandSelfLoops(g) {
                g.eachEdge(function (e, u, v, a) {
                    if (u === v) {
                        var x = addDummyNode(g, e, u, v, a, 0, false), y = addDummyNode(g, e, u, v, a, 1, true), z = addDummyNode(g, e, u, v, a, 2, false);
                        g.addEdge(null, x, u, {
                            minLen: 1,
                            selfLoop: true
                        });
                        g.addEdge(null, x, y, {
                            minLen: 1,
                            selfLoop: true
                        });
                        g.addEdge(null, u, z, {
                            minLen: 1,
                            selfLoop: true
                        });
                        g.addEdge(null, y, z, {
                            minLen: 1,
                            selfLoop: true
                        });
                        g.delEdge(e);
                    }
                });
            }
            function expandSidewaysEdges(g) {
                g.eachEdge(function (e, u, v, a) {
                    if (u === v) {
                        var origEdge = a.originalEdge, dummy = addDummyNode(g, origEdge.e, origEdge.u, origEdge.v, origEdge.value, 0, true);
                        g.addEdge(null, u, dummy, { minLen: 1 });
                        g.addEdge(null, dummy, v, { minLen: 1 });
                        g.delEdge(e);
                    }
                });
            }
            function addDummyNode(g, e, u, v, a, index, isLabel) {
                return g.addNode(null, {
                    width: isLabel ? a.width : 0,
                    height: isLabel ? a.height : 0,
                    edge: {
                        id: e,
                        source: u,
                        target: v,
                        attrs: a
                    },
                    dummy: true,
                    index: index
                });
            }
            function reorientEdges(g) {
                g.eachEdge(function (e, u, v, value) {
                    if (g.node(u).rank > g.node(v).rank) {
                        g.delEdge(e);
                        value.reversed = true;
                        g.addEdge(e, v, u, value);
                    }
                });
            }
            function rankComponent(subgraph, useSimplex) {
                var spanningTree = feasibleTree(subgraph);
                if (useSimplex) {
                    util.log(1, 'Using network simplex for ranking');
                    simplex(subgraph, spanningTree);
                }
                normalize(subgraph);
            }
            function normalize(g) {
                var m = util.min(g.nodes().map(function (u) {
                        return g.node(u).rank;
                    }));
                g.eachNode(function (u, node) {
                    node.rank -= m;
                });
            }
        },
        function (module, exports) {
            var util = _require(23);
            module.exports = acyclic;
            module.exports.undo = undo;
            function acyclic(g) {
                var onStack = {}, visited = {}, reverseCount = 0;
                function dfs(u) {
                    if (u in visited)
                        return;
                    visited[u] = onStack[u] = true;
                    g.outEdges(u).forEach(function (e) {
                        var t = g.target(e), value;
                        if (u === t) {
                            console.error('Warning: found self loop "' + e + '" for node "' + u + '"');
                        } else if (t in onStack) {
                            value = g.edge(e);
                            g.delEdge(e);
                            value.reversed = true;
                            ++reverseCount;
                            g.addEdge(e, t, u, value);
                        } else {
                            dfs(t);
                        }
                    });
                    delete onStack[u];
                }
                g.eachNode(function (u) {
                    dfs(u);
                });
                util.log(2, 'Acyclic Phase: reversed ' + reverseCount + ' edge(s)');
                return reverseCount;
            }
            function undo(g) {
                g.eachEdge(function (e, s, t, a) {
                    if (a.reversed) {
                        delete a.reversed;
                        g.delEdge(e);
                        g.addEdge(e, t, s, a);
                    }
                });
            }
        },
        function (module, exports) {
            exports.apply = function (g) {
                function dfs(sg) {
                    var rankSets = {};
                    g.children(sg).forEach(function (u) {
                        if (g.children(u).length) {
                            dfs(u);
                            return;
                        }
                        var value = g.node(u), prefRank = value.prefRank;
                        if (prefRank !== undefined) {
                            if (!checkSupportedPrefRank(prefRank)) {
                                return;
                            }
                            if (!(prefRank in rankSets)) {
                                rankSets.prefRank = [u];
                            } else {
                                rankSets.prefRank.push(u);
                            }
                            var newU = rankSets[prefRank];
                            if (newU === undefined) {
                                newU = rankSets[prefRank] = g.addNode(null, { originalNodes: [] });
                                g.parent(newU, sg);
                            }
                            redirectInEdges(g, u, newU, prefRank === 'min');
                            redirectOutEdges(g, u, newU, prefRank === 'max');
                            g.node(newU).originalNodes.push({
                                u: u,
                                value: value,
                                parent: sg
                            });
                            g.delNode(u);
                        }
                    });
                    addLightEdgesFromMinNode(g, sg, rankSets.min);
                    addLightEdgesToMaxNode(g, sg, rankSets.max);
                }
                dfs(null);
            };
            function checkSupportedPrefRank(prefRank) {
                if (prefRank !== 'min' && prefRank !== 'max' && prefRank.indexOf('same_') !== 0) {
                    console.error('Unsupported rank type: ' + prefRank);
                    return false;
                }
                return true;
            }
            function redirectInEdges(g, u, newU, reverse) {
                g.inEdges(u).forEach(function (e) {
                    var origValue = g.edge(e), value;
                    if (origValue.originalEdge) {
                        value = origValue;
                    } else {
                        value = {
                            originalEdge: {
                                e: e,
                                u: g.source(e),
                                v: g.target(e),
                                value: origValue
                            },
                            minLen: g.edge(e).minLen
                        };
                    }
                    if (origValue.selfLoop) {
                        reverse = false;
                    }
                    if (reverse) {
                        g.addEdge(null, newU, g.source(e), value);
                        value.reversed = true;
                    } else {
                        g.addEdge(null, g.source(e), newU, value);
                    }
                });
            }
            function redirectOutEdges(g, u, newU, reverse) {
                g.outEdges(u).forEach(function (e) {
                    var origValue = g.edge(e), value;
                    if (origValue.originalEdge) {
                        value = origValue;
                    } else {
                        value = {
                            originalEdge: {
                                e: e,
                                u: g.source(e),
                                v: g.target(e),
                                value: origValue
                            },
                            minLen: g.edge(e).minLen
                        };
                    }
                    if (origValue.selfLoop) {
                        reverse = false;
                    }
                    if (reverse) {
                        g.addEdge(null, g.target(e), newU, value);
                        value.reversed = true;
                    } else {
                        g.addEdge(null, newU, g.target(e), value);
                    }
                });
            }
            function addLightEdgesFromMinNode(g, sg, minNode) {
                if (minNode !== undefined) {
                    g.children(sg).forEach(function (u) {
                        if (u !== minNode && !g.outEdges(minNode, u).length && !g.node(u).dummy) {
                            g.addEdge(null, minNode, u, { minLen: 0 });
                        }
                    });
                }
            }
            function addLightEdgesToMaxNode(g, sg, maxNode) {
                if (maxNode !== undefined) {
                    g.children(sg).forEach(function (u) {
                        if (u !== maxNode && !g.outEdges(u, maxNode).length && !g.node(u).dummy) {
                            g.addEdge(null, u, maxNode, { minLen: 0 });
                        }
                    });
                }
            }
            exports.relax = function (g) {
                var originalEdges = [];
                g.eachEdge(function (e, u, v, value) {
                    var originalEdge = value.originalEdge;
                    if (originalEdge) {
                        originalEdges.push(originalEdge);
                    }
                });
                g.eachNode(function (u, value) {
                    var originalNodes = value.originalNodes;
                    if (originalNodes) {
                        originalNodes.forEach(function (originalNode) {
                            originalNode.value.rank = value.rank;
                            g.addNode(originalNode.u, originalNode.value);
                            g.parent(originalNode.u, originalNode.parent);
                        });
                        g.delNode(u);
                    }
                });
                originalEdges.forEach(function (edge) {
                    g.addEdge(edge.e, edge.u, edge.v, edge.value);
                });
            };
        },
        function (module, exports) {
            var Set = _require(3).Set, Digraph = _require(25).Digraph, util = _require(23);
            module.exports = feasibleTree;
            function feasibleTree(g) {
                var remaining = new Set(g.nodes()), tree = new Digraph();
                if (remaining.size() === 1) {
                    var root = g.nodes()[0];
                    tree.addNode(root, {});
                    tree.graph({ root: root });
                    return tree;
                }
                function addTightEdges(v) {
                    var continueToScan = true;
                    g.predecessors(v).forEach(function (u) {
                        if (remaining.has(u) && !slack(g, u, v)) {
                            if (remaining.has(v)) {
                                tree.addNode(v, {});
                                remaining.remove(v);
                                tree.graph({ root: v });
                            }
                            tree.addNode(u, {});
                            tree.addEdge(null, u, v, { reversed: true });
                            remaining.remove(u);
                            addTightEdges(u);
                            continueToScan = false;
                        }
                    });
                    g.successors(v).forEach(function (w) {
                        if (remaining.has(w) && !slack(g, v, w)) {
                            if (remaining.has(v)) {
                                tree.addNode(v, {});
                                remaining.remove(v);
                                tree.graph({ root: v });
                            }
                            tree.addNode(w, {});
                            tree.addEdge(null, v, w, {});
                            remaining.remove(w);
                            addTightEdges(w);
                            continueToScan = false;
                        }
                    });
                    return continueToScan;
                }
                function createTightEdge() {
                    var minSlack = Number.MAX_VALUE;
                    remaining.keys().forEach(function (v) {
                        g.predecessors(v).forEach(function (u) {
                            if (!remaining.has(u)) {
                                var edgeSlack = slack(g, u, v);
                                if (Math.abs(edgeSlack) < Math.abs(minSlack)) {
                                    minSlack = -edgeSlack;
                                }
                            }
                        });
                        g.successors(v).forEach(function (w) {
                            if (!remaining.has(w)) {
                                var edgeSlack = slack(g, v, w);
                                if (Math.abs(edgeSlack) < Math.abs(minSlack)) {
                                    minSlack = edgeSlack;
                                }
                            }
                        });
                    });
                    tree.eachNode(function (u) {
                        g.node(u).rank -= minSlack;
                    });
                }
                while (remaining.size()) {
                    var nodesToSearch = !tree.order() ? remaining.keys() : tree.nodes();
                    for (var i = 0, il = nodesToSearch.length; i < il && addTightEdges(nodesToSearch[i]); ++i);
                    if (remaining.size()) {
                        createTightEdge();
                    }
                }
                return tree;
            }
            function slack(g, u, v) {
                var rankDiff = g.node(v).rank - g.node(u).rank;
                var maxMinLen = util.max(g.outEdges(u, v).map(function (e) {
                        return g.edge(e).minLen;
                    }));
                return rankDiff - maxMinLen;
            }
        },
        function (module, exports) {
            var util = _require(23), topsort = _require(25).alg.topsort;
            module.exports = initRank;
            function initRank(g) {
                var sorted = topsort(g);
                sorted.forEach(function (u) {
                    var inEdges = g.inEdges(u);
                    if (inEdges.length === 0) {
                        g.node(u).rank = 0;
                        return;
                    }
                    var minLens = inEdges.map(function (e) {
                            return g.node(g.source(e)).rank + g.edge(e).minLen;
                        });
                    g.node(u).rank = util.max(minLens);
                });
            }
        },
        function (module, exports) {
            module.exports = { slack: slack };
            function slack(graph, u, v, minLen) {
                return Math.abs(graph.node(u).rank - graph.node(v).rank) - minLen;
            }
        },
        function (module, exports) {
            var util = _require(23), rankUtil = _require(21);
            module.exports = simplex;
            function simplex(graph, spanningTree) {
                initCutValues(graph, spanningTree);
                while (true) {
                    var e = leaveEdge(spanningTree);
                    if (e === null)
                        break;
                    var f = enterEdge(graph, spanningTree, e);
                    exchange(graph, spanningTree, e, f);
                }
            }
            function initCutValues(graph, spanningTree) {
                computeLowLim(spanningTree);
                spanningTree.eachEdge(function (id, u, v, treeValue) {
                    treeValue.cutValue = 0;
                });
                function dfs(n) {
                    var children = spanningTree.successors(n);
                    for (var c in children) {
                        var child = children[c];
                        dfs(child);
                    }
                    if (n !== spanningTree.graph().root) {
                        setCutValue(graph, spanningTree, n);
                    }
                }
                dfs(spanningTree.graph().root);
            }
            function computeLowLim(tree) {
                var postOrderNum = 0;
                function dfs(n) {
                    var children = tree.successors(n);
                    var low = postOrderNum;
                    for (var c in children) {
                        var child = children[c];
                        dfs(child);
                        low = Math.min(low, tree.node(child).low);
                    }
                    tree.node(n).low = low;
                    tree.node(n).lim = postOrderNum++;
                }
                dfs(tree.graph().root);
            }
            function setCutValue(graph, tree, child) {
                var parentEdge = tree.inEdges(child)[0];
                var grandchildren = [];
                var grandchildEdges = tree.outEdges(child);
                for (var gce in grandchildEdges) {
                    grandchildren.push(tree.target(grandchildEdges[gce]));
                }
                var cutValue = 0;
                var E = 0;
                var F = 0;
                var G = 0;
                var H = 0;
                var outEdges = graph.outEdges(child);
                var gc;
                for (var oe in outEdges) {
                    var succ = graph.target(outEdges[oe]);
                    for (gc in grandchildren) {
                        if (inSubtree(tree, succ, grandchildren[gc])) {
                            E++;
                        }
                    }
                    if (!inSubtree(tree, succ, child)) {
                        G++;
                    }
                }
                var inEdges = graph.inEdges(child);
                for (var ie in inEdges) {
                    var pred = graph.source(inEdges[ie]);
                    for (gc in grandchildren) {
                        if (inSubtree(tree, pred, grandchildren[gc])) {
                            F++;
                        }
                    }
                    if (!inSubtree(tree, pred, child)) {
                        H++;
                    }
                }
                var grandchildCutSum = 0;
                for (gc in grandchildren) {
                    var cv = tree.edge(grandchildEdges[gc]).cutValue;
                    if (!tree.edge(grandchildEdges[gc]).reversed) {
                        grandchildCutSum += cv;
                    } else {
                        grandchildCutSum -= cv;
                    }
                }
                if (!tree.edge(parentEdge).reversed) {
                    cutValue += grandchildCutSum - E + F - G + H;
                } else {
                    cutValue -= grandchildCutSum - E + F - G + H;
                }
                tree.edge(parentEdge).cutValue = cutValue;
            }
            function inSubtree(tree, n, root) {
                return tree.node(root).low <= tree.node(n).lim && tree.node(n).lim <= tree.node(root).lim;
            }
            function leaveEdge(tree) {
                var edges = tree.edges();
                for (var n in edges) {
                    var e = edges[n];
                    var treeValue = tree.edge(e);
                    if (treeValue.cutValue < 0) {
                        return e;
                    }
                }
                return null;
            }
            function enterEdge(graph, tree, e) {
                var source = tree.source(e);
                var target = tree.target(e);
                var lower = tree.node(target).lim < tree.node(source).lim ? target : source;
                var aligned = !tree.edge(e).reversed;
                var minSlack = Number.POSITIVE_INFINITY;
                var minSlackEdge;
                if (aligned) {
                    graph.eachEdge(function (id, u, v, value) {
                        if (id !== e && inSubtree(tree, u, lower) && !inSubtree(tree, v, lower)) {
                            var slack = rankUtil.slack(graph, u, v, value.minLen);
                            if (slack < minSlack) {
                                minSlack = slack;
                                minSlackEdge = id;
                            }
                        }
                    });
                } else {
                    graph.eachEdge(function (id, u, v, value) {
                        if (id !== e && !inSubtree(tree, u, lower) && inSubtree(tree, v, lower)) {
                            var slack = rankUtil.slack(graph, u, v, value.minLen);
                            if (slack < minSlack) {
                                minSlack = slack;
                                minSlackEdge = id;
                            }
                        }
                    });
                }
                if (minSlackEdge === undefined) {
                    var outside = [];
                    var inside = [];
                    graph.eachNode(function (id) {
                        if (!inSubtree(tree, id, lower)) {
                            outside.push(id);
                        } else {
                            inside.push(id);
                        }
                    });
                    throw new Error('No edge found from outside of tree to inside');
                }
                return minSlackEdge;
            }
            function exchange(graph, tree, e, f) {
                tree.delEdge(e);
                var source = graph.source(f);
                var target = graph.target(f);
                function redirect(v) {
                    var edges = tree.inEdges(v);
                    for (var i in edges) {
                        var e = edges[i];
                        var u = tree.source(e);
                        var value = tree.edge(e);
                        redirect(u);
                        tree.delEdge(e);
                        value.reversed = !value.reversed;
                        tree.addEdge(e, v, u, value);
                    }
                }
                redirect(target);
                var root = source;
                var edges = tree.inEdges(root);
                while (edges.length > 0) {
                    root = tree.source(edges[0]);
                    edges = tree.inEdges(root);
                }
                tree.graph().root = root;
                tree.addEdge(null, source, target, { cutValue: 0 });
                initCutValues(graph, tree);
                adjustRanks(graph, tree);
            }
            function adjustRanks(graph, tree) {
                function dfs(p) {
                    var children = tree.successors(p);
                    children.forEach(function (c) {
                        var minLen = minimumLength(graph, p, c);
                        graph.node(c).rank = graph.node(p).rank + minLen;
                        dfs(c);
                    });
                }
                dfs(tree.graph().root);
            }
            function minimumLength(graph, u, v) {
                var outEdges = graph.outEdges(u, v);
                if (outEdges.length > 0) {
                    return util.max(outEdges.map(function (e) {
                        return graph.edge(e).minLen;
                    }));
                }
                var inEdges = graph.inEdges(u, v);
                if (inEdges.length > 0) {
                    return -util.max(inEdges.map(function (e) {
                        return graph.edge(e).minLen;
                    }));
                }
            }
        },
        function (module, exports) {
            exports.min = function (values) {
                return Math.min.apply(Math, values);
            };
            exports.max = function (values) {
                return Math.max.apply(Math, values);
            };
            exports.all = function (xs, f) {
                for (var i = 0; i < xs.length; ++i) {
                    if (!f(xs[i])) {
                        return false;
                    }
                }
                return true;
            };
            exports.sum = function (values) {
                return values.reduce(function (acc, x) {
                    return acc + x;
                }, 0);
            };
            exports.values = function (obj) {
                return Object.keys(obj).map(function (k) {
                    return obj[k];
                });
            };
            exports.shuffle = function (array) {
                for (i = array.length - 1; i > 0; --i) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var aj = array[j];
                    array[j] = array[i];
                    array[i] = aj;
                }
            };
            exports.propertyAccessor = function (self, config, field, setHook) {
                return function (x) {
                    if (!arguments.length)
                        return config[field];
                    config[field] = x;
                    if (setHook)
                        setHook(x);
                    return self;
                };
            };
            exports.ordering = function (g) {
                var ordering = [];
                g.eachNode(function (u, value) {
                    var rank = ordering[value.rank] || (ordering[value.rank] = []);
                    rank[value.order] = u;
                });
                return ordering;
            };
            exports.filterNonSubgraphs = function (g) {
                return function (u) {
                    return g.children(u).length === 0;
                };
            };
            function time(name, func) {
                return function () {
                    var start = new Date().getTime();
                    try {
                        return func.apply(null, arguments);
                    } finally {
                        log(1, name + ' time: ' + (new Date().getTime() - start) + 'ms');
                    }
                };
            }
            time.enabled = false;
            exports.time = time;
            function log(level) {
                if (log.level >= level) {
                    console.log.apply(console, Array.prototype.slice.call(arguments, 1));
                }
            }
            log.level = 0;
            exports.log = log;
        },
        function (module, exports) {
            module.exports = '0.4.5';
        },
        function (module, exports) {
            exports.Graph = _require(30);
            exports.Digraph = _require(29);
            exports.CGraph = _require(28);
            exports.CDigraph = _require(27);
            _require(45);
            exports.alg = {
                isAcyclic: _require(36),
                components: _require(31),
                dijkstra: _require(32),
                dijkstraAll: _require(33),
                findCycles: _require(34),
                floydWarshall: _require(35),
                postorder: _require(37),
                preorder: _require(38),
                prim: _require(39),
                tarjan: _require(40),
                topsort: _require(41)
            };
            exports.converter = { json: _require(43) };
            var filter = _require(44);
            exports.filter = {
                all: filter.all,
                nodesFromList: filter.nodesFromList
            };
            exports.version = _require(47);
        },
        function (module, exports) {
            var Set = _require(3).Set;
            module.exports = BaseGraph;
            function BaseGraph() {
                this._value = undefined;
                this._nodes = {};
                this._edges = {};
                this._nextId = 0;
            }
            BaseGraph.prototype.order = function () {
                return Object.keys(this._nodes).length;
            };
            BaseGraph.prototype.size = function () {
                return Object.keys(this._edges).length;
            };
            BaseGraph.prototype.graph = function (value) {
                if (arguments.length === 0) {
                    return this._value;
                }
                this._value = value;
            };
            BaseGraph.prototype.hasNode = function (u) {
                return u in this._nodes;
            };
            BaseGraph.prototype.node = function (u, value) {
                var node = this._strictGetNode(u);
                if (arguments.length === 1) {
                    return node.value;
                }
                node.value = value;
            };
            BaseGraph.prototype.nodes = function () {
                var nodes = [];
                this.eachNode(function (id) {
                    nodes.push(id);
                });
                return nodes;
            };
            BaseGraph.prototype.eachNode = function (func) {
                for (var k in this._nodes) {
                    var node = this._nodes[k];
                    func(node.id, node.value);
                }
            };
            BaseGraph.prototype.hasEdge = function (e) {
                return e in this._edges;
            };
            BaseGraph.prototype.edge = function (e, value) {
                var edge = this._strictGetEdge(e);
                if (arguments.length === 1) {
                    return edge.value;
                }
                edge.value = value;
            };
            BaseGraph.prototype.edges = function () {
                var es = [];
                this.eachEdge(function (id) {
                    es.push(id);
                });
                return es;
            };
            BaseGraph.prototype.eachEdge = function (func) {
                for (var k in this._edges) {
                    var edge = this._edges[k];
                    func(edge.id, edge.u, edge.v, edge.value);
                }
            };
            BaseGraph.prototype.incidentNodes = function (e) {
                var edge = this._strictGetEdge(e);
                return [
                    edge.u,
                    edge.v
                ];
            };
            BaseGraph.prototype.addNode = function (u, value) {
                if (u === undefined || u === null) {
                    do {
                        u = '_' + ++this._nextId;
                    } while (this.hasNode(u));
                } else if (this.hasNode(u)) {
                    throw new Error('Graph already has node \'' + u + '\'');
                }
                this._nodes[u] = {
                    id: u,
                    value: value
                };
                return u;
            };
            BaseGraph.prototype.delNode = function (u) {
                this._strictGetNode(u);
                this.incidentEdges(u).forEach(function (e) {
                    this.delEdge(e);
                }, this);
                delete this._nodes[u];
            };
            BaseGraph.prototype._addEdge = function (e, u, v, value, inMap, outMap) {
                this._strictGetNode(u);
                this._strictGetNode(v);
                if (e === undefined || e === null) {
                    do {
                        e = '_' + ++this._nextId;
                    } while (this.hasEdge(e));
                } else if (this.hasEdge(e)) {
                    throw new Error('Graph already has edge \'' + e + '\'');
                }
                this._edges[e] = {
                    id: e,
                    u: u,
                    v: v,
                    value: value
                };
                addEdgeToMap(inMap[v], u, e);
                addEdgeToMap(outMap[u], v, e);
                return e;
            };
            BaseGraph.prototype._delEdge = function (e, inMap, outMap) {
                var edge = this._strictGetEdge(e);
                delEdgeFromMap(inMap[edge.v], edge.u, e);
                delEdgeFromMap(outMap[edge.u], edge.v, e);
                delete this._edges[e];
            };
            BaseGraph.prototype.copy = function () {
                var copy = new this.constructor();
                copy.graph(this.graph());
                this.eachNode(function (u, value) {
                    copy.addNode(u, value);
                });
                this.eachEdge(function (e, u, v, value) {
                    copy.addEdge(e, u, v, value);
                });
                copy._nextId = this._nextId;
                return copy;
            };
            BaseGraph.prototype.filterNodes = function (filter) {
                var copy = new this.constructor();
                copy.graph(this.graph());
                this.eachNode(function (u, value) {
                    if (filter(u)) {
                        copy.addNode(u, value);
                    }
                });
                this.eachEdge(function (e, u, v, value) {
                    if (copy.hasNode(u) && copy.hasNode(v)) {
                        copy.addEdge(e, u, v, value);
                    }
                });
                return copy;
            };
            BaseGraph.prototype._strictGetNode = function (u) {
                var node = this._nodes[u];
                if (node === undefined) {
                    throw new Error('Node \'' + u + '\' is not in graph');
                }
                return node;
            };
            BaseGraph.prototype._strictGetEdge = function (e) {
                var edge = this._edges[e];
                if (edge === undefined) {
                    throw new Error('Edge \'' + e + '\' is not in graph');
                }
                return edge;
            };
            function addEdgeToMap(map, v, e) {
                (map[v] || (map[v] = new Set())).add(e);
            }
            function delEdgeFromMap(map, v, e) {
                var vEntry = map[v];
                vEntry.remove(e);
                if (vEntry.size() === 0) {
                    delete map[v];
                }
            }
        },
        function (module, exports) {
            var Digraph = _require(29), compoundify = _require(42);
            var CDigraph = compoundify(Digraph);
            module.exports = CDigraph;
            CDigraph.fromDigraph = function (src) {
                var g = new CDigraph(), graphValue = src.graph();
                if (graphValue !== undefined) {
                    g.graph(graphValue);
                }
                src.eachNode(function (u, value) {
                    if (value === undefined) {
                        g.addNode(u);
                    } else {
                        g.addNode(u, value);
                    }
                });
                src.eachEdge(function (e, u, v, value) {
                    if (value === undefined) {
                        g.addEdge(null, u, v);
                    } else {
                        g.addEdge(null, u, v, value);
                    }
                });
                return g;
            };
            CDigraph.prototype.toString = function () {
                return 'CDigraph ' + JSON.stringify(this, null, 2);
            };
        },
        function (module, exports) {
            var Graph = _require(30), compoundify = _require(42);
            var CGraph = compoundify(Graph);
            module.exports = CGraph;
            CGraph.fromGraph = function (src) {
                var g = new CGraph(), graphValue = src.graph();
                if (graphValue !== undefined) {
                    g.graph(graphValue);
                }
                src.eachNode(function (u, value) {
                    if (value === undefined) {
                        g.addNode(u);
                    } else {
                        g.addNode(u, value);
                    }
                });
                src.eachEdge(function (e, u, v, value) {
                    if (value === undefined) {
                        g.addEdge(null, u, v);
                    } else {
                        g.addEdge(null, u, v, value);
                    }
                });
                return g;
            };
            CGraph.prototype.toString = function () {
                return 'CGraph ' + JSON.stringify(this, null, 2);
            };
        },
        function (module, exports) {
            var util = _require(46), BaseGraph = _require(26), Set = _require(3).Set;
            module.exports = Digraph;
            function Digraph() {
                BaseGraph.call(this);
                this._inEdges = {};
                this._outEdges = {};
            }
            Digraph.prototype = new BaseGraph();
            Digraph.prototype.constructor = Digraph;
            Digraph.prototype.isDirected = function () {
                return true;
            };
            Digraph.prototype.successors = function (u) {
                this._strictGetNode(u);
                return Object.keys(this._outEdges[u]).map(function (v) {
                    return this._nodes[v].id;
                }, this);
            };
            Digraph.prototype.predecessors = function (u) {
                this._strictGetNode(u);
                return Object.keys(this._inEdges[u]).map(function (v) {
                    return this._nodes[v].id;
                }, this);
            };
            Digraph.prototype.neighbors = function (u) {
                return Set.union([
                    this.successors(u),
                    this.predecessors(u)
                ]).keys();
            };
            Digraph.prototype.sources = function () {
                var self = this;
                return this._filterNodes(function (u) {
                    return self.inEdges(u).length === 0;
                });
            };
            Digraph.prototype.sinks = function () {
                var self = this;
                return this._filterNodes(function (u) {
                    return self.outEdges(u).length === 0;
                });
            };
            Digraph.prototype.source = function (e) {
                return this._strictGetEdge(e).u;
            };
            Digraph.prototype.target = function (e) {
                return this._strictGetEdge(e).v;
            };
            Digraph.prototype.inEdges = function (target, source) {
                this._strictGetNode(target);
                var results = Set.union(util.values(this._inEdges[target])).keys();
                if (arguments.length > 1) {
                    this._strictGetNode(source);
                    results = results.filter(function (e) {
                        return this.source(e) === source;
                    }, this);
                }
                return results;
            };
            Digraph.prototype.outEdges = function (source, target) {
                this._strictGetNode(source);
                var results = Set.union(util.values(this._outEdges[source])).keys();
                if (arguments.length > 1) {
                    this._strictGetNode(target);
                    results = results.filter(function (e) {
                        return this.target(e) === target;
                    }, this);
                }
                return results;
            };
            Digraph.prototype.incidentEdges = function (u, v) {
                if (arguments.length > 1) {
                    return Set.union([
                        this.outEdges(u, v),
                        this.outEdges(v, u)
                    ]).keys();
                } else {
                    return Set.union([
                        this.inEdges(u),
                        this.outEdges(u)
                    ]).keys();
                }
            };
            Digraph.prototype.toString = function () {
                return 'Digraph ' + JSON.stringify(this, null, 2);
            };
            Digraph.prototype.addNode = function (u, value) {
                u = BaseGraph.prototype.addNode.call(this, u, value);
                this._inEdges[u] = {};
                this._outEdges[u] = {};
                return u;
            };
            Digraph.prototype.delNode = function (u) {
                BaseGraph.prototype.delNode.call(this, u);
                delete this._inEdges[u];
                delete this._outEdges[u];
            };
            Digraph.prototype.addEdge = function (e, source, target, value) {
                return BaseGraph.prototype._addEdge.call(this, e, source, target, value, this._inEdges, this._outEdges);
            };
            Digraph.prototype.delEdge = function (e) {
                BaseGraph.prototype._delEdge.call(this, e, this._inEdges, this._outEdges);
            };
            Digraph.prototype._filterNodes = function (pred) {
                var filtered = [];
                this.eachNode(function (u) {
                    if (pred(u)) {
                        filtered.push(u);
                    }
                });
                return filtered;
            };
        },
        function (module, exports) {
            var util = _require(46), BaseGraph = _require(26), Set = _require(3).Set;
            module.exports = Graph;
            function Graph() {
                BaseGraph.call(this);
                this._incidentEdges = {};
            }
            Graph.prototype = new BaseGraph();
            Graph.prototype.constructor = Graph;
            Graph.prototype.isDirected = function () {
                return false;
            };
            Graph.prototype.neighbors = function (u) {
                this._strictGetNode(u);
                return Object.keys(this._incidentEdges[u]).map(function (v) {
                    return this._nodes[v].id;
                }, this);
            };
            Graph.prototype.incidentEdges = function (u, v) {
                this._strictGetNode(u);
                if (arguments.length > 1) {
                    this._strictGetNode(v);
                    return v in this._incidentEdges[u] ? this._incidentEdges[u][v].keys() : [];
                } else {
                    return Set.union(util.values(this._incidentEdges[u])).keys();
                }
            };
            Graph.prototype.toString = function () {
                return 'Graph ' + JSON.stringify(this, null, 2);
            };
            Graph.prototype.addNode = function (u, value) {
                u = BaseGraph.prototype.addNode.call(this, u, value);
                this._incidentEdges[u] = {};
                return u;
            };
            Graph.prototype.delNode = function (u) {
                BaseGraph.prototype.delNode.call(this, u);
                delete this._incidentEdges[u];
            };
            Graph.prototype.addEdge = function (e, u, v, value) {
                return BaseGraph.prototype._addEdge.call(this, e, u, v, value, this._incidentEdges, this._incidentEdges);
            };
            Graph.prototype.delEdge = function (e) {
                BaseGraph.prototype._delEdge.call(this, e, this._incidentEdges, this._incidentEdges);
            };
        },
        function (module, exports) {
            var Set = _require(3).Set;
            module.exports = components;
            function components(g) {
                var results = [];
                var visited = new Set();
                function dfs(v, component) {
                    if (!visited.has(v)) {
                        visited.add(v);
                        component.push(v);
                        g.neighbors(v).forEach(function (w) {
                            dfs(w, component);
                        });
                    }
                }
                g.nodes().forEach(function (v) {
                    var component = [];
                    dfs(v, component);
                    if (component.length > 0) {
                        results.push(component);
                    }
                });
                return results;
            }
        },
        function (module, exports) {
            var PriorityQueue = _require(3).PriorityQueue;
            module.exports = dijkstra;
            function dijkstra(g, source, weightFunc, incidentFunc) {
                var results = {}, pq = new PriorityQueue();
                function updateNeighbors(e) {
                    var incidentNodes = g.incidentNodes(e), v = incidentNodes[0] !== u ? incidentNodes[0] : incidentNodes[1], vEntry = results[v], weight = weightFunc(e), distance = uEntry.distance + weight;
                    if (weight < 0) {
                        throw new Error('dijkstra does not allow negative edge weights. Bad edge: ' + e + ' Weight: ' + weight);
                    }
                    if (distance < vEntry.distance) {
                        vEntry.distance = distance;
                        vEntry.predecessor = u;
                        pq.decrease(v, distance);
                    }
                }
                weightFunc = weightFunc || function () {
                    return 1;
                };
                incidentFunc = incidentFunc || (g.isDirected() ? function (u) {
                    return g.outEdges(u);
                } : function (u) {
                    return g.incidentEdges(u);
                });
                g.eachNode(function (u) {
                    var distance = u === source ? 0 : Number.POSITIVE_INFINITY;
                    results[u] = { distance: distance };
                    pq.add(u, distance);
                });
                var u, uEntry;
                while (pq.size() > 0) {
                    u = pq.removeMin();
                    uEntry = results[u];
                    if (uEntry.distance === Number.POSITIVE_INFINITY) {
                        break;
                    }
                    incidentFunc(u).forEach(updateNeighbors);
                }
                return results;
            }
        },
        function (module, exports) {
            var dijkstra = _require(32);
            module.exports = dijkstraAll;
            function dijkstraAll(g, weightFunc, incidentFunc) {
                var results = {};
                g.eachNode(function (u) {
                    results[u] = dijkstra(g, u, weightFunc, incidentFunc);
                });
                return results;
            }
        },
        function (module, exports) {
            var tarjan = _require(40);
            module.exports = findCycles;
            function findCycles(g) {
                return tarjan(g).filter(function (cmpt) {
                    return cmpt.length > 1;
                });
            }
        },
        function (module, exports) {
            module.exports = floydWarshall;
            function floydWarshall(g, weightFunc, incidentFunc) {
                var results = {}, nodes = g.nodes();
                weightFunc = weightFunc || function () {
                    return 1;
                };
                incidentFunc = incidentFunc || (g.isDirected() ? function (u) {
                    return g.outEdges(u);
                } : function (u) {
                    return g.incidentEdges(u);
                });
                nodes.forEach(function (u) {
                    results[u] = {};
                    results[u][u] = { distance: 0 };
                    nodes.forEach(function (v) {
                        if (u !== v) {
                            results[u][v] = { distance: Number.POSITIVE_INFINITY };
                        }
                    });
                    incidentFunc(u).forEach(function (e) {
                        var incidentNodes = g.incidentNodes(e), v = incidentNodes[0] !== u ? incidentNodes[0] : incidentNodes[1], d = weightFunc(e);
                        if (d < results[u][v].distance) {
                            results[u][v] = {
                                distance: d,
                                predecessor: u
                            };
                        }
                    });
                });
                nodes.forEach(function (k) {
                    var rowK = results[k];
                    nodes.forEach(function (i) {
                        var rowI = results[i];
                        nodes.forEach(function (j) {
                            var ik = rowI[k];
                            var kj = rowK[j];
                            var ij = rowI[j];
                            var altDistance = ik.distance + kj.distance;
                            if (altDistance < ij.distance) {
                                ij.distance = altDistance;
                                ij.predecessor = kj.predecessor;
                            }
                        });
                    });
                });
                return results;
            }
        },
        function (module, exports) {
            var topsort = _require(41);
            module.exports = isAcyclic;
            function isAcyclic(g) {
                try {
                    topsort(g);
                } catch (e) {
                    if (e instanceof topsort.CycleException)
                        return false;
                    throw e;
                }
                return true;
            }
        },
        function (module, exports) {
            var Set = _require(3).Set;
            module.exports = postorder;
            function postorder(g, root, f) {
                var visited = new Set();
                if (g.isDirected()) {
                    throw new Error('This function only works for undirected graphs');
                }
                function dfs(u, prev) {
                    if (visited.has(u)) {
                        throw new Error('The input graph is not a tree: ' + g);
                    }
                    visited.add(u);
                    g.neighbors(u).forEach(function (v) {
                        if (v !== prev)
                            dfs(v, u);
                    });
                    f(u);
                }
                dfs(root);
            }
        },
        function (module, exports) {
            var Set = _require(3).Set;
            module.exports = preorder;
            function preorder(g, root, f) {
                var visited = new Set();
                if (g.isDirected()) {
                    throw new Error('This function only works for undirected graphs');
                }
                function dfs(u, prev) {
                    if (visited.has(u)) {
                        throw new Error('The input graph is not a tree: ' + g);
                    }
                    visited.add(u);
                    f(u);
                    g.neighbors(u).forEach(function (v) {
                        if (v !== prev)
                            dfs(v, u);
                    });
                }
                dfs(root);
            }
        },
        function (module, exports) {
            var Graph = _require(30), PriorityQueue = _require(3).PriorityQueue;
            module.exports = prim;
            function prim(g, weightFunc) {
                var result = new Graph(), parents = {}, pq = new PriorityQueue(), u;
                function updateNeighbors(e) {
                    var incidentNodes = g.incidentNodes(e), v = incidentNodes[0] !== u ? incidentNodes[0] : incidentNodes[1], pri = pq.priority(v);
                    if (pri !== undefined) {
                        var edgeWeight = weightFunc(e);
                        if (edgeWeight < pri) {
                            parents[v] = u;
                            pq.decrease(v, edgeWeight);
                        }
                    }
                }
                if (g.order() === 0) {
                    return result;
                }
                g.eachNode(function (u) {
                    pq.add(u, Number.POSITIVE_INFINITY);
                    result.addNode(u);
                });
                pq.decrease(g.nodes()[0], 0);
                var init = false;
                while (pq.size() > 0) {
                    u = pq.removeMin();
                    if (u in parents) {
                        result.addEdge(null, u, parents[u]);
                    } else if (init) {
                        throw new Error('Input graph is not connected: ' + g);
                    } else {
                        init = true;
                    }
                    g.incidentEdges(u).forEach(updateNeighbors);
                }
                return result;
            }
        },
        function (module, exports) {
            module.exports = tarjan;
            function tarjan(g) {
                if (!g.isDirected()) {
                    throw new Error('tarjan can only be applied to a directed graph. Bad input: ' + g);
                }
                var index = 0, stack = [], visited = {}, results = [];
                function dfs(u) {
                    var entry = visited[u] = {
                            onStack: true,
                            lowlink: index,
                            index: index++
                        };
                    stack.push(u);
                    g.successors(u).forEach(function (v) {
                        if (!(v in visited)) {
                            dfs(v);
                            entry.lowlink = Math.min(entry.lowlink, visited[v].lowlink);
                        } else if (visited[v].onStack) {
                            entry.lowlink = Math.min(entry.lowlink, visited[v].index);
                        }
                    });
                    if (entry.lowlink === entry.index) {
                        var cmpt = [], v;
                        do {
                            v = stack.pop();
                            visited[v].onStack = false;
                            cmpt.push(v);
                        } while (u !== v);
                        results.push(cmpt);
                    }
                }
                g.nodes().forEach(function (u) {
                    if (!(u in visited)) {
                        dfs(u);
                    }
                });
                return results;
            }
        },
        function (module, exports) {
            module.exports = topsort;
            topsort.CycleException = CycleException;
            function topsort(g) {
                if (!g.isDirected()) {
                    throw new Error('topsort can only be applied to a directed graph. Bad input: ' + g);
                }
                var visited = {};
                var stack = {};
                var results = [];
                function visit(node) {
                    if (node in stack) {
                        throw new CycleException();
                    }
                    if (!(node in visited)) {
                        stack[node] = true;
                        visited[node] = true;
                        g.predecessors(node).forEach(function (pred) {
                            visit(pred);
                        });
                        delete stack[node];
                        results.push(node);
                    }
                }
                var sinks = g.sinks();
                if (g.order() !== 0 && sinks.length === 0) {
                    throw new CycleException();
                }
                g.sinks().forEach(function (sink) {
                    visit(sink);
                });
                return results;
            }
            function CycleException() {
            }
            CycleException.prototype.toString = function () {
                return 'Graph has at least one cycle';
            };
        },
        function (module, exports) {
            var Set = _require(3).Set;
            module.exports = compoundify;
            function compoundify(SuperConstructor) {
                function Constructor() {
                    SuperConstructor.call(this);
                    this._parents = {};
                    this._children = {};
                    this._children[null] = new Set();
                }
                Constructor.prototype = new SuperConstructor();
                Constructor.prototype.constructor = Constructor;
                Constructor.prototype.parent = function (u, parent) {
                    this._strictGetNode(u);
                    if (arguments.length < 2) {
                        return this._parents[u];
                    }
                    if (u === parent) {
                        throw new Error('Cannot make ' + u + ' a parent of itself');
                    }
                    if (parent !== null) {
                        this._strictGetNode(parent);
                    }
                    this._children[this._parents[u]].remove(u);
                    this._parents[u] = parent;
                    this._children[parent].add(u);
                };
                Constructor.prototype.children = function (u) {
                    if (u !== null) {
                        this._strictGetNode(u);
                    }
                    return this._children[u].keys();
                };
                Constructor.prototype.addNode = function (u, value) {
                    u = SuperConstructor.prototype.addNode.call(this, u, value);
                    this._parents[u] = null;
                    this._children[u] = new Set();
                    this._children[null].add(u);
                    return u;
                };
                Constructor.prototype.delNode = function (u) {
                    var parent = this.parent(u);
                    this._children[u].keys().forEach(function (child) {
                        this.parent(child, parent);
                    }, this);
                    this._children[parent].remove(u);
                    delete this._parents[u];
                    delete this._children[u];
                    return SuperConstructor.prototype.delNode.call(this, u);
                };
                Constructor.prototype.copy = function () {
                    var copy = SuperConstructor.prototype.copy.call(this);
                    this.nodes().forEach(function (u) {
                        copy.parent(u, this.parent(u));
                    }, this);
                    return copy;
                };
                Constructor.prototype.filterNodes = function (filter) {
                    var self = this, copy = SuperConstructor.prototype.filterNodes.call(this, filter);
                    var parents = {};
                    function findParent(u) {
                        var parent = self.parent(u);
                        if (parent === null || copy.hasNode(parent)) {
                            parents[u] = parent;
                            return parent;
                        } else if (parent in parents) {
                            return parents[parent];
                        } else {
                            return findParent(parent);
                        }
                    }
                    copy.eachNode(function (u) {
                        copy.parent(u, findParent(u));
                    });
                    return copy;
                };
                return Constructor;
            }
        },
        function (module, exports) {
            var Graph = _require(30), Digraph = _require(29), CGraph = _require(28), CDigraph = _require(27);
            exports.decode = function (nodes, edges, Ctor) {
                Ctor = Ctor || Digraph;
                if (typeOf(nodes) !== 'Array') {
                    throw new Error('nodes is not an Array');
                }
                if (typeOf(edges) !== 'Array') {
                    throw new Error('edges is not an Array');
                }
                if (typeof Ctor === 'string') {
                    switch (Ctor) {
                    case 'graph':
                        Ctor = Graph;
                        break;
                    case 'digraph':
                        Ctor = Digraph;
                        break;
                    case 'cgraph':
                        Ctor = CGraph;
                        break;
                    case 'cdigraph':
                        Ctor = CDigraph;
                        break;
                    default:
                        throw new Error('Unrecognized graph type: ' + Ctor);
                    }
                }
                var graph = new Ctor();
                nodes.forEach(function (u) {
                    graph.addNode(u.id, u.value);
                });
                if (graph.parent) {
                    nodes.forEach(function (u) {
                        if (u.children) {
                            u.children.forEach(function (v) {
                                graph.parent(v, u.id);
                            });
                        }
                    });
                }
                edges.forEach(function (e) {
                    graph.addEdge(e.id, e.u, e.v, e.value);
                });
                return graph;
            };
            exports.encode = function (graph) {
                var nodes = [];
                var edges = [];
                graph.eachNode(function (u, value) {
                    var node = {
                            id: u,
                            value: value
                        };
                    if (graph.children) {
                        var children = graph.children(u);
                        if (children.length) {
                            node.children = children;
                        }
                    }
                    nodes.push(node);
                });
                graph.eachEdge(function (e, u, v, value) {
                    edges.push({
                        id: e,
                        u: u,
                        v: v,
                        value: value
                    });
                });
                var type;
                if (graph instanceof CDigraph) {
                    type = 'cdigraph';
                } else if (graph instanceof CGraph) {
                    type = 'cgraph';
                } else if (graph instanceof Digraph) {
                    type = 'digraph';
                } else if (graph instanceof Graph) {
                    type = 'graph';
                } else {
                    throw new Error('Couldn\'t determine type of graph: ' + graph);
                }
                return {
                    nodes: nodes,
                    edges: edges,
                    type: type
                };
            };
            function typeOf(obj) {
                return Object.prototype.toString.call(obj).slice(8, -1);
            }
        },
        function (module, exports) {
            var Set = _require(3).Set;
            exports.all = function () {
                return function () {
                    return true;
                };
            };
            exports.nodesFromList = function (nodes) {
                var set = new Set(nodes);
                return function (u) {
                    return set.has(u);
                };
            };
        },
        function (module, exports) {
            var Graph = _require(30), Digraph = _require(29);
            Graph.prototype.toDigraph = Graph.prototype.asDirected = function () {
                var g = new Digraph();
                this.eachNode(function (u, value) {
                    g.addNode(u, value);
                });
                this.eachEdge(function (e, u, v, value) {
                    g.addEdge(null, u, v, value);
                    g.addEdge(null, v, u, value);
                });
                return g;
            };
            Digraph.prototype.toGraph = Digraph.prototype.asUndirected = function () {
                var g = new Graph();
                this.eachNode(function (u, value) {
                    g.addNode(u, value);
                });
                this.eachEdge(function (e, u, v, value) {
                    g.addEdge(e, u, v, value);
                });
                return g;
            };
        },
        function (module, exports) {
            exports.values = function (o) {
                var ks = Object.keys(o), len = ks.length, result = new Array(len), i;
                for (i = 0; i < len; ++i) {
                    result[i] = o[ks[i]];
                }
                return result;
            };
        },
        function (module, exports) {
            module.exports = '0.7.4';
        }
    ];
    return  _require(0);
}());

  return _bundleExports;
}));