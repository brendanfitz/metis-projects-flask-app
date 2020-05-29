console.clear()

// set the dimensions and margins of the graph
var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var xBar = d3.scaleBand().range([0, width]).paddingInner(0.5).paddingOuter(0.25);
var xLine = d3.scalePoint().range([0, width]).padding(0.5);
var yBar = d3.scaleLinear().range([height, 0]);
var yLine = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return xLine(d.year); })
    .y(function(d) { return yLine(d.line1); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return xLine(d.year); })
    .y(function(d) { return yLine(d.line2); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("static/js/data/data4.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.bar = +d.bar;
    	d.line1 = +d.line1;
      d.line2 = +d.line2;
  });
	console.table(data);

  // Scale the range of the data
  xBar.domain(data.map(function(d) { return d.year; }));
  xLine.domain(data.map(function(d) { return d.year; }));
  yBar.domain([0, d3.max(data, function(d) { return d.bar; })]).nice();
  yLine.domain([0, d3.max(data, function(d) {return Math.max(d.line1, d.line2); })]).nice();

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "steelblue")
      .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "crimson")
      .attr("d", valueline2);

  var rect = svg.selectAll("rect")
      .data(data)

  rect.enter().append("rect")
  	.merge(rect)
      .attr("class", "bar")
      .style("stroke", "none")
      .style("fill", "#ccc")
      .attr("x", function(d){ return xBar(d.year); })
      .attr("width", function(d){ return xBar.bandwidth(); })
      .attr("y", function(d){ return height - yBar(d.bar); })
      .attr("height", function(d){ return yBar(d.bar); });


  var points2 = svg.selectAll("circle.point2")
      .data(data)

  points2.enter().append("circle")
  	.merge(points2)
      .attr("class", "point2")
      .style("stroke", "crimson")
      .style("stroke-width", 3)
  		.style("fill", "none")
      .attr("cx", function(d){ return xLine(d.year); })
      .attr("cy", function(d){ return yLine(d.line1); })
      .attr("r", function(d){ return 10; });

  var points1 = svg.selectAll("circle.point1")
      .data(data)

  points1.enter().append("circle")
  	.merge(points1)
      .attr("class", "point1")
      .style("stroke", "steelblue")
  		.style("fill", "steelblue")
      .attr("cx", function(d){ return xLine(d.year); })
      .attr("cy", function(d){ return yLine(d.line1); })
      .attr("r", function(d){ return 5; });


  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xLine));

  // Add the Y0 Axis
  svg.append("g")
      .attr("class", "axisSteelBlue")
      .call(d3.axisLeft(yBar));

  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(yLine));

});
