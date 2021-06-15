sap.ui.define([
	"../BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardAgent", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardAgent").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
			this.getUserName();
			this.getModel("AgentDashboardSet","DashboardCountModel");
		},
		onNavToPress: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			var route = type === "ETA" ? "etaList" : "logList";
			this.getRouter().navTo(route, {
				sPath: status,
				type: type
			});
		},
		gotoCreatEta: function () {
			this.getRouter().navTo("etaDetails", {
				sPath: "0",
				id: "createETA"
			});
		}
	});

});