sap.ui.define([
	"sap/ui/Device",
	"../BaseController"
], function(Device, BaseController) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.gatepass", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("gatepass").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function() {
			this.getUserName();
		}
	});
});