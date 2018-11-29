function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return 'NULL'
}
var subject = getQueryVariable('subject');
subject = subject.toUpperCase()

var birthDate = ''
var group = ''

$.get('public/subjectsData/subjectsDB.json', function (data) {
  subjectJSON = data
  birthDate = subjectJSON[subject].birthdate

  group =  subjectJSON[subject].group

  console.log(subject)
  LC_AGE = parseInt(subjectJSON[subject].age);
  console.log('Age: ' + LC_AGE);
  if (LC_AGE <= 45) {
    $('#i').hide();
  }
  if (LC_AGE <= 35) {
    $('#h').hide();
  }
  if (LC_AGE <= 25) {
    $('#g').hide();
  }
  if (LC_AGE <= 18) {
    $('#f').hide();
  }
  if (LC_AGE <= 14) {
    $('#e').hide();
  }

});
// Hide Epoch Buttons Based on Age

var rangeSlider; // global var


$(document).ready(function () {

  $("#nav-title").attr('href', '/lifechartexamples')
  document.getElementById('subject').innerHTML = subject.toUpperCase().replace('-',' ') + ' - ' + group
  document.getElementById('homenav').innerHTML = subject.toUpperCase()

  $('#homenav').attr('href','chart.html?subject=' + subject)
  $('#overall-count-nav-link').attr('href', 'overall.html?subject=' + subject);
  $('#bad-good-count-nav-link').attr('href', 'good-bad.html?subject=' + subject);
  $('#drug-count-nav-link').attr('href', 'drugs.html?subject=' + subject);
  $('#people-count-nav-link').attr('href', 'people.html?subject=' + subject);
  $('#hobbies-count-nav-link').attr('href', 'hobbies.html?subject=' + subject);
  $('#mental-ratio-nav-link').attr('href', 'mental.html?subject=' + subject);

});


// Loading the Vsualziation API and the timepline package
google.charts.load('visualization', '1', {
  'packages': ['corechart', 'timeline', 'controls']
});

// set a callback when the Google Visualization API is loaded.
// Draw T
google.charts.setOnLoadCallback(getTimelineData);


// Draw Events Chart
google.charts.setOnLoadCallback(drawEventsChart);


function stringToArray(string) {
  // body...
  var line = string.split(/\r?\n/);
  var x = new Array(line.length);
  for (var i = 0; i < line.length; i++) {
    x[i] = line[i].split(',')
  }
  return x;
}

function returnDateObj(dates) {
  if (dates == undefined) {
    return null
  }
  datearray = dates.split('/');
  year = datearray[0]
  month = datearray[1]
  day = datearray[2]
  return new Date(dates)
}
// Will return the dates explicityly
// example: 1 year, 8, months, 3 days
function getDuration(start, end) {
  if (end == 'Invalid Date' || start == 'Invalid Date') {
    return ''
  } else {
    startdate = moment(start)
    enddate = moment(end)
    duration = moment.duration(enddate.diff(startdate))
    return `${duration.years()} Years<br>
                ${duration.months()} Months<br>
                ${duration.days()} Days
                `
  }

}


function getTooltipHTML(category, description, state, country, start, end) {
  // body...
  var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sept",
    "Oct", "Nov", "Dec");
  duration = getDuration(start, end);
  d1 = moment(start, 'DD/MM/YY', true).format('MMM YYYY')
  d2 = moment(end, 'DD/MM/YY', true).format('MMM YYYY')
  if (start == 'Invalid Date') {
    d1 = 'null'
  }
  if (end == 'Invalid Date') {
    d2 = 'null'
  }

  if (state == undefined) {
    state = ''
  }

  if (country == undefined) {
    country = ''
  }

  html = `<div style="padding:9px 12px 12px 9px;font-family: Lucida Grande; ">
          <table style="border-collapse: collapse;">
            <tr style="border-bottom: thin solid gray;">
              <th style="font-size: 12px;"><center><strong>${category}</strong></center></th>
            </tr>
            <tr>
              <th style="font-size: 14px;"><center>${description}</center></th>
            </tr>
            <tr>
              <td style="padding:5px 5px 5px 5px;font-size: 12px;"><center>${state}</center></td>
            </tr>
            <tr>
              <td style="padding:5px 5px 5px 5px;font-size: 12px;"><center>${country}</center></td>
            </tr>
            <tr>
              <td style="padding:5px 5px 5px 5px;font-size: 12px;"><center><strong></strong> ${duration}</center></td>
            </tr>
            <tr>
              <td style="padding:5px 5px 5px 5px;font-size: 11px;"><center><i>${d1 + ' - ' + d2}</i></center></td>
            </tr>
          </table>
        </div>`
  // console.log(html)
  return html

}

// Functio to get the timeline data, conce it does, invokes
// the drawTimelineChart() to then draw the chart.
function getTimelineData() {
  // Get File
  console.log(subject)
  $.get('public/subjectsData/' + subject + '/' + subject + '-timeline-rev.csv', function (data) {
    // console.log(data)
    drawTimelineChart(data);
  })

}



function drawTimelineChart(data) {

  //document.getElementById('test').innerHTML = data;
  var finalData = [];

  fileArray = stringToArray(data);
  //console.log(fileArray)

  //console.log(testdata);
  //data.addRows(finalData);
  colorpalette = ['#358E96', '#3EA8B2', '#51BAC3', '#6CC5CD', '#86D0D7', '#A1DBE1', '#BCE6EA']
  // Raingbow:
  color1 = ['#e74c3c', '#e67e22', '#2980b9', '#f39c12', '#f1c40f', '#16a085', '#2980b9', '#2c3e50']
  color2 = ['#e84393', '#d63031', '#e17055', '#fdcb6e', '#00b894', '#00cec9', '#6c5ce7', '#b2bec3']
  color3 = ['#EA2027', '#EE5A24', '#FFC312', '#009432', '#0652DD', '#9980FA', '#D980FA', '#ED4C67']
  color5 = ['#FC427B', '#FD7272', '#FD7272', '#F97F51', '#55E6C1', '#25CCF7', '#1B9CFC', '#D6A2E8']
  color6 = ['#fc5c65', '#fd9644', '#fed330', '#26de81', '#2bcbba', '#45aaf2', '#4b7bec', '#a55eea']
  color7 = ['#BC4943', '#C55F5A', '#CE7571', '#D78C88', '#DFA29F', '#E7B9B7', '#EFD0CF', '#F7E8E7']
  color = ['#182843', '#21385E', '#2A487A', '#325896', '#3B68B2', '#4C7AC5', '#678ECF']
  // color 4 is the default

  var colorsp = [];
  var colorMap = {
    // should contain a map of category -> color for every category
    'Drugs and Alcohol': color3[0],
    'Mental Health': color3[1],
    'Hobbies': color3[2],
    'People': color3[3],
    'Jobs': color3[4],
    'School': color3[5],
    'Residence': color3[6],
  }

  for (var i = 0; i < fileArray.length - 1; i++) {
    row = fileArray[i]


    order = row[0]
    category = row[1]
    period = row[2]
    startdate = returnDateObj(row[3])
    enddate = returnDateObj(row[4])
    birthdate = returnDateObj(row[5])
    assesseddate = returnDateObj(row[6])

    // swaps the date if one end date came before start date
    if (startdate.getTime() > enddate.getTime()) {
      tempdate = startdate;
      startdate = enddate;
      enddate = tempdate;
    }
    description = row[7].replace("\"", "")
    annotext = getthreeword(description)
    state = row[8]
    country = row[9]

    //console.log(birthdate)
    tooltiphtml = getTooltipHTML(category, description, state, country, startdate, enddate);

    if (enddate != 'Invalid Date') {
      // console.log(startdate._d)
      finalData.push([category, annotext, colorMap[category], tooltiphtml, startdate._d, enddate._d, birthdate, assesseddate]);
    }
  }

  // console.log(finalData)

  var data = new google.visualization.DataTable();
  // Inserting Date to the data object

  data.addColumn({
    type: 'string',
    id: 'Category'
  });
  //data.addColumn({ type: 'string', 'role': 'annotation'});
  data.addColumn({
    type: 'string',
    id: 'Name'
  });
  data.addColumn({
    type: 'string',
    role: 'style'
  });


  data.addColumn({
    type: 'string',
    role: 'tooltip',
    p: {
      'html': true
    }
  });
  data.addColumn({
    type: 'date',
    id: 'Start'
  });
  data.addColumn({
    type: 'date',
    id: 'End'
  });
  data.addColumn({
    type: 'date',
    id: 'birthdate',
    role: 'domain'
  });
  data.addColumn({
    type: 'date',
    id: 'assesseddate',
    role: 'domain'
  });

  data.addRows(finalData);

  var options = {
    //width : '100%',
    height: '100%',
    tooltip: {
      isHtml: true
    },
    avoidOverlappingGridLines: true,
    // height: 100%,
    forceIFrame: false,
    hAxis: {
      gridLines: {
        count: 10
      }
    },
    timeline : {
      showBarLabels: true
    }

  };

  var dashboard = new google.visualization.Dashboard(
    document.getElementById('timeline')
  );

  rangeSlider = new google.visualization.ControlWrapper({
    'controlType': 'ChartRangeFilter',
    'containerId': 'timeline_slider',
    'options': {
      // Filter by the date axis.
      'filterColumnIndex': 4,
      'ui': {
        'cssClass': 'rangeSlider',
        'chartType': 'TimeLine',
        'chartOptions': {
          //'width': 1000,
          'height': 70,
          'chartArea': {
            'width': '100%', // make sure this is the same for the chart and control so the axes align right
            'height': '80%'
          },

          //'snapToData' : true
        },
        // This, this view has two columns: the start and end dates.
        'chartView': {
          'columns': [4, {
            type: 'number',
            calc: function () {
              return 0;
            }
          }]
        }
      }
    },

  });

  var categoryFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'timelineCategoryFilter',
    'options': {
      // Filter by the date axis.
      'filterColumnIndex': 0,
      'ui': {
        'caption': 'Select Category',
        'labelStacking': 'horizontal',
        'selectedValuesLayout': 'belowStacked',
        'allowTyping': false,
        'allowMultiple': true,
        'allowNone': true,
      },

    },

  });

  var timelineChart = new google.visualization.ChartWrapper({
    'chartType': 'Timeline',
    'containerId': 'timeline_chart',
    'options': options

  });

  categorySelectValues = ['Drugs and Alcohol', 'Hobbies', 'Jobs', 'Mental Health', 'People', 'Residence', 'School']

  categoryFilter.setState({
    'selectedValues': categorySelectValues
  })

  // Sets the stroke of the bars to black on the category chart
  google.visualization.events.addListener(timelineChart, 'ready', function () {
    var container = document.getElementById('timeline_chart')
    var rectangles = container.getElementsByTagName('rect');
    var adjustY = 25;
    var adjustX = 15;
    for(var i=0; i<rectangles.length; i++){
      if (i >= 8){
        rectangles[i].setAttribute('stroke',"#000000")
      }
     
    }

    var g = container.getElementsByTagName("svg")[0].getElementsByTagName("g")[1]; // the Y axis labels for google cahrt
    

    container.getElementsByTagName("svg")[0].parentNode.style.top = '40px';
    container.getElementsByTagName("svg")[0].style.overflow = 'visible';
    var height = Number(g.getElementsByTagName("text")[0].getAttribute('y')) + 15;
    
    previousg = g.previousElementSibling // previous dom element after g
    g.setAttribute('id','og')
    newg = g.cloneNode(true); // copy the same
    newg.setAttribute('id', 'newg')
    newg.setAttribute('transform','translate(0,-'+height+')');

    var dates = newg.getElementsByTagName('text')
    for(var i=0; i<dates.length; i++){

      date = getAgeFromDate(dates[i].innerHTML, birthdate) // the date on the x axis
      // console.log(date)


      // if Nan, don't show the text
      if(isNaN(date)){
        dates[i].style.display = "none"
      }

      if(dates[i].getAttribute('font-weight') == 'bold'){
        y = dates[i].getAttribute('y')
        dates[i].setAttribute('y', y - 15) 
        // offests the y position to place it 15 pixel height above the line

      }


      dates[i].innerHTML = date
    }
    previousg.after(newg)
    // previousg.append(g)
    // g.nextElementSibling = newg
    // newg.append(g)
    g = null;

});

  

  dashboard.bind([rangeSlider, categoryFilter], timelineChart);
  dashboard.draw(data);

  //console.log(rangeSlider.getState())

  $('#load2wrap').attr('style', "display: none;")
  $('#load2wrap').attr('style', "padding: 0px;")
  $('#load2').attr('style', "display: none;")

  $('#drugs').change(function () {
    catstring = 'Drugs and Alcohol'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {

      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });


  $('#mental').change(function () {
    catstring = 'Mental Health'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {

      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });

  $('#hobbies').change(function () {
    catstring = 'Hobbies'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {
      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });

  $('#people').change(function () {
    catstring = 'People'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {
      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });

  $('#jobs').change(function () {
    catstring = 'Jobs'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {
      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });

  $('#school').change(function () {
    catstring = 'School'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {
      //'unchecked' event code
      //console.log('drugs unchecked')
      // Remove Drugs and Alcohol From the selected values
      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });

  $('#residence').change(function () {
    catstring = 'Residence'
    if ($(this).is(":checked")) {
      //'checked' event code
      categorySelectValues.push(catstring)
      //console.log('drugs checked')
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    } else {
      //'unchecked' event code
      //console.log('drugs unchecked')
      // Remove Drugs and Alcohol From the selected values
      index = categorySelectValues.indexOf(catstring)
      if (index > -1) {
        categorySelectValues.splice(index, 1)
      }
      categoryFilter.setState({
        'selectedValues': categorySelectValues
      })
      categoryFilter.draw()
    }

  });


  // Button Clicks for Epoch
  $("#all").click(function () {

    rangeSlider.setState({
      'range': {
        'start': periodDates('b', birthDate).start,
        'end': new Date()
      }
    })
    rangeSlider.draw()
    timelineChart.draw();
    $('#epochtitle').html('All Epochs');
  });
  $("#b").click(function () {
    //alert( "Handler for .click() called." );

    

    rangeSlider.setState({
      'range': {
        'start': periodDates('b', birthDate).start,
        'end': periodDates('b', birthDate).end
      }
    })
    rangeSlider.draw()
    $('#epochtitle').html("Birth-Elementary School Years");
  });
  $("#c").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('c', birthDate).start,
        'end': periodDates('c', birthDate).end
      }
    })
    rangeSlider.draw()
    $('#epochtitle').html("Elementary School Years");
  });
  $("#d").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('d', birthDate).start,
        'end': periodDates('d', birthDate).end
      }
    })
    rangeSlider.draw();
    $('#epochtitle').html("Middle School Years");
  });
  $("#e").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('e', birthDate).start,
        'end': periodDates('e', birthDate).end
      }
    })
    rangeSlider.draw()
    $('#epochtitle').html("High School Years");
  });
  $("#f").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('f', birthDate).start,
        'end': periodDates('f', birthDate).end
      }
    })
    rangeSlider.draw();
    $('#epochtitle').html("Young Adult Years");
  });
  $("#g").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('g', birthDate).start,
        'end': periodDates('g', birthDate).end
      }
    })
    rangeSlider.draw();
    $('#epochtitle').html("Age: 25-35 ");
  });
  $("#h").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('h', birthDate).start,
        'end': periodDates('h', birthDate).end
      }
    })
    rangeSlider.draw()
    $('#epochtitle').html("Age: 35-45 ");
  });
  $("#i").click(function () {
    //alert( "Handler for .click() called." );
    rangeSlider.setState({
      'range': {
        'start': periodDates('i', birthDate).start,
        'end': periodDates('i', birthDate).end
      }
    })
    rangeSlider.draw()
    $('#epochtitle').html("Age: 45-55 ");
  });

}

/**
 * Returns JSON object of start and end date
 * @param {String} period period Letter
 * @param {String} birthdate birthdate String Date
 */
function periodDates(period, birthdate) {
  var start;
  var end;
  if (period == 'b') {
    start = moment(new Date(birthdate))._d
    end = moment(birthdate).add(6, 'years')._d
  } else if (period == 'c') {
    start = moment(birthdate).add(6, 'years')._d
    end = moment(birthdate).add(10, 'years')._d
  } else if (period == 'd') {
    start = moment(birthdate).add(10, 'years')._d
    end = moment(birthdate).add(14, 'years')._d
  } else if (period == 'e') {
    start = moment(birthdate).add(14, 'years')._d
    end = moment(birthdate).add(18, 'years')._d
  } else if (period == 'f') {
    start = moment(birthdate).add(18, 'years')._d
    end = moment(birthdate).add(25, 'years')._d
  } else if (period == 'g') {
    start = moment(birthdate).add(25, 'years')._d
    end = moment(birthdate).add(35, 'years')._d
  } else if (period == 'h') {
    start = moment(birthdate).add(35, 'years')._d
    end = moment(birthdate).add(45, 'years')._d
  } else if (period == 'i') {
    start = moment(birthdate).add(45, 'years')._d
    end = moment(birthdate).add(55, 'years')._d
  }
  dates = {
    start: start,
    end: end
  }
  // console.log(dates)

  return dates
}

/**
 * Return the age given a date and the birthdate
 * @param {Date} date 
 * @param {Date} birthdate 
 */
function getAgeFromDate(date, birthdate){
  return moment(date).diff(moment(birthdate), 'years')
}

function getthreeword(text) {
  words = text.split(' ');

  if (words[2] == undefined && words[1] == undefined) {
    return words[0]
  } else if (words[2] == undefined && words[1] != undefined) {
    return words[0] + ' ' + words[1]
  } else if (words[2] != undefined && words[1] != undefined) {
    return words[0] + ' ' + words[1] + ' ' + words[2]
  } else {
    return words[0]
  }
}

function getNumber(string) {
  if (string == '') {
    return null
  } else {
    return parseFloat(string)
  }
}


function getEventTooltipHTML(category, description, age, start, end, eventRating) {
  // body...
  var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sept",
    "Oct", "Nov", "Dec");
  duration = getDuration(start, end);
  d1 = moment(start, 'DD/MM/YY', true).format('MMM YYYY')
  d2 = moment(end, 'DD/MM/YY', true).format('MMM YYYY')

  start_and_enddate = ''
  if (start == 'Invalid Date') {
    d1 = ''
  }
  if (end == 'Invalid Date') {
    d2 = ''
  }

  // Formatting the start and end date depending on available data
  if (d1 == '' && d2 == ''){
    start_and_enddate = ''
  } else if (d1 == '' && d2 != ''){
    start_and_enddate = d2
  } else if (d1 != '' && d2 == ''){
    start_and_enddate = d1
  } else {
    start_and_enddate = d1 + ' - ' + d2
  }


  html = `<div style="padding:9px 12px 12px 9px;font-family: Lucida Grande; ">
        <table style="border-collapse: collapse;">
          <tr style="border-bottom: thin solid gray;">
            <th style="font-size: 12px;"><center><strong>${category}</strong></center></th>
          </tr>
          <tr>
            <th style="font-size: 14px;"><center>${description}</center></th>
          </tr>
          <tr>
            <th style="font-size: 14px;"><center><strong>Rating: <strong>${eventRating}</center></th>
          </tr>
          <tr>
            <td style="padding:5px 5px 5px 5px;font-size: 12px;"><center><strong>Age: </strong>${age}</center></td>
          </tr>
          <tr>
            <td style="padding:5px 5px 5px 5px;font-size: 12px;"><center><strong></strong>${duration}</center></td>
          </tr>
          <tr>
            <td style="padding:5px 5px 5px 5px;font-size: 11px;"><center><i>${start_and_enddate}</i></center></td>
          </tr>
        </table></div>`
  //console.log(html)
  return html

}
var moodrating = {}

function isLastThreeTaken(age) {
  if ((parseInt(age) - 3).toString() in moodrating) {
    //console.log('triggered - 3 ' + age)
    return true
  }
  if ((parseInt(age) - 2).toString() in moodrating) {
    // console.log('triggered - 2 ' + age)
    return true
  }

  return false

}


function getNewMoodRating(age, mood) {
  // mood already in that corresponding age
  // return a shifted mood

  var DODGE_WIDTH = .3


  try {
    if (moodrating[age].includes(mood)) {
      moodrating[age].push(parseFloat(mood) + DODGE_WIDTH)
      // If there is a value at least 3 ages ago, then shift the rating up
      // even more
      if (isLastThreeTaken(age)) {
        return [age, parseFloat(mood) + DODGE_WIDTH * 1.5]
        //console.log('triggered')
      } else {
        return [age, parseFloat(mood) + DODGE_WIDTH]
      }

      // mood is not in that corresponding age
      // return same mood and add to the array
    } else {
      moodrating[age].push(mood)
      if (isLastThreeTaken(age)) {
        return [age, parseFloat(mood) - DODGE_WIDTH]
      } else {
        return [age, mood]
      }

    }

  } catch (error) {
    // hasn't been added to the associatve array

    if (error instanceof TypeError) {
      moodrating[age] = [mood]
      if (isLastThreeTaken(age)) {
        // dodge width should change if the previous ages are taken
        //return [age,parseFloat(mood) + DODGE_WIDTH]
        return [age, parseFloat(mood)]
      } else {
        return [age, mood]
      }
    } else {
      console.log(error)
    }

  }


}

function getStyle(start, end) {
  if (enddate == 'Invalid Date' || enddate == null) {
    return ''
  } else {
    startdate = moment(start)
    enddate = moment(end)
    duration = moment.duration(enddate.diff(startdate))
    diffDays = duration.days()


    return 'point { shape-type: star; size: 9; sides: ' + diffDays + '; visible: true; }'
  }
}


function filterDescription(value) {
  //console.log(value);
  if (value == undefined) {
    return ''
  } else {
    return value.replace('\"', '')
  }
}



function drawEventsChart() {
  // Some raw data (not necessarily accurate)
  var progressBar = document.getElementById("eventProgess");

  $.get('public/subjectsData/' + subject + '/' + subject + '-events-rev.csv', function (data) {
    var finalData = [];

    console.log('events data')
    // console.log(data)

    fileArray = stringToArray(data);

    for (var i = 1; i < fileArray.length - 1; i++) {
      row = fileArray[i]



      age = parseInt(row[0])


      periodrating = getNewMoodRating(age, getNumber(row[15]))[1]

      eventtype = row[1]

      one = getNumber(row[2])
      onenew = getNewMoodRating(age, getNumber(row[2]))[1]

      two = getNumber(row[3])
      twonew = getNewMoodRating(age, getNumber(row[3]))[1]

      three = getNumber(row[4])
      threenew = getNewMoodRating(age, getNumber(row[4]))[1]

      four = getNumber(row[5])
      fournew = getNewMoodRating(age, getNumber(row[5]))[1]

      five = getNumber(row[6])
      fivenew = getNewMoodRating(age, getNumber(row[6]))[1]

      six = getNumber(row[7])
      sixnew = getNewMoodRating(age, getNumber(row[7]))[1]

      seven = getNumber(row[8])
      sevennew = getNewMoodRating(age, getNumber(row[8]))[1]

      eight = getNumber(row[9])
      ewightnew = getNewMoodRating(age, getNumber(row[9]))[1]

      nine = getNumber(row[10])
      ninenew = getNewMoodRating(age, getNumber(row[10]))[1]

      ten = getNumber(row[11])
      tennew = getNewMoodRating(age, getNumber(row[11]))[1]

      agenew = getNewMoodRating(age, getNumber(row[15]))[0]


      startdate = returnDateObj(row[12])
      enddate = returnDateObj(row[13])

      eventdes = filterDescription(row[14])



      onetooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, one)
      twotooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, two)
      threetooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, three)
      fourtooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, four)
      fivetooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, five)
      sixtooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, six)
      seventooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, seven)
      eighttooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, eight)
      ninetooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, nine)
      tentooltip = getEventTooltipHTML(eventtype, eventdes, age, startdate, enddate, ten)

      annotext = getthreeword(eventdes)

      if (enddate == "") {
        enddate = "NA"
      }


      finalRow = [
        agenew,
        onenew, onetooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        twonew, twotooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        threenew, threetooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        fournew, fourtooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        fivenew, fivetooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        sixnew, sixtooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        sevennew, seventooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        ewightnew, eighttooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        ninenew, ninetooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        tennew, tentooltip, getthreeword(eventdes), eventdes, getStyle(startdate, enddate),
        periodrating,
        eventtype,
      ]

      //console.log(finalRow);

      finalData.push(finalRow);
    }

    // console.log(finalData);

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Age');

    data.addColumn('number', 'One');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Two');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Three');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Four');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Five');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Six');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Seven');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Eight');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Nine');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })
    data.addColumn('number', 'Ten');
    data.addColumn({
      'type': 'string',
      'role': 'tooltip',
      'p': {
        'html': true
      }
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotation'
    })
    data.addColumn({
      'type': 'string',
      'role': 'annotationText'
    })
    data.addColumn({
      'type': 'string',
      'role': 'style'
    })


    data.addColumn('number', 'Period Rating');
    data.addColumn({
      'type': 'string',
      'role': 'domain'
    });

    data.addRows(finalData)

    var options = {
      height: 445,
      enableInteractivity: true,
      focusTarget: 'datum',
      tooltip: {
        isHtml: true
      },
      vAxis: {
        title: 'Mood Rating',
        gridlines: {
          color: 'white'
        },
        viewWindow : {
          min: null,
          max: null
        },
        ticks: _.range(0, 11, 1)
      },
      hAxis: {
        title: 'Age',
        minValue: 0,
        maxValue: 10,
        viewWindow : {
          min: null,
          max: null
        },
        ticks: _.range(0, LC_AGE + 4, 3)
      },
      legend: {
        position: 'none',
        'alignment': 'center'
      },
      chartArea: {
        top: 20,
        left: 50,
        width: '100%',
        height: '85%',
      },
      //curveType : 'funtion',
      //steppedArea
      series: {

        0: {
          type: 'scatter',
          color: '#0E0CE5'
        },

        1: {
          type: 'scatter',
          color: '#0E09AB'
        },

        2: {
          type: 'scatter',
          color: '#000672'
        },
        // Other Event
        3: {
          type: 'scatter',
          color: '#000339'
        },
        4: {
          type: 'scatter',
          color: '#000000'
        },
        5: {
          type: 'scatter',
          color: '#000000'
        },
        6: {
          type: 'scatter',
          color: '#3A0700'
        },
        7: {
          type: 'scatter',
          color: '#750F00'
        },
        8: {
          type: 'scatter',
          color: '#B01600'
        },
        9: {
          type: 'scatter',
          color: '#EB1E00'
        },
        // Period Rating
        10: {
          type: 'line',
          lineWidth: 4,
          color: '#666666',
          visibleInLegend: false,
          areaOpacity: 1
        }

      },
      annotations: {
        textStyle: {
          fontSize: 12,
        }
      }

    };

    var eventdashboard = new google.visualization.Dashboard(
      document.getElementById('events')
    );

    var eventCategoryFilter = new google.visualization.ControlWrapper({
      'controlType': 'CategoryFilter',
      'containerId': 'eventsPicker',
      'options': {
        // Filter by the date axis.
        'filterColumnIndex': 52,
        'ui': {
          'caption': 'Select Event',
          'labelStacking': 'horizontal',
          'selectedValuesLayout': 'aside',
          'allowTyping': false,
          'allowMultiple': true,
          'allowNone': true,
        },

      },
    });

    var comboChart = new google.visualization.ChartWrapper({
      'chartType': 'ComboChart',
      'containerId': 'eventsChart',
      'options': options

    });


    eventSelected = ['Good Event', 'Bad Event', 'Change Event', 'Other Event', 'Period']
    eventCategoryFilter.setState({
      'selectedValues': eventSelected
    })

    eventdashboard.bind(eventCategoryFilter, comboChart);
    eventdashboard.draw(data);

    $('#load1wrap').attr('style', "display: none;")
    $('#load1').attr('style', "display: none;")
    $('#load1wrap').attr('style', "padding: 0px;")

    google.visualization.events.addListener(comboChart, 'ready', function () {
      document.getElementById('download1').href = comboChart.getChart().getImageURI();
      document.getElementById('download1').download = subject + "-LifeChart-Events"
    });


    // Changes the event chart when the range slider is changed
    google.visualization.events.addListener(rangeSlider, 'statechange', function () {

      options.hAxis.viewWindow.max = getAgeFromDate(rangeSlider.getState().range.end, birthDate)
      min = getAgeFromDate(rangeSlider.getState().range.start, birthDate)
      if(min == -1){
        min = 0
      }
      options.hAxis.viewWindow.min = min
      
      // console.log(options.hAxis.viewWindow)
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    });



    $('#all').click(function(){
      options.hAxis.viewWindow.max = LC_AGE
      options.hAxis.viewWindow.min = 0
      // options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })
    $('#b').click(function(){
      options.hAxis.viewWindow.max = 6
      options.hAxis.viewWindow.min = 0
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })

    $('#c').click(function(){
      options.hAxis.viewWindow.max = 10
      options.hAxis.viewWindow.min = 6
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })
    $('#d').click(function(){
      options.hAxis.viewWindow.max = 14
      options.hAxis.viewWindow.min = 10
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })
    $('#e').click(function(){
      options.hAxis.viewWindow.max = 18
      options.hAxis.viewWindow.min = 14
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })
    $('#f').click(function(){
      options.hAxis.viewWindow.max = 25
      options.hAxis.viewWindow.min = 18
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })
    $('#g').click(function(){
      options.hAxis.viewWindow.max = 35
      options.hAxis.viewWindow.min = 25
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })
    $('#h').click(function(){
      options.hAxis.viewWindow.max = 45
      options.hAxis.viewWindow.min = 35
      options.hAxis.ticks = null
      comboChart.setOptions(options)
      comboChart.draw()
    })


    $('#good').change(function () {
      eventstring = 'Good Event'
      if ($(this).is(":checked")) {
        //'checked' event code
        eventSelected.push(eventstring)
        //console.log('drugs checked')
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      } else {
        index = eventSelected.indexOf(eventstring)
        if (index > -1) {
          eventSelected.splice(index, 1)
        }
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      }

      //console.log(eventSelected)
    });

    $('#bad').change(function () {
      eventstring = 'Bad Event'
      if ($(this).is(":checked")) {
        //'checked' event code
        eventSelected.push(eventstring)
        //console.log('drugs checked')
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      } else {
        index = eventSelected.indexOf(eventstring)
        if (index > -1) {
          eventSelected.splice(index, 1)
        }
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      }

    });

    $('#change').change(function () {
      eventstring = 'Change Event'
      if ($(this).is(":checked")) {
        //'checked' event code
        eventSelected.push(eventstring)
        //console.log('drugs checked')
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      } else {

        index = eventSelected.indexOf(eventstring)
        if (index > -1) {
          eventSelected.splice(index, 1)
        }
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      }


    });

    $('#other').change(function () {
      eventstring = 'Other Event'
      if ($(this).is(":checked")) {
        //'checked' event code
        eventSelected.push(eventstring)
        //console.log('drugs checked')
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      } else {

        index = eventSelected.indexOf(eventstring)
        if (index > -1) {
          eventSelected.splice(index, 1)
        }
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      }


    });

    $('#period').change(function () {
      eventstring = 'Period'
      if ($(this).is(":checked")) {
        //'checked' event code
        eventSelected.push(eventstring)
        //console.log('drugs checked')
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      } else {

        index = eventSelected.indexOf(eventstring)
        if (index > -1) {
          eventSelected.splice(index, 1)
        }
        eventCategoryFilter.setState({
          'selectedValues': eventSelected
        })
        eventCategoryFilter.draw()
      }


    });

    var fontsize = 12

    $('#font-decrease').click(function () {

      var opt = comboChart.getOptions()

      fontsize = fontsize - 1
      // //console.log(opt)
      opt['annotations'] = {
        'textStyle': {
          'fontSize': fontsize
        }
      }
      comboChart.setOptions(opt)
      comboChart.draw()

    })

    $('#font-reset').click(function () {

      var opt = comboChart.getOptions()

      fontsize = 12
      // //console.log(opt)
      opt['annotations'] = {
        'textStyle': {
          'fontSize': fontsize
        }
      }
      comboChart.setOptions(opt)
      comboChart.draw()

    })

    $('#font-increase').click(function () {
      var opt = comboChart.getOptions()

      fontsize = fontsize + 1
      // //console.log(opt)
      opt['annotations'] = {
        'textStyle': {
          'fontSize': fontsize
        }
      }
      comboChart.setOptions(opt)
      comboChart.draw()
      //
    })

  });

}
