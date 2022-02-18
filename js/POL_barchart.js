class POL_BarChart {

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
        margin: _config.margin || {top: 25, right: 30, bottom: 60, left: 150}
      }
      this.data = _data;
      this.data = this.data[41];
      console.log(this.data);
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
      let vis = this;
      
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.xScale = d3.scaleLinear()
          .domain([0,100])
          .range([0, vis.width]);
      
      let QualityGrades = ["CO", "NO2", "Ozone", "SO2", "PM2.5", "PM10"]
      vis.yScale = d3.scaleBand()
          .domain(QualityGrades)
          .range([0, vis.height])
          .paddingInner(0.15);
  
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
  
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
      // Add bar path
        //["CO", "NO2", "Ozone", "SO2", "PM2.5", "PM10"]
      vis.chart.append("rect")
          .data([vis.data])
          .attr('class', 'chart-bar')
          .attr('width', d => vis.xScale(d.CO))
          .attr('height', vis.yScale.bandwidth())
          .attr('y', vis.yScale("CO"))
          .attr('x',0);

          vis.chart.append("rect")
          .data([vis.data])
          .attr('class', 'chart-bar2')
          .attr('width', d => vis.xScale(d.NO2))
          .attr('height', vis.yScale.bandwidth())
          .attr('y', vis.yScale("NO2"))
          .attr('x',0);

          vis.chart.append("rect")
          .data([vis.data])
          .attr('class', 'chart-bar3')
          .attr('width', d => vis.xScale(d.Ozone))
          .attr('height', vis.yScale.bandwidth())
          .attr('y', vis.yScale("Ozone"))
          .attr('x',0);
      
          vis.chart.append("rect")
          .data([vis.data])
          .attr('class', 'chart-bar4')
          .attr('width', d => vis.xScale(d.SO2))
          .attr('height', vis.yScale.bandwidth())
          .attr('y', vis.yScale("SO2"))
          .attr('x',0);

          vis.chart.append("rect")
          .data([vis.data])
          .attr('class', 'chart-bar5')
          .attr('width', d => vis.xScale(d.PM2point5))
          .attr('height', vis.yScale.bandwidth())
          .attr('y', vis.yScale("PM2.5"))
          .attr('x',0);

          vis.chart.append("rect")
          .data([vis.data])
          .attr('class', 'chart-bar6')
          .attr('width', d => vis.xScale(d.PM10))
          .attr('height', vis.yScale.bandwidth())
          .attr('y', vis.yScale("PM10"))
          .attr('x',0);
      
        //axes titles
        vis.chart.append("text")
        .attr("text-anchor", "end")
        .attr("x", vis.width/2)
        .attr("y", vis.height +50)
        .attr("font-size","20px")
        .text("Percentage of Year");

        vis.chart.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -vis.config.margin.left +80)
        .attr("x", -vis.config.margin.top -20 )
        .attr("font-size","20px")
        .text("Pollutant");
      // Update the axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }