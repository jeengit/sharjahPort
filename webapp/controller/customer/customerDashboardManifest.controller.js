sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardManifest", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardManifest").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
			this.getUserName();
			this.getModel("ManifestDashboardSet","DashboardCountModel");
			sap.ui.getCore().getModel("rememberSelectionModel") ? sap.ui.getCore().setModel(new JSONModel(null),"rememberSelectionModel") : '';
		},
		handleListPress: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			//var route = type === "MANIFEST" ? "manifest" : "dashboardManifest";
			this.getRouter().navTo("manifest", {
				sPath: status,
				type: type
			});
		}
	});
});