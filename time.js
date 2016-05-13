function draw_time()
{
    function leastSquares(xSeries, ySeries) {
        var reduceSumFunc = function(prev, cur) { return prev + cur; };
        
        var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
        var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

        var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
            .reduce(reduceSumFunc);
        
        var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
            .reduce(reduceSumFunc);
            
        var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
            .reduce(reduceSumFunc);
            
        var slope = ssXY / ssXX;
        var intercept = yBar - (xBar * slope);
        var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
        
        return [slope, intercept, rSquare];
    }
 
    var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = $(document).width() - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .0);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xticks = []

    for (var i = 1995; i <= 2017; i++)
    {
        xticks.push("" + i + "-01")
    } 

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d) { return d.replace("-01", ""); })
        .tickValues(xticks);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "" + d.date + ":  <span style='color:red'>" + d.value + "</span>M HKD";
      })

    var svg = d3.select("#menu2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv("values_per_month.csv", type, function(error, data) {
    var xLabels = data.map(function(d) { return d.date; });
      x.domain(xLabels);
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

        var xSeries = d3.range(1, xLabels.length + 1);
        var ySeries = data.map(function(d) { return d.value; });

        var leastSquaresCoeff = leastSquares(xSeries, ySeries);
        var x1 = xLabels[0];
            var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
            var x2 = xLabels[xLabels.length - 1];
            var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
            var trendData = [[x1,y1,x2,y2]];    


      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .attr("x", ".71em")

          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("M HKD");

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.date); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
        
    var trendline = svg.selectAll(".trendline")
                .data(trendData);
                
            trendline.enter()
                .append("line")
                .attr("class", "trendline")
                .attr("x1", function(d) { return x(d[0]); })
                .attr("y1", function(d) { return y(d[1]); })
                .attr("x2", function(d) { return x(d[2]); })
                .attr("y2", function(d) { return y(d[3]); })
                .attr("stroke", "red")
                .attr("stroke-width", 1);

    svg.append("text")
                .attr("x", (width + (margin.left + margin.right) )/ 2)
                .attr("y", 0 + margin.top)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-family", "sans-serif")
                .text("Funding Expense Per Month");

    });

    function type(d) {
      d.value = +d.value;
      return d;
    }
}
