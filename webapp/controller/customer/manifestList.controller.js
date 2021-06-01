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
			if (type === "MANIFEST") {
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getModel("ManifestListSet", "manifestListModel", status);
			}
			if (type === "DELIVERY") {
				this.getModel("DeliveryListSet", "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
			}
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		handelDetailPress: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var model = evt.getSource().getFieldGroupIds()[0] === "manifest" ? "manifestListModel" : "deliveryListModel";
			var sPath = evt.getSource().getBindingContext(model).getPath().split("/")[1];
			var property = evt.getSource().getBindingContext(model).getProperty();
			var id = evt.getSource().getFieldGroupIds()[0] === "manifest" && property.ManifestNo === '' ? property.CustomsRefManifestNo : 
			evt.getSource().getFieldGroupIds()[0] === "manifest" && property.ManifestNo !== '' ? property.ManifestNo : property.DeliveryNo;
			var status = evt.getSource().getFieldGroupIds()[0] === "manifest" ? property.ManifestStatus : property.Status;
			this.getRouter().navTo(evt.getSource().getFieldGroupIds()[0] === "manifest" ? "manifestDetails" : "deliveryDetails", {
				sPath: encodeURIComponent(sPath),
				id: id,
				status: status
			});
		}
	});
});