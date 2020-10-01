var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var colorColumn, dataCleaned;
colorColumn = 'DBSCAN Results'
/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d['Height (Inches)']; }, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d)); }, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["Weight"]; }, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d)); }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var colorMap = {
    'DBSCAN Results': {
      'Core Data': '#2874A6',
      'Outlier': '#00ffc5',
    },
    'IsolationForest Results': {
      'Core Data': '#2874A6',
      'Outlier': '#de03f9',
    },
    'PCA Z-Score Results': {
      'Core Data': '#2874A6',
      'Outlier': '#fbfd00',
    },
}
function color(d) {
  var cmap = colorMap[colorColumn];
  outlier_status = d[colorColumn];
  return cmap[outlier_status];
}

// add the graph canvas to the body of the webpage
var svg = d3.select("#chart-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("/visuals/static/js/data/nba_biometrics_analysis.csv", function(error, data) {

  // change string (from CSV) into number format

  data.forEach(function(d) {
    d["Height (Inches)"] = +d["Height (Inches)"];
    d["Weight"] = +d["Weight"];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  var xbuffer = 1;
  var ybuffer = 10;
  xScale.domain([d3.min(data, xValue)-xbuffer, d3.max(data, xValue)+xbuffer]);
  yScale.domain([d3.min(data, yValue)-ybuffer, d3.max(data, yValue)+ybuffer]);

  // x-axis
  svg.append("g")
      .attr("class", "x axisNBA")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Height (Inches)");

  // y-axis
  svg.append("g")
      .attr("class", "y axisNBA")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Weight (lbs)");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(d);}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Player"] + "<br/> (" + xValue(d) 
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(Object.keys(colorMap[colorColumn]))
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("y", height - 120 - 9)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return colorMap[colorColumn][d]; });

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", height - 120)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
  
  dataCleaned = data;
});

$('#modelSelect').on('change', function() {
  colorColumn = this.value + ' Results';
  console.log(colorColumn);
  changeColor(dataCleaned);
})

function changeColor(data) {
  var rects = d3.selectAll(".dot")
    .data(data)
  rects.style("fill", function(d) { return color(d); }) 

  var legend_boxes = d3.selectAll('.legend')
    .select('rect')
  legend_boxes.style("fill", function(d) { return colorMap[colorColumn][d]; });
}