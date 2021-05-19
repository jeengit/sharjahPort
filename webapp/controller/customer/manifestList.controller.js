sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(Controller, BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.manifestList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.demo.sharjahPort.view.manifest
		 */
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("manifest").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			//var status = oEvent.getParameter("arguments").sPath;
			this.getUserName();
			var odata = {
				"results": [{
					"manifestNo": 1232,
					"agentName": "KHK Scaffo",
					"vesselName": "NORTHERN JUBILEE",
					"creationDate": "20201212",
					"status": "NEW",
					"flag": "I"
				}, {
					"manifestNo": 155,
					"agentName": "KHK Scaffo",
					"vesselName": "LILA",
					"creationDate": "20201212",
					"status": "IN PROGRESS",
					"flag": "E"
				}, {
					"manifestNo": 155,
					"agentName": "KHK Scaffo",
					"vesselName": "SWISSCO SURF",
					"creationDate": "20200212",
					"status": "NEW",
					"flag": "E"
				}, {
					"manifestNo": 155,
					"agentName": "KHK Scaffo",
					"vesselName": "SWISSCO SURF",
					"creationDate": "20200408",
					"status": "CLOSED",
					"flag": "I"
				}]
			};
			this.getView().setModel(new JSONModel(odata), "manifestListModel");
			var count = {
				"countI":this.getView().byId("list1").getItems().length,
				"countE":this.getView().byId("list2").getItems().length
			};
			this.getView().setModel(new JSONModel(count), "countListModel");
			sap.ui.core.BusyIndicator.hide();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.demo.sharjahPort.view.manifest
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.demo.sharjahPort.view.manifest
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.demo.sharjahPort.view.manifest
		 */
		//	onExit: function() {
		//
		//	}

	});

});