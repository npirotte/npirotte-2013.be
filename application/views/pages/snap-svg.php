<section class="si-icons si-icons-default">
				<span class="si-icon si-icon-nav-left-arrow" data-icon-name="navLeftArrow"></span>
				<span class="si-icon si-icon-nav-up-arrow" data-icon-name="navUpArrow"></span>
				<span class="si-icon si-icon-right-arrow" data-icon-name="rightArrow"></span>
				<span class="si-icon si-icon-down-arrow" data-icon-name="downArrow"></span>
				<span class="si-icon si-icon-hamburger" data-icon-name="hamburger"></span>
				<span class="si-icon si-icon-hamburger-cross" data-icon-name="hamburgerCross"></span>
				<span class="si-icon si-icon-plus" data-icon-name="plus"></span>
				<span class="si-icon si-icon-plus-cross" data-icon-name="plusCross"></span>
				<span class="si-icon si-icon-maximize" data-icon-name="maximize"></span>
				<span class="si-icon si-icon-maximize-rotate" data-icon-name="maximizeRotate"></span>
				<span class="si-icon si-icon-contract" data-icon-name="contract"></span>
				<span class="si-icon si-icon-play" data-icon-name="play"></span>
				<span class="si-icon si-icon-monitor" data-icon-name="monitor"></span>
				<span class="si-icon si-icon-trash" data-icon-name="trash"></span>
				<span class="si-icon si-icon-flag" data-icon-name="flag"></span>
				<span class="si-icon si-icon-volume" data-icon-name="volume"></span>
				<span class="si-icon si-icon-clock" data-icon-name="clock"></span>
				<span class="si-icon si-icon-mail" data-icon-name="mail"></span>
				<span class="si-icon si-icon-smiley" data-icon-name="smiley"></span>
				<span class="si-icon si-icon-equalizer" data-icon-name="equalizer"></span>
				<span class="si-icon si-icon-glass-empty" data-icon-name="glass"></span>
				<span class="si-icon si-icon-lock" data-icon-name="padlock"></span>
				<span class="si-icon si-icon-hourglass" data-icon-name="hourglass"></span>
				<span class="si-icon si-icon-zoom" data-icon-name="zoom"></span>
			</section>


<script>
	var svgIconConfig = {
			clock : { 
			url : '/content/default/img/svg/clock.svg',
			animation : [
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 32 32"}' }, 
						to : { val : '{"transform" : "r630 32 32"}' } 
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val :'{"transform" : "r0 32 32"}' }, 
						to : { val : '{"transform" : "r80 32 32"}' } 
					} 
				},
			]
		},
		trash : { 
			url : '/content/default/img/svg/trash.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}' }, 
						to : { val : '{"transform" : "t0 -8"}' } 
					} 
				}
			]
		},
		contract : { 
			url : '/content/default/img/svg/contract.svg',
			animation : [
				{ 
					el : 'rect:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}', after : '{ "opacity" : 0 }' }, 
						to : { val : '{"transform" : "t-5 -5"}', before : '{ "opacity" : 1 }' }
					} 
				},
				{ 
					el : 'rect:nth-child(3)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}', after : '{ "opacity" : 0 }' }, 
						to : { val : '{"transform" : "t-10 -10"}', before : '{ "opacity" : 1 }' }
					} 
				}
			]
		},
		maximize : { 
			url : '/content/default/img/svg/maximize.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}' }, 
						to : { val : '{"transform" : "t-5 -5"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}' }, 
						to : { val : '{"transform" : "t5 -5"}' }
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}' }, 
						to : { val : '{"transform" : "t-5 5"}' }
					} 
				},
				{ 
					el : 'path:nth-child(4)', 
					animProperties : { 
						from : { val : '{"transform" : "t0 0"}' }, 
						to : { val : '{"transform" : "t5 5"}' }
					} 
				}
			]
		},
		maximizeRotate : { 
			url : '/content/default/img/svg/maximize.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 16 16 t0 0"}' }, 
						to : { val : '{"transform" : "r180 16 16 t-5 -5"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 48 16 t0 0"}' }, 
						to : { val : '{"transform" : "r-180 48 16 t5 -5"}' }
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 16 48 t0 0"}' }, 
						to : { val : '{"transform" : "r-180 16 48 t-5 5"}' }
					} 
				},
				{ 
					el : 'path:nth-child(4)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 48 48 t0 0"}' }, 
						to : { val : '{"transform" : "r180 48 48 t5 5"}' }
					} 
				}
			]
		},
		volume : {
			url : '/content/default/img/svg/volume.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "t-10 0 s0 32 32"}' }, 
						to : { val : '{"transform" : "t0 0 s1 32 32", "opacity" : 1}', before : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : .5 }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : .25 }, 
						to : { val : '{"transform" : "t0 0 s1 32 32", "opacity" : 1}', before : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : .25 }
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : .5 }, 
						to : { val : '{"transform" : "t0 0 s1 32 32", "opacity" : 1}', before : '{"transform" : "t-10 0 s0 32 32"}' }
					} 
				}
			]
		},
		plus : { 
			url : '/content/default/img/svg/plus.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 32 32", "opacity" : 1}' }, 
						to : { val : '{"transform" : "r180 32 32", "opacity" : 0}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 32 32"}' }, 
						to : { val : '{"transform" : "r180 32 32"}' }
					} 
				}
			]
		},
		plusCross : { 
			url : '/content/default/img/svg/plus.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 32 32"}' }, 
						to : { val : '{"transform" : "r45 32 32"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "r0 32 32"}' }, 
						to : { val : '{"transform" : "r45 32 32"}' }
					} 
				}
			]
		},
		hamburger : {
			url : '/content/default/img/svg/hamburger.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"path" : "m 5.0916789,20.818994 53.8166421,0"}' }, 
						to : { val : '{"path" : "m 5.091679,9.771104 53.816642,0"}' }
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val : '{"path" : "m 5.0916788,42.95698 53.8166422,0"}' }, 
						to : { val : '{"path" : "m 5.0916789,54.00487 53.8166421,0"}' }
					} 
				}
			]
		},
		hamburgerCross : {
			url : '/content/default/img/svg/hamburger.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"path" : "m 5.0916789,20.818994 53.8166421,0"}' }, 
						to : { val : '{"path" : "M 12.972944,50.936147 51.027056,12.882035"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "s1 1", "opacity" : 1}', before : '{"transform" : "s0 0"}' }, 
						to : { val : '{"opacity" : 0}' }
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val : '{"path" : "m 5.0916788,42.95698 53.8166422,0"}' }, 
						to : { val : '{"path" : "M 12.972944,12.882035 51.027056,50.936147"}' }
					} 
				}
			]
		},
		navLeftArrow : {
			url : '/content/default/img/svg/nav-left-arrow.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "M 48.592939,9.792208 15.407062,31.887987 48.592939,54.025974"}' }, 
						to : { val : '{"path" : "M 15.407062,9.792208 48.592939,31.887987 15.407062,54.025974"}' }
					} 
				}
			]
		},
		navUpArrow : {
			url : '/content/default/img/svg/nav-up-arrow.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "M 9.8831175,48.502029 31.978896,15.316152 54.116883,48.502029"}' }, 
						to : { val : '{"path" : "M 9.8831175,15.316152 31.978896,48.502029 54.116883,15.316152"}' }
					} 
				}
			]
		},
		rightArrow : {
			url : '/content/default/img/svg/right-arrow.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "M 34.419061,13.24425 57.580939,32.017897 34.419061,50.75575"}' }, 
						to : { val : '{"path" : "M 31.580939,13.24425 8.419061,32.017897 31.580939,50.75575"}' }
					} 
				}
			]
		},
		downArrow : {
			url : '/content/default/img/svg/down-arrow.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "M 14.083963,33.258774 32.85761,56.420652 51.595463,33.258774"}' }, 
						to : { val : '{"path" : "M 14.083963,30.420652 32.85761,7.258774 51.595463,30.420652"}' }
					} 
				}
			]
		},
		smiley : {
			url : '/content/default/img/svg/smiley.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "m 19.380224,39.901132 c 0,0 4.860771,5.28501 12.770151,5.28501 7.909379,0 12.770152,-5.28501 12.770152,-5.28501"}' }, 
						to : { val : '{"path" : "m 19.380224,45.186142 c 0,0 4.860771,-5.28501 12.770151,-5.28501 7.909379,0 12.770152,5.28501 12.770152,5.28501"}' }
					} 
				}
			]
		},
		play : {
			url : '/content/default/img/svg/play.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "M 18.741071,52 31.30178,42.531655 45.258928,31.887987 18.741071,12 z"}' }, 
						to : { val : '{"path" : "m 12.5,52 39,0 0,-40 -39,0 z"}' }
					} 
				}
			]
		},
		mail : {
			url : '/content/default/img/svg/mail.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "m 61.693118,24.434001 -59.386236,0 29.692524,19.897984 z"}' }, 
						to : { val : '{"path" : "m 61.693118,24.434001 -59.386236,0 29.692524,-19.7269617 z"}' }
					} 
				}
			]
		},
		equalizer : {
			url : '/content/default/img/svg/equalizer.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "t 0 0"}' }, 
						to : { val : '{"transform" : "t 0 -30"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "t 0 0"}' }, 
						to : { val : '{"transform" : "t 0 35"}' }
					} 
				},
				{ 
					el : 'path:nth-child(3)', 
					animProperties : { 
						from : { val : '{"transform" : "t 0 0"}' }, 
						to : { val : '{"transform" : "t 0 -10"}' }
					} 
				}
			]
		},
		glass : {
			url : '/content/default/img/svg/glass.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "m 16.778805,44 c 0,0 9.518312,-3.481153 13.221195,-2 10,4 17.153596,2 17.153596,2 L 45,54 20,54 z"}' }, 
						to : { val : '{"path" : "M 13.183347,29 C 13.183347,29 25,31.439358 30,29 c 12.710171,-6.200932 20,0 20,0 l -5,25 -25,0 z"}' }
					} 
				}
			]
		},
		hourglass : {
			url : '/content/default/img/svg/hourglass.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "r 0 32 32"}' }, 
						to : { val : '{"transform" : "r 180 32 32"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "r 0 32 32"}', animAfter : '{"path" : "m 31,32 2,0 0,0 9,15 -20,0 9,-15 z"}' }, 
						to : { val : '{"transform" : "r 180 32 32"}', animAfter : '{"path" : "m 22,17 20,0 -9,15 0,0 -2,0 0,0 z"}' }
					} 
				}
			]
		},
		padlock : {
			url : '/content/default/img/svg/padlock.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"transform" : "t 0 0"}' }, 
						to : { val : '{"transform" : "t 0 -11"}' }
					} 
				}
			]
		},
		zoom : {
			url : '/content/default/img/svg/zoom.svg',
			animation : [
				{ 
					el : 'path:nth-child(1)', 
					animProperties : { 
						from : { val : '{"transform" : "s 1 1"}' }, 
						to : { val : '{"transform" : "s 1.1 1.1"}' }
					} 
				},
				{ 
					el : 'path:nth-child(2)', 
					animProperties : { 
						from : { val : '{"transform" : "s 1 1", "stroke-width" : "1"}' }, 
						to : { val : '{"transform" : "s 2 2", "stroke-width" : "2"}' }
					} 
				}
			]
		},
		monitor : {
			url : '/content/default/img/svg/monitor.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "m 5,11.75 0,33.75 20.25,0 -6.75,6.75 27,0 -6.75,-6.75 20.25,0 0,-33.75 -54,0 z m 2.65625,2.875 48.6875,0 0,27.8125 -48.6875,0 0,-27.8125 z"}' }, 
						to : { val : '{"path" : "m 21.875,16.8125 0,30.375 3.375,0 3.5,0 3.25,0 6.75,0 3.375,0 0,-30.375 -20.25,0 z m 3.375,3.375 13.5,0 0,20.25 -13.5,0 0,-20.25 z m 6.75,22.25 c 0.756641,0 1.375,0.618359 1.375,1.375 0,0.756641 -0.618359,1.375 -1.375,1.375 -0.756641,0 -1.375,-0.618359 -1.375,-1.375 0,-0.756641 0.618359,-1.375 1.375,-1.375 z"}' }
					} 
				}
			]
		},
		flag : {
			url : '/content/default/img/svg/flag.svg',
			animation : [
				{ 
					el : 'path', 
					animProperties : { 
						from : { val : '{"path" : "m 11.75,11.75 c 0,0 10.229631,3.237883 20.25,0 10.020369,-3.2378833 20.25,0 20.25,0 l 0,27 c 0,0 -6.573223,-3.833185 -16.007359,0 -9.434136,3.833185 -24.492641,0 -24.492641,0 z"}' }, 
						to : { val : '{"path" : "m 11.75,11.75 c 0,0 8.373476,-4.8054563 17.686738,0 9.313262,4.805456 22.813262,0 22.813262,0 l 0,27 c 0,0 -11.699747,4.363515 -22.724874,0 C 18.5,34.386485 11.75,38.75 11.75,38.75 z"}' }
					} 
				}
			]
		}
	};



	/**
 * svgicons.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	/*** helper functions ***/

	// from https://github.com/desandro/classie/blob/master/classie.js
	function classReg( className ) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	function hasClass( el, c ) {
		return 'classList' in document.documentElement ? el.classList.contains( c ) : classReg( c ).test( el.className )
	}

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// from http://stackoverflow.com/a/11381730/989439
	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	// http://snipplr.com/view.php?codeview&id=5259
	function isMouseLeaveOrEnter( e, handler ) { 
		if (e.type != 'mouseout' && e.type != 'mouseover') return false; 
		var reltg = e.relatedTarget ? e.relatedTarget : 
		e.type == 'mouseout' ? e.toElement : e.fromElement; 
		while (reltg && reltg != handler) reltg = reltg.parentNode; 
		return (reltg != handler); 
	}

	/*** svgIcon ***/

	function svgIcon( el, config, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
		this.svg = Snap( this.options.size.w, this.options.size.h );
		this.svg.attr( 'viewBox', '0 0 64 64' );
		this.el.appendChild( this.svg.node );
		// state
		this.toggled = false;
		// click event (if mobile use touchstart)
		this.clickevent = mobilecheck() ? 'touchstart' : 'click';
		// icons configuration
		this.config = config[ this.el.getAttribute( 'data-icon-name' ) ];
		// reverse?
		if( hasClass( this.el, 'si-icon-reverse' ) ) {
			this.reverse = true;
		}
		if( !this.config ) return;
		var self = this;
		// load external svg
		Snap.load( this.config.url, function (f) {
			var g = f.select( 'g' );
			self.svg.append( g );
			self.options.onLoad();
			self._initEvents();
			if( self.reverse ) {
				self.toggle();
			}
		});
	}

	svgIcon.prototype.options = {
		speed : 200,
		easing : mina.linear,
		evtoggle : 'click', // click || mouseover
		size : { w : 64, h : 64 },
		onLoad : function() { return false; },
		onToggle : function() { return false; }
	};

	svgIcon.prototype._initEvents = function() {
		var self = this, toggleFn =  function( ev ) {
				if( ( ( ev.type.toLowerCase() === 'mouseover' || ev.type.toLowerCase() === 'mouseout' ) && isMouseLeaveOrEnter( ev, this ) ) || ev.type.toLowerCase() === self.clickevent ) {
					self.toggle(true);
					self.options.onToggle();	
				}
			};

		if( this.options.evtoggle === 'mouseover' ) {
			this.el.addEventListener( 'mouseover', toggleFn );
			this.el.addEventListener( 'mouseout', toggleFn );
		}
		else {
			this.el.addEventListener( this.clickevent, toggleFn );
		}
	};

	svgIcon.prototype.toggle = function( motion ) {
		if( !this.config.animation ) return;
		var self = this;
		for( var i = 0, len = this.config.animation.length; i < len; ++i ) {
			var a = this.config.animation[ i ],
				el = this.svg.select( a.el ),
				animProp = this.toggled ? a.animProperties.from : a.animProperties.to,
				val = animProp.val, 
				timeout = motion && animProp.delayFactor ? animProp.delayFactor : 0;
			
			if( animProp.before ) {
				el.attr( JSON.parse( animProp.before ) );
			}

			if( motion ) {
				setTimeout(function( el, val, animProp ) { 
					return function() { el.animate( JSON.parse( val ), self.options.speed, self.options.easing, function() {
						if( animProp.after ) {
							this.attr( JSON.parse( animProp.after ) );
						}
						if( animProp.animAfter ) {
							this.animate( JSON.parse( animProp.animAfter ), self.options.speed, self.options.easing );
						}
					} ); }; 
				}( el, val, animProp ), timeout * self.options.speed );
			}
			else {
				el.attr( JSON.parse( val ) );
			}
				
		}
		this.toggled = !this.toggled;
	};

	// add to global namespace
	window.svgIcon = svgIcon;

})( window );

[].slice.call( document.querySelectorAll( '.si-icons-default > .si-icon' ) ).forEach( function( el ) {
					var svgicon = new svgIcon( el, svgIconConfig );
				} );
</script>