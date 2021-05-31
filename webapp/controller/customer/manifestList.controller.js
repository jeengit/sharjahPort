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
				this.getView().setModel(new JSONModel(null), "countListModel");
			}
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		getListCount: function() {
			//sap.ui.core.BusyIndicator.show();
			var that = this;
			setTimeout(function() {
				var count = {
					"countI": that.getView().byId("list1").getItems().length,
					"countE": that.getView().byId("list2").getItems().length
				};
				that.getView().setModel(new JSONModel(count), "countListModel");
				sap.ui.core.BusyIndicator.hide();
			}, 2000);
		},
		handelDetailPress: function(evt) {
			var sPath = evt.getSource().getBindingContext("manifestListModel").getPath().split("/")[1];
			var id = evt.getSource().getBindingContext("manifestListModel").getProperty().CustomsRefManifestNo;
			var status = evt.getSource().getBindingContext("manifestListModel").getProperty().ManifestStatus;
			sap.ui.core.BusyIndicator.show();
			this.getRouter().navTo("manifestDetails", {
				sPath: encodeURIComponent(sPath),
				id: id,
				status: status
			});
		}
	});
});