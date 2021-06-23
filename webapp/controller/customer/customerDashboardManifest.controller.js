sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardManifest", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardManifest").attachPatternMatched(this._onObjectMatched, this);
			var oPopOver = this.getView().byId("idPopOver");
			var oVizFrame = this.getView().byId("idVizFrame");
			oPopOver.connect(oVizFrame.getVizUid());
		},
		_onObjectMatched: function () {
			this.getUserName();
			this.getModel("ManifestDashboardSet","DashboardCountModel");
			sap.ui.getCore().getModel("rememberSelectionModel") ? sap.ui.getCore().setModel(new JSONModel(null),"rememberSelectionModel") : '';
			var that = this;
			setTimeout(function() {
				var oModData = that.getView().getModel("DashboardCountModel").getData();
				var res = {
					"results": [{
						"status": "Custom",
						"count": oModData['0'].Manifest
					}, {
						"status": "Open",
						"count": oModData['0'].OpenManifest
					}, {
						"status": "Closed",
						"count": oModData['0'].ClosedManifest
					}]
				};
				that.getView().setModel(new JSONModel(res), "pieChartModel");
			}, 2000);
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