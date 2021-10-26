d3.json("samples.json").then(function(data) {
    console.log(data)
  });
  

function buildCharts(sample){
    d3.json("samples.json").then(function(data){
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        
        var values = result.sample_values;
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var dataY = otu_ids.map(id => `OTU ${id}`).slice(0,10).reverse();
        var dataX =values.slice(0,10).reverse()

        var barData ={
            y:dataY,
            x:dataX,
            type:"bar",
            orientation: "h"  
        };

        var dataBarChart = [barData];
        
        var barLayout = {
            title: "Top 10 Bacteria Cultures"
        };

        Plotly.newPlot("bar", dataBarChart, barLayout);

        var bubbleData={
            x:otu_ids,
            y:values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids, 
                size: values
            }
        };

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t :30},
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        var dataBubbleChart = [bubbleData];
        Plotly.newPlot("bubble", dataBubbleChart, bubbleLayout);

        var gaugeData = [
            {
                domain: {x: [0,1], y: [0,1]},
                value: 2,
                title: {text: "Belly Button Washing Frequency"},
                type: "indicator",
                mode: "gauge+number",                
                gauge: {
                    axis: {range: [0,9]},
                    steps: [
                        { range: [0, 9], color: "white" },
                      ],
                }
            }
        ];
        var layout = {
            width: 600, 
            height: 500, 
            margin: {t:0, b:0}
        };
        Plotly.newPlot("gauge",gaugeData);


    });
};

function init(){
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then(function(data){
        var sampleName = data.names;
        sampleName.forEach((sample)=>{
            dropdown.append("option")        
            .text(sample)        
            .property("value", sample);
        });
        const sampleOne = sampleName[0];
        buildCharts(sampleOne);
        buildMetadata(sampleOne);

    });
}

function optionChanged(newSample) {
    console.log(newSample);
    buildCharts(newSample);
    buildMetadata(newSample);
};

function buildMetadata(sample){
    d3.json("samples.json").then((data)=>{
        var metadata = data.metadata;       
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);   
        var result = resultArray[0];        
        var PANEL = d3.select("#sample-metadata");  
        PANEL.html("");     
        Object.entries(result).forEach(([key, value]) => {      
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);    
        });
      });  
    }

    init();
