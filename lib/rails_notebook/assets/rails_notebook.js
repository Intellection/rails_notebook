var RAILS_NOTEBOOK = RAILS_NOTEBOOK || {};

require(["jquery", "/kernelspecs/rails_notebook/d3.js"], function ($, jsonview) {

RAILS_NOTEBOOK.generateFlamechart = function( _data , _element ){
  // Initialize
    var SAMPLE_TIME       = _data.sampleTime;
    var element           = $(_element);
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

    var generate_flamechart = function () {
        // Create the SVG element
        $(element).append('<svg version="1.1" class="chart"></svg>');

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

        // Determine/initialize some variables that define the appearance and
        // positioning of the chart (and some defaults). No explanation needed here
        // ... the names of the variables make it self explanatory.
        var bar_height        = 20,
            margin            = { left: 45, top: 10, right: 5, bottom: 60 };


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
        var svg = d3.select(".chart")
            .attr("width", width() + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

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
           .attr("width", function (d) { return xScale(d.width) })
           .attr("height", bar_height - 1)
           .attr("fill", function (d) { return color(d).toString(); })
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
    });
  };

  // Draw chart.
  generate_flamechart();
  load_analysis_table();

};});