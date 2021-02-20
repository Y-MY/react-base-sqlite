document.addEventListener('plusready', function () {
	plus.screen.lockOrientation('portrait-primary'); 
	if(plus.os.name === 'iOS') {
		addCSS();
	}
});

function addCSS() {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = 'css/video.css';
	document.getElementsByTagName("head")[0].appendChild(link);
}