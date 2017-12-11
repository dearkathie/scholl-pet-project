var Main = {
	gmap: $('#gmap_canvas'),
	maps: function() {
	    if(Main.gmap.length) {
	    	Main.loadMapsScript();
	    }
	},
	loadMapsScript: function() {
	  var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
	      '&key=AIzaSyAnqPtX4niilu-1QFi-q6MaMXPibVFB780&callback=Main.initMaps';
	  document.body.appendChild(script);
	},
	initMaps: function() {
		var myOptions = {
            zoom: 14,
            center: new google.maps.LatLng(52.377113, 4.920359),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: [
				{
					"featureType": "landscape.natural",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#e0efef"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"hue": "#1900ff"
						},
						{
							"color": "#c0e8e8"
						}
					]
				},{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"lightness": 100
					},
					{
						"visibility": "simplified"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "labels",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "on"
					},
					{
						"lightness": 700
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "all",
				"stylers": [
					{
						"color": "#46CDCF"
					}
				]
			}
			]
        };
		var map = new google.maps.Map(Main.gmap[0], myOptions);
		var pinIcon = new google.maps.MarkerImage(
			'/img/icons/pin.svg',
			null, 
			null, 
			null, 
			new google.maps.Size(18, 26)
		);  
        var marker = new google.maps.Marker({
            map: map,
			position: new google.maps.LatLng(52.377113, 4.920359),
			icon: pinIcon
		});
        var content = $('address').html();
        var infowindow = new google.maps.InfoWindow({
            content: "<div class='gmaps-infocontent'>"+content+"</div>"
        });
        google.maps.event.addListener(marker, "click", function() {
            infowindow.open(map, marker);
        });
        infowindow.open(map, marker);
	},
	scrollMenu: function() {
		if(!$('.navbar').hasClass('navbar-abs-top') && !$('.navbar').hasClass('inverted')) {
			$(window).scroll(function(e) {
				if($(window).scrollTop() > 680) {
					$('.navbar').addClass('inverted');
				} else {
					$('.navbar').removeClass('inverted');
				}
			});
		}
	},
	mailforms: function() {
		$('form.mail').submit(function(e) {
			e.preventDefault();
			var form = $(this);

			var data = {};
			var valid = true;
			form.removeClass('error');
			form.find('input, textarea').each(function() {
				e.preventDefault();
				if($(this).attr('data-required') == "true" && $(this).val() == "") {
					valid = false;
					$(this).addClass('error');
				}
			});

			if(valid) {
				form.serializeArray().forEach(function(input) {
					data[input.name] = input.value;
				});

				$.ajax({
				    url: "//formspree.io/info@crobox.com", 
				    method: "POST",
				    data: data,
				    dataType: "json"
				})
				.done(function( data ) {
					if(data.success) {
						form.css('display','none');
						$("#complete-contact-message span.complete-message").addClass('complete');
						if(form.hasClass('demomail') && window.parent) {
							window.parent.openDemo(form.find('input[name=email]').val());
						}
						if(form.parent("#ic").length) {
							$("#ic, #complete-contact-message").addClass("done");
						} else {
							form.find(".complete-contact-message").addClass("done");
						}
						form.find('input[type=submit]').removeAttr('disabled');
						if(fbq) {
							fbq('track', 'Lead');
						}
					}
				});
			} else {
				e.preventDefault();
				form.addClass('error');
				form.find('input[type=submit]').removeAttr('disabled');
			}
		});

		$('form.mail input, form.mail textarea').focus(function() {
			$(this).removeClass('error');
		});	
	},

	questions: function() {
		if($('#questions').length) {
			$('#questions .question').each(function(index, question) {
				var answer = $(question).find('.answer').first();
					answer.attr('data-height', answer.height());

				if(index || window.innerWidth < 500) {
					$(question).addClass('closed');
				} else {
					answer.css('height', answer.height() + "px");
				}
			});
			$('#questions .toggle, #questions h2').click(function() {
				var question = $(this).parents('.question').first(),
					answer = question.find('.answer').first(),
					open = false;


				if(!question.hasClass('closed')) {
					open = true;
				}

				$('#questions .question').addClass('closed');
				$('#questions .question .answer').css('height', 0);
				
				if(!open) {
					question.removeClass('closed');
					answer.css('height', answer.attr('data-height') + "px");
				}
			});
		}
	},
	requiredSignUp: function(){
		$('#signup-form input').on('change invalid', function(e){
			e.preventDefault();
			var textfield = $(this).get(0);

			if (!textfield.validity.valid) {
				$(this).addClass('required');  
				$(this).next().css({'opacity':'1'});  
			}	
		})

		$('#signup-form input').focusout(function() {
    		if (! $(this).val() ) {
				$(this).addClass('required');  
				$(this).next().css({'opacity':'1'});  
   			} else {
				$(this).removeClass('required');  
				$(this).next().css({'opacity':'0'});   
			   }
		});

		$("#signup-form").submit(function(e) {
			e.preventDefault();
			
			var form = $(this);

			var data = {};
			var valid = true;


				form.serializeArray().forEach(function(input) {
					data[input.name] = input.value;
				});
				
				$.ajax({
				    url: "https://formspree.io/sales@crobox.com", 
				    method: "POST",
				    data: data,
				    dataType: "json"
				})
				.done(function( data ) {
					if(data.success) {
						$("#form-message").addClass('hide');
						$('#complete-message').addClass('show'); 
					}
				});

		});


	},

	features: function() {
		$('#feature-set li').click(function() {
			$('#feature-set li').removeClass('active');
			$(this).addClass('active');

			$('#feature-set video').first().attr('src', $(this).attr('data-video'));
		});
	},
	demo: function() {
		$('.demo').click(function(e) {
			e.preventDefault();
			if($(e.currentTarget).hasClass('subscribe')) {
				document.cookie = 'viewedOuibounceModal=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				setTimeout(function() {
					window.exitintent.fire();
				}, 100);
				
			} else {
				
				$('#signup').addClass("show");
				$('#signup').removeClass("hidden");
			}
			var offcanvas = $('.navbar-offcanvas').data('bs.offcanvas');
			if(offcanvas) offcanvas.hide();
		});


		$(document).on('animationend', "#signup", 
		    function (evnt) {
		        var $faded = $(evnt.target);
		        if (!$faded.hasClass("show")) {
		            $faded.addClass("hidden");
		            $faded.removeClass("hider");
		        }
		});
	},

	subscriptionPost: function(){

		$('#newsletter input').on('change invalid', function(e){
			e.preventDefault();
			var textfield = $(this).get(0);

			if (!textfield.validity.valid) {
				$(this).addClass('required');  
				$('p.required-error').css({'opacity':'1'});
			} else {
				$(this).removeClass('required');  
				$('p.required-error').css({'opacity':'0'});
			}
		})

		$("#newsletter").submit(function(e) {
			$("#newsletter").addClass('hide');
			$('#subscription-success').addClass('show'); 
		})
	},

}

$(document).ready(function() {
	Main.maps();
	Main.scrollMenu();
	Main.subscriptionPost();
	Main.questions();
	Main.features();
	Main.demo();
	Main.mailforms();

	Main.requiredSignUp();

	// window.openDemo = Main.openDemo;
	// window.closeDemo = Main.closeDemo;
});
