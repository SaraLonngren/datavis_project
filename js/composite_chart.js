    d3.csv("data/line_chart_data.csv").then(function(data) {

       let compositeChart = dc.compositeChart('#composite_chart');
       
        let parseDate = d3.timeParse("%d/%m/%Y");
        data.forEach(function(d) {
          d.month = parseDate(d.month)
          d.month = d.month.setFullYear(2018);
        });

        var ndx = crossfilter(data);
        dateDim = ndx.dimension(function(d) {return d3.timeMonth(d.month);});

        composeGraphs = []
        yearsAndColors = [
          {'year':'2018', 'color':'#3366cc'},
          {'year':'2017', 'color':'#dc3912'},
          {'year':'2016', 'color':'#ff9900'},
          {'year':'2015', 'color':'#109618'},
          {'year':'2014', 'color':'#990099'},
          {'year':'2013', 'color':'#0099c6'},
          {'year':'2012', 'color':'#dd4477'},
          {'year':'2011', 'color':'#000000'}
        ];

        yearsAndColors.forEach(function(item) {
          dataFiltered = data.filter(function(d) { if(d.year == item.year){ return d; }})
          factsFiltered = crossfilter(dataFiltered);
          dateDimFiltered = factsFiltered.dimension(function(d) {return d3.timeMonth(d.month);});
          dataDimGroup = dateDimFiltered.group().reduceSum(function(d) {return d.amount;});

          composeGraphs.push(
            dc.lineChart(compositeChart)
              .group(dataDimGroup, item.year)
              .ordinalColors([item.color])
          );
        });

        let xScale = d3.scaleTime()
                      .domain([dateDim.bottom(1)[0].month, dateDim.top(1)[0].month])

        compositeChart.width(800)
                     .height(400)
                     .margins({top: 50, right: 50, bottom: 50, left: 50})
                     .dimension(dateDim)
                     .x(xScale)
                     .y(d3.scaleLinear().domain([20000, 50000]))
                     .round(d3.timeMonth.round)
                     .xUnits(d3.timeMonths)
                     .xAxisLabel('Meses do ano')
                     .yAxisLabel('Quantidade de ocorrências')
                     .mouseZoomable(true)
                     .renderHorizontalGridLines(true)
                     .legend(dc.legend().x(300).y(20).itemHeight(13).itemWidth(50).gap(5).horizontal(1))
                     .brushOn(false)
                     .compose(composeGraphs);

        compositeChart.render();
      });