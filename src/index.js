'use strict';

require('./style.css');

const d3 = require('d3');
const d3Selection = require('d3-selection');
const {line, brush, tooltip} = require('britecharts');

var parseTime = d3.timeParse("%d/%m/%Y");

let data, dataByTopic;

function getData(callback){
  d3.json('/data').get(function(r) {

    data = r.data;

    data.forEach(function(d) { d.date = parseTime(d.date); });

    data.sort(function(x, y){
      return d3.ascending(x.date, y.date);
    });

    callback()
  })
}


function createBrushChart(callback) {
    let brushChart = brush(),
        brushMargin = {top:0, bottom: 50, left: 100, right: 50},
        brushContainer = d3Selection.select('.js-line-brush-chart-container'),
        containerWidth = brushContainer.node() ? brushContainer.node().getBoundingClientRect().width : false;

    if (containerWidth) {

        brushChart
            .width(containerWidth)
            .height(100)
            .margin(brushMargin)
            .xAxisFormat(brushChart.axisTimeCombinations.MONTH_YEAR)
            .on('customBrushEnd', function(brushExtent) {

                // Filter
                filterData(brushExtent[0], brushExtent[1], function(){
                  d3Selection.selectAll('.js-line-chart-container .line-chart').remove();
                  createLineChart();
                }) 
            });

        brushContainer.datum(brushDataAdapter(data)).call(brushChart);
        callback()
    }
}


function createLineChart(callback) {
  let lineChart = line(),
    chartTooltip = tooltip(),
    container = d3Selection.select('.js-line-chart-container'),
    containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
    lineMargin = {top:100, bottom: 50, left: 100, right: 50};

  if (containerWidth) {
    
    // LineChart Setup and start
    lineChart
      .isAnimated(false)
      .aspectRatio(0.3)
      .grid('horizontal')
      .tooltipThreshold(600)
      .width(containerWidth)
      .margin(lineMargin)
      .dateLabel("date")
      .yAxisLabel("Indice de qualité de l'air")
      .xAxisCustomFormat(lineChart.axisTimeCombinations.DAY_MONTH)
      .on('customMouseOver', chartTooltip.show)
      .on('customMouseMove', chartTooltip.update)
      .on('customMouseOut', chartTooltip.hide);

    chartTooltip.title("");

    container.datum(lineDataAdapter(data)).call(lineChart);

    const tooltipContainer = d3Selection.select('.js-line-chart-container .metadata-group .hover-marker');
    tooltipContainer.datum([]).call(chartTooltip);

    callback()
  }
}

/*
 * The Brush chart wants an input like this one
 * @example
 * [
 *     {
 *         value: 1,
 *         date: '2011-01-06T00:00:00Z'
 *     },
 *     {
 *         value: 2,
 *         date: '2011-01-07T00:00:00Z'
 *     }
 * ]
 */
function brushDataAdapter(data) {
  return data.map(function(d) {
    return {
      date: d.date,
      value: d.no2 + d.o3 + d.pm10
    }
  })
}

/*
 * The Line chart wants an input like this one
 * @example
 * {
 *   dataByTopic: [
 *     {
 *       topicName: 'San Francisco',
 *       topic: 123,
 *       dates: [
 *         {
 *           date: '2017-01-16T16:00:00-08:00',
 *           value: 1
 *         },
 *         {
 *           date: '2017-01-16T17:00:00-08:00',
 *           value: 2
 *         }
 *       ]
 *     },
 *     {
 *       topicName: 'Other',
 *       topic: 345,
 *       dates: [
 *         {...},
 *         {...}
 *       ]
 *     }
 *   ]
 * }
 */
function lineDataAdapter(data) {
    const no2 = data.map(function(x){
      return {date: x.date, value: x.no2}
    })

    const o3 = data.map(function(x){
      return {date: x.date, value: x.o3}
    })

    const pm10 = data.map(function(x){
      return {date: x.date, value: x.pm10}
    })

    return {
      dataByTopic : [
        { 
          topicName: 'no2',
          topic: 1,
          dates: no2
        },
        {
          topicName: 'o3',
          topic: 2,
          dates: o3
        },
        {
          topicName: 'pm10',
          topic: 3, 
          dates: pm10
        }
      ]      
    }

}

function isInRange(d0, d1, d) {
  return d >= d0 && d <= d1;
}


function filterData(d0, d1, callback) {
  getData(function() {
    data = data.filter(function(d) {
      return isInRange(d0, d1, d.date)
    });
    callback()
  })
}


getData(function(){
  const lineChartPromise = new Promise(function(resolve){
    createLineChart(resolve);
  });
  const brushChartPromise = new Promise(function(resolve){
    createBrushChart(resolve)
  });
  Promise.all([lineChartPromise, brushChartPromise]).then(function(){
    d3.selectAll("footer, svg, .title").style("display", "block");
  });
});


