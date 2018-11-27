    var opts = {
      lines: 9,
      length: 9,
      width: 5,
      radius: 20,
      color: '#EE3124',
      speed: 1.9,
      trail: 40,
      className: 'spinner',
    };

    var target = document.getElementById('histogram');

    var spinner = new Spinner(opts).spin(target);

    d3.csv("data/Calls_histogram.csv").then(function(data) {
      spinner.stop();
      var years = ['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011']

      d3.select('#dropbox').selectAll('option')
          .data(years)
        .enter().append('option')
          .text(function(d) { return d; });

      function redraw() {

        var year = d3.select('#dropbox').nodes()[0].value;
        filteredData = data.filter(function(d) { if(d.year == year){ return d; }})

        let durationHistogram = dc.barChart('#histogram');

        let facts = crossfilter(filteredData);

        let durationDim = facts.dimension(function(d){
            return d.duration;
        });

        durationGroup = durationDim.group().reduceCount();

        durationHistogram.width(800)
                 .height(400)
                 .margins({top: 50, right: 50, bottom: 50, left: 50})
                 .dimension(durationDim)
                 .x(d3.scaleLinear().domain([0, 120]))
                 .yAxisLabel('Quantidade de ocorrências')
                 .xAxisLabel('Tempo decorrido (minutos)')
                 .barPadding(0.1)
                 .brushOn(false)
                 .group(durationGroup);

        dc.renderAll();
      }

      redraw();
      d3.select('#dropbox').on('change', redraw);
    });