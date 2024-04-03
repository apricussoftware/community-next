var cpright = document.getElementById("copyright-id");
if (cpright) {
    cpright.innerText = (new Date()).getFullYear()
}

var menuItem = document.getElementById("selectedMenuItem2");
if (menuItem) 
{
    menuItem.parentNode.className += " selected"
    menuItem.firstElementChild.className += " selected"
}

// Mobile menu
var mobileMenuItem = document.getElementById("selectedMenuItem1");
if (mobileMenuItem) {
    mobileMenuItem.parentNode.className += " selected"
    mobileMenuItem.firstElementChild.className += " selected"
}