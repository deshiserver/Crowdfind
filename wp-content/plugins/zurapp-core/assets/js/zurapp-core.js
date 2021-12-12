(function ( $ ) {
	'use strict';

	/**
	 * Global callback function for handling AJAX errors
	 *
	 * @param xhr
	 * @param status
	 * @param error
	 */
	var zurappCoreOnAjaxFail = function ( xhr, status, error ) {
		console.log( [ 'zurapp.core.ajax.error', status, error, xhr, xhr.responseText ] );
	};

	/**
	 * Convert loaded posts through AJAX from raw HTML to jQuery Object.
	 * Used for "Load More" and "Infinite Scroll" function.
	 *
	 * @param {Array} data Array of posts, raw HTML
	 * @returns {Array}
	 */
	var zurappCoreParsePosts = function ( data ) {
		var $posts = [];

		$.each( data, function ( index, post ) {
			var parsed = $.parseHTML( post );
			$posts.push( parsed[0] );
		} );

		return $posts;
	};

	/**
	 * Collect all Isotope Grids from shortcodes.
	 *
	 * @param selector Isotopes service class
	 * @returns {Array}
	 */
	function zurappCollectIsotopeGrids( selector ) {
		var $isotopes = $( selector );
		var grids = [];
		if ( $isotopes.length > 0 ) {
			$.each( $isotopes, function ( i, isotope ) {
				var ID = $( isotope ).attr( 'id' );
				grids.push( ID );
			} );
		}

		return grids;
	}

	/**
	 * Collect all Isotope Filters from shortcodes.
	 *
	 * @param selector Isotope Filters service class
	 * @returns {Array}
	 */
	function zurappCollectIsotopeFilters( selector ) {
		var $filters = $( selector );
		var filters = [];
		if ( $filters.length > 0 ) {
			$.each( $filters, function ( i, filter ) {
				var ID = $( filter ).attr( 'id' );
				filters.push( ID );
			} );
		}

		return filters;
	}

    /**
     * Portfolio AJAX loading
     */
    $( document ).on( 'click', '.zurapp-portfolio-more', function ( e ) {
        e.preventDefault();

        var button = $( this ),
            posts = button.data( 'posts' ),
            query = button.data( 'query' ),
            filtersId = button.data( 'filters-id' ),
            gridId = button.data( 'grid-id' );

        var formdata = {
            action: 'zurapp_portfolio_more',
            nonce: zurappCore.nonce,
            posts: posts,
            query: query
        };

        $.post( zurappCore.ajaxurl, formdata ).done( function ( response ) {
            if ( false === response.success ) {
                return false;
            }

            console.log( response );

            // Some isotope magic: convert html string to jQuery Object
            var $posts = zurappCoreParsePosts( response.data ),
                $container = zurappCore.isotopes.containers[ gridId ];

            $container.append( $posts ).isotope( 'appended', $posts );

            // Remove button
            button.remove();

        } ).fail( zurappCoreOnAjaxFail );
    } );

	$( document ).ready( function ( e ) {
		/**
		 * Collect all isotope grids for further initialization
		 */
		return;
		zurappCore.isotopes.grids = zurappCollectIsotopeGrids( '.zurapp-isotope' );
		zurappCore.isotopes.filters = zurappCollectIsotopeFilters( '.zurapp-isotope-filter' );

		// Featured Tabs auto switching
		var $autoTab = $( '.featured-tabs .nav-tabs[data-autoswitch]' );
		if ( $autoTab.length > 0 ) {
			var $changeInterval = $( '.featured-tabs .nav-tabs' ).data( 'interval' );
			setInterval( function () {
				var $tabs = $( '.featured-tabs .nav-tabs > li' ),
					$active = $tabs.filter( '.active' ),
					$next = $active.next( 'li' ),
					$toClick = $next.length ? $next.find( 'a' ) : $tabs.eq( 0 ).find( 'a' );

				$toClick.trigger( 'click' );
			}, $changeInterval );
		}

		// Device Carousel
		var $phoneCarousel = $( '.phone-carousel .inner' );
		if ( $phoneCarousel.length > 0 ) {
			$phoneCarousel.each( function () {
				var $parent = $( this ).parents( '.phone-carousel' );

				var dataLoop = $parent.data( 'loop' ),
					autoPlay = $parent.data( 'autoplay' ),
					timeOut = $parent.data( 'interval' );

				$( this ).owlCarousel( {
					items: 1,
					loop: dataLoop,
					margin: 0,
					nav: false,
					dots: true,
					navText: [,],
					autoplay: autoPlay,
					autoplayTimeout: timeOut,
					autoHeight: true
				} );
			} );
		}

		// Image Carousel
		var $imageCarousel = $( '.image-carousel .inner' );
		if ( $imageCarousel.length > 0 ) {
			$imageCarousel.each( function () {

				var $parent = $( this ).parent(),
					dataLoop = $parent.data( 'loop' ),
					autoPlay = $parent.data( 'autoplay' ),
					timeOut = $parent.data( 'interval' ),
					autoheight = $parent.data( 'autoheight' );

				$( this ).owlCarousel( {
					items: 1,
					loop: dataLoop,
					margin: 0,
					nav: true,
					dots: false,
					navText: [,],
					autoplay: autoPlay,
					autoplayTimeout: timeOut,
					autoHeight: autoheight
				} );
			} );
		}

		// Quotation Carousel
		var $quoteCarousel = $( '.quote-carousel .inner' );
		if ( $quoteCarousel.length > 0 ) {
			$quoteCarousel.each( function () {

				var $parent = $( this ).parent(),
					dataLoop 	 = $parent.data( 'loop' ),
					autoPlay   = $parent.data( 'autoplay' ),
					timeOut    = $parent.data( 'interval' );

				$( this ).owlCarousel( {
					items: 1,
					loop: dataLoop,
					margin: 0,
					nav: false,
					dots: true,
					navText: [ , ],
					autoplay: autoPlay,
					autoplayTimeout: timeOut,
					autoHeight: true
				} );
			} );
		}

		// Clients Carousel
		var $clientCarousel = $( '.clients-carousel .inner' );
		if ( $clientCarousel.length > 0 ) {
			$clientCarousel.each( function () {

				var $parent = $( this ).parent(),
					dataLoop = $parent.data( 'loop' ),
					autoPlay = $parent.data( 'autoplay' ),
					timeOut = $parent.data( 'interval' );

				$( this ).owlCarousel( {
					loop: dataLoop,
					margin: 20,
					nav: false,
					dots: false,
					autoplay: autoPlay,
					autoplayTimeout: timeOut,
					responsiveClass: true,
					responsive: {
						0: {items: 2},
						480: {items: 3},
						700: {items: 4},
						1000: {items: 5},
						1200: {items: 6},
						1330: {items: 6, margin: 60}
					}
				} );
			} );
		}

		// Gallery Popup
		var $gallItem = $( '.gal-item' );
		if ( $gallItem.length > 0 ) {
			$gallItem.magnificPopup( {
				type: 'image',
				mainClass: 'mfp-fade',
				gallery: {
					enabled: true
				},
				removalDelay: 500,
				image: {
					titleSrc: 'data-title'
				}
			} );
		}

		// Video Popup
		var $videoBtn = $( '.video-popup-btn' );
		if ( $videoBtn.length > 0 ) {
			$videoBtn.magnificPopup( {
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 500
			} );
		}

		// Google Maps API
		var $googleMap = $( '.google-map' );
		if ( $googleMap.length > 0 ) {
			$googleMap.each( function () {
				var $self = $( this ),
					mapHeight = $self.data( 'height' ),
					address = $self.data( 'address' ),
					zoom = $self.data( 'zoom' ),
					controls = $self.data( 'disable-controls' ),
					scrollwheel = $self.data( 'scrollwheel' ),
					marker = $self.data( 'marker' ),
					markerTitle = $self.data( 'marker-title' ),
					styles = $self.data( 'styles' );
				$self.height( mapHeight );
				$self.gmap3( {
					marker: {
						address: address,
						data: markerTitle,
						options: {
							icon: marker
						},
						events: {
							mouseover: function ( marker, event, context ) {
								var map = $( this ).gmap3( "get" ),
									infowindow = $( this ).gmap3( {get: {name: "infowindow"}} );
								if ( infowindow ) {
									infowindow.open( map, marker );
									infowindow.setContent( context.data );
								} else {
									$( this ).gmap3( {
										infowindow: {
											anchor: marker,
											options: {content: context.data}
										}
									} );
								}
							},
							mouseout: function () {
								var infowindow = $( this ).gmap3( {get: {name: "infowindow"}} );
								if ( infowindow ) {
									infowindow.close();
								}
							}
						}
					},
					map: {
						options: {
							zoom: zoom,
							disableDefaultUI: controls,
							scrollwheel: scrollwheel,
							styles: styles
						}
					}
				} );
			} );
		}
	} );

	// On window load functions
	$( window ).on( 'load', function () {

        /**
         * Dynamically init the isotope grids
         */
        if (zurappCore.isotopes.grids.length > 0) {
            $.each(zurappCore.isotopes.grids, function (index, gridID) {
                var $grid = $('#' + gridID);

                zurappCore.isotopes.containers[gridID] = $grid.isotope({
                    itemSelector: '.grid-item',
                    transitionDuration: '0.7s',
                    masonry: {
                        columnWidth: '.grid-sizer',
                        gutter: '.gutter-sizer'
                    }
                });
            });
        }

		/**
		 * Dynamically attach the isotope filtration to isotope grids
		 */
		if ( zurappCore.isotopes.filters.length > 0 ) {
			$.each( zurappCore.isotopes.filters, function ( index, filtersID ) {
				if ( 'false' === filtersID ) {
					return false;
				}

				// Create $filters
				// Where $filters is a jQuery object of container <ul> with filters.
				var $filters = $( '#' + filtersID );

				// Find all <a> inside <ul> filters and bind the click on them
				$filters.find( 'a' ).click( function ( e ) {
					e.preventDefault();
					var $this = $( this ),
						filter = $this.data( 'filter' ),
						gridId = $filters.data( 'grid-id' );

					// don't proceed if already selected
					if ( $this.parent( 'li' ).hasClass( 'active' ) ) {
						return false;
					}

					// Add class .active for recently clicked item
					$filters.find( '.active' ).removeClass( 'active' );
					$this.parent( 'li' ).addClass( 'active' );

					// make option object dynamically, i.e. { filter: '.my-filter-class' }
					// and apply new options to isotope containers
					zurappCore.isotopes.containers[ gridId ].isotope( { filter: filter } );

					return false;
				} );
			} );
		}

	} );

	/**
	 * Twitter share window
	 *
	 * @uses Twitter Web Intents
	 * @link https://dev.twitter.com/web/tweet-button/web-intent
	 */
	$( document ).on( 'click', '.zurapp-share-twitter', function ( e ) {
		e.preventDefault();
		var self = $( this ),
			query = {
				text: self.data( 'text' ),
				url: self.data( 'url' )
			};

		var uri = $.param( query );
		window.open( 'http://twitter.com/intent/tweet?' + uri, 'twitter', 'menubar=no,toolbar=no,resizable=yes,scrollbars=no,status=0,location=0,height=380,width=660' );
	} );

	/**
	 * Facebook share
	 *
	 * @link https://developers.google.com/+/web/share/#sharelink
	 */
	$( document ).on( 'click', '.zurapp-share-facebook', function ( e ) {
		e.preventDefault();
		var self = $( this ),
			query = { u: self.data( 'url' ) };

		var uri = $.param( query );
		window.open( 'https://www.facebook.com/sharer/sharer.php?' + uri, 'facebook', 'menubar=yes,toolbar=yes,resizable=yes,scrollbars=yes,height=600,width=600' );
	} );

	/**
	 * Google+ share
	 *
	 * @link https://developers.google.com/+/web/share/#sharelink
	 */
	$( document ).on( 'click', '.zurapp-share-google-plus', function ( e ) {
		e.preventDefault();
		var self = $( this ),
			query = { url: self.data( 'url' ) };

		var uri = $.param( query );
		window.open( 'https://plus.google.com/share?' + uri, 'googleplus', 'menubar=no,toolbar=no,resizable=yes,scrollbars=no,height=600,width=600' );
	} );

	/**
	 * Pinterest share
	 */
	$( document ).on( 'click', '.zurapp-share-pinterest', function ( e ) {
		e.preventDefault();
		var self = $( this ),
			query = {
				url: self.data( 'url' ),
				media: self.data( 'thumb' ),
				description: self.data( 'text' )
			};

		var uri = $.param( query );
		window.open( 'https://pinterest.com/pin/create/button/?' + uri, 'pinterest', 'menubar=no,toolbar=no,resizable=yes,scrollbars=no,height=600,width=600' );
	} );

})( jQuery );
