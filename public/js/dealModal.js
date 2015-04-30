/**
 * JQuery Plugin for a modal box
 * Will create a simple modal box with all HTML and styling
 * 
 * Author: Paul Underwood
 * URL: http://www.paulund.co.uk
 * 
 * Available for free download from http://www.paulund.co.uk
 */

(function($){

	// Defining our jQuery plugin

	$.fn.setDeal = function(prop){

		// Default parameters

		var options = $.extend({
			height : "500",
			width : "600",
			title:"ExitNow - Set a Deal",
			description: "Please wait the Deal Wizard is Loading..",
			top: "10%",
			left: "25%",
		},prop);
				
		//Click event on element
		return this.click(function(e){
			add_block_page();
			add_popup_box();
			add_styles();
			
			$('.setDealBox').fadeIn();
		});
		
		/**
		 * Add styles to the html markup
		 */
		 
		 
		 function add_styles(){			
			$('.setDealBox').css({ 
				'position':'absolute', 
				'left':options.left,
				'top':options.top,
				'display':'none',
				'height': options.height + 'px',
				'width': options.width + 'px',
				'border':'1px solid #fff',
				'box-shadow': '0px 2px 7px #292929',
				'-moz-box-shadow': '0px 2px 7px #292929',
				'-webkit-box-shadow': '0px 2px 7px #292929',
				'border-radius':'10px',
				'-moz-border-radius':'10px',
				'-webkit-border-radius':'10px',
				'background': '#f2f2f2', 
				'z-index':'5000',
			});
			$('.setDealClose').css({
				'position':'relative',
				'top':'-25px',
				'left':'20px',
				'float':'right',
				'display':'block',
				'height':'50px',
				'width':'50px',
				'background': 'url(assets/close.png) no-repeat',
			});
			
			var pageHeight = $(document).height();
			var pageWidth = $(window).width();
			
			$('.setDealBlockPage').css({
				'position':'absolute',
				'top':'0',
				'left':'0',
				'background-color':'rgba(0,0,0,0.6)',
				'height':'100%',
				'width':'100%',
				'z-index':'10'
			});
			$('.setDealInnerModalBox').css({
				'background-color':'#fff',
				'height':(options.height - 50) + 'px',
				'width':(options.width - 50) + 'px',
				'padding':'10px',
				'margin':'15px',
				'border-radius':'10px',
				'-moz-border-radius':'10px',
				'-webkit-border-radius':'10px'
			});
		}
		
		 /**
		  * Create the block page div
		  */
		 function add_block_page(){
			var block_page = $('<div class="setDealBlockPage"></div>');
						
			$(block_page).appendTo('body');
		}
		 	
		 /**
		  * Creates the modal box
		  */
		 function add_popup_box(){
			 var pop_up = $('<div class="setDealBox"><a href="#" class="setDealClose"></a><div class="setDealInnerModalBox"><h2>' + options.title + '</h2><p>' + options.description + '</p></div></div>');
			 $(pop_up).appendTo('.setDealBlockPage');             
			 
			 $.ajax(
               {
                           url: ('/deal'),
                           method: "GET",
                           success: function(page){
                           	 $('.setDealInnerModalBox').html(page).fadeIn(500);
                           },
                           error: function (msg, url, line) {
                             console.log('input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                           }
              });
 
			 $('.setDealClose').click(function(){
				$(this).parent().fadeOut().remove();
				$('.setDealBlockPage').fadeOut().remove();				 
			 });
		}

		return this;
	};
	
})(jQuery);
