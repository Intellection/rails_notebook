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

        def self.render_routes( tree )
            <<-HTML
            <svg width=960 height=600><g/></svg>
            <!--<script src="/kernelspecs/rails_notebook/renderRoutes.js"></script>-->
            <script>
            require(["jquery", "/kernelspecs/rails_notebook/jquery.tipsy.js", "/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js"], 
                    function ( $, tipsy , dagreD3 , d3 ) {
                var routeTree = #{MultiJson.dump( tree )};
                var g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function() { return {}; });
                console.log( routeTree );

                // Rendering the graph
                var buildOutput = function myself( g, thisNode, nodeNumber, i ){
                    if ( nodeNumber == 0 ) {
                        thisNode.label = thisNode.nodeUri + "/";
                        g.setNode( 0 , thisNode );
                    }
                    for ( c in thisNode.childrenNodes ){
                        child = thisNode.childrenNodes[c];
                        child.nodeNumber = nodeNumber + i;
                        child.label = child.nodeUri + "/";
                        child.class = ( child.verbs.length > 0 ?  "type-hasDisplay" : "type-noDisplay" );
                        g.setNode( child.nodeNumber , child );
                        g.setEdge( nodeNumber , child.nodeNumber );
                        i++;
                    }
                    for ( c in thisNode.childrenNodes ){
                        child = thisNode.childrenNodes[c];
                        myself( g , child, child.nodeNumber,  i);
                        i++;
                    }
                    return i;
                }
                buildOutput( g , routeTree.headNode, 0 , 1 )
                
                // DagreD3 code to display graph
                var render  = new dagreD3.render(); // Create the renderer
                g.nodes().forEach(function(v) {
                  var node  = g.node(v);
                  // Round the corners of the nodes
                  node.rx   = node.ry = 5;
                });
                
                // Set up an SVG group so that we can translate the final graph.
                var svg     = d3.select("svg"),
                    inner   = svg.select("g");

                // Set up zoom support
                var zoom = d3.behavior.zoom().on("zoom", function() {
                    inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
                });
                svg.call(zoom);

                // Simple function to style the tooltip for the given node.
                var styleTooltip = function( node ) {
                    if ( node.controller == "/articles/:article_id/comments/new/"){
                        console.log( node );
                    }
                    return(
                        node.verbs.length > 0?
                            "<h3>"+node.uriPattern.slice(0, -1)+"</h3>"      +
                            "<table border=1>"                  +
                                (node.controller? "<tr><th>Controller:</th><td>"+node.controller+"</td></tr>":"")+
                                "<tr><th>Verbs: </th>"          +
                                "<td>"+node.verbs.join("</td><td>")+"</td>"+
                                "</tr>"                         +
                                "<tr><th>Actions: </th>"        +
                                "<td>"+node.actions.join("</td><td>")+"</td>"+
                                "</tr>"                         +
                            "</table>"
                        :
                            null
                    ) 
                };
                // Run the renderer. This is what draws the final graph.
                render(inner, g);
                inner.selectAll("g.node")
                  .attr("title", function(v) { return styleTooltip( g.node(v) ) })
                  .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });
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

        def self.render_profiling( obj )
            <<-HTML
            <script>
                var profile = #{MultiJson.dump( obj )};
                console.log( profile );
            </script>
            HTML
        end

        def self.render_schema( tables )
        <<-HTML
            <svg width=960 height=600><g/></svg>
            <!--<script src="/kernelspecs/rails_notebook/renderSchema.js"></script>-->
            <div class=schema id="#{tables.object_id}" width="960" height="600"></div>
            <script>
            require(["jquery", "/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js"], 
                    function ( $ , dagreD3 , d3 ) {
                var tablesVar = #{MultiJson.dump( tables )};
                console.log("Processed requires successfully!")
                console.log(tablesVar[0].table_name)
                function capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }
                // Lets start by creating something simple and add lables to them
                var g = new dagreD3.graphlib.Graph().setGraph({});

                //Create rectangles for each of the tables
                var tablesVarLangth = tablesVar.length;
                console.log(tablesVarLangth)
                for (var i=tablesVarLangth-1; i >= 0; i--)
                {
                    var buildHtmlOutput = "<div style = 'text-align: center;'><span style='font-size:32px;color:#007acc;font-style:italic;'><u><font style = 'font-family:Palatino'>" + capitalizeFirstLetter(tablesVar[i].table_name) + "</font></u></span><br>";
                    buildHtmlOutput = buildHtmlOutput + "<table class=Tsutable border='0' cellspacing='0' cellpadding='0' style='color:#66c1ff;font-style:italic; border:0px solid' >";
                    tablesVar[i].columns.forEach(function(column){
                        var column_name = column[0];
                        var column_type = column[1];
                        buildHtmlOutput = buildHtmlOutput + "<tr><td>" + column_name + "</td><td>" + column_type + "</td></tr>";
                    });
                    buildHtmlOutput += "</table></div>";
                    g.setNode(tablesVar[i].table_name, { shape: "rect", labelType: "html", label: buildHtmlOutput});
                } // End of loop i, but not end of scope for i

                // Now we want to populate the rectangles with column information
                // TODO

                // Now we want to make the arrows from the arrowsTo array
                for (var i=0; i < tablesVarLangth; i++)
                {
                    if (tablesVar[i].arrowsTo.length != 0)
                    {
                        console.log(tablesVar[i].arrowsTo)
                        tablesVar[i].arrowsTo.forEach(function(arrow) {
                            g.setEdge(tablesVar[i].table_name, arrow, {
                                arrowhead: "normal",
                                label: "belongs to"
                          });
                        });// For each arrow in table
                    } // If there are arrows
                } // End of loop i, but not end of scope for i
                

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
                var initialScale = 0.60;
                zoom
                  .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
                  .scale(initialScale)
                  .event(svg);
                svg.attr('height', g.graph().height * initialScale + 40);

            });   
            </script>
            HTML
        end #render_schema()

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

    IRuby::Display::Registry.type { RubyProf::GraphPrinter }
    IRuby::Display::Registry.format("text/html") do |obj|
        printer = RubyProf::GraphPrinter.new(obj)
        Renderers.render_profiling( printer )
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


        #tables.each do |table|
            #table.printTable
        #end

        # Lets first draw some rectangles for the table names
        Renderers.render_schema( tables ) # Parses the array of tables to Javascript for rendering

    end

end
