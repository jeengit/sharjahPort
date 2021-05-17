sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/table/library",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Device, BaseController, Controller, Filter, FilterOperator, library, MessageToast, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.logList", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("orders").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var status = oEvent.getParameter("arguments").sPath;
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/LogSheetListSet", {
				urlParameters: {
					"$filter": "Status eq '" + status + "'"
				},
				success: function (data) {
					that.getView().setModel(new JSONModel(data), "etaListModel");
					MessageToast.show("Items loaded succesfully with status - " + status);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {
					MessageToast.show("Something went wrong...");
					sap.ui.core.BusyIndicator.hide();
					// getDialog.close();
				}
			});
			this.adjustTableRowsCount();
		},
		onETADetailsPress: function (evt) {
			sap.ui.core.BusyIndicator.show();
			var sPath = evt.getSource().getBindingContext("etaListModel").getPath().split("/")[2];
			var id = evt.getSource().getBindingContext("etaListModel").getProperty().LogNumber;
			this.getRouter().navTo("orderStatus", {
				sPath: encodeURIComponent(sPath),
				id: id
			});
		},
		onAfterRendering: function () {
			var that = this;
			$(window).resize(function () {
				that.adjustTableRowsCount();
			});
		},
		adjustTableRowsCount: function(){
			var that = this;
			var pageId = this.getView().byId("pageId").getId();
			var rows = Math.floor(($("#" + pageId).height() - 200) / 32);
			jQuery.sap.delayedCall(0, this, function () {
				that.byId("shifTableDisplay").setVisibleRowCount(rows);
				that.byId("shifTableChange").setVisibleRowCount(rows);
			});
		}
	});
});