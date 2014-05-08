/*
 * xtBanner 0.1
 * Based on jQuery 1.11
 */

(function($) {
	
	$.fn.xtBanner = function(options) {

		// Store the current element, we'll need it in our functions
		var xtObj = this;

		// Store the settings in an object, which will be easy to use further on
		var opts = $.extend( {}, defaults, options);
		
		// In this variable we'll store the current active banner item
		var xtActive = opts.start;
		
		// We also need the total number of items
		var xtItems = this.find(opts.item).length;

		// There variables will be used to store the timeout & interval, so we can reset them later
		var xtTimeout, xtInterval;
		
		// This variable will be used to store the animation (if necessary). AV stands for Animation Values (just a reminder)
		var xtAV;
		
		// Add our css class to the banner so everything looks just fine
		this.addClass('xtBanner');
		
		/*
		 * Now lets make our container full sized.
		 * We have to be sure that all items have equal dimensions
		 * ... so we better take care of that!
		 * of course we have to keep in mind that some items can be styled
		 * therefor we'll add the paddings, margins & borders of the items to the width as well
		 */
		var xtMaxItemWidth = 0,
				xtMaxItemHeight = 0;
		this.find(opts.item).each(function() {
			
			var xtItemW = $(this).find(opts.item).width();
					xtItemW += parseFloat($(this).css('paddingLeft')) + parseFloat($(this).css('paddingRight'));
					xtItemW += parseFloat($(this).css('marginLeft')) + parseFloat($(this).css('marginRight'));
					xtItemW += parseFloat($(this).css('borderLeft')) + parseFloat($(this).css('borderRight'));
					
			var xtItemH = $(this).find(opts.item).height();
					xtItemH += parseFloat($(this).css('paddingTop')) + parseFloat($(this).css('paddingBottom'));
					xtItemH += parseFloat($(this).css('marginTop')) + parseFloat($(this).css('marginBottom'));
					xtItemH += parseFloat($(this).css('borderTop')) + parseFloat($(this).css('borderBottom'));
		
			if($(this).width() > xtMaxItemWidth) {
				xtMaxItemWidth = $(this).width();
			}
			
			if($(this).height() > xtMaxItemHeight) {
				xtMaxItemHeight = $(this).height();
			}
			
		});
			
		this.find(opts.item).css({
			'width'		: xtMaxItemWidth,
			'height'	: xtMaxItemHeight
		});
				
		this.css({
			'width'		: xtMaxItemWidth,
			'height'	: xtMaxItemHeight
		});
		
		this.find(opts.item+'.'+opts.classes.active).parent().css({
			'width'		: xtMaxItemWidth,
			'height'	: xtMaxItemHeight
		});
		
		/*
		 * Nex step: we'll hide our banners.
		 * For security reasons (CSS) we'll add a class 'bannerItem'
		 */
		this.find(opts.item).addClass('xtItem').hide();
		
		// Again, for some security in styling we'll add a style to each child elements
		this.find(opts.item+'> *').addClass('xtContent');
		
		// Now let's show the starting item & store it's index
		if(this.find(opts.item+'.'+opts.classes.active).length > 0) {
			xtActive = this.find(opts.item+'.'+opts.classes.active).index();
		}
		
		this.find(opts.item+':eq('+xtActive+')').addClass(opts.classes.active).show();
		
		/*
		 * Now lets give our plugin some brains
		 * We want to check the users input and call the corresponding function
		 * In this area we're going to check which type of movement the user selected
		 * Then call a function according to that movement.
		 * Within the function called, if we need a direction, the plugin will check it's direction
		 */
		switch(opts.type) {
			case 'slide' 	: xtSlide(opts.direction); break;
			case 'fade'		: break;
		}
		
		/*
		 * In this function we'll make sure everything moves just on time
		 * The timeout is used once so the promo banner doesn't start sliding immediatly
		 * Once the timer has finished, our interval will be started
		 * In our interval we'll check if the last one is active at this moment
		 * If it is active, we'll jump back to the first one
		 * 		animation : the name of the function that needs to be started
		 */
		function startSliding(animation) {
			// Timeout function
			xtTimeout = setTimeout(function() {
				xtInterval = setInterval(function() {
					switch(xtActive) {
						case xtItems - 1:	animation(0);
															break;
															
						default:					animation(xtActive + 1);
					}
				}, opts.duration);
			}, opts.duration);
		};
		
		function xtSlide() {
			switch(opts.direction) {
				case 'left'		: xtAV = animations.slide.left;
												break;
												
				case 'right'	: xtAV = animations.slide.right;
												break;
												
				case 'top'		: xtAV = animations.slide.top;
												break;
												
				case 'bottom'	: xtAV = animations.slide.bottom;
												break;
			}

			setSlidePosition();
			startSliding(xtAnimSlide);
			
		};
		
		function setSlidePosition() {
			$(xtObj).find(opts.item+'.'+opts.classes.active).css(xtAV.active).show();
			$(xtObj).find(opts.item+':not(.'+opts.classes.active+')').css(xtAV.start).show();
		}
		
		function xtAnimSlide(target) {
			$(xtObj).find(opts.item+':eq('+xtActive+')').animate(xtAV.end, function() {
				$(xtObj).find(opts.item+':eq('+xtActive+')').css(xtAV.start);
				xtActive = target;
			}).removeClass('active');
			
			$(xtObj).find(opts.item+':eq('+target+')').animate(xtAV.active).addClass('active');
			
		};
		
	
	};
	
	// Animation settings
	var animations = {
		// The slide animation
		'slide' : {
		
			// Slide animation to the left
			'left' : {
				// Starting position
				'start' : {
					'left':'100%',
					'right':'-100%'
				},
				// Active position
				'active': {
					'left':'0',
					'right':'0'
				},
				// End position
				'end':{
					'left':'-100%',
					'right':'100%'
				}
			},
			
			// Slide animation to the right
			'right' : {
				// Starting position
				'start' : {
					'left' : '-100%',
					'right' : '100%'
				},
				// Active positions
				'active' : {
					'left' : '0',
					'right': '0'
				},
				// End position
				'end' : {
					'left' : '100%',
					'right': '-100%'
				}
			},
			
			// Slide animation to the top
			'top' : {
				// Starting position
				'start' : {
					'bottom' : '-100%',
					'top' : '100%'
				},
				// Active position
				'active' : {
					'bottom' : '0',
					'top' : '0'
				},
				// End position
				'end' : {
					'bottom' : '100%',
					'top' : '-100%'
				}
			},
			
			// Slide animation to the bottom
			'bottom' : {
				// Starting position
				'start' : {
					'bottom' : '100%',
					'top' : '-100%'
				},
				// Active position
				'active' : {
					'bottom' : '0',
					'top' : '0',
				},
				// End position
				'end' : {
					'bottom' : '-100%',
					'top' : '100%'
				}
			}

		}
	}

	// Default settings
	var defaults = {
		'item' : 'li',
		'type' : 'slide',
		'direction' : 'left',
		'start' : 0,
		'duration' : 1000,
		'classes' : {
			'active' : 'active',
			'navigation' : 'xtNav'
		}
	}
	
})(jQuery);