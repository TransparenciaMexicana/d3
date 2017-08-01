
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseDate = d3.timeParse("%Y-%m-%d");

// set the ranges
var x = d3.scaleTime()
          .domain([new Date(2017, 0, 1), new Date(2017, 11, 31)])
          .rangeRound([0, width]);
var y = d3.scaleLinear()
          .range([height, 0]);

// set the parameters for the histogram
var histogram = d3.histogram()
    //.value(function(d) { return d.date; })
    //.domain(x.domain());
    .thresholds(x.ticks(365));

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".date_histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr('class', 'histogram')
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("fechas.txt", function(error, data) {
  if (error) throw error;

  // get only fechaTransmision and just the %Y-%m-%d part
  
  //var fechas = data.map(function(d){
                        //return d.fechaTransmision;})
  //var fechasSimples = fechas.map(function(d){
                        //return d.split(' ')[0]; })


  // format the data
  //var formatedDate = fechasSimples.map(function(d){
                        //return parseDate(d)});
  data.forEach(function(d){
	d.fechaTransmision = parseDate(d.fechaTransmision.split(' ')[0]);
  });

  // group data by year
  var years = d3.nest()
	.key(function(d){return d.fechaTransmision.getFullYear();})
	.entries(data);
 

  // group the data for the bars for current year

  var currentYear = years[years.length - 1];
  var bins = histogram(currentYear.values.map(function(d){return d.fechaTransmision;}));
  console.log(bins);

  // Scale the range of the data in the y domain
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
		  return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); })
      .attr('fill', 'red');

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style('font-family', 'monospace');

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .style('font-family', 'monospace');
      //.style('font-size', '15px');
      
});
