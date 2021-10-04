var nodes = [];
var edges = [];
var graph;


function Graph(cy){
    this.addNode = function(n){
        
        if(typeof findNode(n.id) != 'undefined') {
            console.log("attempted to add node (",n.id,") which exists.."); 
            return
        }

        var no = {
            group: 'nodes',
            data: { 
                id: ''+ n.id,
                name: JSON.parse(n.name),
                weight: 10,
                height: 10,
            },
            position: {
                x: Math.random() * 500,
                y: Math.random() * 500
            }
        };

        nodes.push(no);
        cy.add(no); 
    };

    this.addEdge = function(e){
        var s = findNode(e.source); 
        var t = findNode(e.target); 
        
        if(typeof s == 'undefined' || typeof t == 'undefined'){
            console.log("Attempted to add a faulty edge"); 
            return
        }

        var ed = {
            group: "edges",
            data: {
                source: ''+e.source,
                target: ''+e.target,
            },
        }; 

        edges.push(ed); 
        cy.add(ed); 

    }

    var findNode = function (id) {
        for (var i in nodes) {
            if (nodes[i]["data"]["id"] === ''+id) {
                return nodes[i];
            }
        };
    };


    
    var update = function() {
        cy.layout(); 
    }

}
$(loadCy = function(){
    let cyto = cytoscape ({
        container: document.getElementById('cy'),
        layout: {
            name: 'random', 
           // gravity: true,
            liveUpdate: true,
            maxSimulationtime: 1000,
        },
        
        showOverlay: false,
        minZoom: 0.5,
        maxZoom: 2,
        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'right',
                'background-color': 'steelblue',
                'text-outline-width': 0,
                'text-outline-color': '#ccc',
                'text-opacity': 0.5,
                'text-color': '#ccc',
                'height': 10,
                'width': 10, 
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle'
        }),
        elements : {            
            nodes: [],
            edges : []
        }
       
    } );
    

    $(document).ready(function() {
        //cy = cyto //document.getElementById('cy'),
        console.log("ready");
        graph = new Graph(cyto); 
        
        // Load data from JSON 
        var url = "ws://"+window.location.hostname+":3999/ws";
        var socket = new WebSocket(url); 
        socket.onmessage = function(m){
            var message = JSON.parse(m.data); 
            if(message.command == "\"InitGraph\""){
                
                json = JSON.parse(JSON.parse(message.graph)); 
                var numAdded = 0; 
                console.log(json.nodes);
                
                for(var i in json.nodes){
                    var n = json.nodes[i]; 
                    graph.addNode(n); 
                }
                
                //cy.layout(); 
                var cy_nodes = cyto.add(nodes); 
                for(var j in json.edges){
                    var e = json.edges[j]; 
                    console.log(e);
                    graph.addEdge(e); 
                                            //graph.push(ed); 
                }
                cyto.layout({
                    name: 'random'
                });
            }

            if(message.command == "\"AddNode\""){
                graph.addNode(message); 
                cyto.layout({
                    name: 'random'
                });
            }

            if(message.command == "\"AddNode\""){
                //graph.addNode( createNodeMap( message.id, message.name, 0, message.size ) );
                graph.addNode( message );
            }
            if(message.command == "\"AddEdge\""){
                //graph.addLink( createEdgeMap( message.source, message.target, message.id, message.weight ) );
                graph.addEdge( message );
            }            
            

        }     
        
    });
        

    //document.getElementById('cy').cytoscape(options);
    //$('#cy').cytoscape(options); 
    
});


    var color = d3.scale.category20();

