!function() {

var railsNB = {
  version: "0.0.1"
};

// Margin values are standard for all elements
var margin = { left: 45, top: 10, right: 5, bottom: 60 };

railsNB.renderFlamechart = function ( _data , _element ){
  require( [ "/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js", "jquery", "/kernelspecs/rails_notebook/jquery.tipsy.js" ] , function ( dagreD3, d3, $, tipsy ) {

  // Initialize
  var SAMPLE_TIME       = _data.sampleTime;
  var element               = $(_element);
  var data              = _data.data;
  var self              = this;

  var getGemName = function(frame) {
    var split = frame.split('/gems/');
    if(split.length == 1) {
      split = frame.split('/app/');
      if(split.length == 1) { split = frame.split('/lib/'); }
      split = split[ Math.max( split.length-2,0 ) ].split('/');
      return split[split.length-1].split(':')[0];
    }
    else {
      return split[split.length -1].split('/')[0];
    }
  };

  var getMethodName = function(frame) {
    var split = frame.split('`');
    if(split.length == 2) {
      var fullMethod = split[1].split("'")[0];
      split = fullMethod.split("#");
      if(split.length == 2) { return split[1]; }
      return split[0];
    }
    return '';
  };

  var generate_flamechart = function myself() {
      var bar_height        = 20;
      // Generate color from data. The color palette is based on warm colors i.e.
      // from red to orange which have a hue of 0 to around 40. The step taken to
      // increment the hue from 0 to 40 is a function of the step or depth level.
      var color = function(d) {
          var hue_min     = 0,
          hue_max     = 40,
          hue         = null,
          saturation  = 80,
          luminosity  = 60,
          hues        = [],
          step        = (hue_max - hue_min)/Math.max.apply(Math,y_values);
          for (var h = 0; h < hue_max; h+=step) { hues.push(h) };
          hue = hues[d.y - 1];
          return d3.hsl("hsl(" + hue + "," + saturation + "%," + luminosity + "%)");
      };

      var guessGem = function(frame)
      {
        var split = frame.split('/gems/');
        if(split.length == 1) {
          split = frame.split('/app/');
          if(split.length == 1) {
            split = frame.split('/lib/');
          }
          split = split[Math.max(split.length-2,0)].split('/');
          return split[split.length-1].split(':')[0];
        }
        else
        {
          return split[split.length -1].split('/')[0];
        }
      }

      var guessMethod = function(frame) {
        var split = frame.split('`');
        if(split.length == 2) {
          var fullMethod = split[1].split("'")[0];
          split = fullMethod.split("#");
          if(split.length == 2) {
            return split[1];
          }
          return split[0];
        }
        return '?';
      }

      // Format the data into formats that make it easier to generate the chart.
      // For example ... convert the UNIX timestamps into Date objects for a more
      // meaningful x-axis. To note is that UNIX timestamps are seconds while
      // JavaScript Date objects expect milliseconds.
      var chart_data = $.map(data, function(d, i) {
          var entry = {}
          entry['x_start']            = d.x * SAMPLE_TIME;
          entry['x_end']              = ( d.x + d.width ) * SAMPLE_TIME;
          entry['y']                  = d.y;
          entry['width']              = d.width * SAMPLE_TIME;
          entry['methodDescription']  = d.frame;
          entry['step']               = i;
          d.index                     = i;
          return entry;
      });

      // D3 orders the drawing of elements stacked on each other so we reverse the
      // order by steps to hack in some form of z-index-ness.
      //chart_data.sort(function(a, b) { return b.step - a.step });

      // Determine the chart width (minus axis y-axis and its label).
      var width = function() {
        return element.width() - margin.left - margin.right;
      };

      // Determine the position of the bar which represents each entry i.e. each
      // bar.
      var bar_y_position = function(d) { 
        return bar_height * (d.y - 1)
      };

      var x_values = function() {
        var start_time_values = $.map(chart_data, function(v, i) { return v.x_start }),
            end_time_values   = $.map(chart_data, function(v, i) { return v.x_end   });
        return start_time_values.concat(end_time_values);
      };
      // Get the y-domain possible values ... depending on the mode.
      var y_values    = $.map( chart_data, function(d){ return d.y });
      
      var max_y_value = Math.max.apply( Math,y_values );
      var max_x_value = Math.max.apply( Math,x_values() );

      // Determine the chart height (minus axis x-axis and its label).
      var height = bar_height * Math.max.apply(Math,y_values);

      // Define the limits/scale of the x-axis from it's maximum and minimum points.
      var xScale = d3.scale.linear()
                    .domain(d3.extent(x_values() ) )
                    .range([ 0, width() ]);

      // Define the limits/scale of the y-axis from it's maximum and minimum points.
      var yScale = d3.scale.ordinal()
          .domain(y_values)
          .rangeBands([0, height ]);

      // Create x-axis.
      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");

      // Create y-axis.
      var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

      // Get the SVG element.
      element.append('<svg class="chart" id='+element.context.id+'></svg>');
      
      var svg = d3.select( "#"+element.context.id+".chart" )
                  .attr("width", width() + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom);

      // Add the chart area.
      var chart = svg
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Create entries from data
      var entries = chart.selectAll("g")
          .data(chart_data)
          .enter()

      // Create the bars that represent each entry of data.
      var bar = entries.append("g")
          .attr("transform", function (d) { return "translate(0," + bar_y_position(d) + ")" })
          .on("mouseover", function (d) {
            $("table tr." + d.step, element).addClass("info");
          })
          .on("mouseout", function (d) {
            $("table tr." + d.step, element).removeClass("info");
          })

      var e_sub_bar = bar.append("rect")
         .attr("id", function (d) {return d.step})
         .attr("width", function (d) { return xScale(d.width) })
         .attr("height", bar_height - 1)
         .attr("fill", function (d) { return color(d).toString(); })
         .attr("storedfill", function (d) { return color(d).toString(); }) //for reverting color after cell highlight
         .attr("class", "flamechart-bar")
         .attr("transform", function (d) { return "translate(" + xScale(d.x_start) + ",0)"; });


      // Add the x-axis.
      var xAxisScale = chart.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis);

      // Add the y-axis.
      var yAxisScale = chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      // Add label to the x-axis
      var xAxisLabel = xAxisScale.append("text")
           .attr("class", "label")
           .attr("x", width()/2)
           .attr("y", 30)
           .attr("dy", ".71em")
           .style("text-anchor", "middle")
           .text("Duration (s)");

      // Add label to the y-axis
      var yAxisLabel = yAxisScale.append("text")
        .attr("class", "label")
        .attr("x", height/2 * -1)
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left * -0.85)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Depth");

      // Add the time taken for the expression to execute.
      var bar_time = bar.append("text")
         .attr("x", function (d) { return xScale( d.x_end ) - 3; })
         .attr("y", bar_height/2)
         .attr("fill", "black")
         .attr("dy", ".35em")
         .attr("text-anchor", "end")
         .attr("style", "font: 0.8em sans-serif;")
         .text(function(d) {
            if ( d.width > ( max_x_value/15) ) {
              return ( d.width ).toFixed(2) + 'ms'
            }
          });

      var bar_text = bar.append("text")
         .attr("x", function (d) { return xScale( d.x_start ) + 3; })
         .attr("y", bar_height/2)
         .attr("fill", "black")
         .attr("dy", ".35em")
         .attr("style", "font: 0.8em sans-serif;")
         .text(function(d) {
            if ( d.width > ( max_x_value/5) ) {
              return ( getMethodName( d.methodDescription ) )
            }
          });
  };

  // Load results in a table.
  var load_analysis_table = function() {
    // Create table that will hold our data.
    var empty_table_structure = '<table class="table table-striped">' +
                                  '<thead>' +
                                    '<tr>' +
                                      '<th>Depth</th>' +
                                      '<th>Method Name</th>' +
                                      '<th>Gem Name</th>' +
                                      '<th>Time Taken</th>' +
                                      '<th>% Total Time</th>' +
                                    '</tr>' +
                                  '</thead>' +
                                  '<tbody></tbody>' +
                                '</table>';
    $(element).append(empty_table_structure);

    var widths = $.map( data, function(d){ return d.width });
    var max_entry_time = Math.max.apply( Math, widths );

    // Populate the empty table we just created.
    $.each( data, function( index , entry ) {
      var table_row  = '<tr class="' + entry.index + '">'
          table_row += '<td>' + entry.y + '</td>';
          table_row += '<td>' + getMethodName(entry.frame) + '</td>';
          table_row += '<td>' + getGemName(entry.frame) + '</td>';
          table_row += '<td>' + ( (entry.width * SAMPLE_TIME) ).toFixed(3) + ' ms' + '</td>';
          table_row += '<td>' + (entry.width / max_entry_time * 100).toFixed(3) + '%' + '</td>';
          table_row += '</tr>';
      $('table', element).append(table_row);
      $("table tr." + index, element)
          .on("mouseover", function (d) {
            $( "rect#" + index + ".flamechart-bar", element ).attr("fill","aqua")
          })
          .on("mouseout", function (d) {
            $("rect#" + index + ".flamechart-bar", element)
              .attr("fill",
                $("rect#" + index + ".flamechart-bar", element).attr("storedfill")
              )
          });
    });
  };

  // Draw chart.
  generate_flamechart();
  load_analysis_table();
  
  });
};

railsNB.renderRoutes = function( tree , _element ){
  require( ["/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js", "jquery" ] , function ( dagreD3, d3, $ ) {

  var element   = $(_element);
  var routeTree = tree;

  var g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function() { return {}; });

  // Rendering the graph
  var buildOutput = function myself( g, thisNode, nodeNumber, i ){
      if ( nodeNumber == 0 ) {
          thisNode.label = thisNode.nodeUri + "/";
          g.setNode( 0 , thisNode );
      }
      for ( c in thisNode.childrenNodes ){
          child = thisNode.childrenNodes[c];
          child.nodeNumber = nodeNumber + i;
          child.label = "/" + child.nodeUri;
          child.class = ( child.verbs.length > 0 && child.verbs[0] != "" ?  "type-hasDisplay" : "type-noDisplay" );
          g.setNode( child.nodeNumber , child );
          g.setEdge( nodeNumber , child.nodeNumber );
          i++;
      }
      for ( c in thisNode.childrenNodes ){
          child = thisNode.childrenNodes[c];
          i = myself( g , child, child.nodeNumber,  i);
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
  element.append('<svg class="routes" id='+element.context.id+'><g></g></svg>');
  var width = function() {
        return element.width() - margin.left - margin.right;
      };
      
  var svg = d3.select( "#"+element.context.id+".routes" )
              .attr("width", width() + margin.left + margin.right)
              .attr("height", 400 + margin.top + margin.bottom);
  var inner = svg.select("g");

  // Set up zoom support
  var zoom = d3.behavior.zoom().on("zoom", function() {
      inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
  });
  svg.call(zoom);

  // Simple function to style the tooltip for the given node.
  var styleTooltip = function( node ) {
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
  var initialScale = 0.70;
  zoom
    .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
    .scale(initialScale)
    .event(svg);
  svg.attr('height', g.graph().height * initialScale + 40);

  });
};

railsNB.renderSchema = function( tables, _element ){
  require( ["/kernelspecs/rails_notebook/dagre-d3.js", "/kernelspecs/rails_notebook/d3.js", "jquery" ] , function ( dagreD3, d3, $ ) {

  var element   = $(_element);
  var tablesVar = tables;
  
  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Lets start by creating something simple and add lables to them
  var g = new dagreD3.graphlib.Graph().setGraph({});

  //Create rectangles for each of the tables
  var tablesVarLangth = tablesVar.length;
  for (var i=tablesVarLangth-1; i >= 0; i--)
  {
      var rows = tablesVar[i].columns.map( function( r ){
        var name = r[0].indexOf("id") > -1? "<th>" + r[0] + "</th>" : "<td>" + r[0] + "</td>";
        return "<tr>" + name + "<td>" + r[1] + "</td></tr>"; 
      });
      var buildHtmlOutput = "<div class='activeRecordSchema'><h3>" + capitalizeFirstLetter(tablesVar[i].table_name) + "</h3>";
      buildHtmlOutput += "<table class='activeRecordSchemaTable'>";
      buildHtmlOutput +=    rows;
      buildHtmlOutput += "</table>";
      buildHtmlOutput += "</div>";
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
  

  // Set up an SVG group so that we can translate the final graph.
  element.append('<svg class="schema" id='+element.context.id+'><g></g></svg>');
  var width = function() {
        return element.width() - margin.left - margin.right;
      };
      
  var svg = d3.select( "#"+element.context.id+".schema" )
              .attr("width", width() + margin.left + margin.right)
              .attr("height", 400 + margin.top + margin.bottom);
  var inner = svg.select("g");

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
};

railsNB.renderTableData = function( tableData, element ){
  require( ["jquery"] , function ( $ ) {

  $(element).append("<h1>"+tableData[0]+"</h1>" );

  var rows = tableData[1].map( function( rowElem , i ){
    var cellTypeOpen  = i == 0 ? "<th>" : "<td>";
    var cellTypeClose = i == 0 ? "</th>" : "</td>";
    var row = "<tr>";
    for ( var j = 1 ; j <= tableData.slice(1).length ; j ++ ) {
      row += cellTypeOpen+ tableData[j][i] + cellTypeClose;
    }
    row += "</tr>"
    return ( row );
  });

  $(element).append( "<table>" + rows + "</table>" );

 });
};

railsNB.renderBarChart      = function( hash, element ){
  require(["jquery",  "/kernelspecs/rails_notebook/nv.d3.js", "/kernelspecs/rails_notebook/d3.js"], function ( $ , nvd3 , d3) {
      var barData = [];
      var hashVar = hash;
      for (var key in hashVar)
      {
        barData.push({
          "label": key,
          "value": hashVar[key]
        })
      }

      // console.log(barData);
      var object = [{
        key: "This Chart",
        values: barData
      }];

      nv.addGraph(function() {
          var chart = nv.models.discreteBarChart()
              .x(function(d) { return d.label })    //Specify the data accessors.
              .y(function(d) { return d.value })
              .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
              .showValues(true)       //...instead, show the bar value right on top of each bar.
              ;

          d3.select(element)
              .datum(object)
              .call(chart);

          nv.utils.windowResize(chart.update);

          return chart;
        }); // nv add graph end
  }); // Require end
}; // RenderBarChart end

});

if (typeof define === "function" && define.amd) this.railsNB = railsNB, define(railsNB); else if (typeof module === "object" && module.exports) module.exports = railsNB; else this.railsNB = railsNB;
}();
