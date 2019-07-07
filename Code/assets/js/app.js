console.log("In javascript app.js")

// Define chart area size
var svgWidth = 900;
var svgHeight = 500;

// Define the margins
var margin = {
    top: 20,
    right: 100,
    bottom: 70,
    left: 100
};

// Subtract the margins from the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//   Add a group to the svg and move all items within the group to begin at the left and top margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load data file using D3

d3.csv("assets/data/data.csv").then(function (usData) {
    // if (error) return console.warn(error);
    console.log(usData);

    // Process csv file by looping through the data
    for (var i = 0; i < usData.length; i++) {
        console.log(i, usData[i].state, usData[i].poverty, usData[i].healthcare);
        console.log(i, usData[i].obesity, usData[i].income);
    }
    //Parse Data/Cast as numbers
    // ==============================
    usData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    // Create scale functions
    // ==============================
    // Scale x to chart width
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(usData, d => d.poverty)])
        .range([0, width]);
    //   Scale y to chart height
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(usData, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(usData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "mediumslateblue")
        .attr("opacity", ".5");

//   Initialize toolTop
console.log("creating tooltip")
// Create tool tip
var toolTip = d3.tip()
    // Attach the class 'tooltip' to the html
    .attr("class", "tooltip")
    // .offset([80, -60])
    // Assign text to show up on toolTip
    .html(function (data) {
        var state = data.state;
        var poverty = +data.poverty;
        var healthcare = +data.healthcare;
        return (
            '<strong>' + state + '</strong>' + '<br> Poverty Percentage: ' + poverty + '%' + '<br> Lacks Healthcare Percentage: ' + healthcare + '%'
        );
    });
// Call the tooltip on chartGroup.
chartGroup.call(toolTip);
//   Create "mouseover" event listener to display tooltip
circlesGroup.on("mouseover", function (data) {
    // hand the data to the function and a pointer to the specific data point (this) so the tooltip can stop there
    toolTip.show(data, this);
})
// Create "mouseout" event listener to hide tooltip
.on("mouseout", function (data) {
    toolTip.hide(data);
});
// Add state abbreviations to each circle
// Add 'dot' class to html and add text elements where data points exist
    svg.selectAll(".dot")
        .data(usData)
        .enter()
        .append("text")
        .text(function (data) { return data.abbr; })
        .attr("x", function (data) {
            return xLinearScale(data.poverty  +1.93);
        })
        .attr("y", function (data) {
            return yLinearScale(data.healthcare -1.4);
        })
        .attr("font-size", "10px")
        .attr("fill", "white")
        .style("text-anchor", "middle");

    //   Create axis labels
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    // x-axis labels
    chartGroup
        .append("text")
        .attr(
            "transform",
            `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});