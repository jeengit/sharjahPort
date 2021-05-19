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
		_onObjectMatched: function() {
			//var status = oEvent.getParameter("arguments").sPath;
			this.getUserName();
			this.getModel("ManifestListSet","manifestListModel");
			var that = this;
			setTimeout(function(){
				var count = {
				"countI":that.getView().byId("list1").getItems().length,
				"countE":that.getView().byId("list2").getItems().length
			};
			that.getView().setModel(new JSONModel(count), "countListModel");
			sap.ui.core.BusyIndicator.hide();
			}, 2000);
		}
	});
});