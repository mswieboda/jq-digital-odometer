(function($) {
    var defaultSettings = {
        'digits' : 3,
        'speed' : 100,
        'toDigit' : 9
    };
    
    var methods = {
        init : function( options ) {
            var settings = $.extend( {
              'digits' : defaultSettings.digits
            }, options);
            
            return this.each(function() {
                var $counter = $(this).html("").addClass('digitalOdometer').css('display', 'inline-block');
                
                for (var i = 0; i < settings.digits; i++) {
                    $counter.append('<span class="digit" style="display: inline-block"><span>0</span><hr/></span>');
                }
                
                $counter.find('.digit').each(function() {
                    var $display = $(this);
                    var $digit = $display.find('span');
                    
                    $digit.html([0,1,2,3,4,5,6,7,8,9,0].reverse().join('<br/>'))
                    $digit.css({ 
                        top: '-' + (parseInt($display.height()) * (10 - parseInt($digit.html()))) + 'px'
                    });
                });
            });
        },
        
        reset : function( options ) {
            var settings = $.extend( {
              'speed' : defaultSettings.speed
            }, options);
            
            return this.each(function() {
                $(this).find('.digit').each(function() {
                    var $display = $(this);
                    var $digit = $display.find('span');
                    $digit.animate({
                        top: '-' + (parseInt($display.height()) * 10) + 'px'
                    }, settings.speed);
                });
            });
        },
        
        step : function( options ) {
            var settings = $.extend( {
              'speed' : defaultSettings.speed
            }, options);
            
            return this.each(function() {
                var $display = $(this);
                var $digit = $display.find('span');
                
                $digit.animate({
                    top: '+=' + $display.height() + 'px'
                }, settings.speed, function() {
                    var digit = parseInt($digit.css('top')) / parseInt($display.height()) * -1;
                    
                    // If we've reached the end of the counter, tick the previous digit
                    if(digit < 1) {
                        //reset digit back to zero
                        digit = 0;
                        
                        // reset the top back to the tenth #, 0
                        $digit.css({
                            top: '-' + (parseInt($display.height()) * 10) + 'px'
                        });
                        
                        //animate prev digit
                        $display.prevAll(".digit:first").digitalOdometer('step', settings);
                    }
                });
            });
        },
        
        countToDigit : function( options ) {
            var settings = $.extend( {
              'toDigit' : defaultSettings.toDigit,
              'speed' : defaultSettings.speed
            }, options);
            
            return this.find(".digit:last").each(function() {
                var $display = $(this);
                var $digit = $display.find('span');
                
                for (var i = 0; i < settings.toDigit; i++) {
                    $display.digitalOdometer('step', settings);
                }
            });
        }
    };
    
    /*
        digitalOdometer - jQuery plugin to create a odometer / counter
        this jQuery function calls the given method that is given as a string.
        Ex:
        $("#example").digitalOdometer('countToDigit', { 'speed', 300 });
    */
    $.fn.digitalOdometer = function(method) {
        // Method calling logic
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
    }
})(jQuery);