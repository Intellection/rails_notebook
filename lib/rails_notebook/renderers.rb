module RailsNotebook
    
    module Renderers

        def self.json_view( obj )
            <<-HTML
            <div id="json-#{obj.object_id}"></div>
            <script>
                require(["jquery", "/kernelspecs/rails_notebook/jquery.jsonview.js"], function ($, jsonview) {
                    $("#json-#{obj.object_id}").JSONView( #{MultiJson.dump(obj)} );
                });
            </script>
            HTML
        end

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

        def self.render_routes( tree )
            <<-HTML
            <svg id="routes-#{tree.object_id}" width=960 height=600><g/></svg>
            <script>
                require(["/kernelspecs/rails_notebook/rails_notebook.js"], function ( railsNB ) {
                    railsNB.renderRoutes( #{MultiJson.dump(tree)} , document.getElementById( "routes-#{tree.object_id}" ) );
                });
            </script>
            HTML
        end

        def self.html_flamechart( data )
            <<-HTML
            <div class=flamechart id="flamechart-#{data.object_id}" width="960" height="600"></div>
            <script>
                require(["/kernelspecs/rails_notebook/rails_notebook.js"], function ( railsNB ) {
                    railsNB.renderFlamechart( #{MultiJson.dump(data)}, document.getElementById("flamechart-#{data.object_id}" ));
                });
            </script>
            HTML
        end

        def self.render_schema( tables )
        <<-HTML
            <svg id="schema-#{tables.object_id}" width=960 height=600><g/></svg>
            <script>
                require(["/kernelspecs/rails_notebook/rails_notebook.js"], function ( railsNB ) {
                    railsNB.renderSchema( #{MultiJson.dump(tables)} , document.getElementById( "schema-#{tables.object_id}" ) );
                });
            </script>
            HTML
        end

        def self.render_table_data( tableData )
        <<-HTML
            <svg id="schema-#{tableData.object_id}" width=960 height=600><g/></svg>
            <script>
                require(["/kernelspecs/rails_notebook/rails_notebook.js"], function ( railsNB ) {
                    railsNB.renderTableData( #{MultiJson.dump(tableData)} , document.getElementById( "schema-#{tableData.object_id}" ) );
                });
            </script>
            HTML
        end

    end

    IRuby::Display::Registry.type { Hash }
    IRuby::Display::Registry.format("text/html") do |hash| 
        Renderers.json_view( hash )
    end


    IRuby::Display::Registry.type { Array }
    IRuby::Display::Registry.format("text/html") do |array| 
        # Let rails do the heavy lifting
    end

    IRuby::Display::Registry.type { String }
    IRuby::Display::Registry.format("text/html") do |string| 
        if string[0] == "{" && string[-1] == "}" 
            Renderers.pretty_print_json( string )
        else
            #render the string normally
        end
    end

    IRuby::Display::Registry.type { Rails.application }
    IRuby::Display::Registry.format("text/html") do |obj|
        Renderers.json_view( Serializers.serialize(obj) )
    end

    IRuby::Display::Registry.type { Profiler::Profile }
    IRuby::Display::Registry.format("text/html") do |profiledData|
        #puts profiledData.inspect
        Renderers.html_flamechart( profiledData )
    end

    IRuby::Display::Registry.type { ActionDispatch::Routing::RouteSet }
    IRuby::Display::Registry.format("text/html") do |route_set|
        all_routes = route_set.routes.to_a
        all_routes.reject! { |route| route.verb.nil? || route.path.spec.to_s == '/assets' }
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
        # routeTree.printTree()
        Renderers.render_routes( routeTree )
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
                    arrowsTo.push(c.name.humanize.pluralize.downcase)
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

        Renderers.render_schema( tables ) # Parses the array of tables to Javascript for rendering
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
            obj.each do |row|
                tempValues.push(row[index])
            end
            tableData.push(tempValues)
        end
        puts tableData.to_a
        Renderers.render_table_data( tableData )
    end # DatabaseQueries

end
