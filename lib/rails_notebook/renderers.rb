module RailsNotebook
    
    module Renderers

        def self.json_view( obj )
            <<-HTML
            <div id="hash-#{obj.object_id}"></div>
            <script>
                require(["jquery", "/kernelspecs/rails_notebook/jquery.jsonview.js"], function ($, jsonview) {
                    $("#hash-#{obj.object_id}").JSONView( #{MultiJson.dump(obj)} );
                });
            </script>
            HTML
        end

        #Note: I edited the /Users/nickhoernle/.ipython/kernels/rails_notebook kernel.js file
        # to import the files "d3.min.js" and "custom.js"
        def self.render_routes( tree )
            <<-HTML
            <svg width=960 height=600><g/></svg>
            <!--<script src="/kernelspecs/rails_notebook/renderRoutes.js"></script>-->
            <script>
            require(["jquery", "/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js"], function ($, dagreD3 , d3 ) {
            routeTree = #{MultiJson.dump( tree )};
            console.log( routeTree )
            // Create the input graph
            var g = new dagreD3.graphlib.Graph()
              .setGraph({})
              .setDefaultEdgeLabel(function() { return {}; });

            // Here we"re setting nodeclass, which is used by our custom drawNodes function
            // below.
            var buildOutput = function myself( g, thisNode, nodeNumber, i ){
                console.log( thisNode );

                for ( c in thisNode.childrenNodes ){
                    child = thisNode.childrenNodes[c];
                    child.nodeNumber = nodeNumber + i;
                    g.setNode( child.nodeNumber , {label:thisNode.uriPattern , class:"type-TK" } );
                    g.setEdge( nodeNumber , child.nodeNumber );
                    i++;
                }
                for ( c in thisNode.childrenNodes ){
                    child = thisNode.childrenNodes[c];
                    i = myself( g , child, child.nodeNumber,  i);
                }
                return i;
                // countChildren = 0;
                // var i = 1;
                // for ( c in thisNode.childrenNodes ){
                //     child = thisNode.childrenNodes[c]
                //     myself( g, child, nodeNumber + countChildren + i, nodeNumber );
                //     countChildren += child.countChildrenNodes;
                //     i += 1;
                // }
            }
            
            thisNode = routeTree.headNode.childrenNodes[0];
            buildOutput( g , thisNode, 0 , 0 )

            // g.setNode(0,  { label: "TOP",       class: "type-TOP" });
            // g.setNode(1,  { label: "S",         class: "type-S" });
            // g.setNode(2,  { label: "NP",        class: "type-NP" });
            // g.setNode(3,  { label: "DT",        class: "type-DT" });
            // g.setNode(4,  { label: "This",      class: "type-TK" });
            // g.setNode(5,  { label: "VP",        class: "type-VP" });
            // g.setNode(6,  { label: "VBZ",       class: "type-VBZ" });
            // g.setNode(7,  { label: "is",        class: "type-TK" });
            // g.setNode(8,  { label: "NP",        class: "type-NP" });
            // g.setNode(9,  { label: "DT",        class: "type-DT" });
            // g.setNode(10, { label: "an",        class: "type-TK" });
            // g.setNode(11, { label: "NN",        class: "type-NN" });
            // g.setNode(12, { label: "example",   class: "type-TK" });
            // g.setNode(13, { label: ".",         class: "type-." });
            // g.setNode(14, { label: "sentence",  class: "type-TK" });

            g.nodes().forEach(function(v) {
              var node = g.node(v);
              // Round the corners of the nodes
              node.rx = node.ry = 5;
            });

            // Set up edges, no special attributes.
            // g.setEdge(3, 4);
            // g.setEdge(2, 3);
            // g.setEdge(1, 2);
            // g.setEdge(6, 7);
            // g.setEdge(5, 6);
            // g.setEdge(9, 10);
            // g.setEdge(8, 9);
            // g.setEdge(11,12);
            // g.setEdge(8, 11);
            // g.setEdge(5, 8);
            // g.setEdge(1, 5);
            // g.setEdge(13,14);
            // g.setEdge(1, 13);
            // g.setEdge(0, 1)

            // Create the renderer
            var render = new dagreD3.render();

            // Set up an SVG group so that we can translate the final graph.
            var svg = d3.select("svg"),
                svgGroup = svg.append("g");

            // Run the renderer. This is what draws the final graph.
            render(d3.select("svg g"), g);

            // Center the graph
            var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
            svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
            svg.attr("height", g.graph().height + 40);


            });

            </script>
            HTML
        end
    end

    IRuby::Display::Registry.type { Hash }
    IRuby::Display::Registry.format("text/html") do |obj| 
        Renderers.json_view( obj )
    end


    IRuby::Display::Registry.type { Array }
    IRuby::Display::Registry.format("text/html") do |obj| 
        # Let ruby do the heavy lifting
    end

    IRuby::Display::Registry.type { Rails.application }
    IRuby::Display::Registry.format("text/html") do |obj|
        Renderers.json_view( Serializers.serialize(obj) )
    end


    IRuby::Display::Registry.type { ActionDispatch::Routing::RouteSet }
    IRuby::Display::Registry.format("text/html") do |route_set|
        all_routes = route_set.routes.to_a
        all_routes.reject! { |route| route.verb.nil? || route.path.spec.to_s == '/assets' }
        routeTree = RouteTree.new( RouteNode.new( "/" , "GET", "Default" , "index" ) )
        all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|
            group.each do |r|
                routeNode = RouteNode.new( (r.path.spec.to_s.sub '(.:format)','') , r.verb.inspect.gsub(/^.{2}|.{2}$/, "") , r.name.to_s , r.defaults[:action].to_s )
                routeTree.insertNode( routeNode )
            end
        end
        routeTree.getRoot.countChildrenNodes(0)
        Renderers.render_routes( routeTree )
    end

end
