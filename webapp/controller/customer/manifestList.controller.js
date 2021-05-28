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
			this.getModel("ManifestListSet","manifestListModel",status);
			var that = this;
			setTimeout(function(){
				var count = {
				"countI":that.getView().byId("list1").getItems().length,
				"countE":that.getView().byId("list2").getItems().length
			};
			that.getView().setModel(new JSONModel(count), "countListModel");
			}, 2000);
			sap.ui.getCore().setModel(new JSONModel({"status":status,"type":type}), "navModel");
			sap.ui.core.BusyIndicator.hide();
		},
		handelDetailPress: function(evt){
			var sPath = evt.getSource().getBindingContext("manifestListModel").getPath().split("/")[1];
			var id = evt.getSource().getBindingContext("manifestListModel").getProperty().CustomsRefManifestNo;
			var status = evt.getSource().getBindingContext("manifestListModel").getProperty().ManifestStatus;
			sap.ui.core.BusyIndicator.show();
			this.getRouter().navTo("manifestDetails", {
				sPath: encodeURIComponent(sPath),
				id: id,
				status:status
			});
		}
	});
});