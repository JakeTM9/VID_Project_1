
// We use d3.timeParse() to convert a string into JS date object
// Initialize helper function
const parseTime = d3.timeParse("%Y-%m-%d");

let data, AQ_lineChart, POL_lineChart, DWM_lineChart, AQ_barChart; 

/**
 * Load data from CSV file asynchronously and render line chart
 */
d3.csv('data/hamilton.csv')
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
    
    // Initialize and render chart
    AQ_lineChart = new AQ_LineChart({ parentElement: '#AQ_chart'}, data);
    AQ_lineChart.updateVis();

    POL_lineChart = new POL_LineChart({ parentElement: '#POL_chart'}, data);
    POL_lineChart.updateVis();

    DWM_lineChart = new DWM_LineChart({ parentElement: '#DWM_chart'}, data);
    DWM_lineChart.updateVis();

    AQ_barChart = new AQ_BarChart({ parentElement: '#AQ_barchart'}, data);
    AQ_barChart.updateVis();

    POL_barChart = new POL_BarChart({ parentElement: '#POL_barchart'}, data);
    POL_barChart.updateVis();
  })
  .catch(error => console.error(error));

/**
 * Input field event listener
 *//*
d3.select('#start-year-input').on('change', function() {
  // Get selected year
  const minYear = parseInt(d3.select(this).property('value'));

  // Filter dataset accordingly
  let filteredData = data.filter(d => d.date.getFullYear() >= minYear);

  // Update chart
  lineChart.data = filteredData;
  lineChart.updateVis();
}); */