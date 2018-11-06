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
//console.log(subject);

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
    $('#homenav').attr('href','chart.html?subject=' + subject.toUpperCase())
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
    $.get('public/overallData/overallMood.csv', function(data){
      resolve(data)
    });
  }).then(
    function (result) {
      fileArray = stringToArray(result) // send counts to the fileArray variable
      return new Promise((resolve, reject) => {
        $.get('public/subjectsData/' + subject + '/' + subject + '-mood.csv', function (data) {
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
  //console.log(finalData)
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
  
  serieslines = {}
  if (subject != 'NULL'){
    serieslines = {
      0 : {
        type: 'line'
      },
      1 : {
        type : 'line'
      },
      2 : {
        type : 'line'
      },
      3 : {
        type : 'line'
      },
      4 : {
        type : 'line'
      },
      5 : {
        type : 'line'
      },
      6 : {
        type : 'line'
      }
    }
  }else {
    serieslines = {
      0 : {
        type: 'line'
      },
      1 : {
        type : 'line'
      },
      2 : {
        type : 'line'
      },
      3 : {
        type : 'line'
      },
      4 : {
        type : 'line'
      },
      5 : {
        type : 'line'
      }
    }
  }

  // console.log(finalData)
  data.addRows(finalData);
  var linewidth = 4;
  var fontsize = 13
  var chartoptions = {
    //curveType: 'function',
    'intervals': { 'style' : 'bars' },
    'lineWidth': linewidth,
    'fontSize' : fontsize,
    'chartArea' : {
      left: 30,
      top: 30,
      width: '100%'

    },
    'hAxis': { 
      ticks : [
        {v: 0, f: ''},
        {v: 1, f: 'Birth-Elementary School'},
        {v: 2, f: 'Elementary School'},
        {v: 3, f: 'Middle School'},
        {v: 4, f: 'High School'},
        {v: 5, f: 'Young Adult'},
        {v: 6, f: '25-35'},
        {v: 7, f: '35-45'},
        {v: 8, f: '45-55'},
        {v: 9, f: ''}
      ]
      // ticks : ['Birth-Elementary School','Elementary School',
      // 'Middle School','High School','Young Adult',
      // '25-35','35-45','45-44']
    },
    'series' : serieslines,
    'legend' : { 
      position : 'top'
    }
  }


  var dashboard = new google.visualization.Dashboard(
    document.getElementById('drugs')
    );


  // var chart_lines = new google.visualization.ComboChart(document.getElementById('countchart'));
  // chart_lines.draw(data, chartoptions);



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

    groupSelected = ['Anxiety', 'Comorbid Depression + Anxiety', 'Depression', 'Eating +','Healthy Control ', 'Substance +']

    if (subject != 'NULL'){
      groupSelected.push('Subject')
    }
    groupCategoryFilter.setState({'selectedValues' : groupSelected})

    dashboard.bind(groupCategoryFilter, comboChart);
    dashboard.draw(data);

    google.visualization.events.addListener(comboChart, 'ready', function(){
      document.getElementById('download1').href = comboChart.getChart().getImageURI();
      document.getElementById('download1').download = "LifeChart-Drug-Counts"
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



  //data.addColumn('string', 'Group');
  // data.addColumn('string', 'Period');
  // data.addColumn('number', 'Depression');
  // data.addColumn({id:'i0', type:'number', role:'interval'});
  // data.addColumn({id:'i1', type:'number', role:'interval'});
  // data.addColumn('number', 'Anxiety');
  // data.addColumn({id:'a0', type:'number', role:'interval'});
  // data.addColumn({id:'a1', type:'number', role:'interval'});
  // data.addColumn({type: 'string', id: 'Group', role : 'domain'});
  // // data.addColumn({id:'i2', type:'number', role:'interval'});
  // // data.addColumn({id:'i2', type:'number', role:'interval'});
  // // data.addColumn({id:'i2', type:'number', role:'interval'});
  // // data.addColumn({id:'i2', type:'number', role:'interval'});

  // datatable = [
  //     ['1',  100, 90, 110,null, null, null,'Depression'],
  //     ['2',  120, 95, 130,130, 105, 140,'Anxiety'],
  //     ['3',  130, 105, 140,null, null, null,'Depression'],
  //     ['4',  90, 85, 95,80, 77, 83,'Anxiety'],
  //     ['5',  70, 74, 63,null, null, null,'Depression'],
  //     ['6',  30, 39, 22,130,140, 105,'Anxiety'],
  //     ['7',  80, 77, 83,null, null, null,'Depression'],
  //     ['8',  100, 90, 110,120, 95, 130,'Anxiety']]

  // console.log(datatable);
  // data.addRows(datatable);

  // The intervals data as narrow lines (useful for showing raw source data)
  // var options_lines = {
  //     height: 800,
  //     title: 'Line intervals, default',
  //     curveType: 'function',
  //     lineWidth: 4,
  //     intervals: { 'style':'bars' },
  //     series : {
  //       0: {
  //         type : 'line',
  //         interpolateNulls : true
  //       },
  //       1: {
  //         type : 'line',
  //         interpolateNulls : false
  //       }
  //     }
  //     // legend: 'none'
  // };

  // var chart_lines = new google.visualization.ComboChart(document.getElementById('countchart'));
  // chart_lines.draw(data, options_lines);
}