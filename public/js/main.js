//our Hack Demo
function getTraffic(segment){
    if(!segment){ var segment=31; }
    
       //get Data today
       var state = {};
       var dateRange = '04/26/2015';  //TODO populate date range
       $.ajax({
                    url: ('/api/state/search?setdate='+dateRange+'&segment='+segment),
                    method: "GET",
                    success: function(res) {
                       state = res;
                       
                       var dataSpeed = new Array();
                       var dataSpeedTime = new Array();
                       var dataState = new Array();

                       var i=0; for(var time in state){
                        if(i<=65){
                            var timeData = state[time].CalculatedDate.split("T");
                            var timeOfDay = timeData[1].split(":");
                            dataSpeedTime.push(timeOfDay[0]+':'+timeOfDay[1]);
                              if(state[time].Conditions[0].AverageVolume<=0){state[time].Conditions[0].AverageVolume=1;}
                              if(state[time].Conditions[0].AverageSpeed<=0){state[time].Conditions[0].AverageSpeed=1;}
                            dataState.push((state[time].Conditions[0].AverageVolume)*10);
                            dataSpeed.push(state[time].Conditions[0].AverageSpeed); 
                         i++;
                         }       
                       }

                      var chartData = {
		                data: {
		                 dateFormat: 'mm/dd/YYYY'
		                },
		               chart: {
			           type: 'line',
		        	   width: 860,
			           height: 215
		               },
		               title: {
			            text: 'cDot Traffic Conditions in your area'
		               },
		               xAxis: {
			            labels: {
                          autoRotation: [-45],
                          autoRotationLimit: 200,
			              enabled:false,
			            },
			            categories: dataSpeedTime,
			            title:{
			                text: 'Time (4am - 9am)',
			            }
			           },
		               yAxis: {
			             floor:0,
			             title: {
				           text: 'Volume of Cars'
			             }
		              },
		              series: [{
			            name: 'Speed (cDOT Average Mph)',
			            data: dataSpeed
		                }, {
			            name: 'Volume (Cars on road)',
			            data: dataState
		              }]
                    };

                    //show chart
                    $('#getTraffic').highcharts(chartData).fadeIn('500');

                    },
                    error: function (msg, url, line) {
                       alert('State add error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
       });   
    
}


$(document).ready(function() {

  //deal type tabs
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});

  // Show chart for cDOT data    
    if($('#getTraffic')){
      getTraffic(31);
    }


  // modal for setDeal
  $('.setDeal').setDeal();


});
