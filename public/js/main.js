//our Hack Demo
function setChartData(stamp,city){
  
  if(stamp){ var stamps = stamp.split("/"); var chartDate = new Date(stamps[2],stamps[0],stamps[1]); var starting = 2; }else{ var chartDate = new Date(); var starting = 1; }
  if(!city){ var city = 'West Vail'; var segment = 31; }
       
      //get Data today
       var state;
       $.ajax({
                    url: ('/api/state/search?setdate='+(chartDate.getMonth()+1)+'/'+chartDate.getDate()+'/'+chartDate.getFullYear()+'&segment='+segment),
                    method: "GET",
                    success: function(res) {
                       state = res;
                       
                       var dataSpeed = new Array();
                       var dataSpeedTime = new Array();
                       var dataCond = new Array();
                       var dataCondTime = new Array();
                       var dataState = new Array();
                       var i = 0;
                        
                        for(var time in state){
                            
                            var timeData = state[time].CalculatedDate.split("T");
                            var timeOfDay = timeData[1].split(":");
                            dataSpeedTime.push(timeOfDay[0]+':'+timeOfDay[1]);

                            dataState.push((state[time].Conditions[0].AverageVolume)*2);
                              
                        }

                        
                        
                        for (var key in speeds) {
                          if(i<60 && starting==1){
                              
                             var currentAlgo = (speeds[key].AverageVolume*1);
                               if(currentAlgo<0){ currentAlgo=1; }
                             
                             dataSpeed.push(currentAlgo);
                             dataSpeedTime.push(key);

                             if(i>8 && i<22){     //simulate snowstorm
                               calc = i*1.15;        //factoral
                               dataCond.push(calc*i);
                             }else{
                               dataCond.push(10);
                             }
                          }else if(i>100 && i<160 && starting==2){

                             var currentAlgo = (speeds[key].AverageVolume*1);
                               if(currentAlgo<0){ currentAlgo=1; }
                             
                             dataSpeed.push(currentAlgo);
                             dataSpeedTime.push(key);

                             dataCond.push(10);
                          }
                          i++;

                        }


  var nowDate = new Date();
  var nextDate = new Date();
  var nowDateTime =  (chartDate.getMonth()+'/'+chartDate.getDate()+'/'+chartDate.getFullYear()+' @ '+chartDate.getHours()+':'+chartDate.getMinutes()+':'+chartDate.getSeconds());
  var chartDateDisp = (chartDate.getMonth()+'/'+chartDate.getDate()+'/'+chartDate.getFullYear());
    if(starting==1){ nextDate.setDate(nextDate.getDate()+30);  } // 30 days out as 2nd example
    else{ nextDate = nowDate; }
  var nextDateDisp = (nextDate.getMonth()+'/'+nextDate.getDate()+'/'+nextDate.getFullYear());
  var chartDateDisp = (chartDate.getMonth()+'/'+chartDate.getDate()+'/'+chartDate.getFullYear());

  var titleHtml = '<div id="chartTitleBar">Show: ';
  titleHtml = (titleHtml+'<select id="toggleTheDate" name="toggleDate">');
  titleHtml = (titleHtml+'<option value="'+chartDateDisp+'" class="'+city+'" SELECTED>'+chartDateDisp+'</option>');
  titleHtml = (titleHtml+'<option value="'+nextDateDisp+'" class="'+city+'">'+nextDateDisp+'</option>');
  titleHtml = (titleHtml+'</select> For '+city);
  titleHtml = (titleHtml+'<input type="hidden" name="usercity" id="usercity" value="'+city+'">');

  if(starting==1){
    var barHtml = '<div id="chartbar"><li style="left:200px;"><a href="/deal">MAKE AUTO TRIGGER &raquo;</a></li>';
    var barHtml = (barHtml+'<li style="left:550px; width:300px;"><a href="/deal">MAKE AUTO TRIGGER &raquo;</a></li></div></div>');
      
  }else{
    var barHtml = '<div id="chartbar"><li style="left:800px;"><a href="/deal">MAKE AUTO TRIGGER &raquo;</a></li></div></div>';
  }
  
  titleHtml = (titleHtml+barHtml);

var chartData = {
		data: {
		    dateFormat: 'mm/dd/YYYY'
		},
		chart: {
			type: 'line',
			width: 1100,
			height: 450
		},
		title: {
			text: 'Here are Todays Anticipated Trigger Opportunities<br>'+chartDateDisp+' - '+city
		},
		xAxis: {
			categories: ["Time"]
		},
		yAxis: {
			title: {
				text: 'Intensity'
			}
		},
		series: [{
			name: 'Historical Traffic Trend (cDOT Volume)',
			data: dataSpeed
		}, {
			name: 'Condition Forecast (Cars on segment at Time)',
			data: dataState
		}]
	  };
	  

 $('#container').highcharts(chartData).before(titleHtml).fadeIn('700');
 $('#chartBar').html(barHtml);

                    },
                    error: function (msg, url, line) {
                       alert('State add error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });
   
  

    
}


$(document).ready(function() {

  // Place JavaScript code here...
  	$(function () {
 
setChartData();

$('#toggleTheDate').change(function() {
    var dateSel = $(this).val();
    var city = $('#usercity').val();
         alert('see me');
     $('#chartTitleBar').hide();
     $('#container').hide();
     $('#chartBar').hide();
     setChartData(dateSel,city);
});



$('#testAddState').click(function(){
    
    var token = $('#token').val();
                 $.ajax(
                {
                    url: ('/api/state/add'),
                    method: "POST",
                    data: {
                     _csrf:token,
                     SegmentId: 31,
                     CalculatedDate: '2015-04-15T12:45:30.000-06:10',
                     AverageSpeed: 66.44,
                     AverageTrafficFlow: 80,
                     IsSlowDown: false,
                     RoadCondition: 8,
                     ExpectedTravelTime: 3,
                     AverageOccupancy: 4
                    },
                    success: function(res) {
                       alert('Saved State Data Thanks'+JSON.stringify(res));
                    },
                    error: function (msg, url, line) {
                       alert('State add error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });

});


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
                           html = (html+'<span class="strong">'+plUsed+' Interests of: '+data[key].maxCoupon+'</span><br>');
                             if(Expire < curDate){ html = (html+'<span class="red"><i><b><u>EXPIRED: '+ExpireDisp+'</u></b></i></span>'); }
                             else{ html = (html+'<i><b><u>Expires: '+ExpireDisp+'</u></b></i>'); }
                           html = (html+'<button id="'+data[key]._id+'_delete" class="removeToggle">Remove This Deal</button>');
                           html = (html+'</div></div><br>');
                          
                          }
                        }
                     $("#dealview").html(html).fadeIn(500);
                     
}