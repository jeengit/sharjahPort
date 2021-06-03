sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (Device, Controller, Filter, FilterOperator, UIComponent, JSONModel) {
	"use strict";

	return Controller.extend("com.demo.sharjahPort.controller.App", {

		onInit: function () {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/UserLoginSet('')", {
				success: function (data) {
					sap.ui.getCore().setModel(new JSONModel(data), "loginModel");
					if (data.Role === "CONTROL_ROOM") {that.getRouter().navTo("dashboard");}
					if (data.Role === "HARBOR_MASTER") {that.getRouter().navTo("dashboardHarbour");}
					if (data.Role === "AGENT") {that.getRouter().navTo("dashboardAgent");}
					if (data.Role === "CARGO") {that.getRouter().navTo("dashboardManifest");}
					if (data.Role === "TALLYCLERK"){that.getRouter().navTo("tallySheetClerkList");}
					var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					oStore.put("user", data.Name);
					oStore.put("role", data.Role);
					sap.m.MessageToast.show("You are Logged in as" + " " + data.Role + " user !..");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		}
	});

});