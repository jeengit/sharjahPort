sap.ui.define([], function () {
    "use strict";
    return {
     changeDataFormat: function (dStr) {
        if(dStr) {
			var year = dStr.substring(0,4);
			var month = dStr.substring(4,6);
			var day = dStr.substring(6,8);
			var date = day+"/"+month+"/"+year;
    		return date;
        } else {
            return "";
        }
    }
    };
   });