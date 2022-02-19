
// We use d3.timeParse() to convert a string into JS date object
// Initialize helper function
const parseTime = d3.timeParse("%Y-%m-%d");

let data, AQ_lineChart, POL_lineChart, DWM_lineChart, AQ_barChart; 


/**
 * Load data from CSV file asynchronously and render line chart
 */
d3.csv('data/data.csv')
  .then(_data => {
    _data.forEach(d => {
      
      //AQI linechart data
      d.MaxAQI = +d.MaxAQI;  
      d.MedianAQI = +d.MedianAQI;
      d.NinteyAQI = +d.Nintey_Percentile_AQI;

      //POL linechart data
      d.CO = (+d.Days_CO / +d.Days_with_AQI * 100).toFixed(2);
      d.NO2 = (+d.Days_NO2 / +d.Days_with_AQI * 100).toFixed(2);
      d.Ozone = (+d.Days_Ozone / +d.Days_with_AQI * 100).toFixed(2);
      d.SO2 = (+d.Days_SO2 / +d.Days_with_AQI * 100).toFixed(2);
      d.PM2point5 = (+d.Days_PM2point5 / +d.Days_with_AQI * 100).toFixed(2);
      d.PM10 = (+d.Days_PM10 / +d.Days_with_AQI * 100).toFixed(2);

      //DWM linechart data
      if (+d.Year % 400 === 0){ //Leap Year?
        d.DaysWithoutMeasurements = Math.abs(+d.Days_with_AQI - 366); 
      }
      else{
        d.DaysWithoutMeasurements = Math.abs(+d.Days_with_AQI - 365); 
      }

      //AQ barchart data
      function calculateAQCategoryPercentage(days){
        if (+d.Year % 400 === 0){
          return days / (366 - d.DaysWithoutMeasurements) *100;
        }
        else{
          return days / (366 - d.DaysWithoutMeasurements) *100;
        }
      }
      d.Good = calculateAQCategoryPercentage(+d.Good_Days).toFixed(2);
      d.Moderate = calculateAQCategoryPercentage(+d.Moderate_Days).toFixed(2);
      d.UnhelathySensitive = calculateAQCategoryPercentage(+d.Unhealthy_for_Sensitive_Groups_Days).toFixed(2);
      d.Unhealthy = calculateAQCategoryPercentage(+d.Unhealthy_Days).toFixed(2);
      d.VeryUnhealthy = calculateAQCategoryPercentage(+d.Very_Unhealthy_Days).toFixed(2);
      d.Hazardous = calculateAQCategoryPercentage(+d.Hazardous_Days).toFixed(2);

      var parseTime = d3.timeParse("%Y");
      d.Year = parseTime(d.Year);
    });

    data = _data;

    let initalData1 = data.filter(d => d.County === "Hamilton" && d.State === "Ohio");
    
    let initalData2 = data.filter(d => d.County === "San Diego" && d.State === "California");
    

    // Initialize and render chart
    AQ_lineChart = new AQ_LineChart({ parentElement: '#AQ_chart'}, initalData1);
    AQ_lineChart.updateVis();

    POL_lineChart = new POL_LineChart({ parentElement: '#POL_chart'}, initalData1);
    POL_lineChart.updateVis();

    DWM_lineChart = new DWM_LineChart({ parentElement: '#DWM_chart'}, initalData1);
    DWM_lineChart.updateVis();

    AQ_barChart = new AQ_BarChart({ parentElement: '#AQ_barchart'}, initalData1);
    AQ_barChart.updateVis();

    POL_barChart = new POL_BarChart({ parentElement: '#POL_barchart'}, initalData1);
    POL_barChart.updateVis();

    AQ_lineChart2 = new AQ_LineChart({ parentElement: '#AQ_chart2'}, initalData2);
    AQ_lineChart2.updateVis();

    POL_lineChart2 = new POL_LineChart({ parentElement: '#POL_chart2'}, initalData2);
    POL_lineChart2.updateVis();

    DWM_lineChart2 = new DWM_LineChart({ parentElement: '#DWM_chart2'}, initalData2);
    DWM_lineChart2.updateVis();

    AQ_barChart2 = new AQ_BarChart({ parentElement: '#AQ_barchart2'}, initalData2);
    AQ_barChart2.updateVis();

    POL_barChart2 = new POL_BarChart({ parentElement: '#POL_barchart2'}, initalData2);
    POL_barChart2.updateVis();
  })
  .catch(error => console.error(error));

/**
 * Input field event listeners
 */
const counties = {};

function updateLeft(county) {
  
  var countyArr = county.split(','); // :D
  
  let filteredData=data.filter(d => d.County === countyArr[0] && d.State === countyArr[1]);
  AQ_lineChart.data = filteredData;
  AQ_lineChart.updateVis();

  POL_lineChart.data = filteredData;
  POL_lineChart.updateVis();

  DWM_lineChart.data = filteredData;
  DWM_lineChart.updateVis();

  AQ_barChart.data = filteredData[filteredData.length -1];
  AQ_barChart.updateVis();

  POL_barChart.data = filteredData[filteredData.length -1];
  POL_barChart.updateVis();

}
function updateRight(county) {
  
  var countyArr = county.split(','); // :D again
  
  let filteredData=data.filter(d => d.County === countyArr[0] && d.State === countyArr[1]);
  AQ_lineChart2.data = filteredData;
  AQ_lineChart2.updateVis();

  POL_lineChart2.data = filteredData;
  POL_lineChart2.updateVis();

  DWM_lineChart2.data = filteredData;
  DWM_lineChart2.updateVis();

  AQ_barChart2.data = filteredData[filteredData.length -1];
  AQ_barChart2.updateVis();

  POL_barChart2.data = filteredData[filteredData.length -1];
  POL_barChart2.updateVis();

}