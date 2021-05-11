sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function(Device, BaseController, Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerOrderStatus", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("orderStatus").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent){
			var data = sap.ui.getCore().getModel("orderListModel").getData()["results"][oEvent.getParameter("arguments").sPath];
            this.getView().setModel(new JSONModel(data), "orderListModel");
			sap.ui.getCore().setModel(new JSONModel(data), "orderListModel");
		}
	});
});
