$('#loading').fadeOut('fast');
var chartHeight = $('.chart').height();
var chartWidth = $('.chart').width()+25;

/*==== Barras JS ====*/
var config = "?var=" + vrv + "&uf=" + uf + "&atc=" + atc + "&slc=" + slc + "&cad=" + cad + "&uos=" + uos + "&ano=" + ano + "&prt=" + prt + "&ocp=" + ocp + "&sex=" + sex + "&fax=" + fax + "&esc=" + esc + "&cor=" + cor + "&typ=" + typ + "&prc=" + prc + "&frm=" + frm + "&prv=" + prv + "&snd=" + snd + "&mec=" + mec + "&mod=" + mod + "&pfj=" + pfj + "&eixo=" + eixo;
jQuery.get("./db/json_linhas.php"+config, function(data) {
    // console.log(data);
});
// var info = [];
var dados = {key: [], value: []};

// import colors.json file
var colorJSON;
var textJSON;
d3.json('data/colors.json', function (error, data) {
    if (error) throw error;
    colorJSON = data;


    // import pt-br.json file for get the title
    d3.json('data/pt-br.json', function (error, data) {
        if (error) throw error;

        textJSON = data;

        var config = "?var=" + vrv + "&uf=" + uf + "&atc=" + atc + "&slc=" + slc + "&cad=" + cad + "&uos=" + uos + "&ano=" + ano + "&prt=" + prt + "&ocp=" + ocp + "&sex=" + sex + "&fax=" + fax + "&esc=" + esc + "&cor=" + cor + "&typ=" + typ + "&prc=" + prc + "&frm=" + frm + "&prv=" + prv + "&snd=" + snd + "&mec=" + mec + "&mod=" + mod + "&pfj=" + pfj + "&eixo=" + eixo;

        d3.queue()
            .defer(d3.json, "./db/json_lines.php" + config)
            .await(analyze);
    });

});

$.get("./db/json_linhas.php"+config, function(data) {
    // console.log(data);
});

function analyze(error, data) {
    $('#loading').fadeOut('fast');

    if (error) {
        console.log(error)
    }

    var dados = [];

    Object.keys(data).forEach(function (key) {
        dados.push(data[key]);
    });

    //tamanho do grafico
    // AQUI automatizar map center
    var margin = {top: 20, right: 20, bottom: 30, left: 25},
        width = chartWidth - margin.left - margin.right,
        height = chartHeight - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y");

// set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
    var valueline = d3.line()
        .x(function(d) { return x(d.ano); })
        .y(function(d) { return y(d.UF); });

// define the 2nd line
    var valueline2 = d3.line()
        .x(function(d) { return x(d.ano); })
        .y(function(d) { return y(d.Setor); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#corpo").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Get the data

        console.log(dados)

        // format the data
        dados.forEach(function(d) {
            d.ano = parseTime(d.ano);
            d.UF = +d.UF;
            d.Setor = +d.Setor;
        });

        // Scale the range of the data
        x.domain(d3.extent(dados, function(d) { console.log(d); return d.ano; }));
        y.domain([0, d3.max(dados, function(d) {
            return Math.max(d.UF, d.Setor); })]);

        // Add the valueline path.
        svg.append("path")
            .data([dados])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([dados])
            .attr("class", "line")
            .style("stroke", "red")
            .attr("d", valueline2);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));


}



