

function allofthem(){
    crossLayer.selectAll("*").remove()
    d3.csv("data/county_monthly.csv", function(error, data) {
        if (estan == 1){
            drawCross(data);
            estan = null;
        } else {
            crossLayer.selectAll("*").transition().duration(120)
                .style('opacity', 0).remove();
            estan = 1;
        }
    });
}

// Get State name
function nameFn(d){
  return d && d.properties ? d.properties.County: null;
}


// Get femicides number
function fem_num(d){
    var n = femFn(d);
    return n
}

// When clicked, zoom in
function clicked(d) {
  var x, y, k;

  // Compute centroid of the selected path
  if (d && centered !== d) {
    var coordinates= d3.mouse(this);
    x1 = coordinates[0];
    y1 = coordinates[1];
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 3;
    centered = d;
    dateX = coordinates[0] - 100;
    dateY = y - 50;
    sizeText = "10px"
  } else {
    x1 = width / 2;
    y1 = height / 2;
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    dateX = width / 2 - 90;
    dateY = 175;
    sizeText = "23px"
  }

  // .attr('x', width/2-90)
  // .attr('y', 135);

  // Highlight the clicked province
  mapLayer.selectAll('path')
    .style('fill', function(d){return centered && d===centered ? '#8a0303' : fillFn(d);});

  // Zoom
  g.transition()
    .duration(750)
    // .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
    .attr('transform', 'translate(' + x1 + ',' + y1 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');

  bigText.transition()
    .duration(650)
    .attr('x', dateX)
    .attr('y', dateY)
    .style("font-size", sizeText)

// text.big-text{
//   font-size: 23px;
//   font-weight: 380;
// }
}

function drawCross(data){
    crossLayer
        .selectAll('g')
        .data(data)
        .enter()
        .append("svg:image")
        .transition()
        .duration(700)
        .style('opacity', 1)
        .attr("x", function(d) {
                return projection([d.lon, d.lat])[0] - Math.pow(d.death_rate,0.7)*1;
        })
        .attr("y", function(d) {
                return projection([d.lon, d.lat])[1] - Math.pow(d.death_rate,0.8)*8;
        })
        .attr('width', function(d){
            return Math.pow(d.death_rate,0.1)*1})
        .attr('height', function(d){
            return Math.pow(d.death_rate,0.7)*1})
        .attr("xlink:href", "figs/drug.svg")
}

function yearProp(d,year){
    if (year == "2003"){
      return d.properties.three;
    } else if (year == "2004"){
      return d.properties.four;
    } else if (year == "2005"){
      return d.properties.five;
    } else if (year == "2006"){
      return d.properties.six;
    } else if (year == "2007"){
      return d.properties.seven;
    } else if (year == "2008"){
      return d.properties.eight;
    } else if (year == "2009"){
      return d.properties.nine;
    } else if (year == "2010"){
      return d.properties.ten;
    } else if (year == "2011"){
      return d.properties.eleven;
    } else if (year == "2012"){
      return d.properties.twelve;
    } else if (year == "2013"){
      return d.properties.thirteen;
    } else if (year == "2014"){
      return d.properties.fourteen;
    } else if (year == "2015"){
      return d.properties.fifteen;
    } else if (year == "2016"){
      return d.properties.sixteen;
    } else if (year == "2017"){
      return d.properties.seventeen;
    }
}

function mouseover(d,year){
  // Highlight hovered province
  d3.select(this).style('fill', '#8a0303');
  var theval = yearProp(d,year)
  // Draw effects
  textState(nameFn(d)+" - "+Math.round(theval).toString());
}


function fillFn(d){
  var year = d3.selectAll("#slider").node().value
  if (year == "2003"){
                return color(d.properties.three);
              } else if (year == "2004"){
                return color(d.properties.four);
              } else if (year == "2005"){
                return color(d.properties.five);
              } else if (year == "2006"){
                return color(d.properties.six);
              } else if (year == "2007"){
                return color(d.properties.seven);
              } else if (year == "2008"){
                return color(d.properties.eight);
              } else if (year == "2009"){
                return color(d.properties.nine);
              } else if (year == "2010"){
                return color(d.properties.ten);
              } else if (year == "2011"){
                return color(d.properties.eleven);
              } else if (year == "2012"){
                return color(d.properties.twelve);
              } else if (year == "2013"){
                return color(d.properties.thirteen);
              } else if (year == "2014"){
                return color(d.properties.fourteen);
              } else if (year == "2015"){
                return color(d.properties.fifteen);
              } else if (year == "2016"){
                return color(d.properties.sixteen);
              } else if (year == "2017"){
                return color(d.properties.seventeen);
              }
  // return color(d.properties.ten);
}

function mouseout(d){
  // Reset State color
  mapLayer.selectAll('path')
    .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
  // Clear State name
  bigText.text('');
}

// Gimmick
// Just me playing around.
// You won't need this for a regular map.

var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

var FONTS = [
  "Josefin Slab",
  "Vollkorn",
  "Lobster",
  "Playfair Display"
];

function textState(text){
  bigText
    .style('font-family', 'Lobster')
    .text(text);
}



