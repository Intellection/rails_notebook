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

            var buildOutput = function myself( g, thisNode, nodeNumber, i ){
                if ( nodeNumber == 0 ) {
                    g.setNode( 0 , {label:thisNode.uriPattern , class:"type-TK" } );
                }
                for ( c in thisNode.childrenNodes ){
                    child = thisNode.childrenNodes[c];
                    child.nodeNumber = nodeNumber + i;
                    g.setNode( child.nodeNumber , {label:child.uriPattern , class:"type-TK" } );
                    g.setEdge( nodeNumber , child.nodeNumber );
                    i++;
                }
                // for ( c in thisNode.childrenNodes ){
                //     child = thisNode.childrenNodes[c];
                //     i = myself( g , child, child.nodeNumber,  i);
                // }
            }
            
            var g = new dagreD3.graphlib.Graph()
                            .setGraph({})
                            .setDefaultEdgeLabel(function() { return {}; });


            thisNode = routeTree.headNode;
            buildOutput( g , thisNode, 0 , 1 )

            g.nodes().forEach(function(v) {
              var node = g.node(v);
              // Round the corners of the nodes
              node.rx = node.ry = 5;
            });
            
            // Set up an SVG group so that we can translate the final graph.
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
        routeTree = RouteTree.new( RouteNode.new( "/" , nil, nil, nil ) )
        all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|
            group.each do |r|
                routeNode = RouteNode.new( (r.path.spec.to_s.sub '(.:format)','') , r.verb.inspect.gsub(/^.{2}|.{2}$/, "") , r.name.to_s , r.defaults[:action].to_s )
                routeTree.insertNode( routeNode )
            end
        end
        Renderers.render_routes( routeTree )
    end

end
