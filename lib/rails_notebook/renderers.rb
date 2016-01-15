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

            #all_routes.each { |x| puts x }
            # table_data = [["Controller", "Name", "Verb", "Path", "Action"]]
            # all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|
            #     row = []
            #     row << "CONTROLLER: " + group.first.defaults[:controller].to_s
            #     group.each do |r|
            #         puts r.name.to_s
            #         puts r.verb.inspect.gsub(/^.{2}|.{2}$/, "")
            #         puts r.path.spec.to_s
            #         puts r.defaults[:action].to_s
            #         #route = Route.new( r.path.spec.to_s , r.verb.inspect.gsub(/^.{2}|.{2}$/, "") , r.name.to_s , r.defaults[:action].to_s )
            #         #self.json_view( route )
            #         puts group.first.defaults[:controller].to_s
            #         puts ""

            #         # row << route.name.to_s
            #         # row << route.verb.inspect.gsub(/^.{2}|.{2}$/, "")
            #         # row << route.path.spec.to_s
            #         # row << route.defaults[:action].to_s
            #     end
            #     table_data << row
            # end
            # IRuby::Display.display(IRuby.table(table_data))
        end

        def self.somejavascript( obj )
            <<-HTML
            <div id="hash-#{obj.object_id}"></div>
            <script>
                <div id="content"></div>
            </script>
            HTML
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
