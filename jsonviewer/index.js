// Source: https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
if (!String.linkify) {
  String.prototype.linkify = function() {
    // http://, https://, ftp://
    var urlPattern =
      /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return this.replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
  };
}

const url = window.location.search.split("?url=")[1];

const response = await fetch(url);
const object = await response.json();
let html = JSON.stringify(object, null, 4);
// console.log(html);
html = html.replace(/\n/g, "<br>");
html = html.replace(/\s/g, "&nbsp;");
html = html.linkify();
document.getElementById("jsonstring").innerHTML = html;
