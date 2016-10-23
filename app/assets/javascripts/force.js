d3.json("/get_nodes", function(nodes){
    d3.json("/get_links", function(links){        
        var svg_height = window.innerHeight;
        var svg_width = document.body.clientWidth;

        var colors = d3.scale.category10();
        
        var force = d3.layout.force()
                        .size([svg_width, svg_height])
                        .linkDistance(50)
                        .charge([-200]);

        
//        check whether two nodes linked
        var linkedByIndex;
        function linkedInitial(){
            linkedByIndex = {};
            links.forEach(function(d){
                linkedByIndex[d.source.index + "," + d.target.index] = true;
            })
        }
        function isConnected(a, b){
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
        }
        
//        define text show and hide
        function showtext(d){
            d3.select(svg_texts[0][d.index]).style("visibility", "visible");
        }
        function hidetext(d){
            d3.select(svg_texts[0][d.index]).style("visibility", "hidden");
        }
        
//        define zoom event
        var zoom = d3.behavior.zoom()
                        .scaleExtent([0.001, 10])
                        .on("zoom", zoomed);
        function zoomed(){
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        
//        define drag event
        var drag = d3.behavior.drag()
                        .origin(function(d){ return d; })
                        .on("dragstart", dragstarted)
                        .on("drag", dragged)
                        .on("dragend", dragended);
        function dragstarted(d){
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);

        }
        function dragged(d){
            d3.select(this).attr("cx", d.x = d3.event.x)
                            .attr("cy", d.y = d3.event.y);
            tick();
        }
        function dragended(d){
            d3.select(this).classed("dragging", false);
            tick();
            force.resume();
        }
        
        
//        start drawing graph
        var svg = d3.select("#graph")
                    .append("svg")
                    .attr("width", svg_width)
                    .attr("height", svg_height)
                    .call(zoom);
        var container = svg.append("g");
        
        var svg_links = container.selectAll("line");
        var svg_texts = container.selectAll("text");
        var svg_nodes = container.selectAll("circle");
        var count = 1;
        function start(){
            force.nodes(nodes)
                .links(links)
                .start();
                        
            svg_links = svg_links.data(links);
            svg_links.exit().remove();
            svg_links.enter()
                    .insert("line", "text")
                    .style("stroke", "#000")
                    .style("stroke-width", function(d){ return Math.sqrt(d.value) });

            svg_nodes = svg_nodes.data(nodes);
            svg_nodes.exit().remove();
            svg_nodes.enter()
                    .insert("circle", "text")
                    .attr("r", 10)
                    .attr("fill", function(d, i){
                        return colors(d.group);
                    })
                    .on("mouseover", function(d){
                        svg_nodes.classed("node-active", function(n){
                            if(isConnected(d, n)){
                                showtext(n);
                                return true;
                            }
                            return false;
                        });
                        svg_links.classed("link-active", function(l){
                            return l.source == d || l.target == d;
                        });
                        
                        showtext(d);
                        d3.select(this).classed("node-active", true);
                        
                        $(".node-name").text(d.name);
                    })
                    .on("mouseout", function(d){
                        hidetext(d);
                        d3.select(this).classed("node-active", false);
                        svg_nodes.classed("node-active", function(n){
                            hidetext(n);
                            return false;
                        });
                        svg_links.classed("link-active", function(l){
                            return false;
                        });
                    })
                    .call(drag);
            
            svg_texts = svg_texts.data(nodes);
            svg_texts.exit().remove();
            svg_texts.enter()
                    .append("text")
                    .text(function(d){
                        return d.name;
                    })
                    .style("fill", "black")
                    .style("visibility", "hidden")
                    .attr("dx", 20)
                    .attr("dy", 5);
            
            
            linkedInitial();
        }
        
        start();
        
        
        
//        define links and nodes dynamic position
        force.on("tick", tick);
        function tick(){
            svg_nodes.attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; });
            svg_links.attr("x1", function(d){ return d.source.x; })
                        .attr("y1", function(d){ return d.source.y; })
                        .attr("x2", function(d){ return d.target.x; })
                        .attr("y2", function(d){ return d.target.y; });
            svg_texts.attr("x", function(d){ return d.x; })
                        .attr("y", function(d){ return d.y; });
        }
        
//        threshold function
        var links_original = [];
        for(var i = 0; i<links.length; i++){
            links_original.push(links[i]);
        }
        
        $("#threshold").change(function(){
            threshold(this.value);
        });
        function threshold(thresh){
            links.splice(0, links.length);
            for(var i = 0; i < links_original.length; i++){
                if(links_original[i].value > thresh){
                    links.push(links_original[i]);
                }
            }
            
            start();
        }
    })
})
