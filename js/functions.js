/**
 * Functionality specific to Adaptive Path.
 *
 * Provides helper functions to enhance the theme experience.
 */

var $ = jQuery;
var emailfilter = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;
var uiDroppableObj;
var uiDraggableObj;
var skipToContentTop;
var $headerContainer;
var $skipButton;
var $ideasNavHeader;
var $ideasNavFeatured;
var scrollToOffset = -78;
var mobileNavPos = 68;
var searchFlag = 0;
var ajaxLoading = 0;
var $currentMember;
var hash;

var curScreenBreakpoint = 0;
var curScreenBreakpointSlider = 0;

( function( $ ) {
	var body    = $( 'body' ),
	    _window = $( window );
  
	/**
	 * Enables menu toggle for small screens.
	 */
	( function() {
    
		var nav = $( '#site-navigation' ), button, menu;
		if ( ! nav )
			return;

		button = nav.find( '.menu-toggle' );
		if ( ! button )
			return;

		// Hide button if menu is missing or empty.
		menu = nav.find( '.nav-menu' );
		if ( ! menu || ! menu.children().length ) {
			button.hide();
			return;
		}
    
    if ($('.searchform').length > 1) {
      $('.site-header .ideas-nav').hide();
    }
    
    setBreakPoints();
    
    if($('.searchform').length > 0) {
      $('.searchform').each(function() {
        var $this = $(this);
        $('#searchsubmit', $this).on('click', function(){
          _gaq.push(['_trackEvent', 'Ideas', 'Search', 'Submit']);
          if($this.hasClass("expanded")) {
            if($('#s', $this).val().replace(/^\s*|\s*$/g,"")==""){
              return false;
            }
          } else{
            searchWidth = 306;
            if(curScreenBreakpoint=='xs') {searchWidth = 290;}
            if( (curScreenBreakpoint=='xs') && $('body').hasClass('single')){searchWidth = 180;}
            
            // Code for CSS animation
            /*if(!$this.hasClass('expanded')){
              $this.addClass('expanded');
              $this.css({ 'width': searchWidth });
              $("#s", $this).show().focus();
            } */
           
            
            $this.stop().css({'width': searchWidth});
            $this.addClass("expanded");
            $("#s", $this).show().focus();
            
//            $this.stop().animate({ 'width': searchWidth }, 500, function() {
//              $("#s", $this).show().focus();
//            });
            searchFlag = 1;
            return false;
          }
        });
        
        $this.submit(function() {
          
        })
      });
      
      $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if ($clicked.parents('.searchform').length > 0){
//          Do nothing
        } else {
          searchFlag = 0;
//          var $this = $(".searchform");
//          if($this.hasClass('expanded')){
//            $this.removeClass('expanded');
//            $this.css({ 'width': '44' });
//            $("#s", $this).hide();
//          }
          
          $(".searchform #s").hide();
          $(".searchform").removeClass("expanded");
          $('.searchform').css({'width': '44'});
          
//          $('.searchform').stop().animate({
//            'width': '44'
//          }, 400);
        }
      });
    }
    

    var $mobileMenu = $('<div></div>');
    $menuUL = $('<ul></ul>');
    $('#site-navigation li').each(function() {
      $menuLI = $('<li></li>');
      menuURL = $('a', $(this)).attr('href');
      menuText = $('a', $(this)).text();
      $menuLink = $('<a href="'+menuURL+'"><div class="container"><div class="row"><div class="col-12">'+menuText+'</div></div></div></a>');
      $menuLI.empty().append($menuLink);
      $menuUL.append($menuLI);
    });
    $mobileMenu.append($menuUL);
    $(".mobile-nav").hide().empty().append($mobileMenu);
    
    if(window.location.hash) {
      hash = window.location.hash.replace(/^.*#/, ''); 
    }
    
    $(window).bind('load', function() {
      if(window.location.hash) {
//        hash = window.location.hash.replace(/^.*#/, '');
        
        if ($('#'+hash).length > 0 && $('#'+hash).hasClass('team-member')) {
          scrollToElement($('#'+hash), 600, scrollToOffset);
        } else if ($('#'+hash).length > 0) {
          scrollToElement($('#'+hash), 600, -120);
        } else if ($('.'+hash).length > 0) {
          scrollToElement($('.'+hash), 600, scrollToOffset);
        } else if ($('.section-'+hash).length > 0) {
          scrollToElement($('.section-'+hash), 600, scrollToOffset);
        }
        
      }
    });
    
    $skipButton = $('.skip-to-content');
    $NavHeader = $('.site-header');
    $ideasNavHeader = $('.site-header .ideas-nav');
    $ideasNavFeatured = $('#ideas_featured .ideas-nav');
    
//    if($('.iso-device').length <= 0) {
    
      if ($NavHeader.length > 0) {
        $headerContainer = $('#masthead .site-header-container');
        skipToContentTop = $NavHeader.offset().top + 21;
        $(window).bind('resize', function(){
          skipToContentTop = $NavHeader.offset().top + 21;
          fixedSkipToContent();
        });
        $(window).bind('scroll', function(){fixedSkipToContent();});
      }
      if ($skipButton.length > 0) {
        $headerContainer = $('#masthead .site-header-container');
        skipToContentTop = $skipButton.offset().top + 21;
        $(window).bind('resize', function(){
          skipToContentTop = $skipButton.offset().top + 21;
          fixedSkipToContent();
        });
        $(window).bind('scroll', function(){fixedSkipToContent();});
      }
      if ($ideasNavFeatured.length > 0) {
        $headerContainer = $('#masthead .site-header-container');
        skipToContentTop = $ideasNavFeatured.offset().top + 23;
        $(window).bind('resize', function(){
          skipToContentTop = $ideasNavFeatured.offset().top + 23;
          fixedSkipToContent();
        });
        $(window).bind('scroll', function(){fixedSkipToContent();});
      }
      if ($('#article_page').length > 0) {
        $headerContainer = $('#masthead .site-header-container');
        skipToContentTop = $ideasNavHeader.offset().top + 23;
        $(window).bind('resize', function(){
          skipToContentTop = $ideasNavHeader.offset().top + 23;
          fixedSkipToContent();
        });
        $(window).bind('scroll', function(){fixedSkipToContent();});
      }
//    }
    
    
    $('.icon-skip').each(function() {
      var $this = $(this);
      var $arrow = $('span', $this);
      $this.hover(function() {
        $arrow.stop().animate({
          'top' : 16
        }, 200)
      }, function () {
        $arrow.stop().animate({
          'top' : 13
        }, 200)
      });
    });
    
    $('.icon-top').each(function() {
      var $this = $(this);
      var $arrow = $('span', $this);
      $this.hover(function() {
        $arrow.stop().animate({
          'top' : 10
        }, 200)
      }, function () {
        $arrow.stop().animate({
          'top' : 13
        }, 200)
      });
    });
    
    $('.icon-btn').each(function() {
      var $this = $(this);
      var $parent = $this.parents('.btn');
      $parent.hover(function() {
        posRight = 15;
        if($parent.hasClass('btn-transparent')) posRight=0;
        
        if ($this.hasClass('icon-btn-back')) {
          $this.stop().animate({
            'left': posRight
          }, 300)
        } else {
            $this.stop().animate({
            'right': posRight
          }, 300)
        }
      }, function() {
        posRight = 18;
        if($parent.hasClass('btn-transparent')) posRight=4;
        
        if ($this.hasClass('icon-btn-back')) {
          $this.stop().animate({
            'left': posRight
          }, 300)
        } else {
          $this.stop().animate({
            'right': posRight
          }, 300)
        }
      });
    });
    
    
    if($('.close-browser-check').length > 0) {
      $('.close-browser-check').on('click', function(e) {
        e.preventDefault();
        
        if (ajaxLoading==1) return;
        ajaxLoading = 1;
        
        var $this = $(this);
        $this.hide();
        var $parent = $this.parents('#browser-check');
        $parent.stop().animate({
          'opacitiy' : 0
        }, 400, function() {
          $parent.remove();
          ajaxLoading = 0;
        })
      });
    }
    
    
    if ($('.service-icon').length > 0) {
      $('.service-icon').hoverIntent({
        over: startAnimation,
        out: stopAnimation,
        timeout: 400
      });
    }
    
    
    // Global
		$( '.menu-toggle' ).on( 'click.twentythirteen', function() {
      if($(".mobile-nav").hasClass('on')) {
        $(".mobile-nav").removeClass("on").stop().slideToggle();
      } else {
        $(".mobile-nav").addClass("on").stop().slideToggle();
      }
		});
    
    
    $('.tabs-toggle').on('click', function(){
      var $parent = $(this).parents('.tabs');
      $('ul',$parent).slideToggle();
    });
    
    
    if ($skipButton.length > 0) {
      $skipButton.on('click', function(e) {
        e.preventDefault();
        scrollToElement($('#content'), 600, scrollToOffset);
      });
    }
    
    if($('.back-to-top a').length > 0) {
      $('.back-to-top a').on('click', function(e) {
        e.preventDefault();
        scrollToElement($('#page'), 600, scrollToOffset);
      });
    }
    
    
    
    if($('#upcoming-events-list').length > 0){
      // Upcoming Events - Columns Equalize height
      $.fn.equalizeHeights = function(){
        return this.height( Math.max.apply(this, $(this).map(function(i,e){return $(e).height()}).get() ) )
      }
      if(curScreenBreakpoint!='xs') {
        $('#upcoming-events-list .row').each(function(){
          $('.col-6', $(this)).equalizeHeights();
        });
      }
    }
    

    if ($('#page-slider .bxslider').length > 0) {
      var $slider = $('#page-slider .bxslider');
      var pagerEnabled = true;
      if($('body').hasClass('iphone')) {
        pagerEnabled = false;
      } 
      
      $slider.each(function() {
        $slider.css('opacity', 0);
        var $pageSlider = $('.bxslider').bxSlider({
          controls: false,
          pager: pagerEnabled,
          swipeThreshold: 25,
          preventDefaultSwipeY: false,
          infiniteLoop: false,
          onSliderLoad: function() {
            $('li', $slider).not($('li:last',$slider)).css({'cursor':'pointer'});
//            $('li', $slider).css({'cursor':'pointer'});
            rePositionMainSlider();
            $slider.animate({'opacity': 1});
            if(pagerEnabled==true) {
              $('li', $slider).on('click', function() {
                $pageSlider.goToNextSlide();
              });
            }

          }
        });
      });
    }
    
    
    
    $('.toggle-box').each(function() {
      $toggleBox = $(this);
      $toggleBox.on('click', function() {
        if($toggleBox.hasClass('on')) {
          $toggleBox.stop().animate({
            'margin-top': '-50' 
          }, 300);
        } else {
          $toggleBox.stop().animate({
            'margin-top': ($toggleBox.height() * -1) 
          }, 300);
        }
        $toggleBox.toggleClass('on');
      })
    });
    
    
    $('#contact_form .field').each(function() {
      var $this = $(this);
      $this.bind({
        click: function() {
          $('.ph-text', $this).hide();
          $('.txtBox', $this).focus();
        }
      });

      $('.txtBox', $this).focus(function() {
        if ($(this).val() == "") {
          $('.ph-text', $this).hide();
        }
      });

      $('.txtBox', $this).blur(function() {
        if ($(this).val() == "") {
          $('.ph-text', $this).show();
        }
      });
    });
    
    
    if($('#search_results').length > 0) {
      $('#search_results article.type-post').each(function() {
        var $this = $(this);
        $this.css({'cursor': 'pointer'});
        $this.hover(function() {
          $this.addClass('mouseover');
        }, function() {
          $this.removeClass('mouseover');
        });
        
        $this.click(function() {
          window.location.href = $('a:eq(0)', $this).attr('href');
        });
        
      });
    }
    
    
    /* Single Ideas - Sidebar Auhtor Top Bar Animation */
    if ($('#author-widget .author-image').length > 0) {
      $('#author-widget a').each(function() {
        var $this = $(this);
        var $parent = $this.parents('#author-widget');
        var $parentIMG = $('.author-image', $parent);
        var $overlay = $('.overlay', $parent);
        
        if($parentIMG.length > 0) {
          $this.hover(function() {
            $('.topbar', $parentIMG).stop().animate({'top': 0}, 300);
            $parent.addClass('mouseover');
            $overlay.addClass('mouseover');
          }, function() {
            $('.topbar', $parentIMG).stop().animate({top: -6}, 300);
            $parent.removeClass('mouseover');
            $overlay.removeClass('mouseover');
          });
        }
      });
    }
    
    
    
    $('.comment-form .field').each(function() {
      $('#btn-submit').addClass("btn");
      $('#btn-submit').attr("disabled", "disabled");
      var $this = $(this);
      $this.bind({
        click: function() {
          $('.ph-text', $this).hide();
          $('.txtBox', $this).focus();
        }
      });

      $('.txtBox', $this).focus(function() {
        if ($(this).val() == "") {
          $('.ph-text', $this).hide();
        }
      });

      $('.txtBox', $this).blur(function() {
        if ($(this).val() == "") {
          $('.ph-text', $this).show();
        }
      });
    });
    
    
    
    /* Home page - consulting grow effect */
    $('#home_consulting img').each(function() {
      var $parent = $(this).parents('.experts-item');
      $(this).hover(function () { 
        $(this).grow(1.2);
        $('h4',$parent).hide();
        $('p',$parent).show();
      }, function () { 
        $(this).grow(1.0);
        $('h4',$parent).show();
        $('p',$parent).hide();
      });
    });
    
    
    if ($('#slider_home_events').length > 0) {
      var video_vimeo_id = '';
      var sliderHomeEvents = $('#slider_home_events').bxSlider({
        pager: false,
        controls: false,
        touchEnabled: false,
        adaptiveHeight: true,
        video: true,
        useCSS: false,
        onSlideNext: function($slideElement, oldIndex, newIndex){
          var video_embed_code = '<iframe src="http://player.vimeo.com/video/'+video_vimeo_id+'?title=0&amp;byline=0&amp;portrait=0&amp;color=00bec5&amp;autoplay=1" width="690" height="388" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
          
          $('.col-12', $slideElement).empty().append(video_embed_code);
          $('.col-12', $slideElement).fitVids({customSelector: "iframe"});
          
          $('.icon-close', $slideElement).bind('click', function(e){
            e.preventDefault();
            sliderHomeEvents.goToPrevSlide();
            $('.col-12', $slideElement).empty();
          });
        }, 
        onSlideAfter: function($slideElement, oldIndex, newIndex){
          scrollToElement($slideElement, 600, scrollToOffset);
        }
      });
      
      $('.icon-play', sliderHomeEvents).bind('click', function(e){
        e.preventDefault();
        video_vimeo_id = $(this).parents("a").attr("data-video_id");
        sliderHomeEvents.goToNextSlide();
      });
    }
    
    
    
    /* Swipe to unload script */
    if ($(".swipe-handle").length > 0) {
      $(".swipe-handle").draggable({
        containment: "parent", 
        scrollSpeed: 100,
        axis: 'x',
        cursor: 'move',
        revert: 'invalid',
        zIndex: '1'
      });

      // Droppable - Input Fields
      $('.swipe-lock').droppable({
        acccept: '.swipe-handle',
        tolerance: 'intersect',
        drop: function(event, ui) {
          uiDroppableObj = $(this);
          uiDraggableObj = $(ui.draggable);

          // Set Positions
          var off = $( this ).offset();
          off.right = 0;
          ui.draggable.offset( off );

          uiDraggableObj.draggable({disabled: true});
          uiDroppableObj.droppable( "option", "disabled", true );
          $('.btn').removeAttr('disabled');
          $('.swipe').addClass('locked');
          $('.swipe span').text('Unlocked');
//          $(".swipe-handle").addClass('disabled');
        }
      });
    }
    
    //Home Featured Ideas - Top Bar Animation
    if($('.idea-item').length > 0){
      $('.idea-item a').each(function(){
        var $this = $(this);
        var $parent = $(this).parents('.idea-item');
        var $parentIMG = $('.idea-image', $parent);
        var $overlay = $('.overlay', $parent);
        
        if($parentIMG.length > 0){
          $this.hover(function() {
            $('.topbar', $parentIMG).stop().animate({'top': 0}, 300);
            $parent.addClass('mouseover');
            $overlay.addClass('mouseover');
          }, function() {
            $('.topbar', $parentIMG).stop().animate({top: -6}, 300);
            $parent.removeClass('mouseover');
            $overlay.removeClass('mouseover');
          });
        }
        
      });
    }
    
    // Single Memeber Page Redirect
    if ($('#'+hash).length > 0 && $('#'+hash).hasClass('team-member')) {
      var offsetTop = $('#'+hash+ ' .member-image a').offset().top;
      setTimeout(function() {
        $('#'+hash+ ' .member-image a').click();
      },(offsetTop*.8));
    }
    
    /* About Page - Team Slider */
    if ($('#slider_our_team').length > 0) {
      $('.team-member a').each(function() {
        var $this = $(this);
        var $parent = $this.parents('.team-member');
        var $parentIMG = $('.member-image', $parent);
        var $overlay = $('.overlay', $parent);

        $this.click(function(e) {
          e.preventDefault();
        });

        $this.hover(function() {
          $('.topbar', $parent).stop().animate({'top': 0}, 300);
          $('h4 a', $parent).addClass('mouseover');
        }, function() {
          $('.topbar', $parent).stop().animate({top: -6}, 300);
          $('h4 a', $parent).removeClass('mouseover');
        });
      });
      
      
      var member_profile = "";
      var sliderOurTeam = $('#slider_our_team').bxSlider({
        pager: false,
        controls: false,
        touchEnabled: false,
        adaptiveHeight: true,
        onSlideNext: function($slideElement, oldIndex, newIndex){
          $('.col-12', $slideElement).empty().append(member_profile);
          
          $('.icon-close', sliderOurTeam).on('click', function(e){
            e.preventDefault();
            sliderOurTeam.goToPrevSlide();
//            $('.col-12', $slideElement).empty();
          });
        },
        onSlideAfter: function($slideElement, oldIndex, newIndex){
          scrollToElement($slideElement, 600, scrollToOffset);
          if (newIndex == 0) {
            scrollToElement($currentMember, 600, scrollToOffset);
          } else {
            scrollToElement($slideElement, 600, scrollToOffset);
          }
        }
      });
      
      
      $('a', sliderOurTeam).not('.icon-close').bind('click', function(e){
        if (ajaxLoading==1) return;
        ajaxLoading = 1;
        e.preventDefault();
        var $parent = $(this).parents('.team-member');
        $currentMember = $parent;
        var $parentIMG = $('.member-image', $parent);
        $parentIMG.showLoading();
        
        var url = $(this).attr('href');
        $.ajax({
          url: url,
          type: 'POST',
          data: {
            action: 'ajax'
          },
          success: function(response) {
            member_profile = response;
            var $images = $("img", member_profile);
            var noOfImages = $images.length
            var noLoaded = 0;
            

            if (noOfImages > 0) {
              $images.on('load', function(){
                noLoaded++;
                if(noOfImages === noLoaded) {
                  $parentIMG.hideLoading();
                  scrollToElement($('#about_our_team'), 400, scrollToOffset);
                  setTimeout(function() {
                    sliderOurTeam.goToNextSlide();
                    ajaxLoading = 0;
                  },1200);
                }
              });
            } else {
              $parentIMG.hideLoading();
              scrollToElement($('#about_our_team'), 400, scrollToOffset);
              setTimeout(function() {
                sliderOurTeam.goToNextSlide();
                ajaxLoading = 0;
              },1200);
            }
            
          }
        });
      });
    }
    
    
    /* Article Page - Team Slider */
    if ($('#article_page_slider').length > 0) {
      var member_profile = "";
      var sliderArticlePage = $('#article_page_slider').bxSlider({
        auto: false,
        infiniteLoop: false,
        pager: false,
        controls: false,
        touchEnabled: false,
        adaptiveHeight: true,
        onSlideNext: function($slideElement, oldIndex, newIndex){
          $('.col-12', $slideElement).empty().append(member_profile);
          profileOpen = 1;
          
          $('.icon-close', sliderArticlePage).on('click', function(e){
            e.preventDefault();
            sliderArticlePage.goToPrevSlide();
          });
          scrollToElement($('#page'), 400, scrollToOffset);
        },
        onSlidePrev: function($slideElement, oldIndex, newIndex){
          scrollToElement($('#page'), 600, scrollToOffset);
        }
      });
      
      
      $('#author-widget a, .entry-meta a', sliderArticlePage).not('.icon-close').bind('click', function(e){
        if (ajaxLoading==1) return;
        ajaxLoading = 1;
        e.preventDefault();
        var $parent = $('#author-widget');
        $currentMember = $parent;
        var $parentIMG = $('.author-image', $parent);
        $parentIMG.showLoading();
        
        var url = $(this).attr('href');
        $.ajax({
          url: url,
          type: 'POST',
          data: {
            action: 'ajax'
          },
          success: function(response) {
            member_profile = response;
            var $images = $("img", member_profile);
            var noOfImages = $images.length
            var noLoaded = 0;
            
            if (noOfImages > 0) {
              $images.on('load', function(){
                noLoaded++;
                if(noOfImages === noLoaded) {
                  $parentIMG.hideLoading();
                  scrollToElement($('#page'), 300, scrollToOffset);
                  setTimeout(function() {
                    sliderArticlePage.goToNextSlide();
                    ajaxLoading = 0;
                  },700);
                }
              });
            } else {
              $parentIMG.hideLoading();
              scrollToElement($('#page'), 300, scrollToOffset);
              setTimeout(function() {
                sliderArticlePage.goToNextSlide();
                ajaxLoading = 0;
              },600);
            }
          }
        });
      });
    }
    
    
    
    if ($('#slider_events').length > 0) {
      var video_vimeo_id = '';
      var sliderEvents = $('#slider_events').bxSlider({
        pager: false,
        controls: false,
        touchEnabled: false,
        adaptiveHeight: true,
        video: true,
        useCSS: false,
        onSlideNext: function($slideElement, oldIndex, newIndex){
          var video_embed_code = '<iframe src="http://player.vimeo.com/video/'+video_vimeo_id+'?title=0&amp;byline=0&amp;portrait=0&amp;color=00bec5&amp;autoplay=1" width="690" height="388" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
          $('.col-12', $slideElement).empty().append(video_embed_code);
          $('.col-12', $slideElement).fitVids({customSelector: "iframe"});
          
          $('.icon-close', sliderEvents).on('click', function(e){
            e.preventDefault();
            sliderEvents.goToPrevSlide();
            $('.col-12', $slideElement).empty();
          });
        }, 
        onSlideAfter: function($slideElement, oldIndex, newIndex){
          scrollToElement($slideElement, 600, scrollToOffset);
        }
      });
      
      $('.icon-play', sliderEvents).bind('click', function(e){
        e.preventDefault();
        video_vimeo_id = $(this).parents("a").attr("data-video_id");
        sliderEvents.goToNextSlide();
      });
    }
    
    
    if ($('#slider_get_inspired').length > 0) {
      var video_vimeo_id = '';
      var sliderGetInspired = $('#slider_get_inspired').bxSlider({
        pager: false,
        controls: false,
        touchEnabled: false,
        adaptiveHeight: true,
        video: true,
        useCSS: false,
        onSlideNext: function($slideElement, oldIndex, newIndex){
          var video_embed_code = '<iframe src="http://player.vimeo.com/video/'+video_vimeo_id+'?title=0&amp;byline=0&amp;portrait=0&amp;color=00bec5&amp;autoplay=1" width="690" height="388" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
          $('.col-12', $slideElement).empty().append(video_embed_code);
          $('.col-12', $slideElement).fitVids({customSelector: "iframe"});
          
          $('.icon-close', $slideElement).on('click', function(e){
            e.preventDefault();
            sliderGetInspired.goToPrevSlide();
            $('.col-12', $slideElement).empty();
          });
        }, 
        onSlideAfter: function($slideElement, oldIndex, newIndex){
          scrollToElement($slideElement, 600, scrollToOffset);
        }
      });
      
      $('#video-items a').not('.icon-close').each(function() {
        var $parent = $(this).parents('.video-item');
        $(this).hover(function() {
          $parent.addClass('mouseover');
        }, function() {
          $parent.removeClass('mouseover');
        });
        
        $(this).click(function(e) {
          e.preventDefault();
          video_vimeo_id = $parent.attr("data-video_id");
          sliderGetInspired.goToNextSlide();
        });
      });
    }
    
    if( $('#commentform').length > 0){
      $('#commentform').submit(function(){
        var isValid = true;
        var errMsg = '';
        $('.error_input').removeClass('error_input');
        $('.field_error').empty().hide();
        
        $(".required").each(function() {
          if($(this).val().replace(/^\s*|\s*$/g,"")==""){
            $parent = $(this).parents('.field-group');
            $('.field', $parent).addClass('error_input');
            $('.field_error', $parent).empty().append($(this).attr('data-error-msg')).fadeIn();
            isValid = false;
          }
        });
        
        if($('#email').length > 0){
          if(emailfilter.test($('#email').val())==false){
            $parent = $('#email').parents('.field-group');
            $('.field', $parent).addClass('error_input');
            $('.field_error', $parent).empty().append($('#email').attr('data-error-msg')).fadeIn();
            isValid = false;
          }
        }

        return isValid;
      });
    }
    
    
    /* Contact Form - Submit Form */
    if($('#contact_form').length > 0) {
      $('#btn_submit').attr('disabled', 'disabled');
      
      var options = {
        beforeSubmit:  showRequest, 
        success: showResponse
      };
      
      $('#contact_form form').submit(function() {
        if (ajaxLoading==1) return false;
        ajaxLoading = 1;
        
        $('#contact_form form').ajaxSubmit(options);
        return false;
      });
    }
    
    /* Ideas Top Bar Animation */
    if ($('#ideas_articles').length > 0) {
      ideas_topbar_animation();
    }
    
    if ($('.ideasList').length > 0) {
      /* Ideas - Articles Listing */
      var $colFirst = $('.ideas-col-1');
      var $colSecond = $('.ideas-col-2');
      var $colThird = $('.ideas-col-3');

      layoutIdeas();
      
      var loadMoreClickCount = 0;
      if ($('.more-articles a').length > 0) {
        $('.more-articles a').on('click', function(e) {
          e.preventDefault();
          loadMoreClickCount++;
          
          if (ajaxLoading==1) return;
          ajaxLoading = 1;
          
          var $this = $(this);
          $this.blur();
          $this.addClass('ajax-loading');
          
          var ajax_url = $this.attr('href');
          var curpage = $this.attr('data-curpage');
          curpage++;
          $this.attr('data-curpage', curpage);

          $.ajax({
            url: ajax_url,
            type: 'POST',
            data: {
              curpage: curpage,
              action: 'ideas'
            },
            success: function(response){
              if (response!='') {
                $(response).appendTo('.ideasList');
                layoutIdeas();
                ajaxLoading = 0;
                $this.removeClass('ajax-loading');
                
                if(loadMoreClickCount > 1){
                  ideas_topbar_animation();
                }
                
              } else {
                ajaxLoading = 0;
                $this.removeClass('ajax-loading');
                $this.blur().hide();
              }
            }
          });

          return false;
        });
      }
    }

    function layoutIdeas() {
      if ($('.ideasList').length > 0) {
        var $items = $('.ideasList article');
        $items.css({'opacity':0});
        var delay = 100;
        for(i=0; i < $items.length; i++) {
          if ($colFirst.height() <= $colSecond.height()) {
            if ($colFirst.height() <= $colThird.height()) {
              $($items[i]).appendTo($colFirst);
            } else {
              $($items[i]).appendTo($colThird);
            }
          } else {
            if ($colSecond.height() <= $colThird.height()) {
              $($items[i]).appendTo($colSecond);
            } else {
              $($items[i]).appendTo($colThird);
            }
          }
          $($items[i]).stop().delay(delay).animate({
            'opacity': 1
          }, 400);
          delay += 200;
        }
      }
    }
    
    
    
	} )();

	/**
	 * Makes "skip to content" link work correctly in IE9 and Chrome for better
	 * accessibility.
	 *
	 * @link http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
	 */
	_window.on( 'hashchange.twentythirteen', function() {
		var element = document.getElementById( location.hash.substring( 1 ) );

		if ( element ) {
			if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) )
				element.tabIndex = -1;

			element.focus();
		}
	} );


  function scrollToElement(selector, time, verticalOffset, callback) {
    time = typeof(time) != 'undefined' ? time : 500;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    t = ($(window).scrollTop() - offsetTop);
    if (t <= 0) t *= -1
    t = parseInt(t * .5);
    if (t < time) t=time
    if (t > 1500) t=1500
    $('html, body').animate({
      scrollTop: offsetTop
    }, t, 'easeInOutCirc', callback);
  }
  
  function ideas_topbar_animation(){
    $('#ideas_articles article a').each(function() {
      var $this = $(this);
      var $parent = $this.parents('article');
      var $parentIMG = $('.article-thumb', $parent);
      var $overlay = $('.overlay', $parent);

      if($parentIMG.length > 0) {
        $this.hover(function() {
          $('.topbar', $parent).stop().animate({'top': 0}, 300);
          $parent.addClass('mouseover');
          $overlay.addClass('mouseover');
        }, function() {
          $('.topbar', $parent).stop().animate({top: -6}, 300);
          $parent.removeClass('mouseover');
          $overlay.removeClass('mouseover');
        });
      }
    });
  }
  
  
  function startAnimation() {
    var $item = $(this);
    var $parent = $(this).parents('.service-item');
    var $iconBG = $('.service-icon-bg', $item);
    var $iconIMG = $('.service-icon-image', $item);
    var $itemTitle = $('h4', $parent);
    var $itemDesc = $('p', $parent);

    $iconBG.stop().animate({
      'width' : 170,
      'height' : 170,
      'margin-left': -85,
      'margin-top': -85
    }, 300);
    $iconIMG.stop().animate({
      'width' : 110,
      'height' : 110,
      'margin-left': -55,
      'margin-top': -55
    }, 400);
    $itemTitle.stop().animate({
      'padding-top' : 24,
      'opacity': 0
    }, 400, function() {
      $itemTitle.hide();
      $itemDesc.css({'opacity':'0', 'padding-top': 24}).show();
      $itemDesc.stop().animate({
        'padding-top' : 0,
        'opacity': 1
      }, 400);
    });
  }
    
  function stopAnimation() {
    var $item = $(this);
    var $parent = $(this).parents('.service-item');
    var $iconBG = $('.service-icon-bg', $item);
    var $iconIMG = $('.service-icon-image', $item);
    var $itemTitle = $('h4', $parent);
    var $itemDesc = $('p', $parent);

    $iconBG.stop().animate({
      'width' : 140,
      'height' : 140,
      'margin-left': -70,
      'margin-top': -70
    }, 400)

    $iconIMG.stop().animate({
      'width' : 100,
      'height' : 100,
      'margin-left': -50,
      'margin-top': -50
    }, 300);

    $itemDesc.stop().animate({
      'padding-top' : 24,
      'opacity': 0
    }, 400, function() {
      $itemDesc.hide();
      $itemTitle.css({'opacity':'0', 'padding-top': 24}).show();
      $itemTitle.stop().animate({
        'padding-top' : 0,
        'opacity': 1
      }, 400);
    });
  }
  
  
  function showRequest(formData, jqForm, options) {
    var isValid = true;
    var errMsg = '';
    $('.error_input').removeClass('error_input');
    $('.field_error').empty().hide();
    $(".required").each(function() {
      if($(this).val().replace(/^\s*|\s*$/g,"")==""){
        $parent = $(this).parents('.field-group');
        $('.field', $parent).addClass('error_input');
        $('.field_error', $parent).empty().append($(this).attr('data-error-msg')).fadeIn();
        isValid = false;
      }
    });

    if(emailfilter.test($('#txt-email').val())==false){
      $parent = $('#txt-email').parents('.field-group');
      $('.field', $parent).addClass('error_input');
      $('.field_error', $parent).empty().append($('#txt-email').attr('data-error-msg')).fadeIn();
      isValid = false;
    }
    
    if(isValid){
//      $('.ajax-loader').show();
    } else {
      scrollToElement($('#content'), 400, scrollToOffset);
      ajaxLoading = 0;
    }
    return isValid;
  }

  function showResponse(responseText, statusText, xhr, $form){
    if (statusText==" success" || statusText=="success"){
//      $('.ajax-loader').hide();
      if (responseText == 1){
        scrollToElement($('#page'), 600, 0);
        $('#contact_form form')[0].reset();
        uiDraggableObj.css({'left': 0});
        uiDraggableObj.draggable({disabled: false});
        uiDroppableObj.droppable( "option", "disabled", false );
        $(".swipe").removeClass('locked');
        $('.swipe span').text('Slide to Submit');
        $('#contact_form .btn').attr('disabled', 'disabled');
        
        $('#page-header .egyptienne-64').html("Thanks for getting in touch. We&rsquo;ll follow up soon... <span>Wait,</span><br />I have more to say!");
        ajaxLoading = 0;
        return false;
      } else {
        alert ("ERROR:" + resopnseText);
        ajaxLoading = 0;
      }
    }
  }
  
  function setBreakPoints(){
    w = $(window).width();
    if(w >= 1184) {
      breakpoint = "lg";
    } else if (w >= 976) {
      breakpoint = "md";
    } else if (w >= 752) {
      breakpoint = "sm";
    } else {
      breakpoint = "xs";
    }
    curScreenBreakpoint = breakpoint;
  }
  
  function fixedSkipToContent(){
    setBreakPoints();
    
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var contentTop = $('#content').offset().top;
    var pageSliderTop;
    if ($('#page-slider').length > 0) {
      pageSliderTop = $('#page-slider').offset().top;
    } else {
      pageSliderTop = $('#content').offset().top;
    }
    
    if($('#page-header').length > 0){
     var pageHeaderTop = ( ($('#page-header').offset().top + docViewTop ));
    }
    if($('#article_page').length > 0){// For Ideas Single Page
      pageHeaderTop = ($('#main').offset().top + docViewTop );
      pageSliderTop = ($('.entry-content').offset().top);
    }
    if($('#member_profile').length > 0){// For Ideas Single Page
      pageHeaderTop = ($('#main').offset().top + docViewTop );
      pageSliderTop = ($('.section-slider').offset().top);
    }
    if($('#search_results').length > 0){// For Ideas Single Page
      pageHeaderTop = ($('#main').offset().top + docViewTop );
      pageSliderTop = ($('.page-header').offset().top + 90);
    }
    
    
//    $('.test1').text(skipToContentTop);
    if( (pageHeaderTop <= pageSliderTop)){
      if($headerContainer.hasClass('site-header-border')) {
        // Do nothing
      } else {
        if(curScreenBreakpoint == 'md' || curScreenBreakpoint == 'lg') {
          $headerContainer.addClass('site-header-border');
          $headerContainer.stop().animate({'padding': '35px 0 25px 0'},200);
          $('.main-navigation').animate({'top': 41}, 200);
        }
      }
    } else{
      if($headerContainer.hasClass('site-header-border') && (curScreenBreakpoint == 'md' || curScreenBreakpoint == 'lg')) {
        $headerContainer.removeClass('site-header-border');
        $headerContainer.stop().animate({'padding': '17px 0 18px 0'},200);
        $('.main-navigation').animate({'top': 26}, 200);
      }
    }
    
    
    if ($skipButton.length > 0) {
      if( ( pageHeaderTop >= skipToContentTop)){
        if($skipButton.hasClass('skip-hidden')) {
          // Do nothing
        } else {
          $skipButton.css({'opacity':0}).addClass('skip-hidden');
        }
      } else{
        if($skipButton.hasClass('skip-hidden')) {
          $skipButton.css({'opacity':1}).removeClass('skip-hidden');
        }
      }
    }
    
    
    if ($ideasNavFeatured.length > 0) {
      if( ( pageHeaderTop >= skipToContentTop)){
        if($ideasNavFeatured.hasClass('skip-hidden')) {
          // Do nothing
        } else {
          $ideasNavFeatured.css({'opacity':0}).addClass('skip-hidden');
          $ideasNavHeader.show();
        }
      } else{
        if($ideasNavFeatured.hasClass('skip-hidden')) {
          $ideasNavHeader.hide();
          $ideasNavFeatured.css({'opacity':1}).removeClass('skip-hidden');
        }
      }
    }
    
    
//    if( (contentTop <= docViewBottom)){
//      $('#page-header .skip-to-content').hide();
//      $('#masthead .skip-to-content').hide();
//    }
  }
  
  
  if($("#history-slider").length > 0) {
    var $historySlider = $("#history-slider");
    var $sliderContainer;
    var $tabsContainer;
    var $slider;
    var $curSlide;
    var $newSlide;
    var $btnNext;
    var $btnPrev;

    var totSlides = 0;
    var positionLeft = 0;
    var slideWidth = 0;
    var isSliding = 0;
    var curIndex = 0;
    var newIndex = 0;
    var padding = 0;

    $(function() {
      $sliderContainer = $('.slider', $historySlider);
      $tabsContainer = $('.tabs', $historySlider);
      $slider = $('ul', $sliderContainer);
      $btnNext = $('.btn-next', $sliderContainer);
      $btnPrev = $('.btn-prev', $sliderContainer);
      $curSlide = $('.selected', $slider);

      totSlides = $('li', $slider).length;

      configureHistorySlider();
      $(window).bind('resize', configureHistorySlider);
      
      
      if(curScreenBreakpointSlider=='sm') {
        $sliderContainer.swipe( {
          triggerOnTouchEnd : true,
          swipeStatus : swipeStatus,
          allowPageScroll:"vertical",
          threshold: 25,
          maxTimeThreshold: 200
        });
      }

      var IMG_WIDTH = slideWidth;
      var maxImages=totSlides;
      var speed=500;


      function swipeStatus(event, phase, direction, distance, fingers) {
//        event.stopPropagation();
//        if(isSliding==1) return false;
        if( phase=="move" && (direction=="left" || direction=="right") ) {
          var duration=0;
          if (direction == "left")
            scrollImages((IMG_WIDTH * curIndex) + distance, duration);

          else if (direction == "right")
            scrollImages((IMG_WIDTH * curIndex) - distance, duration);

        } else if ( phase == "cancel") {
          scrollImages(SLIDE_WIDTH * curIndex, speed);

        } else if ( phase =="end" ) {
          if (direction == "right")
            previousImage()
          else if (direction == "left")
            nextImage()
        }
      }

      function previousImage() {
        if (isSliding==1) return false;
        isSliding==1;
        curIndex = Math.max(curIndex-1, 0);
        scrollImages( IMG_WIDTH * curIndex, speed);
      }

      function nextImage() {
        if (isSliding==1) return false;
        isSliding==1;
        curIndex = Math.min(curIndex+1, maxImages-1);
        scrollImages( IMG_WIDTH * curIndex, speed);
      }
      

      function scrollImages(distance, duration) {
        distance -= padding;
        var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
        $slider.stop().animate({
          'left' : value+'px'
        }, 400, function() {
          resetSliderControls();
        });
        
      }
      
      function resetSliderControls() {
        if ($('li:eq('+curIndex+')', $tabsContainer).hasClass('selected')) {
          return false;
        }
        
        if ($btnPrev.hasClass('disabled') && curIndex > 0)
          $btnPrev.removeClass('disabled').fadeIn();

        if ($btnNext.hasClass('disabled') && curIndex < (totSlides-1)) 
          $btnNext.removeClass('disabled').fadeIn();

        if (curIndex == (totSlides-1))
          $btnNext.addClass('disabled').hide();

        if (curIndex == 0)
          $btnPrev.addClass('disabled').hide();


        $('li', $tabsContainer).removeClass('selected');
        $('li:eq('+curIndex+')', $tabsContainer).addClass('selected');

        $('.tabs-toggle').text($('li:eq('+curIndex+')', $tabsContainer).text());

        $curSlide.removeClass('selected');
        $('.slide-overlay',$curSlide).stop().animate({'opacity': .74}, 600);

        $newSlide = $('li:eq('+curIndex+')', $slider);
        $('.slide-overlay',$newSlide).css({'opacity': '.74'});
        $('.slide-overlay',$newSlide).stop().animate({'opacity': 0}, 600, function() {
          $newSlide.addClass('selected');
          isSliding==0;
        });
        $curSlide = $newSlide; 
      }
      
      

      $('.slide-pager').each(function() {
        $('a', $(this)).click(function(e) {
          e.preventDefault();
          goToWorkSlide(($(this).attr('data-slide')-1));
        })
      });

      $('a', $tabsContainer).on('click', function(e) {
        e.preventDefault();

        $parent = $(this).parents('li');
        if($parent.hasClass('selected')) return false;

        if (isSliding==1) return false;
        isSliding = 1;

        if(curScreenBreakpointSlider=='xs') {
          $('ul',$tabsContainer).hide();
        }

        goToWorkSlide(($parent.attr('data-slide')-1));
      });

      $('.btn', $slider).click(function(e) {
        e.preventDefault();
        if (isSliding==1) return false;
        isSliding = 1;
        goToWorkSlide(($(this).attr('data-slide')));
      });

      
      $btnNext.click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (curIndex == (totSlides-1)) return false;
        
        if (isSliding==1) return false;
        isSliding = 1;

        goToWorkSlide(++curIndex);
      });

      $btnPrev.click(function(e) {
        e.preventDefault();

        if (curIndex == 0) return false;
        
        if (isSliding==1) return false;
        isSliding = 1;

        goToWorkSlide(--curIndex);
      });
      
      $('.graphic-placeholder').css({'cursor': 'pointer'});
      $('.graphic-placeholder').click(function() {
        $parent = $(this).parents('li');
        $('.btn', $parent).trigger('click');
      })
      
      
      var posX =0;
      var posY =0;
      
      $('.btn-prev, .btn-next', $sliderContainer).mousemove(function(e){
        posY = e.pageY - $(this).offset().top;
        if (posY > 26 && posY < 484) {
          $('span',$(this)).css({'top':(posY-10)});
        }
      });

    });


    function configureHistorySlider() {
      w = $(window).width();
      if(w >= 1184) {
        slideWidth = 1036;
        breakpoint = "lg";
      } else if (w >= 976) {
        slideWidth = 878;
        breakpoint = "md";
      } else if (w >= 752) {
        slideWidth = 678;
        breakpoint = "sm";
      } else {
        slideWidth = $tabsContainer.width();;
        breakpoint = "xs";
      }
      curScreenBreakpointSlider = breakpoint;
      
      
      $('.tabs-toggle').text($('.selected', $tabsContainer).text());

      $('li', $slider).css({'width':slideWidth});

//      $('img', $slider).each(function() {
//        imgHeight = $(this).height();
//        parentHeight = $(this).parents('.graphic-image').height();
//        $(this).css({'margin-top': ((parentHeight-imgHeight) / 2)});
//      });

      var newPad = ((w) / 2);
      padding = positionLeft = newPad - (slideWidth/2);
      
      $sliderContainer.css({
        'padding-left' : newPad,
        'padding-right' : newPad
      });

      $slider.css({
        'left' : newPad - ((slideWidth/2)+(curIndex * slideWidth)),
        'width': slideWidth * totSlides
      });

      $btnNext.css({'width': newPad - (slideWidth/2)});
      $btnPrev.css({'width': newPad - (slideWidth/2)});

      $btnPrev.addClass('disabled').hide();
    }

    function goToWorkSlide(slideno) {
      curIndex = slideno;
      if ($btnPrev.hasClass('disabled') && curIndex > 0)
        $btnPrev.removeClass('disabled').fadeIn();

      if ($btnNext.hasClass('disabled') && curIndex < (totSlides-1)) 
        $btnNext.removeClass('disabled').fadeIn();

      if (curIndex == (totSlides-1))
        $btnNext.addClass('disabled').hide();

      if (curIndex == 0)
        $btnPrev.addClass('disabled').hide();


      $('li', $tabsContainer).removeClass('selected');
      $('li:eq('+curIndex+')', $tabsContainer).addClass('selected');
      
      $('.tabs-toggle').text($('li:eq('+curIndex+')', $tabsContainer).text());
      

      $curSlide.removeClass('selected');
      $('.slide-overlay',$curSlide).stop().animate({'opacity': .74}, 600);

      $newSlide = $('li:eq('+curIndex+')', $slider);
      $('.slide-overlay',$newSlide).css({'opacity': '.74'});
      $('.slide-overlay',$newSlide).stop().animate({'opacity': 0}, 600, function() {$newSlide.addClass('selected');});
      
      $slider.stop().animate({
        'left' : (positionLeft - (curIndex * slideWidth))
      },600, function() {
        $curSlide = $newSlide;isSliding = 0;
      });
    }
  }
  
  
  
  if($("#work-slider").length > 0) {
    $("#work-slider").each(function() {
      var $workSlider = $("#work-slider");
      var $sliderContainer;
      var $tabsContainer;
      var $tabs;
      var $slider;
      var $slides;
      var $workSlides;
      var $curSlide;
      var $newSlide;
      var $btnNext;
      var $btnPrev;

      var windowWidth;
      var slideWidth = new Array();

      var totSlides = 0;
      var totSlidesWidth = 0;
      var containerWidth = 0;
      var positionLeft = 0;
      var isSliding = 0;
      var curIndex = 0;
      var padding = 0;
      
      var IMG_WIDTH = 500;
      var SLIDE_WIDTH = 0;
      var maxImages=0;
      var speed=500;
      
      
      $(function() {
        $sliderContainer = $('.slider', $workSlider);
        $tabsContainer = $('.tabs', $workSlider);
        $tabs = $('li', $tabsContainer);
        $slider = $('ul', $sliderContainer);
        $slides = $('li', $slider);
        $workSlides = $('.work-slide', $slider);
        $btnNext = $('.btn-next', $sliderContainer);
        $btnPrev = $('.btn-prev', $sliderContainer);
        $curSlide = $('.selected', $slider);
        totSlides = $('li', $slider).length;
        maxImages=$workSlides.length;
        
        configureSlider();
        $(window).bind('resize', repositionSlider);

        $('.slide-pager a').click(function() {
          if (isSliding==1) return false;
          isSliding = 1;

          changeImage($(this));
        });


        $('a', $tabsContainer).on('click', function(e) {
          e.preventDefault();

          if (isSliding==1) return false;
          isSliding = 1;
          
          
          $parent = $(this).parents('li');
          if($parent.hasClass('selected')) {
            isSliding = 0;
            return false;
          }

          if(curScreenBreakpointSlider=='sm') {
            newSlideIndex = $parent.attr('data-slide') - 1;
            $newSlide = $('li:eq('+newSlideIndex+') .work-slide:eq(0)', $slider);

            curIndex = $workSlides.index($newSlide);
            changeImageTablet($newSlide);
          } else {
            if(curScreenBreakpointSlider=='xs') {
              $('ul',$tabsContainer).hide();
            }

            changeTab($(this));
          }
        });

        $images = $('img', $slider).not($('img:last', $slider));
        $images.css({'cursor': 'pointer'})
          .click(function() {
            $btnNext.trigger('click');
          });

        $btnNext.click(function(e) {
          e.preventDefault();
          
          if($(this).hasClass('disabled')) return false;
          
          
          if(curScreenBreakpointSlider=='sm') {
            if (curIndex == (maxImages-1)) return false;
          }
          
          if (isSliding==1) return false;
          isSliding = 1;

          if(curScreenBreakpointSlider=='sm') {
            navigateSlideTablet('next');
          } else {
            navigateSlides('next');
          };
        });

        $btnPrev.click(function(e) {
          e.preventDefault();
          if(curScreenBreakpointSlider=='sm') {
            if (curIndex == 0) return false;
          }

          if (isSliding==1) return false;
          isSliding = 1;
          if(curScreenBreakpointSlider=='sm') {
            navigateSlideTablet('prev');
          } else {
            navigateSlides('prev');
          }
          
        });


        var posX =0;
        var posY =0;

        $('.btn-prev, .btn-next', $sliderContainer).mousemove(function(e){
          posY = e.pageY - $(this).offset().top;
          if (posY > 26 && posY < 484) {
            $('span',$(this)).css({'top':(posY-10)});
          }
        });
      });
      
      
      
      function configureSlider() {
        windowWidth = $(window).width();
        if(windowWidth >= 1184) {
          containerWidth = 1036;
          breakpoint = "lg";
        } else if (windowWidth >= 976) {
          containerWidth = 878;
          breakpoint = "md";
        } else if (windowWidth >= 752) {
          containerWidth = 678;
          breakpoint = "sm";
        } else {
          containerWidth = $tabsContainer.width();;
          breakpoint = "xs";
          // hide slideshow
        }
        curScreenBreakpointSlider = breakpoint;
        
//        $('#log').append(" /// " + containerWidth);
        
        padding = (windowWidth-containerWidth) / 2;
        positionLeft = padding;
        
        $('img',$slider).each(function() {
          var maxHeight = $(this).parents('li').height();
          var imgHeight = $(this).height();
          var imgWidth = $(this).width();
          if (maxHeight < imgHeight) {
            newHeight = maxHeight;
            newWidth = imgWidth * (maxHeight/imgHeight);
            
            $(this).css({
              'height': newHeight,
              'width': newWidth
            });
          }
        });
        
        
        if(curScreenBreakpointSlider=='sm') {
          $i = 0;
          pos = 0;
          $('li', $slider).each(function() {
            $this = $(this);
            slideWidth[$i] = $this.width();

            $this.css({'width':slideWidth[$i]});
            $this.attr('data-width', slideWidth[$i]);
            $this.attr('data-posleft', pos);
            pos += slideWidth[$i];

            $i++;
          });
          totSlidesWidth = slideWidth[0]+slideWidth[1]+slideWidth[2];
          $('.slide-content', $slider).css({left: 0});

          pos = (positionLeft * -1);
          $('.work-slide', $slider).each(function() {
            $this = $(this);
            slideWidth = $this.width();
            $this.css({'width':slideWidth});
            $this.attr('data-width', slideWidth);
            $this.attr('data-posleft', pos);
            pos += slideWidth;
          });
          
          $slider.css({'left': 0, 'margin-left' : positionLeft, 'width': totSlidesWidth});

        } else {
          $i = 0;
          $('li', $slider).each(function() {
            var l, il;
            $this = $(this);
            if (curScreenBreakpointSlider!='xs') {
              slideWidth[$i] = $this.width();
            }

            $this.css({'width':slideWidth[$i]});

            if (curScreenBreakpointSlider=='xs') {
              $('.slide-content', $this).css({
                'width': containerWidth
              });

            } else {
              l = $('.slide-content', $this).width();

              $('.slide-content', $this).css({
                'position':'absolute',
                'top': 0,
                'left': 0,
                'float':'none',
                'z-index': 3
              });

              $('.slide-image-pad:eq(0)', $this).css({
                'width': l
              });
            }
            $i++;
          });
          
          
          $('.tabs-toggle').text($('.selected', $tabsContainer).text());
          totSlidesWidth = slideWidth[0]+slideWidth[1]+slideWidth[2];

          $slider.css({'margin-left': 0, 'left' : positionLeft, 'width': totSlidesWidth});
        }
        
        
        if(curScreenBreakpointSlider=='sm') {
          $sliderContainer.swipe( {
            triggerOnTouchEnd : true,
            swipeStatus : swipeStatus,
            allowPageScroll:"vertical",
            threshold: 25,
            maxTimeThreshold: 200
          });
        }
        
        $('.slide-image-caption').each(function() {
          $parent = $(this).parents('.slide-image');
          $img = $('img', $parent);

          slideHeight = $parent.height();
          imageHeight = $img.height();
          captionHeight = $(this).height() + 30;

          if (captionHeight < (slideHeight-imageHeight)) {
            $(this).css({'height' : (slideHeight-imageHeight)});
          } else {
            $img.css({'height': (slideHeight-captionHeight)})
          }
        });

        $btnNext.css({'width': padding});
        $btnPrev.css({'width': padding});
        $btnPrev.addClass('disabled').hide();
      }
      
      
      function swipeStatus(event, phase, direction, distance, fingers) {
        if( phase=="move" && (direction=="left" || direction=="right") ) {
          var duration=0;
          if (direction == "left")
            scrollImages((SLIDE_WIDTH) + distance, duration);

          else if (direction == "right")
            scrollImages((SLIDE_WIDTH) - distance, duration);

        } else if ( phase == "cancel") {
          scrollImages(SLIDE_WIDTH, speed);

        } else if ( phase =="end" ) {
          if (direction == "right")
            previousImage()
          else if (direction == "left")
            nextImage()
        }
      }

      function previousImage() {
        curIndex = Math.max(curIndex-1, 0);
        var $slide = $('.work-slide:eq('+curIndex+')');
        SLIDE_WIDTH = (parseInt($slide.attr('data-posleft')) + 0);
        scrollImages( SLIDE_WIDTH, speed);

        if ($btnPrev.hasClass('disabled') && curIndex > 0)
          $btnPrev.removeClass('disabled').fadeIn();

        if ($btnNext.hasClass('disabled') && curIndex < ($workSlides.length - 1))
          $btnNext.removeClass('disabled').fadeIn();


        $('.selected', $tabsContainer).removeClass('selected');
        $current = $slide.parents('li');
        idx = $slides.index($current);
        $('li:eq('+idx+')', $tabsContainer).addClass('selected');

        if(curIndex == ($workSlides.length - 1)) {
          $btnNext.addClass('disabled').fadeOut();
        }
        if(curIndex == 0) {
          $btnPrev.addClass('disabled').fadeOut();
        }
      }

      function nextImage() {
        curIndex = Math.min(curIndex+1, maxImages-1);
        var $slide = $('.work-slide:eq('+curIndex+')');
        SLIDE_WIDTH = (parseInt($slide.attr('data-posleft')) + 0);

        if ( (SLIDE_WIDTH+parseInt($slide.attr('data-width'))+padding) >= parseInt(totSlidesWidth-1) ) {
          SLIDE_WIDTH -=  (containerWidth-parseInt($('.work-slide:eq('+curIndex+')').attr('data-width')));
        }
        scrollImages( SLIDE_WIDTH, speed);

        if ($btnPrev.hasClass('disabled') && curIndex > 0)
          $btnPrev.removeClass('disabled').fadeIn();

        if ($btnNext.hasClass('disabled') && curIndex < ($workSlides.length - 1))
          $btnNext.removeClass('disabled').fadeIn();

        $('.selected', $tabsContainer).removeClass('selected');
        $current = $slide.parents('li');
        idx = $slides.index($current);
        $('li:eq('+idx+')', $tabsContainer).addClass('selected');

        if(curIndex == ($workSlides.length - 1)) {
          $btnNext.addClass('disabled').fadeOut();
        }
        if(curIndex == 0) {
          $btnPrev.addClass('disabled').fadeOut();
        }
      }

      function scrollImages(distance, duration) {
        var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
        $slider.stop().animate({
          'margin-left' : value+'px'
        });
      }
      
      
      function repositionSlider() {
        w = $(window).width();
        if(w >= 1184) {
          breakpoint = "lg";
        } else if (w >= 976) {
          breakpoint = "md";
        } else if (w >= 752) {
          breakpoint = "sm";
        } else {
          breakpoint = "xs";
        }
//        $('#log').empty().append(breakpoint);
        if (curScreenBreakpointSlider == breakpoint && curScreenBreakpointSlider != 'xs') {
          widthDiff = (w-windowWidth) / 2;
          positionLeft += widthDiff;
          
          if(breakpoint == 'sm') {
            padding += widthDiff;
            $slider.css({'margin-left' : positionLeft});
          } else {
            $slider.css({'left' : positionLeft});
          }
          curBtnWidth = $btnNext.width();

          $btnNext.css({'width': (curBtnWidth+widthDiff)});
          $btnPrev.css({'width': (curBtnWidth+widthDiff)});

          windowWidth = w;
        } else {
//          if (curScreenBreakpointSlider != breakpoint || curScreenBreakpointSlider=='xs') {
          if (curScreenBreakpointSlider != breakpoint) {
            curScreenBreakpointSlider=breakpoint;
            
            if (curScreenBreakpointSlider=='xs') {
              configureSlider();
            } else {
              
//              window.location.href = window.location.href;
              window.location.href = "http://www.adaptivepath.com/consulting/";
//              window.location.reload(false);
            }
          }
        }
      }

      function changeImageTablet($this) {
        if ($btnPrev.hasClass('disabled'))
          $btnPrev.removeClass('disabled').fadeIn();

        if ($btnNext.hasClass('disabled')) 
          $btnNext.removeClass('disabled').fadeIn();


        var $parent = $this;
        changePosition = 0;

        positionLeft = $parent.attr('data-posleft');
        newPosition = parseInt($parent.attr('data-posleft'));
        newSlideWidth = parseInt($parent.attr('data-width'));

        if ( (newPosition+newSlideWidth+padding) >= parseInt(totSlidesWidth-1) ) {
          positionLeft -=  (containerWidth-newSlideWidth);
        }
        $slider.animate({'margin-left': (positionLeft * -1)}, 400, function() {isSliding = 0;});


        $current = $this.parents('li');
        idx = $slides.index($current);
        $('.selected', $tabsContainer).removeClass('selected');
        $('li:eq('+idx+')', $tabsContainer).addClass('selected');


        $parent.addClass('selected');

        if(curIndex == ($('.work-slide', $slider).length - 1)) {
          $btnNext.addClass('disabled').hide();
        }
        if(curIndex == 0) {
          $btnPrev.addClass('disabled').hide();
        }

      }

      function navigateSlideTablet(t) {
        if (t=='next') {
          if(curIndex == ($('.work-slide', $slider).length - 1)) {
            isSliding = 0;
            $btnNext.addClass('disabled').fadeOut();
            return false;
          }
          $newSlide = $('.work-slide:eq('+(curIndex+1)+')', $slider);
          curIndex++;
          changeImageTablet($newSlide);
        } else {
          if(curIndex == 0) {
            isSliding = 0;
            $btnPrev.addClass('disabled').fadeOut();
            return false;
          }
          $newSlide = $('.work-slide:eq('+(curIndex-1)+')', $slider);
          curIndex--;
          changeImageTablet($newSlide);
        }
      }
      
      
      function changeTab($this) {
        $parent = $this.parents('li');
        if($parent.hasClass('selected')){isSliding = 0;return false;}

        $('.tabs-toggle', $tabsContainer).text($this.text());

        if ($btnPrev.hasClass('disabled'))
          $btnPrev.removeClass('disabled').fadeIn();

        if ($btnNext.hasClass('disabled')) 
          $btnNext.removeClass('disabled').fadeIn();


        w = $(window).width();
        if(w >= 1184) {
          containerWidth = 1036;
        } else if (w >= 976) {
          containerWidth = 878;
        } else if (w >= 752) {
          containerWidth = 678;
        } else {
          // hide slideshow
        }
        positionLeft = (w-containerWidth)/2;

        var $selected = $('.selected', $tabsContainer);

        var curIndex = $tabs.index($selected);
        var newIndex = $tabs.index($parent);

        var changePosition = 0;
        if (newIndex > curIndex ) {
          for(i=0; i<newIndex; i++) {
            $s = $('li:eq('+i+')', $slider);
            changePosition += $s.width();
          }
          positionLeft -= changePosition;
        } else {
          for(i=0; i<newIndex; i++) {
            $s = $('li:eq('+i+')', $slider);
            changePosition += $s.width();
          }
          positionLeft -= changePosition;
        }

        $curSlide = $('li.selected', $slider);
        $newSlide = $('li:eq('+newIndex+')', $slider);
        positionLeft -= $('.slide-content', $newSlide).position().left;

        $slider.animate({
          'left' : positionLeft
        }, 400, function() {
          isSliding = 0;
        });


        $selected.removeClass('selected');
        $parent.addClass('selected');

        $curSlide.removeClass('selected');
        $newSlide.addClass('selected');


        if (curScreenBreakpointSlider == 'xs') {
          if((newIndex == (totSlides-1))) {
            $btnNext.addClass('disabled').hide();
          }
          if(newIndex == 0) {
            $btnPrev.addClass('disabled').hide();
          }
        }
        
        if ($('li:last', $tabsContainer).hasClass('selected') && $('.slide-pager a:last', $newSlide).hasClass('selected')) {
          $btnNext.addClass('disabled').fadeOut();
        }
        
        if ($('li:eq(0)', $tabsContainer).hasClass('selected') && $('.slide-pager a:eq(0)', $newSlide).hasClass('selected')) {
          $btnPrev.addClass('disabled').fadeOut();
        }
        

      }


      function changeImage($this) {
        var $pagerContainer = $this.parents('.slide-pager');
        var $items = $('a', $pagerContainer);
        var $parent = $pagerContainer.parents('li');
        var $slideContent = $('.slide-content', $parent);
        var slideContentWidth = $slideContent.width();

        if($this.hasClass('selected')){isSliding = 0;return false;}

        var $selected = $('.selected', $pagerContainer);

        var contentPostion = $slideContent.position().left;

        var curIndex = $items.index($selected);
        var newIndex = $items.index($this);

        var $curSlidePad = $('.slide-image-pad.active', $parent);
        var $newSlidePad = $('.slide-image-pad:eq('+newIndex+')', $parent);

        var $curSlideImage = $('.slide-image.selected', $parent);
        var $newSlideImage = $('.slide-image:eq('+newIndex+')', $parent);

        changePosition = 0;

        if (newIndex > curIndex) {
          for(i=curIndex; i<newIndex; i++) {
            var $si = $('.slide-image:eq('+i+')', $parent);
            changePosition += $si.width();
          }
          contentPostion += changePosition;
          positionLeft -= changePosition;

        } else {

          for(i=curIndex; i>newIndex; i--) {
            var $si = $('.slide-image:eq('+(i-1)+')', $parent);
            changePosition += $si.width();
          }
          contentPostion -= changePosition;
          positionLeft += changePosition;
        } 


        $curSlidePad.animate({width: 0});
        $newSlidePad.animate({width: slideContentWidth});

        $slideContent.animate({left: contentPostion});
        $slider.animate({left: positionLeft}, 400, function() {isSliding = 0;});

        $curSlidePad.removeClass('active');
        $newSlidePad.addClass('active');

        $selected.removeClass('selected');
        $this.addClass('selected');

        $curSlideImage.removeClass('selected');
        $newSlideImage.addClass('selected');
      }

      function navigateSlides(t) {
        var $curSlide = $('li.selected', $slider);
        var curSlideIndex = $slides.index($curSlide);
        var newSlideIndex = $slides.index($curSlide);

        var $slideImages = $('.slide-pager a', $curSlide);
        var $curImage = $('.slide-pager a.selected', $curSlide);
        var curSlideImageIndex = $slideImages.index($curImage);

        var totSlides = $slides.length;
        var totImages = $slideImages.length;

        if ($btnPrev.hasClass('disabled')) {
          $btnPrev.removeClass('disabled').fadeIn();
        }

        if ($btnNext.hasClass('disabled')) 
          $btnNext.removeClass('disabled').fadeIn();


        if (t=='next') {
          if(curSlideImageIndex < (totImages-1) && curScreenBreakpointSlider != 'xs') {
            $newImage = $('.slide-pager a:eq('+(curSlideImageIndex+1)+')', $curSlide);
            changeImage($newImage)
            curSlideImageIndex++;
          } else {
            $newTab = $('a:eq('+(curSlideIndex+1)+')', $tabsContainer)
            changeTab($newTab)
          }
          newSlideIndex = curSlideIndex+1;
        } else {
          if(curSlideImageIndex > 0 && curScreenBreakpointSlider != 'xs') {
            $newImage = $('.slide-pager a:eq('+(curSlideImageIndex-1)+')', $curSlide);
            changeImage($newImage)
            curSlideImageIndex--;
          } else {
            $newTab = $('a:eq('+(curSlideIndex-1)+')', $tabsContainer)
            changeTab($newTab)
          }
          newSlideIndex = curSlideIndex-1;
        }


        if (curScreenBreakpointSlider != 'xs') {
          if((curSlideIndex == (totSlides-1)) && (curSlideImageIndex == (totImages-1))) {
            $btnNext.addClass('disabled').hide();
          }

          if(curSlideIndex == 0 && curSlideImageIndex == 0) {
            $btnPrev.addClass('disabled').hide();
          }
        } else {
          if((newSlideIndex == (totSlides-1))) {
            $btnNext.addClass('disabled').hide();
          }
          if(newSlideIndex == 0) {
            $btnPrev.addClass('disabled').hide();
          }
        }
  //      isSliding = 0;
      }
      
    });
  }
  
  
  function rePositionMainSlider() {
    sliderHeight = $('#page-slider .bx-wrapper').height();
    if(sliderHeight > 700) {
      marginTop = (sliderHeight-700)/2
      $('#page-slider .bx-wrapper').css({
        'margin-top': (marginTop * -1)
      });
      $('#page-slider .bx-pager').css({
        'bottom': (marginTop + 40)
      });
    }
  }
  
  
  function swipeLeft(event){slider.goToNextSlide();}            
  function swipeRight(event){slider.goToPrevSlide();} 
  
} )( jQuery );