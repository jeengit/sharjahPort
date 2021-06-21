sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function ( BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerETAList", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("etaList").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.callForHarbourNotification('');
			var status = oEvent.getParameter("arguments").sPath;
			var type = oEvent.getParameter("arguments").type;
			this.getUserName();
			this.adjustTableRowsCount();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/EtaListSet", {
				urlParameters: {
					"$filter": "Status eq '" + status + "'"
				},
				success: function (data) {
					that.getView().setModel(new JSONModel(data), "etaListModel");
					sap.m.MessageToast.show("Items loaded succesfully with status - " + status);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		onETADetailsPress: function (evt) {
			var sPath = evt.getSource().getBindingContext("etaListModel").getPath().split("/")[2];
			var id = evt.getSource().getBindingContext("etaListModel").getProperty().ETANo;
			this.getRouter().navTo("etaDetails", {
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
			var pageId = this.getView().byId("etaPage").getId();
			var rows = Math.floor(($("#" + pageId).height() - 200) / 32);
			jQuery.sap.delayedCall(0, this, function () {
				that.byId("etaTable").setVisibleRowCount(rows);
			});
		}
	});
});