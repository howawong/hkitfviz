function draw_matrix()
{
    var margin = {top: 40, right: 20, bottom: 30, left: 0},
        width = 800 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    d3.csv("matrix.csv", function(error, data){
        var svg = d3.select("#matrix").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var keys = Object.keys(data[0]);
        var r = data.map(function (row) {return row[keys[0]]});
        var x = d3.scale.ordinal().domain(keys).rangeBands([300, width]);
        var y = d3.scale.ordinal().domain(r).rangeBands([160, height]);

        svg.selectAll('text').data(keys).enter()
            .append("g")
            .attr("transform", function(d){return "translate(" + x(d)  + ",140)";})
            .append("text")
            .attr("transform", "rotate(-75)")
            .text(function(d){return d;})
        
        var rLabels = svg.append("g").selectAll('text')
                        .data(r).enter()
                        .append('g').attr("transform", function(d){return "translate(0," + y(d) + ")";})
                        .append('text').text(function(d){return d});
        
        keys.splice(0,1);
        console.log(keys);
        console.log(data);
        /*
        var rows = tbody.selectAll('tr').data(data).enter().append('tr')
        var cells = rows.selectAll('td').data(function(row){
                                                return keys.map(function(column) {
                                                    return{column:column, value:row[column]} })})
                    .enter()
                    .append('td')
                    .text(function(d) { console.log(d);return d.value;});
         */
        console.log(data.length)
        function fill_by_value(x)
        {
            if (x >= 200)
                return '#FF0000';
            if (x >= 160)
                return '#FF1919'
            if (x >= 80)
                return '#FF3333'
            if (x >= 40)
                return '#FF6666'
            if (x >= 20)
                return '#FF9999'
            if (x >= 10)
                return '#FFC2C2'
             if (x >= 1)
                return '#FFE5E5'
 
            return '#FFFAFA';
        }
        var x2 = d3.scale.linear().domain([0, 13]).range([320, width - 14]);
        var y2 = d3.scale.linear().domain([0, data.length]).range([148, height - 14]);
        var rows = svg.append('g').selectAll("g").data(data).enter().append('g').attr("transform", function(d, i){ return "translate("+(0)+ ", " + y2(i) + ")";})
        var cells = rows.selectAll('g')
                .data(function(d){return keys.map(function(k, i){return {'index':i,'value':d[k]};});}).enter().append('rect').attr("x", function(d){ return x2(d['index']) ;}).attr('fill', function(d) { return fill_by_value(d['value']);}).attr("width", 20).attr("height",20)

    });


}
