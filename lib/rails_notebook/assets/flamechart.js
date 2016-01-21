var FLAMECHART = FLAMECHART || {};

require(["jquery", "/kernelspecs/rails_notebook/d3.js"], function ($, jsonview) {

FLAMECHART.generateFlamechart = function( _data , _element ){
  // Initialize
    var SAMPLE_TIME       = _data.sampleTime;
    var element           = $(_element);
    var data              = _data.data;
    var self              = this;

    console.log( data );

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

        // Determine/initialize some variables that define the appearance and
        // positioning of the chart (and some defaults). No explanation needed here
        // ... the names of the variables make it self explanatory.
        var bar_height        = 20,
            margin            = { left: 45, top: 10, right: 5, bottom: 60 },
            show_steps        = false;


        // Format the data into formats that make it easier to generate the chart.
        // For example ... convert the UNIX timestamps into Date objects for a more
        // meaningful x-axis. To note is that UNIX timestamps are seconds while
        // JavaScript Date objects expect milliseconds.
        var chart_data = $.map(data, function(d, i) {
            var entry = {}
            entry['x_start']            = new Date( d.x * SAMPLE_TIME );
            entry['x_end']              = new Date( ( d.x + d.width ) * SAMPLE_TIME );
            entry['y']                  = d.y;
            entry['width']              = d.width * SAMPLE_TIME;
            entry['methodDescription']  = d.frame;
            entry['step']               = i + 1;
            return entry;
        });

        // D3 orders the drawing of elements stacked on each other so we reverse the
        // order by steps to hack in some form of z-index-ness.
        chart_data.sort(function(a, b) { return b.step - a.step });

        // Determine the chart width (minus axis y-axis and its label).
        var width = function() {
          return element.width() - margin.left - margin.right;
        };

        // Determine the position of the bar which represents each entry i.e. each
        // bar.
        var bar_y_position = function(d) { 
          return bar_height * (d.y - 1)
        };

        // Get the x-domain possible values, factoring in the expression_start_time
        // and expression_end_time as possible values. Returns a single array after
        // going through both sets of values.
        var x_values = function() {
            var start_time_values = $.map(chart_data, function(v, i) { return v.x_start }),
              end_time_values   = $.map(chart_data, function(v, i) { return v.x_end });
            return start_time_values.concat(end_time_values);
        };

        // Get the y-domain possible values ... depending on the mode.
        var y_values = $.map( chart_data, function(d){ return d.y });

        // Determine the chart height (minus axis x-axis and its label).
        var height = bar_height * Math.max.apply(Math,y_values);

        // Define the limits/scale of the x-axis from it's maximum and minimum points.
        var xScale = d3.time.scale()
        .domain(d3.extent(x_values()))
        .range([0, width()]);

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
          .text(show_steps ? "Step" : "Depth");

        // Create the bars that represent each entry of data.
        var bar = entries.append("g")
            .attr("transform", function (d) { return "translate(0," + bar_y_position(d) + ")" });
            // .on("mouseover", function (d) {
            //   $("table tr." + d.sha, element).addClass("info");
            // })
            // .on("mouseout", function (d) {
            //   $("table tr." + d.sha, element).removeClass("info");
            // })
        // Add line to show end of bar! (should be on top of bar)
        // var bar_end_line = entries.append('line')
        //     .attr('x1', function (d) { return xScale(d.x_end) })
        //     .attr('y1', function (d) { return 0 })
        //     .attr('x2', function (d) { return xScale(d.x_end) })
        //     .attr('y2', function (d) { return bar_y_position(d) + bar_height - 1 })
        //     .attr("stroke", d3.hsl("hsl(0, 0%, 30%)").toString())
        //     .attr("stroke-width", 1);

        // // Add line to show start of bar! (white to show separation)
        // var bar_start_line = entries.append('line')
        //     .attr('x1', function (d) { return xScale(d.x_start) })
        //     .attr('y1', function (d) { return bar_y_position(d) - 1 })
        //     .attr('x2', function (d) { return xScale(d.x_start) })
        //     .attr('y2', function (d) { return bar_y_position(d) + bar_height - 1 })
        //     .attr("stroke", "white")
        //     .attr("visibility", show_steps ? "hidden" : "visible")
        //     .attr("stroke-width", 1.75);

        var e_sub_bar = bar.append("rect")
           .attr("width", function (d) { return xScale(d.width) })
           .attr("height", bar_height - 1)
           .attr("fill", function (d) { return color(d).toString(); })
           .attr("transform", function (d) { return "translate("+ xScale(d.x_start) + ",0)"; });

        // Add the time taken for the expression to execute.
        var bar_text = bar.append("text")
           .attr("x", function (d) { return xScale( (d.x_start/2 + d.x_end/2) ); })
           .attr("y", bar_height/2)
           .attr("fill", "black")
           .attr("dy", ".35em")
           .attr("text-anchor", "end")
           .attr("style", "font: 0.8em sans-serif;")
           .text(function(d) { return ( d.width ).toFixed(2) + 'ms' });
    };

    var generate_chart = function () {
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
          step        = (hue_max - hue_min)/data.length;
        for (var h = 0; h < hue_max; h+=step) { hues.push(h) };
        if (show_steps) { hue = hues[d.step - 1] } else { hue = hues[d.depth - 1] };
        return d3.hsl("hsl(" + hue + "," + saturation + "%," + luminosity + "%)");
    };

    // Determine/initialize some variables that define the appearance and
    // positioning of the chart (and some defaults). No explanation needed here
    // ... the names of the variables make it self explanatory.
    var bar_height        = 10,
        margin            = { left: 45, top: 10, right: 5, bottom: 60 },
        show_steps        = false;

    // Determine the chart height (minus axis x-axis and its label).
    var height = function() {
      return bar_height * data.length;
    };

    // Determine the chart width (minus axis y-axis and its label).
    var width = function() {
      return element.width() - margin.left - margin.right;
    };

    // Determine the position of the bar which represents each entry i.e. each
    // bar.
    var bar_y_position = function(d) { 
      return bar_height * (d.depth - 1)
    };

    // Get the x-domain possible values, factoring in the expression_start_time
    // and expression_end_time as possible values. Returns a single array after
    // going through both sets of values.
    var x_values = $.map( data, function(d){ return d.x });
    var y_values = $.map( data, function(d){ return d.y });

    // Format the data into formats that make it easier to generate the chart.
    // For example ... convert the UNIX timestamps into Date objects for a more
    // meaningful x-axis. To note is that UNIX timestamps are seconds while
    // JavaScript Date objects expect milliseconds.
    var chart_data = $.map(data, function(v, i) {
      var entry = {}
      entry['expression_end_time']    = ( v.x + v.width - 1 );
      entry['expression_start_time']  = ( v.x -1 );
      entry['node_end_time']          = ( v.x + v.width - 1 );
      entry['node_start_time']        = ( v.x -1 );
      entry['time_taken_expression']  = ( v.width );
      entry['time_taken_node']        = ( v.width );
      entry['sha']                    = v.frame;
      entry['depth']                  = v.y;
      entry['step']                   = i + 1;
      return entry;
    });

    console.log( chart_data );

    // D3 orders the drawing of elements stacked on each other so we reverse the
    // order by steps to hack in some form of z-index-ness.
    chart_data.sort(function(a, b) { return b.step - a.step });

    // Define the limits/scale of the x-axis from it's maximum and minimum points.
    var xScale = d3.scale.ordinal()
        .domain(x_values) // your data minimum and maximum
        .rangeBands([0, width()]); // the pixels to map to, e.g., the width of the diagram.

    // Define the limits/scale of the y-axis from it's maximum and minimum points.
    var yScale = d3.scale.ordinal()
        .domain(y_values)
        .rangeBands([0, height()]);

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
        .attr("height", height() + margin.top + margin.bottom)

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
        .attr("transform", function (d) { return "translate(0," + bar_y_position(d) + ")"  });
        // .on("mouseover", function (d) {
        //   $("table tr." + d.sha, element).addClass("info");
        // })
        // .on("mouseout", function (d) {
        //   $("table tr." + d.sha, element).removeClass("info");
        // });

    // Add line to show end of bar! (should be on top of bar)
    var bar_end_line = entries.append('line')
        .attr('x1', function (d) { return d.expression_end_time })
        .attr('y1', function (d) { return 0 })
        .attr('x2', function (d) { return d.expression_end_time })
        .attr('y2', function (d) { return bar_y_position(d) + bar_height - 1 })
        .attr("stroke", d3.hsl("hsl(0, 0%, 30%)").toString())
        .attr("stroke-width", 1);

    // Add line to show start of bar! (white to show separation)
    var bar_start_line = entries.append('line')
        .attr('x1', function (d) { return d.expression_start_time })
        .attr('y1', function (d) { return bar_y_position(d) - 1 })
        .attr('x2', function (d) { return d.expression_start_time })
        .attr('y2', function (d) { return bar_y_position(d) + bar_height - 1 })
        .attr("stroke", "white")
        .attr("visibility", show_steps ? "hidden" : "visible")
        .attr("stroke-width", 1.75);

    // // Add the expression (give each bar life!).
    var e_sub_bar = bar.append("rect")
       .attr("width", function (d) { return d.time_taken_expression; })
       .attr("height", bar_height - 1)
       .attr("fill", function (d) { return color(d).toString(); })
       .attr("transform", function (d) { return "translate("+ d.expression_start_time + ",0)"; });

    // Add the node (layered on the expression).
    // var n_sub_bar = bar.append("rect")
    //    .attr("width", function (d) { return d.time_taken_expression; })
    //    .attr("height", bar_height - 1)
    //    .attr("fill", function (d) { return color(d).darker(0.8).toString(); })
    //    .attr("transform", function (d) { return "translate("+ xScale(d.node_start_time) + ",0)"; });

    // Add the time taken for the expression to execute.
    // var bar_text = bar.append("text")
    //    .attr("x", function (d) { return xScale(d.expression_end_time) - 3; })
    //    .attr("y", bar_height/2)
    //    .attr("fill", "black")
    //    .attr("dy", ".35em")
    //    .attr("text-anchor", "end")
    //    .attr("style", "font: 0.8em sans-serif;")
    //    .text(function(d) { return (d.time_taken_expression * 1000).toFixed(2) + 'ms' });

    // Add the x-axis.
    var xAxisScale = chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + (height())+ ")")
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
      .attr("x", height()/2 * -1)
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left * -0.85)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text(show_steps ? "Step" : "Depth");

    // Animate transition into show_steps mode on and off.
    // $('svg.chart').on("click", function() {
    //   show_steps = !show_steps;
    //   svg.transition()
    //     .attr("height", height() + margin.bottom);
    //   bar_start_line.transition()
    //     .attr("visibility", show_steps ? "hidden" : "visible")
    //     .attr('y1', function (d) { return bar_y_position(d) - 1 })
    //     .attr('y2', function (d) { return bar_y_position(d) + bar_height - 1 });
    //   bar_end_line.transition()
    //     .attr('y2', function (d) { return bar_y_position(d) + bar_height - 1 });
    //   bar.transition()
    //     .attr("transform", function (d) { return "translate(0," + bar_y_position(d) + ")" });
    //   e_sub_bar.transition()
    //     .attr("fill", function (d) { return color(d).toString() });
    //   n_sub_bar.transition()
    //     .attr("fill", function (d) { return color(d).darker(0.7).toString() });
    //   xAxisScale.transition()
    //     .attr("transform", "translate(0," + (height())+ ")");
    //   yScale
    //     .domain(y_values())
    //     .rangeBands([0, height()]);
    //   yAxisScale.transition()
    //     .call(yAxis);
    //   yAxisLabel.transition()
    //     .attr("x", height()/2 * -1)
    //     .text(show_steps ? "Step" : "Depth");
    // })
    }

  // Load results in a table.
  // var load_analysis_table = function() {
  //   // Create table that will hold our data.
  //   var empty_table_structure = '<table class="table table-striped">' +
  //                                 '<thead>' +
  //                                   '<tr>' +
  //                                     '<th>Step</th>' +
  //                                     '<th>Depth</th>' +
  //                                     '<th>Name</th>' +
  //                                     '<th>Node Time</th>' +
  //                                     '<th>% Time Taken</th>' +
  //                                     '<th>Expression Time</th>' +
  //                                     '<th>% Time Taken</th>' +
  //                                   '</tr>' +
  //                                 '</thead>' +
  //                                 '<tbody></tbody>' +
  //                               '</table>';
  //   $(element).append(empty_table_structure);

  //   // Sort the objects in order of start time so the main function is at the top
  //   processed_data.sort(function(a, b) { return a.expression_start_time - b.expression_start_time });

  //   // Populate the empty table we just created.
  //   $.each(processed_data, function(index, entry) {
  //     var table_row  = '<tr class="' + entry.sha + '">'
  //         table_row += '<td>' + (index + 1) + '</td>';
  //         table_row += '<td>' + entry.depth + '</td>';
  //         table_row += '<td>' + entry.expression_name + '</td>';
  //         table_row += '<td>' + (entry.node_time_taken * 1000).toFixed(3) + ' ms' + '</td>';
  //         table_row += '<td>' + (entry.node_time_ratio * 100).toFixed(3) + ' %' + '</td>';
  //         table_row += '<td>' + (entry.expression_time_taken * 1000).toFixed(3) + ' ms' + '</td>';
  //         table_row += '<td>' + (entry.expression_time_ratio * 100).toFixed(3) + ' %' + '</td>';
  //         table_row += '</tr>';

  //     $('table', element).append(table_row);
  //   });
  // };

  // // Process the raw node data into some more usable and meaningful.
  var process = function () {
    // Initialize
    var start_times = [], end_times = [];

    // Validate the profile data. Some times the profile details object seems to
    // cache previously profiled jobs. This makes sure that what we represent is
    // part of the expression being calculated.
    $.map(profile_data, function(value, key) {
      // console.log(value, key);
      if (!expression_map[key]) {
        delete profile_data[key]
      };
    });

    // Determine node depths (in relation to stack).
    calculate_depths();

    // Get the expressions into an array for easy looping.
    var expressions = $.map(profile_data, function(expression) {
      start_times.push(expression.expression_start_time);
      end_times.push(expression.expression_end_time);
      return expression;
    });

    // Get the minimum and maximum times so that we know how long the expression
    // took.
    var start_time = Math.min.apply(Math, start_times);
    var end_time   = Math.max.apply(Math, end_times);
    var time_taken = end_time - start_time;

    // This is where we actually digest the raw data into something meaningful.
    $.each(expressions, function(i, e) {
      processed_data.push({
        depth: e.depth,
        sha: e.sha,
        expression_name: e.expression_name,
        expression_start_time: e.expression_start_time,
        expression_time_taken: (e.expression_end_time - e.expression_start_time),
        expression_end_time: e.expression_end_time,
        expression_time_ratio: ((e.expression_end_time - e.expression_start_time)/time_taken),
        node_start_time: e.node_start_time,
        node_time_taken: e.node_execution_time,
        node_end_time: (e.node_start_time + e.node_execution_time),
        node_time_ratio: e.node_execution_time/time_taken
      });
    });
  };

  // Draw chart.
    //process();
    generate_flamechart();
};});