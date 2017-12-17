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
	      '&key=AIzaSyA4O-tIUQjMlly1wgWTU-TP5H0MHhLa8gs&callback=Main.initMaps&language=ru&region=RU';
	  document.body.appendChild(script);
	},
	initMaps: function() {
		var myOptions = {
            zoom: 14,
            center: new google.maps.LatLng(59.94591,30.4153683),
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
						"color": "#41b3d3"
					}
				]
			}
			]
        };
		var map = new google.maps.Map(Main.gmap[0], myOptions); 
        var marker = new google.maps.Marker({
            map: map,
			position: new google.maps.LatLng(59.94591,30.4153683),
			
		});
        var infowindow = new google.maps.InfoWindow({
            content: "<div class='gmaps-infocontent'>"+" Школа №515 с углублённым изучением немецкого языка имени Иоганна Вольфганга Гёте"+"</div>"
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
				    url: "//formspree.io/eshelevakho@gmail.com", 
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



}

$(document).ready(function() {
	Main.maps();
	Main.questions();
	Main.mailforms();

});
