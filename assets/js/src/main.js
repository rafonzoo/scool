import { localNavigation } from "./local/navigation";
import { skipLinkFocusFix } from "./local/skip-link-focus-fix";
import { spinWheelEvent } from "./spinwheel";

/**
 * Release default underscore script.
 * Skip to focus and navigation toggle
 */
localNavigation(); skipLinkFocusFix(); 
spinWheelEvent();

/**
 * Replace feather attribute as Icon
 * @param feathericon(c)
 */
// @ts-ignore
 feather.replace();

 /**
	* Get computed background color to match
	* the body element or user want to.
	*/
	// document.addEventListener('DOMContentLoaded', () => {
	// 	const header = document.getElementById('masthead');
	// 	const menu = document.getElementById('primary-menu');
	// 	const bodyBg = window.getComputedStyle(document.body);
	// 	const bgProp = bodyBg.getPropertyValue('background-color');

	// 	[].concat(header, menu).forEach(item => {
	// 		item.style.backgroundColor = `${bgProp}`; 
	// 	});
	// });

	/**
	 * Get rotate animation for a while and run
	 * only after the document completely loaded
	 */
	document.onreadystatechange = () => {
		const figureLanding = document.getElementById('image-landing');
		const figureLanding2 = document.getElementById('image-landing-2');
		const figureLanding3 = document.getElementById('image-radial');
		const figureLanding4 = document.getElementById('image-backcover');
		if (document.readyState === 'complete') {
			figureLanding.setAttribute('data-spin-animation', 'roll');
			figureLanding3.setAttribute('data-spin-animation', 'roll');
			figureLanding4.setAttribute('data-spin-animation', 'roll');
			figureLanding2.setAttribute('data-type-animation', 'reveal-opacity');
			setTimeout(() => {
				document.body.dataset.bodyScroll = `unlocked`;
				figureLanding.setAttribute('data-spin-animation', 'off');
				figureLanding2.setAttribute('data-type-animation', 'off');
				figureLanding3.setAttribute('data-spin-animation', 'off');
				figureLanding4.setAttribute('data-spin-animation', 'off');
				figureLanding2.setAttribute('data-spin-effect', 'cubic-roll');
				figureLanding3.setAttribute('data-spin-effect', 'cubic-roll');
			}, 7000);
		}
	}
	document.body.dataset.bodyScroll = `unlocked`;