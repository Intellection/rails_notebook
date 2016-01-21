require(["jquery", "/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js"], function ($, dagreD3 , d3 ) {
        var g = new dagreD3.graphlib.Graph().setGraph({});
    ["normal", "vee", "undirected"].forEach(function(arrowhead) {
    g.setNode(arrowhead + "1", { label: " " });
    g.setNode(arrowhead + "2", { label: " " });
    g.setEdge(arrowhead + "1", arrowhead + "2", {
      arrowhead: arrowhead,
      label: arrowhead
    });
    });
    var svg = d3.select("svg"),
      inner = svg.select("g");
    // Set up zoom support
    var zoom = d3.behavior.zoom().on("zoom", function() {
        inner.attr("transform", "translate(" + d3.event.translate + ")" +
                                    "scale(" + d3.event.scale + ")");
      });
    svg.call(zoom);
    // Create the renderer
    var render = new dagreD3.render();
    // Run the renderer. This is what draws the final graph.
    render(inner, g);
    // Center the graph
    var initialScale = 0.75;
    zoom
    .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
    .scale(initialScale)
    .event(svg);
    svg.attr('height', g.graph().height * initialScale + 40);
});