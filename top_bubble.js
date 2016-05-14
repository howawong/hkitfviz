/*
 * Author: @mbostock
 * http://bl.ocks.org/mbostock/4063269
 *
 */
function draw_bubble()
{
   
    var diameter = 1200, //max size of the bubbles
        color    = d3.scale.category20b(); //color category

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#menu3")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    d3.csv("top_bubble.csv", function(error, data){

        //convert numerical values from strings to numbers
        data = data.map(function(d){ d.value = +d["amount"]; return d; });

        //bubbles needs very specific format, convert data to this.
        var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

        //setup the chart
        var bubbles = svg.append("g")
            .attr("transform", "translate(0,0)")
            .selectAll(".bubble")
            .data(nodes)
            .enter();

        //create the bubbles
        bubbles
            .append("circle")
            .attr("r", function(d){ return d.r; })
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .style("fill", function(d) { return color(d.value); })

       /* 
        bubbles.append("text")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y - d.r / 2; })
            .attr("text-anchor", "middle")
            .text(function(d){ return text_truncate(d["title"], 50) + "\n" + d["amount"] + "M"; })
            .call(wrap, 10)
            .style({
                "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                "font-size": "10pt"
            });*/

        var side = 2 * 100 * Math.cos(Math.PI / 4);

bubbles.append("foreignObject")

            .attr("x", function(d){ return d.x - d.r * 0.75;})
            .attr("y", function(d){ return d.y - d.r * 0.75; })
 
    .attr("width", function(d){ return d.r * 1.5; })
    .attr("height", function(d){ return d.r * 1.5; })
    .append("xhtml:body")
    .style({"height":"100%", "background-color":"transparent"})
    .append("div")
    .style({"height":"100%", "display":"table", "width": "100%"})
    .append("div")
    .style({
    "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
    "font-weight":"bold",
    "color":"#FFF",
    "display": "table-cell",
    "vertical-align": "middle",
    "text-align":"center",
    "font-size": "10pt",
    "width":"100%",
    "height":"100%",
    })
        .html(function(d){ return d["reference"]+ "</br>" + d["amount"] + "百萬"; })
        .on({ "mouseover": function(d) {
                d3.select(this).style({"cursor": "pointer", "opacity": "0.6"})
            },
            "mouseout": function(d) {
                d3.select(this).style({"cursor": "default", "opacity": "1.0"})
            }, 
            "click": function(d){open_project(d["reference"]);}
        })
   




    });

    function open_url(url, windowoption, name, params)
    {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", url);
            form.setAttribute("target", name);
 
            for (var i in params) {
                if (params.hasOwnProperty(i)) {
                    var input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = i;
                    input.value = params[i];
                    form.appendChild(input);
                }
            }
            
            document.body.appendChild(form);
            window.open("post.htm", name, windowoption);
            
            form.submit();
            
            document.body.removeChild(form);
    }
    
    function open_project(ref)
    {
        $.ajax({
            url: 'https://www.itf.gov.hk/l-tc/Prj_Search.asp?code=106',
            headers:{'Access-Control-Allow-Origin': '*'},
            done: function(data){
                console.log(data);
            }
        });
        /*
        var param = { 'prj_ref' : ref};                   
                    open_url("http://www.itf.gov.hk/l-tc/Prj_SearchResult.asp", 
                    "", 
                    "NewFile", param);        
        */
    }
}
