class AQ_LineChart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 250,
      margin: _config.margin || {top: 25, right: 30, bottom: 50, left: 70}
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;
    
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleTime()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .nice();

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);

        //.tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);
    
    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // We need to make sure that the tracking area is on top of other chart elements
    vis.marks = vis.chart.append('g');
    vis.trackingArea = vis.chart.append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');
    
    //labels
    vis.svg.append("text")
      

  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    vis.xValue = d => d.Year;
    vis.yValue = d => d.MaxAQI;
    vis.yValue2 = d => d.MedianAQI;
    vis.yValue3 = d => d.NinteyAQI;

    vis.line = d3.line()
      .x(d => vis.xScale(vis.xValue(d)))
      .y(d => vis.yScale(vis.yValue(d)));
    
    vis.line2 = d3.line()
      .x(d => vis.xScale(vis.xValue(d)))
      .y(d => vis.yScale(vis.yValue2(d)));

    vis.line3 = d3.line()
      .x(d => vis.xScale(vis.xValue(d)))
      .y(d => vis.yScale(vis.yValue3(d)));

    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.data, vis.xValue));

    vis.allAirQualityData = vis.data.map((d) => d.MaxAQI).concat(vis.data.map((d) => d.MedianAQI)); //gross but whatever
    vis.yScale.domain([d3.min(vis.allAirQualityData),d3.max(vis.allAirQualityData)]);

    vis.bisectDate = d3.bisector(vis.xValue).left;

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add line path
    vis.chart.append("path")
        .data([vis.data])
        .attr('class', 'chart-line')
        .attr('d', vis.line);

    vis.chart.append("path")
      .data([vis.data])
      .attr('class', 'chart-line2')
      .attr('d', vis.line2)
    
    vis.chart.append("path")
      .data([vis.data])
      .attr('class', 'chart-line3')
      .attr('d', vis.line3)

    //axes titles
    vis.chart.append("text")
      .attr("text-anchor", "end")
      .attr("x", vis.width/2)
      .attr("y", vis.height +50)
      .attr("font-size","20px")
      .text("Year");

    vis.chart.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -vis.config.margin.left +20)
      .attr("x", -vis.config.margin.top )
      .attr("font-size","20px")
      .text("Air Quality Index");
      
    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}