sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardSecurity", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardSecurity").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function() {
			sap.ui.getCore().setModel(new JSONModel({}), "countModel");
			this.getUserName();
			this.getModel("SecurityDashboardSet", "DashboardCountModel");
		},
		onNavToPress: function(oEvent) {
			sap.ui.core.BusyIndicator.show();
			oEvent.getSource().getTileContent()[0].getContent() ? this.fnGetCount(oEvent) : '';
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			this.getRouter().navTo("etaList", {
				sPath: status,
				type: type
			});
		},
		fnGetCount : function(obj){
			var count = [];
			for (var i of obj.getSource().getTileContent()[0].getContent().getData()) {
				count.push({
					"text": i.getTitle(),
					"count": i.getValue()
				});
			}
			sap.ui.getCore().setModel(new JSONModel(count), "countModel");
		}
	});

});