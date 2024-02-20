function plotHeatMap() {
        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 100, left: 300 },
                width = 1000 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
        // Append the svg object to the body of the page
        const svg = d3.select("#svg_heat_map")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        d3.csv("static/data/data.csv")
                .then(function (data) {

                        const myGroups = Array.from(new Set(data.map(d => d.Student)))
                        const myVars = Array.from(new Set(data.map(d => d.Indicator)))

                        const x = d3.scaleBand()
                                .range([0, width])
                                .domain(myGroups)
                                .padding(0.05);
                        svg.append("g")
                                .style("font-size", 12)
                                .attr("transform", `translate(0, ${height})`)
                                .call(d3.axisBottom(x).tickSize(0))
                                .selectAll("text").attr("transform", "rotate(65)")
                                .style("text-anchor", "start")
                                .select(".domain").remove()

                        // Build Y scales and axis:
                        const y = d3.scaleBand()
                                .range([height, 0])
                                .domain(myVars)
                                .padding(0.05);
                        svg.append("g")
                                .style("font-size", 12)
                                .call(d3.axisLeft(y).tickSize(0))
                                .select(".domain").remove()

                                const y_bar = d3.scaleLinear()
                                .domain([0,100])
                                .range([height, 0]);
                        // Build color scale
                        const myColor = d3.scaleSequential()
                                .interpolator(d3.interpolateRdBu)
                                .domain([-5, 5])

                        // Create a tooltip
                        const tooltip = d3.select("#svg_heat_map")
                                .append("div")
                                .attr("class", "tooltip")
                                .classed("tooltip", true)

                        // Three function that update view when user hover / move / leave a cell
                        const mouseover = function (event, d) {
                                tooltip.style("opacity", 0.8)

                                // Select the corresponding bar in the bar chart
                                d3.select("#svg_bar_chart")
                                        .selectAll("rect")
                                        .filter((cd, i) => cd.Student === d.Student )
                                        .classed("highlighted", true)

                                // Save the selected indicator
                                d3.select("#svg_bar_chart")
                                        .attr("Indicator", d.Indicator)

                                d3.select("#svg_bar_chart")
                                        .selectAll("rect")
                                        .attr("y", function (cd) {
                                                //id is heatmap obj i.e. data obj, cd is bar plot obj i.e. pca obj. They have parameters as defined in csv
                                                height_var = data.filter(function (id) {
                                                        return id.Student === cd.Student && id.Indicator === d.Indicator
                                                })
                                                return y_bar(height_var[0].value) - margin.top * 2
                                        })
                                        .attr("height", function (cd) {
                                                height_var = data.filter(function (id) {
                                                        return id.Student === cd.Student && id.Indicator === d.Indicator
                                                })
                                                //height is the whole i suppose. height_var is the tiny that should be bigger i.e. scaled n displayed. Pixel space
                                                return height - y_bar(height_var[0].value)
                                        });



                                // Highlight the corresponding column and row
                                svg.selectAll("rect")
                                        .filter((rd, i) => rd === d.Student || rd === d.Indicator)
                                        .classed("highlighted", true)
                        }

                        const mousemove = function (event, d) {
                                // Show the tooltip
                                tooltip.html(`The "${d.Indicator}" for ${d.Student} is: ${d.value}`)
                                        .style("left", (event.x + 20) + "px")
                                        .style("top", (event.y + 20) + "px")


                        }

                        const mouseleave = function (event, d) {
                                // Hide the tooltip
                                tooltip.style("opacity", 0)

                                // Unselect the selected bar in the bar chart
                                d3.select("#svg_bar_chart")
                                        .selectAll("rect")
                                        .filter((cd, i) => cd.Student === d.Student)
                                        .classed("highlighted", false)

                                // Remove the column and row highlight
                                svg.selectAll("rect")
                                        .filter((rd, i) => rd === d.Student || rd === d.Indicator)
                                        .classed("highlighted", false)
                        }

                        // Add the squares
                        svg.selectAll()
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("x", function (d) {
                                        return x(d.Student)
                                })
                                .attr("y", function (d) {
                                        return y(d.Indicator)
                                })
                                .attr("width", x.bandwidth())
                                .attr("height", y.bandwidth())
                                .style("fill", function (d) {
                                        return myColor(d.Color)
                                })
                                .style("opacity", 0.8)
                                .classed("highlightable", true)
                                .on("mouseover", mouseover)
                                .on("mousemove", mousemove)
                                .on("mouseleave", mouseleave)

                        // Prepare (add) column highlights
                        svg.selectAll()
                                .data(myGroups)
                                .enter()
                                .append("rect")
                                .attr("x", function (d) {
                                        return x(d)
                                })
                                .attr("y", 0)
                                .attr("width", x.bandwidth())
                                .attr("height", height)
                                .style("fill", "none")
                                .attr("opacity", 1)
                                .classed("highlightable", true)

                        // Prepare (add) row highlights
                        svg.selectAll()
                                .data(myVars)
                                .enter()
                                .append("rect")
                                .attr("x", 0)
                                .attr("y", function (d) {
                                        return y(d)
                                })
                                .attr("width", width)
                                .attr("height", y.bandwidth())
                                .style("fill", "none")
                                .attr("opacity", 1)
                                .classed("highlightable", true)
                })
}