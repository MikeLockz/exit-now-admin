
















$(document).ready(function() {

  // Place JavaScript code here...
  	$(function () { 
 
  //ur HackDemo! 		
  var triggers = {
  'roadConditions': {
    '0':'Slide',
    '1':'Closed',
    '2':'Blowing Snow',
    '3':'Icy',
    '4':'Icy Spots',
    '5':'Snow',
    '6':'Snow Packed',
    '7':'Snow Packed Icy Spots',
    '8':'Poor Visibility',
    '9':'High Wind',
    '10':'Scattered Showers',
    '11':'Rain',
    '11':'Wet',
    '11':'Slushy',
    '11':'Dry'
  },
  'traffic': {
    '1':'Green - Over 50mph',
    '2':'Yellow - 25-50mph',
    '3':'Red - 15-25mph',
    '4':'Black - 0-15mph'
  },
  'distance': {
    '0':'1 mile',
    '1':'2 miles',
    '2':'5 miles',
    '3':'10 miles',
  }
}
	  $('#container').highcharts({
		chart: {
			type: 'line'
		},
		title: {
			text: 'Todays Anticipated Travel Conditions'
		},
		xAxis: {
			categories: ['Traffic', 'Conditions']
		},
		yAxis: {
			title: {
				text: 'What to Expect'
			}
		},
		series: [{
			name: 'traffic',
			data: [1, 0, 4]
		}, {
			name: 'Time',
			data: [5, 7, 3]
		}]
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