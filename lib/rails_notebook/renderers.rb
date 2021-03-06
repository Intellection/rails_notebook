require 'json'

module RailsNotebook
    
    module Renderers

        def self.pretty_print_json( json )
            <<-HTML
            <div id="json-#{json.object_id}"></div>
            <script>
                require(["jquery", "/kernelspecs/rails_notebook/jquery.jsonview.js"], function ($, jsonview) {
                    $("#json-#{json.object_id}").JSONView( #{json} );
                });
            </script>
            HTML
        end

        def self.render_html( object , functionName )
            <<-HTML
            <div id="railsnb-#{object.object_id}"></div>
            <script>
            require(["/kernelspecs/rails_notebook/rails_notebook.js"] , function ( railsNB ) {
                railsNB.#{functionName}( #{MultiJson.dump(object)} , document.getElementById( "railsnb-#{object.object_id}" ) );
            }); 
            </script>
            HTML
        end
    end

    IRuby::Display::Registry.type { String }
    IRuby::Display::Registry.format("text/html") do |string| 
        begin JSON.parse( string )
            Renderers.pretty_print_json( string )
        rescue
            string
        end
    end

    IRuby::Display::Registry.type { Rails.application }
    IRuby::Display::Registry.format("text/html") do |obj|
        Renderers.json_view( Serializers.serialize(obj) )
    end

    IRuby::Display::Registry.type { Profiler::Profile }
    IRuby::Display::Registry.format("text/html") do |profiledData|
        Renderers.render_html( profiledData, "renderFlamechart" )
    end

    IRuby::Display::Registry.type { ActionDispatch::Routing::RouteSet }
    IRuby::Display::Registry.format("text/html") do |route_set|
        all_routes = route_set.routes.to_a
        all_routes.reject! { |route| route.verb.nil? || route.path.spec.to_s == '/assets' || ( route.path.spec.to_s =~ /^\/rails(.*)/ ) || route.path.spec.to_s =~ /^\/pages(.*)/ }
        routeTree = RouteTree.new( RouteNode.new( "/" , nil, nil, nil, "" ) )
        all_routes.group_by { |route| route.defaults[:controller] }.each_value do |group|
            group.each do |r|
                routeNode = RouteNode.new(  (r.path.spec.to_s.sub '(.:format)','') , 
                                            r.verb.inspect.gsub(/^.{2}|.{2}$/, "") , 
                                            r.name.to_s , r.defaults[:action].to_s , 
                                            (r.path.spec.to_s.sub '(.:format)','').split("/")[-1] 
                                        )
                routeTree.insertNode( routeNode )
            end
        end
        #routeTree.printTree() # for debugging
        Renderers.render_html( routeTree, "renderRoutes" )
    end

    IRuby::Display::Registry.type { ActiveRecord::Base.connection.tables }
    IRuby::Display::Registry.format("text/html") do |obj|
        tables = [] # List of Table objects
        tableNames = [] # List of table names
        obj.each do |table_name|
            tableNames.push(table_name.singularize.foreign_key)
        end # Populates table names

        obj.each do |table_name| # Finding foreign keys and populating the array of Table objects
            columnsTemp = []
            arrowsTo = []
            ActiveRecord::Base.connection.columns(table_name).each do |c|
                columnTemp = []
                if (tableNames.include? c.name)
                    arrowsTo.push(c.name[0..-4].pluralize.downcase) # [0..-4] chops off the _id suffix for foreign keys. .humanize renmoves existing underscores, which causes bugs.
                    columnTemp.push("* " + c.name)
                    columnTemp.push(c.type.to_s)
                else 
                    columnTemp.push("- " + c.name)
                    columnTemp.push(c.type.to_s)
                end
                columnsTemp.push(columnTemp)
            end # end iterating through columns in tables
            tables.push(Table.new(table_name , columnsTemp , arrowsTo ))
        end # end iterating through tables
        tables = tables.sort_by { |x| x.arrowsTo.length }
        Renderers.render_html( tables, "renderSchema" ) # Parses the array of tables to Javascript for rendering
    end

    IRuby::Display::Registry.type { ActiveRecord::Relation}
    IRuby::Display::Registry.format("text/html") do |obj|
        columnNames = []
        tableData = []
        tableData.push(obj.name)
        obj.columns.each do |column|
            columnNames.push(column.name)
        end
        columnNames.each do |index|
            tempValues = []
            tempValues.push(index)
            obj[0,10].each do |row| # Display only the first ten rows
                tempValues.push(row[index])
            end
            tableData.push(tempValues)
        end
        Renderers.render_html( tableData, "renderTableData" )
    end # DatabaseQueries

    IRuby::Display::Registry.type { SchemaTable::ChartRenderer }
    IRuby::Display::Registry.format("text/html") do |obj|
        Renderers.render_html( obj.data , "renderBarChart" )
    end

end
