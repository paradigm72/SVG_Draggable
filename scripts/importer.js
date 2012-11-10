//Basic lightweight importer for other Javascript class files
function importClass(path) {
	newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.src = path;
	document.getElementsByTagName('head')[0].appendChild(newScript);	
}
