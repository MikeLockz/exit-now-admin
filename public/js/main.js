//our Hack Demo
function setDealEst(weather,distance,traffic,segment){
    
      var myDate = new Date();
      $('#dealestview').hide();
      
      $.ajax({
        url: ('/api/state/search?setdate='+(myDate.getMonth()+1)+'/'+myDate.getDate()+'/'+myDate.getFullYear()+'&segment='+segment),
        method: "GET",
          success: function(res) {
            //TODO: triggers based on last week

            //dummy display
            html = ('<blockquote style="color:green;">');
              html = (html+'Your Area may be <u><b>Yellow - 25-50mph</b></u> in a <b><u>30 Mile radius</u></b> about [<u><b>5</b></u>] times with [<u><b>500+ cars</b></u>] each time<br>');
              html = (html+'The Forecast is calling for <u><b>Snow</b></u> [<u><b>4</b></u>] times this week<br>');
              html = (html+'<b>Total Estimated Deals to be pushed: [<u>4,500</u>] over [<u>9</u>] seperate times!</b>');
            html = (html+'</blockquote>');
            
            $('#dealestview').html(html).fadeIn('700');
          },
          error: function (msg, url, line) {
            alert('There was an error estimating traffic today - Please check back later ' + msg + ', url = ' + url + ', line = ' + line);
          }
      });

}


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
	
  //Estimate traffic for a deals triggers
    $('#distance').change(function() {
      setDealEst($('#roadConditions').val(),$('#distance').val(),$('#traffic').val(),31);
    });
    $('#traffic').change(function() {
      setDealEst($('#roadConditions').val(),$('#distance').val(),$('#traffic').val(),31);
    });
    $('#roadConditions').change(function() {
      setDealEst($('#roadConditions').val(),$('#distance').val(),$('#traffic').val(),31);
    });

    setDealEst($('#roadConditions').val(),$('#distance').val(),$('#traffic').val(),31);

    
  // Show chart for cDOT data    
    if($('#getTraffic')){
      getTraffic(31);
    }


   /* Hack to view the current deals and prediction graph admin demo */
   $.ajax(
                {
                    url: ('/api/deals/foruser'),
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function(data) { renderDeals(data); },
                    error: function (msg, url, line) {
                       console.log('input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });


   /*$.get( "/api/deals/foruser", function( data ) {
        $("#dealview").html('Hello World'+jQuery.parseJSON(data));
   });*/
      
  $(document).on('click','.removeToggle',function(){
  	var currentId=this.id;
  	 $(".removeToggle").each(function(e){
   	    if(currentId==this.id){
   	    	
   	      if(confirm('Are you Sure you want to delete this Deal?')) {
             var ids = currentId.split("_");
             var token = $('#token').val();
             $.ajax(
                {
                    url: ('/api/deals/delete'),
                    method: "POST",
                    data: {_csrf:token,dealId:ids[0]},
                    success: function() {
                       $("#dealview").hide(); 
                    },
                    error: function (msg, url, line) {
                       console.log('Delete error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });
             $.ajax(
               {
                           url: ('/api/deals/foruser'),
                           method: "GET",
                           headers: { "Accept": "application/json; odata=verbose" },
                           success: function(data) { renderDeals(data); },
                           error: function (msg, url, line) {
                             console.log('input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                           }
              });
   	      } else { return false; }

   	    }
   	
      });
 
    });
      
});


function renderDeals(data){
        var html = '';
                        for (var key in data) {
                          if (data.hasOwnProperty(key)) {
                           
                           var plUsed = Math.floor(Math.random()*(data[key].maxCoupon-1+1)+1); 
                           var curDate = new Date();
                           var Expire = new Date(data[key].dateExpires);
                           var ExpireDisp = (Expire.getMonth()+'/'+Expire.getDate()+'/'+Expire.getFullYear()+' @ '+Expire.getHours()+':'+Expire.getMinutes()+':'+Expire.getSeconds()); 
                           
                           html = (html+'<div class="dealbar ');
                             if(Expire < curDate){ html = (html+'expired'); }
                             else if(data[key].active===false){ html = (html+'unactive'); }
                           html = (html+'"><h2>'+data[key].dealData.name+'</h2>');
                           html = (html+'<span class="small">'+data[key].dealData.description+'</span>');
                           html = (html+' - <b>By: '+data[key].dealData.businessName+'</b>');
                           html = (html+'<div class="right">');
                           html = (html+'<span class="strong">Shown [4] Times - '+plUsed+' Interests of: '+data[key].maxCoupon+'</span><br>');
                             if(Expire < curDate){ html = (html+'<span class="red"><i><b><u>EXPIRED: '+ExpireDisp+'</u></b></i></span>'); }
                             else{ html = (html+'<i><b><u>Expires: '+ExpireDisp+'</u></b></i>'); }
                           html = (html+'<button id="'+data[key]._id+'_delete" class="removeToggle">Remove This Deal</button>');
                           html = (html+'</div></div><br>');
                          
                          }
                        }
                     $("#dealview").html(html).fadeIn(500);
                     
}