// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 600;
var data;

var chartMargin = {
    top: 30,
    right: 30,
    bottom: 50,
    left: 50
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
        data.obesity = +data.obesity;
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

    chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);    

    chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);    
  
    // append x axis
    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top})`)
    .classed("aText", true)
    .text("In Poverty (%)");

  // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacks Healthcare (%)");      

    for (var i = 0; i < stateData.length; i++) {
        chartGroup.append('g').append("circle")
            .attr("cx",  xLinearScale(stateData[i].poverty))
            .attr("cy", yLinearScale(stateData[i].healthcare))
            .attr("r",10)
            .attr("opacity", "0.5")
            .classed("stateCircle", true)

            chartGroup.append('g').append("text")
            .attr("x",  xLinearScale(stateData[i].poverty))
            .attr("y", yLinearScale(stateData[i].healthcare)+5)        
            .classed("stateText", true)  
            .attr("text-anchor","middle")        
            .text(stateData[i].abbr)
            .style("font-size",10);          
    }    
    
    var circlesGroup = chartGroup.selectAll("circle").data(stateData)

    // Append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .classed("d3-tip", true); 
      
    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
      toolTip.style("display", "block")
          .html(
            `<strong>${d.state}<strong><BR>Poverty: ${d.poverty}
            <BR> Obesity: ${d.obesity}`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("position", "absolute")
      // Create "mouseout" event listener to hide tooltip
      .on("mouseout", function() {
        toolTip.style("display", "none");
      });          
    })      
          
  }).catch(function(error) {
      console.log(error);
});