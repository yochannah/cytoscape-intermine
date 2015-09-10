var util = {
  addClass : function(elem, classToAdd) {
    if (!util.hasClass(elem, classToAdd)) {
      elem.className += " " + classToAdd;
    }
  },
  removeClass : function(elem, classToRemove) {
    elem.className = elem.className.replace(classToRemove, "");
  },
  hasClass : function(elem, classToCheckFor) {
    var classes = elem.className.split(" ");
    return (classes.indexOf(classToCheckFor) >= 0);
  }
}
module.exports = util;
