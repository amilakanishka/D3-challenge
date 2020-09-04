// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 600;
var data;

var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  };

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);  

d3.csv("assets/data/data.csv").then(function(stateData) {
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });    

    console.log(stateData);

    var xLinearScale = d3.scaleLinear()
    .range([0,chartWidth])
    .domain([8, d3.max(stateData, data => data.poverty)]);

    var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([4, d3.max(stateData, data => data.healthcare)]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);   

    for (var i = 0; i < stateData.length; i++) {
        chartGroup.append('g').append("circle")
            .attr("cx",  xLinearScale(stateData[i].poverty))
            .attr("cy", yLinearScale(stateData[i].healthcare))
            .attr("r",10)
            .classed("stateCircle", true);

        chartGroup.append('g').append("text")
            .attr("x",  xLinearScale(stateData[i].poverty))
            .attr("y", yLinearScale(stateData[i].healthcare)+5)        
            .classed("stateText", true)  
            .attr("text-anchor","middle")        
            .text(stateData[i].abbr)
            .style("font-size",10);          
    }    

    chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);    

    chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);    
          
});