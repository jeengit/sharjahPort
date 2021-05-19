sap.ui.define([
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Controller, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboard1", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.demo.sharjahPort.view.customerDashboard1
		 */
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardHarbour").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/DashboardCount", {
				success: function (data) {
					that.getView().setModel(new JSONModel(data.results), "DashboardCountModel");
				},
				error: function (oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
			var oData = {
				"results": [{
					"count": 1,
					"title": "Pacific Vision",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 2,
					"title": "Delta Amazon",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 3,
					"title": "Ever Golden",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 4,
					"title": "Ever Glory",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 5,
					"title": "Seapol Ruby",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 6,
					"title": "Yuan Jin Hai",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 7,
					"title": "Snow",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 8,
					"title": "Tihama",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 9,
					"title": "Available",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 10,
					"title": "Vincent Trader",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 11,
					"title": "Shandong Da De",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 12,
					"title": "Ezki",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 13,
					"title": "Available",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 14,
					"title": "Ore Brasil",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 15,
					"title": "Seamec Gallant",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 16,
					"title": "Olympic Lion",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 17,
					"title": "New Treasure",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 18,
					"title": "Morco Polo",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 19,
					"title": "Berg Everest",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 20,
					"title": "New Renown",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 21,
					"title": "Coswisdom Lake",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 22,
					"title": "Mette Maersk",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 23,
					"title": "Pacific Career",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}]
			};
			this.getView().setModel(new JSONModel(oData), "berthModel");
			var pilotTugData = {
				"results": [{
					"vessel": "Ever Golden",
					"status": "Pilot 1, Tug 2"
				}, {
					"vessel": "Olmpic Lion",
					"status": "Waiting"
				}, {
					"vessel": "Snow",
					"status": "Waiting"
				}]
			};
			this.getView().setModel(new JSONModel(pilotTugData), "pilotTugTable");
			var pendReqData = {
				"results": [{
					"vessel": "Ever Golden",
					"agent": "Kanoo Shipping",
					"status": "Log Sheet Approval",
					"statusCode": 1
				}, {
					"vessel": "Olympic Lion",
					"agent": "GAC Shipping",
					"status": "Log Sheet Approval",
					"statusCode": 1
				}, {
					"vessel": "Snow",
					"agent": "NSS",
					"status": "Hot Works",
					"statusCode": 0
				}]
			};
			this.getView().setModel(new JSONModel(pendReqData), "pendReqTable");
			sap.ui.core.BusyIndicator.hide();
		},
		handleListPress: function (oEvent) {
				sap.ui.core.BusyIndicator.show();
				var status = oEvent.getSource().getAriaLabel().split("/")[0];
				var type = oEvent.getSource().getAriaLabel().split("/")[1];
				var route = type === "ETA" ? "products" : type === "LOG" ? "orders" : "manifest";
				this.getRouter().navTo(route, {
					sPath: status,
					type: type
				});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.demo.sharjahPort.view.customerDashboard1
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.demo.sharjahPort.view.customerDashboard1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.demo.sharjahPort.view.customerDashboard1
		 */
		//	onExit: function() {
		//
		//	}
	});
});