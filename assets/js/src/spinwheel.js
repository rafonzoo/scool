export function spinWheelEvent() {
	const landingImage = document.getElementById('image-landing');
	const landingImage2 = document.getElementById('image-landing-2');
	const landingImage3 = document.getElementById('image-radial');

	const requestAnimation = window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function (callback) { window.setTimeout(callback, 1000 / 60); };

	let scrollTicking = false;
	let scrollWinY 		= 0;

	(function initSpinYaxis() {
		scrollWinY = window.pageYOffset;
		landingImage.style.transform = `translate(-50%,-50%)rotate(${ scrollWinY }deg)`;
		landingImage3.style.transform = `translate(-50%,-50%)rotate(${ scrollWinY }deg)`;
	})();

	function spinScrolling() {
		scrollWinY = window.scrollY;
		if ( document.body.dataset.bodyScroll === 'unlocked' ) {
			return spinScrollTick();
		}
	}

	function spinScrollTick() {
    if( scrollTicking !== true ) {
			requestAnimation( spinUpdate );
			scrollTicking = true;
    }
	}

	function spinUpdate() {
		landingImage.style.transform = `translate(-50%,-50%)rotate(${ scrollWinY }deg)`;
		landingImage3.style.transform = `translate(-50%,-50%)rotate(${ scrollWinY }deg)`;

		scrollTicking = false;
	}

	window.addEventListener('scroll', spinScrolling, false);
}