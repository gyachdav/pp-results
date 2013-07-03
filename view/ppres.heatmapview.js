var HEAT_MAP = function(params) {
  var targetDiv = params.targetDiv;
  var dataObj = params.dataObj;

  var data = [];
  var startPoint = 0,
    stopPoint = (dataObj.length) / 20;

  if (typeof params.startPoint !== "undefined") {
    startPoint = params.startPoint;
    var increments = params.increments;
    // console.log(increments);
    stopPoint = startPoint + increments;
    for (i = 0; i < dataObj.length; i++) {
      if ((dataObj[i].col >= startPoint) && (dataObj[i].col <= stopPoint)) data.push(dataObj[i]);
    }
  } else data = dataObj;

  var gridSize = jQuery("#" + targetDiv).width() / ((stopPoint - startPoint) * 1),
    h = gridSize,
    w = gridSize,
    rectPadding = 50;
  // console.log(gridSize);

  var colorLow = 'green',
    colorMed = 'white',
    colorHigh = 'red';

  var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  width = (stopPoint - startPoint) * gridSize - margin.left - margin.right + rectPadding,
    height = 20 * gridSize - margin.top - margin.bottom + rectPadding;

  var colorScale = d3.scale.linear()
    .domain([-100, 0, 100])
    .range([colorLow, colorMed, colorHigh]);

  var svg = d3.select("#" + targetDiv).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var heatMap = svg.selectAll("." + targetDiv)
    .data(data, function(d) {
    return d.col + ': ' + d.row;
  })
    .enter().append("svg:rect")
    .attr("x", function(d) {
    return (d.col - startPoint) * w;
  })
    .attr("y", function(d) {
    return d.row * h;
  })
    .attr("width", function(d) {
    return w;
  })
    .attr("height", function(d) {
    return h;
  })
    .style("fill", function(d) {
    if (d.label == d.mut) return ('black ');
    else return colorScale(d.score);
  })
    .append("svg:title")
    .text(function(d) {
    return d.label + d.col + d.mut + " Score: " + d.score;
  });
};