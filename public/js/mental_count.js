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

// $(document).ready(function(){
//   document.getElementById('subject').innerHTML = subject
// });

// Changine the names of the subject checkbox
$(document).ready( () => {
  //console.log('dc ready');
  if (subject == 'NULL'){
    $('#subjectLabel').hide();
  } else {
    $('#homenav').text(subject.toUpperCase());
    $("#nav-title").attr('href', '/lifechartexamples')
    $('#homenav').attr('href','chart.html?subject=' + subject)
    $('#overall-count-nav-link').attr('href', 'overall.html?subject=' + subject);
    $('#bad-good-count-nav-link').attr('href', 'good-bad.html?subject=' + subject);
    $('#drug-count-nav-link').attr('href', 'drugs.html?subject=' + subject);
    $('#people-count-nav-link').attr('href', 'people.html?subject=' + subject);
    $('#hobbies-count-nav-link').attr('href', 'hobbies.html?subject=' + subject);
    $('#mental-ratio-nav-link').attr('href', 'mental.html?subject=' + subject);

    $('#subjectLabel').text(subject.toUpperCase());
    $('#subject-h4').text(subject.toUpperCase());
  }
});

function getFilterColumnNumber(subject){
  if (subject != 'NULL'){
    return 20
  } else {
    return 19
  }
}
// Loading the Vsualziation API and the timepline package
google.charts.load('current', {'packages':['corechart', 'timeline','controls']});

// set a callback when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(getTableData);

// this callback function is another async function. gets the data, when it is done,
// it then invokes the drawChart()
function getTableData(){
  var fileArray;
  getDataPromise = new Promise((resolve, reject) => {
    $.get('public/overallData/mentalCount.csv', function(data){
      resolve(data)
    });
  }).then(
    function (result) {
      fileArray = stringToArray(result) // send counts to the fileArray variable
      return new Promise((resolve, reject) => {
        $.get('public/subjectsData/' + subject + '/' + subject + '-mentalCount.csv', function (data) {
          resolve(data)
        });
      })
    }
  ).then(
    function (result) {
      fileArray[0].push(subject) // add the name of the subect to the header of the fileArray

      goodbadArray = stringToArray(result)
      goodbadArray.forEach(function (row) {
        fileArray.push(row)
      })

      // Then Draw with the final fileArray
      drawChart(fileArray)

    }
  )
}

function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}

function stringToArray(string) {
  // body...
  var line = string.split(/\r?\n/);
  var x = new Array(line.length);
  for(var i = 0; i < line.length; i++){
    x[i] = line[i].split(',')
  }

  return x;
}

function getNumber(string){
  if (string == ''){
    return null
  } else {
    return parseFloat(string)
  }
}

function drawChart(dataTable) {

  // the final array to be put in google chart
  
  var finalData = []

  count = 0
  for (var i = 1; i < dataTable.length; i++){
    row = dataTable[i]

    period = row[0]
    group = row[1]
    
    if (count == 8){
      if (subject != 'NULL'){
        finalData.push([
          getNumber(period),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
          ]);
      } else {
        finalData.push([
          getNumber(period),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
          ]);
      }
      count = 0
    }
    count = count + 1

    if (subject != 'NULL'){
      finalData.push([
        getNumber(period),
        getNumber(row[2]),
        getNumber(row[3]),
        getNumber(row[4]),
        getNumber(row[5]),
        getNumber(row[6]),
        getNumber(row[7]),
        getNumber(row[8]),
        getNumber(row[9]),
        getNumber(row[10]),
        getNumber(row[11]),
        getNumber(row[12]),
        getNumber(row[13]),
        getNumber(row[14]),
        getNumber(row[15]),
        getNumber(row[16]),
        getNumber(row[17]),
        getNumber(row[18]),
        getNumber(row[19]),
        getNumber(row[20]),
        group
        ])
    } else {
      finalData.push([
        getNumber(period),
        getNumber(row[2]),
        getNumber(row[3]),
        getNumber(row[4]),
        getNumber(row[5]),
        getNumber(row[6]),
        getNumber(row[7]),
        getNumber(row[8]),
        getNumber(row[9]),
        getNumber(row[10]),
        getNumber(row[11]),
        getNumber(row[12]),
        getNumber(row[13]),
        getNumber(row[14]),
        getNumber(row[15]),
        getNumber(row[16]),
        getNumber(row[17]),
        getNumber(row[18]),
        getNumber(row[19]),
        group
        ])
    }
    
  }
  console.log(finalData)
  var data = new google.visualization.DataTable();

  // // document.getElementById('countchart').innerHTML = dataTable;

  data.addColumn({'type' : 'number', 'id' : 'Period', 'role': 'domain'});

  data.addColumn('number', 'Anxiety');
  data.addColumn({id:'a0', type:'number', role:'interval'});
  data.addColumn({id:'a1', type:'number', role:'interval'});

  data.addColumn('number', 'Comorbid Depression + Anxiety');
  data.addColumn({id:'b0', type:'number', role:'interval'});
  data.addColumn({id:'b1', type:'number', role:'interval'});

  data.addColumn('number', 'Depression');
  data.addColumn({id:'c0', type:'number', role:'interval'});
  data.addColumn({id:'c1', type:'number', role:'interval'});

  data.addColumn('number', 'Eating +');
  data.addColumn({id:'d0', type:'number', role:'interval'});
  data.addColumn({id:'d1', type:'number', role:'interval'});

  data.addColumn('number', 'Healthy Control');
  data.addColumn({id:'e0', type:'number', role:'interval'});
  data.addColumn({id:'e1', type:'number', role:'interval'});

  data.addColumn('number', 'Substance +');
  data.addColumn({id:'f0', type:'number', role:'interval'});
  data.addColumn({id:'f1', type:'number', role:'interval'});
  if (subject != 'NULL'){
    data.addColumn('number', subject);
  }
  data.addColumn({'type' : 'string', 'role': 'domain'});
  
  groupColor = {
    'Anxiety' : '#c20f1e',
    'Comorbid Depression + Anxiety' : '#005e9d',
    'Depression' : '#00aeea',
    'Eating +' : '#ffc938',
    'Healthy Control' : '#4c4c4e',
    'Substance +' : '#42833f',
    'subject' : '#85338a',
    'background' : '#eddcaf',
    'gridline' : '#f6ebe0'
  }

  rgbaMap = {
    '#c20f1e' : 'rgba(194, 15, 30, 0.2)',
    '#005e9d' : 'rgba(0,94,157,0.2)',
    '#00aeea' : 'rgba(0,174,234, 0.2)', 
    '#ffc938' : 'rgba(255,201,56, 0.2)',
    '#4c4c4e' : 'rgba(76, 76, 78, 0.2)',
    '#42833f' : 'rgba(66,131,63, 0.2)',
    '#85338a' : 'rgba(133,51,138, 0.2)'

  }

  seriesColors = [] // Array of just the colors // used later for legend
  for(k in groupColor) seriesColors.push(groupColor[k])

  serieslines = {
    0 : {
      pointSize: 18,
      pointShape: 'square',
      type: 'line',
      color : groupColor['Anxiety'],

      // lineWidth : 7
    },
    1 : {
      pointSize: 9,
      pointShape: 'circle',
      type : 'line',
      color : groupColor['Comorbid Depression + Anxiety']
    },
    2 : {
      pointSize: 19,
      pointShape: 'triangle',
      type : 'line',
      color : groupColor['Depression']
    },
    3 : {
      pointSize: 17,
      pointShape: 'diamond',
      type : 'line',
      color : groupColor['Eating +']
    },
    4 : {
      pointSize: 17,
      pointShape: 'circle',
      type : 'line',
      color : groupColor['Healthy Control']
    },
    5 : {
      pointSize: 8,
      type : 'line',
      color : groupColor['Substance +']
    }
    
  }
  if (subject != 'NULL'){
    serieslines[6] = {
      pointSize: 17,
      pointShape: 'star',
      type : 'line',
      color : groupColor['subject']
    }
  }

  // console.log(finalData)
  data.addRows(finalData);
  var linewidth = 4;
  var fontsize = 13
  var chartoptions = {
    title : 'How many different periods were you seen by a mental health professional?',
    'height' : 650,
    //curveType: 'function',
    'intervals': { 
      'style' : 'bars' ,
      'lineWidth' : 1.1,
      'barWidth' : .09,
      
    },
    'lineWidth': linewidth,
    'fontSize' : fontsize,
    'chartArea' : {
      left: 70,
      top: 60,
      width: '90%',
      height : '70%',
      backgroundColor : groupColor.background
    },
    'vAxis' :{
      title : 'Number of Mental Health Treatments',
      titleTextStyle : {
        fontSize : 15,
        italic : false
      },
      ticks : [
        {v : -0.5, f : ''},
        {v : 0, f : '0'},
        
        {v : 1, f : '1'},
        
        {v : 2, f : '2'},
        
        {v : 3, f : '3'},
        
        {v : 4, f : '4'},
        {v : 4.5, f : ''},
        
      ]
      
    },
    'hAxis': { 
      ticks : [
        {v: 0, f: ''},
        {v: 1, f: 'Birth-Elementary\nSchool'},
        {v: 2, f: 'Elementary\nSchool'},
        {v: 3, f: 'Middle\nSchool'},
        {v: 4, f: 'High\nSchool'},
        {v: 5, f: 'Young\nAdult'},
        {v: 6, f: '25-35'},
        {v: 7, f: '35-45'},
        {v: 8, f: '45-55'},
        {v: 9, f: ''}
      ],
      textStyle : {
        'fontSize' : 15
      },
      textPosition : 'out',
      gridlines : {
        color : groupColor.gridline
      }
      
      
      // ticks : ['Birth-Elementary School','Elementary School',
      // 'Middle School','High School','Young Adult',
      // '25-35','35-45','45-44']
    },
    'series' : serieslines,
    'legend' : { 
      position : 'bottom'
    }
  }


  var dashboard = new google.visualization.Dashboard(
    document.getElementById('drugs')
    );

  var groupCategoryFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'groupPicker',

        'options': {
              // Filter by the date axis.
            'filterColumnIndex': getFilterColumnNumber(subject),
            'ui': {
              'caption' : 'Select Group',
              'labelStacking' : 'horizontal',
              'selectedValuesLayout': 'aside',
              'allowTyping': false,
              'allowMultiple' : true,
              'allowNone' : true,
            },

          },
        // Initial range: 2015-08-10 to 2015-08-10.
        //'state': {'range': {'start': new Date(20150810185227), 
            //              'end': new Date(20150810205436)}
            //  }
    });

    var comboChart = new google.visualization.ChartWrapper({
      'chartType' : 'ComboChart',
      'containerId' : 'countchart',
      'options' : chartoptions

    });

    // var comboChart = new google.visualization.ComboChart(document.getElementById('countchart'))


    groupSelected = ['Anxiety', 'Comorbid Depression + Anxiety', 'Depression', 'Eating +','Healthy Control ', 'Substance +']

    if (subject != 'NULL'){
      groupSelected.push('Subject')
    }
    groupCategoryFilter.setState({'selectedValues' : groupSelected})

    
   
   

    dashboard.bind(groupCategoryFilter, comboChart);
    dashboard.draw(data);
    var chartDiv = document.getElementById('countchart');

    function selected(col){
      if (col){
        // clicked a legend
        // console.log(e)
        label = data.getColumnLabel(col)
        if( label == 'CASE-1' || label == 'CASE-2' || label == 'CASE-3' || label == 'CASE-4'){
          label = "subject"
        }
        Array.prototype.forEach.call(chartDiv.getElementsByTagName('path'), function(rect) {
          // console.log(rect)
          if (seriesColors.indexOf(rect.getAttribute('stroke')) > -1) {
            // console.log(rgbaMap[rect.getAttribute('stroke')])

            if(rect.getAttribute('stroke') == groupColor[label]){
              
              
            }else {
              // Decrease Opacity on the other category
              rect.setAttribute('stroke', rgbaMap[rect.getAttribute('stroke')]);
            }
          }

          // Intervals
          if(rect.getAttribute('stroke') == '#000000'){
            // console.log(rect)
            rect.setAttribute('stroke', 'rgba(0,0,0,0.2)');
          }

          


        });

        // Point Shapes For Stars
        Array.prototype.forEach.call(chartDiv.getElementsByTagName('path'), function(rect) {
          // console.log(rect)

          // Point Shapes
          if (seriesColors.indexOf(rect.getAttribute('fill')) > -1) {

            if(rect.getAttribute('fill') == groupColor[label]){
              
            }else {
              // Decrease Opacity on the other category
              rect.setAttribute('fill', rgbaMap[rect.getAttribute('fill')]);
            }
          }
        });

        // Point Shapes For circles
        Array.prototype.forEach.call(chartDiv.getElementsByTagName('circle'), function(rect) {
          // console.log(rect)

          // Points
          if (seriesColors.indexOf(rect.getAttribute('fill')) > -1) {

            if(rect.getAttribute('fill') == groupColor[label]){
              
            }else {
              // Decrease Opacity on the other category
              rect.setAttribute('fill', rgbaMap[rect.getAttribute('fill')]);
            }
          }
        });
      }
    }

    function unselect(){
      Array.prototype.forEach.call(chartDiv.getElementsByTagName('path'), function(rect) {
        if(rect.getAttribute('stroke') in swap(rgbaMap)){
          // console.log(rect.getAttribute('stroke'))
          rect.setAttribute('stroke', swap(rgbaMap)[rect.getAttribute('stroke')])
        }
        // Intervals
        if(rect.getAttribute('stroke') == 'rgba(0,0,0,0.2)' ){
          rect.setAttribute('stroke', '#000000');
        }
      });

      Array.prototype.forEach.call(chartDiv.getElementsByTagName('path'), function(rect) {
        if(rect.getAttribute('fill') in swap(rgbaMap)){
          // console.log(rect.getAttribute('stroke'))
          rect.setAttribute('fill', swap(rgbaMap)[rect.getAttribute('fill')])
        }
       
      });

      Array.prototype.forEach.call(chartDiv.getElementsByTagName('circle'), function(rect) {
        if(rect.getAttribute('fill') in swap(rgbaMap)){
          // console.log(rect.getAttribute('stroke'))
          rect.setAttribute('fill', swap(rgbaMap)[rect.getAttribute('fill')])
        }
       
      });
    }

    
    google.visualization.events.addListener(comboChart, 'ready', function(){
      google.visualization.events.addListener(comboChart.getChart(), 'onmouseover', function(e){
        selected(e.column)
      });
    })

    // Undo what I did with onmouseover
    google.visualization.events.addListener(comboChart, 'ready', function(){
      google.visualization.events.addListener(comboChart.getChart(), 'onmouseout', function(e){
        
        unselect()
      });
    })

    
    google.visualization.events.addListener(comboChart, 'select', function(){
      select = dashboard.getSelection()
      
      console.log('selected')
      // Make the rest of the lines decrease opacity when current 
      // column is selected.
      // console.log(selected)

      
      // if length is 0, we deselected
      if (select.length > 0){
        // if row is undefined, we clicked the legend
        if(select[0].row == undefined){
          selected(select[0].column)
        }
      
      }else {
        unselect()
      }
      
    });

    google.visualization.events.addListener(comboChart, 'ready', function(){
      document.getElementById('download1').href = comboChart.getChart().getImageURI();
      document.getElementById('download1').download = "LifeChart-Overall-Mood"
    });


    $('#anxiety').change(function() {
        eventstring = 'Anxiety'
         if($(this).is(":checked")) {
            //'checked' event code
            groupSelected.push(eventstring)
            //console.log('drugs checked')
            groupCategoryFilter.setState({'selectedValues' : groupSelected })
            groupCategoryFilter.draw()
         } else {
          //'unchecked' event code
           //console.log('drugs unchecked')
           // Remove Drugs and Alcohol From the selected values
           index = groupSelected.indexOf(eventstring)
           if (index > -1){
            groupSelected.splice(index, 1)
           }
          groupCategoryFilter.setState({'selectedValues' : groupSelected})
          groupCategoryFilter.draw()
         }
         
        //console.log(groupSelected)
      });

    $('#comorbig').change(function() {
        eventstring = 'Comorbid Depression + Anxiety'
         if($(this).is(":checked")) {
            //'checked' event code
            groupSelected.push(eventstring)
            //console.log('drugs checked')
            groupCategoryFilter.setState({'selectedValues' : groupSelected })
            groupCategoryFilter.draw()
         } else {
          //'unchecked' event code
           //console.log('drugs unchecked')
           // Remove Drugs and Alcohol From the selected values
           index = groupSelected.indexOf(eventstring)
           if (index > -1){
            groupSelected.splice(index, 1)
           }
          groupCategoryFilter.setState({'selectedValues' : groupSelected})
          groupCategoryFilter.draw()
         }
         
        //console.log(groupSelected)
      });

    $('#depression').change(function() {
        eventstring = 'Depression'
         if($(this).is(":checked")) {
            //'checked' event code
            groupSelected.push(eventstring)
            //console.log('drugs checked')
            groupCategoryFilter.setState({'selectedValues' : groupSelected })
            groupCategoryFilter.draw()
         } else {
          //'unchecked' event code
           //console.log('drugs unchecked')
           // Remove Drugs and Alcohol From the selected values
           index = groupSelected.indexOf(eventstring)
           if (index > -1){
            groupSelected.splice(index, 1)
           }
          groupCategoryFilter.setState({'selectedValues' : groupSelected})
          groupCategoryFilter.draw()
         }
         
        //console.log(groupSelected)
      });
    $('#eating').change(function() {
        eventstring = 'Eating +'
         if($(this).is(":checked")) {
            //'checked' event code
            groupSelected.push(eventstring)
            //console.log('drugs checked')
            groupCategoryFilter.setState({'selectedValues' : groupSelected })
            groupCategoryFilter.draw()
         } else {
          //'unchecked' event code
           //console.log('drugs unchecked')
           // Remove Drugs and Alcohol From the selected values
           index = groupSelected.indexOf(eventstring)
           if (index > -1){
            groupSelected.splice(index, 1)
           }
          groupCategoryFilter.setState({'selectedValues' : groupSelected})
          groupCategoryFilter.draw()
         }
         
        //console.log(groupSelected)
      });

    $('#healthy').change(function() {
        eventstring = 'Healthy Control '
         if($(this).is(":checked")) {
            //'checked' event code
            groupSelected.push(eventstring)
            //console.log('drugs checked')
            groupCategoryFilter.setState({'selectedValues' : groupSelected })
            groupCategoryFilter.draw()
         } else {
          //'unchecked' event code
           //console.log('drugs unchecked')
           // Remove Drugs and Alcohol From the selected values
           index = groupSelected.indexOf(eventstring)
           if (index > -1){
            groupSelected.splice(index, 1)
           }
          groupCategoryFilter.setState({'selectedValues' : groupSelected})
          groupCategoryFilter.draw()
         }
         
        //console.log(groupSelected)
      });

    $('#substance').change(function() {
        eventstring = 'Substance +'
         if($(this).is(":checked")) {
            //'checked' event code
            groupSelected.push(eventstring)
            //console.log('drugs checked')
            groupCategoryFilter.setState({'selectedValues' : groupSelected })
            groupCategoryFilter.draw()
         } else {
          //'unchecked' event code
           //console.log('drugs unchecked')
           // Remove Drugs and Alcohol From the selected values
           index = groupSelected.indexOf(eventstring)
           if (index > -1){
            groupSelected.splice(index, 1)
           }
          groupCategoryFilter.setState({'selectedValues' : groupSelected})
          groupCategoryFilter.draw()
         }
         
        //console.log(groupSelected)
      });
    $('#subjectline').change(function() {
      eventstring = 'Subject'
        if($(this).is(":checked")) {
          //'checked' event code
          groupSelected.push(eventstring)
          //console.log('drugs checked')
          groupCategoryFilter.setState({'selectedValues' : groupSelected })
          groupCategoryFilter.draw()
        } else {
        //'unchecked' event code
          //console.log('drugs unchecked')
          // Remove Drugs and Alcohol From the selected values
          index = groupSelected.indexOf(eventstring)
          if (index > -1){
          groupSelected.splice(index, 1)
          }
        groupCategoryFilter.setState({'selectedValues' : groupSelected})
        groupCategoryFilter.draw()
        }
        
      //console.log(groupSelected)
    });



    $('#line-decrease').click(function(){
      linewidth = linewidth - 1;

      var opt = comboChart.getOptions()
      opt['lineWidth'] = linewidth
      //console.log(opt)
      comboChart.setOptions(opt)
      comboChart.draw()
      //alert('less than!');

    })
    $('#line-reset').click(function(){
      linewidth = 4
      var opt = comboChart.getOptions()
      opt['lineWidth'] = linewidth
      //console.log(opt)
      comboChart.setOptions(opt)
      comboChart.draw()
      //alert('less than!');

    })

    $('#line-increase').click(function(){
      linewidth = linewidth + 1;
      var opt = comboChart.getOptions()
      opt['lineWidth'] = linewidth
      //console.log(opt)
      comboChart.setOptions(opt)
      comboChart.draw()
      //alert('less than!');

    })

    

    $('#font-decrease').click(function(){
      
      var opt = comboChart.getOptions()
      //fontsize = opt['fontSize']
      //console.log(opt)
      fontsize = fontsize - 1
      // //console.log(opt)
      opt['fontSize'] = fontsize
      comboChart.setOptions(opt)
      comboChart.draw()
      //alert('less than!');

    })

    $('#font-reset').click(function(){
      var opt = comboChart.getOptions()
      //fontsize = opt['fontSize']
      //console.log(opt)
      fontsize = 13
      // //console.log(opt)
      opt['fontSize'] = fontsize
      comboChart.setOptions(opt)
      comboChart.draw()
      //
    })

    $('#font-increase').click(function(){
      var opt = comboChart.getOptions()
      //fontsize = opt['fontSize']
      //console.log(opt)
      fontsize = fontsize + 1
      // //console.log(opt)
      opt['fontSize'] = fontsize
      comboChart.setOptions(opt)
      comboChart.draw()
      //
    })
}