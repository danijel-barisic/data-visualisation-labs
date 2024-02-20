function plotBarChart() {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#svg_bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("static/data/total_points.csv")
        .then(function (data) {
            // X axis
            const x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(function (d) { return d.Student; }))
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            const y = d3.scaleLinear()
                // .domain([0, d3.max(data, function (d) { return +d.Value; })])
                .domain([0,100])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Tooltip
            const tooltip = d3.select("#svg_bar_chart")
                .append("div")
                .attr("class", "tooltip")
                .classed("tooltip", true);

            // Function to handle mouseover
            function mouseover(event, d) {
                tooltip.style("opacity", 0.8);
                d3.select(this).classed("highlighted", true);

                // Highlight the corresponding cell in the heatmap
                d3.select("#svg_heat_map")
                    .selectAll("rect")
                    .filter((heatmapData, i) => heatmapData.Student === d.Student)
                    .classed("highlighted", true);
            }

            // Function to handle mousemove
            function mousemove(event, d) {
                const barHeights = data.map(function (cd) {

                    return height - y(+cd.value);
                });
                tooltip.html(`Student: ${d.Student}<br>Points: ${d.Points}`)
                    .style("left", (event.x + 20) + "px")
                    .style("top", (event.y + 20) + "px");
            }

            // Function to handle mouseleave
            function mouseleave(event, d) {
                tooltip.style("opacity", 0);
                d3.select(this).classed("highlighted", false);

                // Remove the cell highlight in the heatmap
                d3.select("#svg_heat_map")
                    .selectAll("rect")
                    .filter((heatmapData, i) => heatmapData.Student === d.Student)
                    .classed("highlighted", false);
            }
            // Bars
            svg.selectAll()
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function (d) { return x(d.Student); }) // "d3 graph lang" + { data lang }
                .attr("y", function (d) { return y(d.Points); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.Points); })
                .attr("fill", "#69b3a2")
                .classed("highlightable", true)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
        })
        .catch(function (error) {
            console.error("Error loading the data: ", error);
        });
}
