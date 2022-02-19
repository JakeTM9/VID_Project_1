
// We use d3.timeParse() to convert a string into JS date object
// Initialize helper function


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
    AQ_lineChart = new AQ_LineChart({ parentElement: '#AQ_chart'}, initalData1, true);
    AQ_lineChart.updateVis();

    POL_lineChart = new POL_LineChart({ parentElement: '#POL_chart'}, initalData1, true);
    POL_lineChart.updateVis();

    DWM_lineChart = new DWM_LineChart({ parentElement: '#DWM_chart'}, initalData1, true);
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
function updateTitlesLeft(countyArr) {
  document.getElementById("airQualityLineLeft").innerHTML = "Air Quality of " + countyArr[0] + " by Year";
  document.getElementById("pollutantLineLeft").innerHTML = "Main Pollutant Prevelance in " + countyArr[0] +" by Year";
  document.getElementById("DaysWithoutLeft").innerHTML = "Days Without Air Quality Measurements in " + countyArr[0] + " Per Year";
  document.getElementById("airQualityBarLeft").innerHTML = countyArr[0] + " Air Quality in 2021";
  document.getElementById("pollutantBarLeft").innerHTML = "Main Pollutant Prevelance in "+ countyArr[0] + " in 2021";
}

function updateLeft(county) {
  
  var countyArr = county.split(','); // :D
  
  updateTitlesLeft(countyArr);
  
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

function updateTitlesRight(countyArr) {
  document.getElementById("airQualityLineRight").innerHTML = "Air Quality of " + countyArr[0] + " by Year";
  document.getElementById("pollutantLineRight").innerHTML = "Main Pollutant Prevelance in " + countyArr[0] +" by Year";
  document.getElementById("DaysWithoutRight").innerHTML = "Days Without Air Quality Measurements in " + countyArr[0] + " Per Year";
  document.getElementById("airQualityBarRight").innerHTML = countyArr[0] + " Air Quality in 2021";
  document.getElementById("pollutantBarRight").innerHTML = "Main Pollutant Prevelance in "+ countyArr[0] + " in 2021";
}

function updateRight(county) {
  
  var countyArr = county.split(','); // :D again
  
  updateTitlesRight(countyArr);

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

function update(year, yearData, isLeft) {
  console.log("yo");
  if(isLeft){

    AQ_barChart.data = yearData;
    AQ_barChart.updateVis();

    POL_barChart.data = yearData;
    POL_barChart.updateVis();
    
    document.getElementById("airQualityBarLeft").innerHTML = document.getElementById("airQualityBarLeft").innerHTML.slice(0, -4) + year; //:)
    document.getElementById("pollutantBarLeft").innerHTML = document.getElementById("pollutantBarLeft").innerHTML.slice(0, -4) + year;
  }
  else{

    AQ_barChart2.data = yearData;
    AQ_barChart2.updateVis();

    POL_barChart2.data = yearData;
    POL_barChart2.updateVis();
    
    document.getElementById("airQualityBarRight").innerHTML = document.getElementById("airQualityBarRight").innerHTML.slice(0, -4) + year; //:)
    document.getElementById("pollutantBarRight").innerHTML = document.getElementById("pollutantBarRight").innerHTML.slice(0, -4) + year;
  }
}