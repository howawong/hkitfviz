function draw_pie()
{
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = $(document).width() * 0.6,
        height = 500,
        radius = Math.min(width, height - margin.top - margin.bottom) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    var svg = d3.select("#pie").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (margin.top + height / 2) + ")");

    d3.csv("pie.csv", type, function(error, data) {
      if (error) throw error;
      var sum = d3.sum(data, function(d) {return d.value;});
      var g = svg.selectAll(".arc")
          .data(pie(data))
        .enter().append("g")
          .attr("class", "arc");

      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.value); });


      g.append("text")
          .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
          .attr("dy", "0.0em")
          .order(100)
          .text(function(d) { return d.data.category + " " + Math.round(d.data.value / sum * 100) + "%"; });
       
         
    });

    function type(d) {
      d.value = parseFloat(d.value);
      d.category = d.category
      return d;
    }
}
