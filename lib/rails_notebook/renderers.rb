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
            <svg width=650 height=680>
                <!--<div id="hash-#{obj.object_id}"/>-->
                <g transform="translate(20,20)" id="hash-#{obj.object_id}"/>
            </svg>
            <script>
                require([ "jquery" , "/kernelspecs/rails_notebook/d3.min.js", "/kernelspecs/rails_notebook/dagre-d3.js"], function($, d3, dagreD3) {
                    // Create a new directed graph
var g = new dagreD3.Digraph();

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.
g.addNode("kspacey",    { label: "Kevin Spacey" });
g.addNode("swilliams",  { label: "Saul Williams" });
g.addNode("bpitt",      { label: "Brad Pitt" });
g.addNode("hford",      { label: "Harrison Ford" });
g.addNode("lwilson",    { label: "Luke Wilson" });
g.addNode("kbacon",     { label: "Kevin Bacon" });

// Add edges to the graph. The first argument is the edge id. Here we use null
// to indicate that an arbitrary edge id can be assigned automatically. The
// second argument is the source of the edge. The third argument is the target
// of the edge. The last argument is the edge metadata.
g.addEdge(null, "kspacey",   "swilliams", { label: "K-PAX" });
g.addEdge(null, "swilliams", "kbacon",    { label: "These Vagabond Shoes" });
g.addEdge(null, "bpitt",     "kbacon",    { label: "Sleepers" });
g.addEdge(null, "hford",     "lwilson",   { label: "Anchorman 2" });
g.addEdge(null, "lwilson",   "kbacon",    { label: "Telling Lies in America" });

                //var html = "<svg width=650 height=680><g transform="translate(20,20)"/></svg>"

                    $("#hash-#{obj.object_id}").append( "html" )
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
        # when Hash
        #     Renderers.json_view( obj ) # render as a json object
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
