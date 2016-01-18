module RailsNotebook
    
    module Renderers

        def self.json_view( obj )
            <<-HTML
            <div id="hash-#{obj.object_id}"></div>
            <script>
                require(["jquery", "/kernelspecs/rails_notebook/jquery.jsonview.js"], function($, jsonview) {
                    $("#hash-#{obj.object_id}").JSONView( #{MultiJson.dump(obj)} );
                });
            </script>
            HTML
        end

        #Note: I edited the /Users/nickhoernle/.ipython/kernels/rails_notebook kernel.js file
        # to import the files "d3.min.js" and "custom.js"
        def self.somejavascript( obj )
            <<-HTML
            <div id="hash-#{obj.object_id}"></div>
            <script>
                require([ "jquery" , "/kernelspecs/rails_notebook/d3.min.js", "/kernelspecs/rails_notebook/dagre-d3.js"], function($, d3, dagreD3) {
                    console.log ( $ );  
                    console.log ( d3 );
                    console.log ( dagreD3 );

                    // var g =  new graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function() { return {}; });

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

                    // // Set up edges, no special attributes.
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
                    // g.setEdge(0, 1);


                    // // Create the renderer
                    // var render = new dagreD3.render();

                    // // Set up an SVG group so that we can translate the final graph.
                    // var svg = d3.select("svg"),
                    //     svgGroup = svg.append("g");

                    // // Run the renderer. This is what draws the final graph.
                    // render(d3.select("svg g"), g);

                    // // Center the graph
                    // var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
                    // svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
                    // svg.attr("height", g.graph().height + 40);
                });
            </script>
            HTML
        end

        ##===================================================================
        ## Seems to be superfluous

        # def self.plain_view( obj )
        #     <<-HTML
        #     <div id="hash-#{object_id}"></div>
        #         #{obj} 
        #     HTML
        # end

        ##===================================================================

        def self.routes_view( route_set )
            all_routes = route_set.routes.to_a
            all_routes.reject! { |route| route.verb.nil? || route.path.spec.to_s == '/assets' }
            routeTree = RouteTree.new( RouteNode.new( "/" , "GET", "Default" , "index" ) )
            # table_data = [["Controller", "Name", "Verb", "Path", "Action"]]
            all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|

            #     row = []
            #     row << "CONTROLLER: " + group.first.defaults[:controller].to_s
                group.each do |r|
                    routeNode = RouteNode.new( (r.path.spec.to_s.sub '(.:format)','') , r.verb.inspect.gsub(/^.{2}|.{2}$/, "") , r.name.to_s , r.defaults[:action].to_s )
                    routeTree.insertNode( routeNode )
                    #puts r.name.to_s
                    # puts r.verb.inspect.gsub(/^.{2}|.{2}$/, "")
                    # r.path.spec.to_s.split("/").each do |uri_mapping|
                    #     uri_mapping = "/" + uri_mapping
                    #     puts uri_mapping
                    #     RouteTree.insertNode( )
                    # end
                    # puts ""
                    #puts r.defaults[:action].to_s

                    #puts routeNode
            #         puts group.first.defaults[:controller].to_s
            #         puts ""

            #         # row << route.name.to_s
            #         # row << route.verb.inspect.gsub(/^.{2}|.{2}$/, "")
            #         # row << route.path.spec.to_s
            #         # row << route.defaults[:action].to_s
                end
            #     table_data << row
            end
            #routeTree.printTree
            # IRuby::Display.display(IRuby.table(table_data))
        end
    end

    IRuby::Display::Registry.type { Object }
    IRuby::Display::Registry.format("text/html") do |obj|
        case obj
        when Array
            #Ruby does the heavy lifting here
        when Hash
            Renderers.json_view( obj ) # render as a json object
        when ActionDispatch::Routing::RouteSet
            Renderers.routes_view( obj )
            Renderers.somejavascript( obj )
        when Rails.application
        else
            Renderers.json_view( obj ) # render as a json object
        end
    end

    # IRuby::Display::Registry.type { Hash }
    # IRuby::Display::Registry.format("text/html") do |obj| 
    #     puts "running this method 1"
    #     Renderers.display( obj )
    # end


    # IRuby::Display::Registry.type { Array }
    # IRuby::Display::Registry.format("text/html") do |obj| 
    #     puts "running this method 2"
    #     Renderers.display( obj )
    # end

  #   IRuby::Display::Registry.type { Rails.application }
  #   IRuby::Display::Registry.format("text/html") do |obj|
  #       puts "running this method 4"
  #       #Renderers.json_view( Serializers.serialize(obj) )
  #   end


  #   IRuby::Display::Registry.type { ActionDispatch::Routing::RouteSet }
  #   IRuby::Display::Registry.format("text/html") do |route_set|
        #     puts "running this method 6"
        #     all_routes = Rails.application.routes.routes.to_a
        #     all_routes.reject! { |route| route.verb.nil? || route.path.spec.to_s == '/assets' }

        #     table_data = [["Controller", "Name", "Verb", "Path", "Action"]]

        #     all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|
        #     row = []

        #     row << "CONTROLLER: " + group.first.defaults[:controller].to_s

        #     group.each do |route|
        #         row << route.name.to_s
        #         row << route.verb.inspect.gsub(/^.{2}|.{2}$/, "")
        #         row << route.path.spec.to_s
        #         row << route.defaults[:action].to_s
        #     end

        #     table_data << row
        # end
        # IRuby::Display.display(IRuby.table(table_data))
  # end

end
