sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
], function (Device, BaseController, Controller, Filter, FilterOperator, JSONModel, MessageToast, BusyIndicator) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardAgent", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardAgent").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/AgentDashboardSet", {
				success: function (data) {
					that.getView().setModel(new JSONModel(data.results), "DashboardCountModel");
				},
				error: function (oResponse) {
					alert("Error...");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onNavToPress: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			var route = type === "ETA" ? "products" : "orders";
			this.getRouter().navTo(route, {
				sPath: status,
				type: type
			});
		}
	});

});