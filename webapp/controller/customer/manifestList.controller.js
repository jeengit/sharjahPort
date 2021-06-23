sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(Controller, BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.manifestList", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("manifest").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var status = oEvent.getParameter("arguments").sPath;
			var type = oEvent.getParameter("arguments").type;
			this.getUserName();
			var res = sap.ui.getCore().getModel("rememberSelectionModel") ? sap.ui.getCore().getModel("rememberSelectionModel").getData() : '';
			if (type === "MANIFEST") {
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
				this.getModel("ManifestListSet", "manifestListModel", status);
			}
			if (type === "DELIVERY") {
				//	this.getModel("DeliveryListSet", "deliveryListModel");
				this.callOdata("DeliveryListSet", "deliveryListModel", "Status", status);
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
			}
			if (type === "CONSIGNEE") {
				this.getConsigneeList();
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
			}
			var that = this;
			setTimeout(function() {
				res.id ? that.getView().byId(res.id).setSelectedItem(that.getView().byId(res.id).getItems()[res.path],
					true) : '';
			}, 1000);
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		handelDetailPress: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var model = evt.getSource().getFieldGroupIds()[0] === "manifest" ? "manifestListModel" : "deliveryListModel";
			var sPath = evt.getSource().getBindingContext(model).getPath().split("/")[1];
			evt.getSource().getParent().setSelectedItem(evt.getSource().getParent().getItems()[evt.getSource().getId().split("-")[4]], true);
			sap.ui.getCore().setModel(new JSONModel({
				path: evt.getSource().getId().split("-")[4],
				id: evt.getSource().getParent().getId().split("--")[1]
			}), "rememberSelectionModel");
			var property = evt.getSource().getBindingContext(model).getProperty();
			var id = evt.getSource().getFieldGroupIds()[0] === "manifest" && property.ManifestNo === '' ? property.CustomsRefManifestNo :
				evt.getSource().getFieldGroupIds()[0] === "manifest" && property.ManifestNo !== '' ? property.ManifestNo : property.DeliveryNo;
			var status = evt.getSource().getFieldGroupIds()[0] === "manifest" ? property.ManifestStatus : property.Status;
			this.getRouter().navTo(evt.getSource().getFieldGroupIds()[0] === "manifest" ? "manifestDetails" : "deliveryDetails", {
				sPath: encodeURIComponent(sPath),
				id: id,
				status: status
			});
		},
		getConsigneeList: function() {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/PaymentStatusListSet", {
				urlParameters: {
					"$filter": "ConsigneeCode eq '10000020' and FiscalYear eq '2021'"
				},
				success: function(data) {
					var pending = data.results.filter(res => res.Status === 'PENDING');
					var completed = data.results.filter(res => res.Status === 'COMPLETED');
					data.results['countP'] = pending.length;
					data.results['countC'] = completed.length;
					that.getView().setModel(new JSONModel(data.results), "consigneeListModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}
	});
});