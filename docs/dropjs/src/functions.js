function drawDatef(data,x,y){
    dateLayer
        .selectAll('g')
        .data(data)
        .enter()
        .append('text')
        .transition()
        .duration(300)
        .style('opacity', 4)
        .attr('x', x)             
        .attr('y', y)
        .attr('text-anchor', "middle")  
        .attr("id","dateCorner")
        .style("font-size", "30px") 
        .style("font-weight", "500") 
        .style('font-family', 'Josefin Slab')
        .text(function(d){
            return formatParse(d.date)
        })
}

function todas(){
    dateLayer.selectAll("*").remove()
    crossLayer.selectAll("*").remove()
    d3.csv("data/monthly.csv", function(error, data) {
        if (estan == 1){
            drawCross(data);
            estan = null;
        } else {
            crossLayer.selectAll("*").transition().duration(120)
                .style('opacity', 0).remove();
            dateLayer.selectAll("*").transition().duration(100)
                .style('opacity', 20).remove()
            effectLayer.selectAll('text').transition()
                .style('opacity', 0)
                .remove();
            estan = 1;
        }
    });
}

// Get State name
function nameFn(d){
  return d && d.properties ? d.properties.name : null;
}

// Get femicides number
function femFn(d){
  return d && d.properties ? d.properties.femicides : null;
}

// Get femicides number
function fem_num(d){
    var n = femFn(d);
    return n
}

// Get State color
function fillFn(d){
  // return color(d.properties.rate_sph);
  return color(d.properties.rate_sph);
  // return color(d.id);
}


// When clicked, zoom in
function clicked(d) {
  var x, y, k;

  // Compute centroid of the selected path
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 3;
    centered = d;
    dateX = x;
    dateY = y - 50;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    dateX = width / 2 - 90;
    dateY = height - 120;
  }

  // Highlight the clicked province
  mapLayer.selectAll('path')
    .style('fill', function(d){return centered && d===centered ? '#8a0303' : fillFn(d);});

  // Zoom
  g.transition()
    .duration(750)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');

  dateLayer.selectAll("*").transition()
    .duration(650)
    .attr('x', dateX)             
    .attr('y', dateY)
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
                return projection([d.lon, d.lat])[0]-Math.pow(d.count,0.8)*5;
        })
        .attr("y", function(d) {
                return projection([d.lon, d.lat])[1]-Math.pow(d.count,0.8)*6;
        })
        .attr('width', function(d){
            return Math.pow(d.count,0.8)*15})
        .attr('height', function(d){
            return Math.pow(d.count,0.8)*14})
        .attr("xlink:href", "figs/pink_cross2.png")
}


// function mouseover(d){
//   // Highlight hovered province
//   d3.select(this).style('fill', '#8a0303');

//   // Draw effects
//   textState(nameFn(d)+" - "+d.properties.femicides.toString());
//     d3.csv("data/nombres_mexico.csv", function(csv){
//         csv.map(function(d){
//                 namesF.push(d.NOMBRE);
//         });
//       textArt(d3.shuffle(namesF).slice(0,d.properties.femicides))
//     });
// }

// function mouseoverNo(d){
//   // Draw effects
//     d3.csv("data/nombres_mexico.csv", function(csv){
//         csv.map(function(d){
//                 namesF.push(d.NOMBRE);
//         });
//       textArt(d3.shuffle(namesF))
//     });
// }

// function mouseout(d){
//  // Reset State color
//   mapLayer.selectAll('path')
//     .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

//   Remove effect text
//   effectLayer.selectAll('text').transition()
//     .style('opacity', 0)
//     .remove();

//   Clear State name
//   bigText.text('');
// }

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
  // Use random font
//   var fontIndex = Math.round(Math.random() * FONTS.length);
//   var fontFamily = FONTS[fontIndex] + ', ' + BASE_FONT;

  bigText
    .style('font-family', 'Lobster')
    .text(text);
}

function textArt(text){
  // Use random font
//   var fontIndex = Math.round(Math.random() * FONTS.length);
//   var fontFamily = FONTS[fontIndex] + ', ' + BASE_FONT;
var fontFamily = "Vollkorn"

  // Use dummy text to compute actual width of the text
  // getBBox() will return bounding box

  // Generate the positions of the text in the background
  var xPtr = 0;
  var yPtr = 0;
  var positions = [];
  var rowCount = 0;
  if (text.length > 0){
  while(yPtr < height){
    while(xPtr < width){
    var nombre = d3.shuffle(text)[0]
    dummyText
        .style('font-family', fontFamily)
        .text(nombre);
    var bbox = dummyText.node().getBBox();

    var textWidth = bbox.width;
    var textHeight = bbox.height;
    var xGap = 3;
    var yGap = 1;

      var point = {
        text: nombre,
        index: positions.length,
        x: xPtr,
        y: yPtr
      };
      var dx = point.x - width/2 + textWidth/2;
      var dy = point.y - height/2;
      point.distance = dx*dx + dy*dy;

      positions.push(point);
      xPtr += textWidth + xGap;
    }
    rowCount++;
    xPtr = rowCount%2===0 ? 0 : -textWidth/2;
    xPtr += Math.random() * 10;
    yPtr += textHeight + yGap;
  }
}

  var selection = effectLayer.selectAll('text')
    .data(positions, function(d){return d.text+'/'+d.index;});

  // Clear old ones
  selection.exit().transition()
    .style('opacity', 0)
    .remove();

  // Create text but set opacity to 0
  selection.enter().append('text')
    .text(function(d){return d.text;})
    .attr('x', function(d){return d.x;})
    .attr('y', function(d){return d.y;})
    .style('font-family', fontFamily)
    .style('fill', '#a9a9a9')
    .style('opacity', 0);

  selection
    .style('font-family', fontFamily)
    .attr('x', function(d){return d.x;})
    .attr('y', function(d){return d.y;});

  // Create transtion to increase opacity from 0 to 0.1-0.5
  // Add delay based on distance from the center of the <svg> and a bit more randomness.
  selection.transition()
    .delay(function(d){
      return d.distance * 0.01 + Math.random()*1000;
    })
    .style('opacity', function(d){
      return 0.1 + Math.random()*0.4;
    });
}

function redraw(t) {
    d3.csv("data/monthly.csv", function(error, data) {
        if (estan == null) {
            crossLayer.selectAll("*")
                .remove();
        }
        data.forEach(function(d){
            d.count = +d.count
            d.date = parser(d.date);
            d.lon = +d.lon;
            d.lat = +d.lat;
        })
        var startEnd = d3.extent(data, function(d){return d.date})
        var crossElements = data.filter(function(d){
            return formatParse(d.date) == formatParse(d3.time.month.offset(startEnd[0], t));
        });
        drawCross(crossElements)
        drawDatef(crossElements,dateX,dateY)
    });
    dateLayer.selectAll("*").transition().duration(600)
    .style('opacity', 20).remove()
    crossLayer.selectAll("*").transition().duration(600)
    .style('opacity', 0).remove()
}

function redrawTimeless(t) {
    d3.csv("data/monthly.csv", function(error, data) {
        data.forEach(function(d){
            d.Year = +d.Year;
            d.muni = d.muni;
            d.Month = d.Month;
            d.count = +d.count
            d.date = parser(d.date);
            d.lon = +d.lon;
            d.lat = +d.lat;
        })
        var startEnd = d3.extent(data, function(d){return d.date})
        var crossElements = data.filter(function(d){
            return formatParse(d.date) == formatParse(d3.time.month.offset(startEnd[0], t));
        });
        drawCross(crossElements)
    });
}

function clickCross() {
    animated = animated * (-1)
    var myTimer = setInterval(function(){
        if (animated !== 1){
            dateLayer.selectAll("*").remove()
            redraw(t);
            t = t+1
            if (t > 60){
                clearInterval(myTimer);
                animated = animated * (-1);
                t = 0;
                estan = 1;
                todas();
            }
        }else {
            clearInterval(myTimer);
         }
    },1000);
}