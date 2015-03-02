/**
 * Holds all of the getter and setter methods for the views and page rendering
 */

/**
 * clears all of div's on the page 
 */
function clearPageElements(){
	 clearFooter();
	 clearHeader();
	 clearNav();
	 clearSideBar();
	 clearContainer();
	 clearSection();
}

/**
 * clearFooter clears the footer on the page 
 */
function clearFooter(){
	var footer =document.getElementsByTagName("footer")[0];
	footer.innerHTML = '';
}

/**
 * clearNav clears the navigation bar on the page 
 */
function clearNav(){
	var nav = document.getElementsByTagName("nav")[0];
	nav.innerHTML = '';
}

/**
 * clearSideBar clears the side bar on the page 
 */
function clearSideBar(){
	var sideBar = document.getElementsByTagName("aside")[0];
	sideBar.innerHTML = '';
}

/**
 * clearHeader clears the header on the page 
 */
function clearHeader(){
	var header = document.getElementsByTagName("header")[0];
	header.innerHTML = '';
	
}

/**
 * clearContainer clears the container on the page 
 */
function clearContainer(){
	var container = document.getElementById("content");
	container.innerHTML = '';
	
}

/**
 * clearFooter clears the section on the page 
 */
function clearSection(){
	var section = document.getElementsByTagName("section")[0];
	section.innerHTML = '';
}

/**
 * Get Html Elements
 * ----------------------
 */

/**
 * getFooter gets the information within footer
 */
function getFooter(){
	var footer =document.getElementsByTagName("footer")[0];
	return footer;
}

/**
 * getHeader gets the information within header
 */
function getHeader(){
	var header = document.getElementsByTagName("header")[0];
	return header;
}

/**
 * getSidebar gets the information within the sidebar
 */
function getSideBar(){
	var sideBar = document.getElementsByTagName("aside")[0];
	return sideBar;
}

/**
 * getSection gets the information within section
 */
function getSection(){
	var section = document.getElementsByTagName("section")[0];
	return section;
}

/**
 * getContainer gets the information within the container
 */
function getContainer(){
	var container = document.getElementById("content");
	return container;
}