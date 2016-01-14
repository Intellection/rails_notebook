module RailsNotebook

    module Renderers

        def self.json_view(obj)
            <<-HTML
            <div id="hash-#{object_id}"></div>
            <script>
                require(["jquery", "/kernelspecs/rails_notebook/jquery.jsonview.js"], function($, jsonview) {
                    $("#hash-#{object_id}").JSONView(#{MultiJson.dump(obj)});
                });
            </script>
            HTML
        end

        def self.plain_view( obj )
            <<-HTML #{obj} HTML
        end
    end


    IRuby::Display::Registry.type { Hash }
    IRuby::Display::Registry.format("text/html") do |obj| 
        Renderers.json_view( obj )
    end


    IRuby::Display::Registry.type { Array }
    IRuby::Display::Registry.format("text/html") do |obj| 
        Renderers.plain_view( obj )
    end


    iRuby::Display::Registry.type { Applicaiton.Object }
    IRuby::Display::Registry.format("text/html") do |obj|
        puts "running this method 3"
        Renderers.json_view( Serializers.serialize(obj) )
        #Renderers.json_view( obj )
    end


    IRuby::Display::Registry.type { Rails.application.class }
    IRuby::Display::Registry.format("text/html") do |obj|
        puts "running this method 4"
        Renderers.json_view(Serializers.serialize(obj))
    end


    IRuby::Display::Registry.type { ActionDispatch::Routing::RouteSet }
    IRuby::Display::Registry.format("text/html") do |route_set|
            all_routes = Rails.application.routes.routes.to_a
            all_routes.reject! { |route| route.verb.nil? || route.path.spec.to_s == '/assets' }

            table_data = [["Controller", "Name", "Verb", "Path", "Action"]]

            all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|
            row = []

            row << "CONTROLLER: " + group.first.defaults[:controller].to_s

            group.each do |route|
                row << route.name.to_s
                row << route.verb.inspect.gsub(/^.{2}|.{2}$/, "")
                row << route.path.spec.to_s
                row << route.defaults[:action].to_s
            end

            table_data << row
        end
        IRuby::Display.display(IRuby.table(table_data))
  end

end
