sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardAgent", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardAgent").attachPatternMatched(this._onObjectMatched, this);
			var oPopOver = this.getView().byId("idPopOver");
			var oVizFrame = this.getView().byId("idVizFrame");
			oPopOver.connect(oVizFrame.getVizUid());
		},
		_onObjectMatched: function () {
			this.getUserName();
			this.getModel("AgentDashboardSet","DashboardCountModel");
			var that = this;
			setTimeout(function() {
				var oModData = that.getView().getModel("DashboardCountModel").getData();
				var res = {
					"results": [{
						"status": "Approved",
						"count": oModData['0'].EtaApproved
					}, {
						"status": "Requested",
						"count": oModData['0'].EtaRequested
					}, {
						"status": "Rejected",
						"count": oModData['0'].EtaRejected
					}]
				};
				that.getView().setModel(new JSONModel(res), "pieChartModel");
			}, 2000);
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
		}
	});

});