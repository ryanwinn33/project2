function optionChanged (month) {
    console.log("are u awake");

    d3.json(`http://127.0.0.1:5000/api/disasteryear/${month}`, function(data){
        console.log(data);   
            chartData(data);
        })
    }
// function getData() {
//     var data =  response.json();
//     console.log(data);
// }

// getData();

function chartData(data) {
    var ctx = document.getElementById('myChart');
    var xlabels = [];
    var ylabels = [];
    var lineChartData = {
        type: 'line',
        data: {
            "2017": {
                "Jan" : [
                    {
                        "Total" : 121354584,
                        "State" : "Cali",
                        "Incident Count": 1
                    },
                    {
                        "total" : 121354584,
                        "state" : "Colo"
                    }
                ],
                "Mar" : [
                    {
                        "total" : 121354584,
                        "state" : "Cali"
                    }
                ]
            }
        }
    };
    //  d3.json(`http://127.0.0.1:5000/api/disasteryear/${month}`, function(data){
    //     console.log(data);
    //         myChart(data);
    //     },

    d3.json(`http://127.0.0.1:5000/api/disasteryear/${month}`, function(data){
        console.log(data);   
            myChart(data);
});

var chartData = [];

function myChart(data){

    Object.entries(data).forEach(function({"2017": year}){
        console.log(year);


        Object.entries(year).forEach(function({"Jan": month}){
            console.log(month);
            new Date(year, "Jan");
            var chartMonth;
            month.forEach(function(state)
        {
            chartData.push(state.total);
            chartData.push(state.incident_count);
                chartMonth++;
        });
        }
    
    
    
    )


},
    

    
    
    
    
    
    
    
    
    
    
        // labels: aLabels,
    // datasets: [
    //     {
    //         label: "Incident per Month",
    //         //fill:false,
    //         fillColor: "rgba(0,0,0,0)",
    //         strokeColor: "rgba(220,220,220,1)",
    //         pointColor: "rgba(200,122,20,1)",

    //         data: aDatasets1
    //     }]}};



//     var myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: xlabels,
//             datasets: [{
//                 data: ylabels,
//                 label: 'Incidents per Month',
//                     backgroundColor: [
//                         'rgba(54, 162, 235, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgba(54, 162, 235, 1)'
//                     ],
//                         borderWidth: 1
//             }], 
//         },
//         options: { 
//             legend: {
//                 display: true
//             },
//             scales: {
//                 xAxes: [{
//                     display: true
//                 }],
//                 yAxes: [{
//                     display: true,
//                         beginAtZero: true
//                 }],
//                 title: [{
//                     display: true,
//                         text: 'Disaster Count by Month',
//                         fontSize: 18
//                 }],
//             },  
//         },
//     });
// }
