sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function(Device, BaseController, Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerOrderNow", {

		onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("orderNow").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent){
			this.getView().setModel(new JSONModel(sap.ui.getCore().getModel("ProductDetailModel").getData()), "ProductOrderNowListModel");
		},
		getTotal: function (a,b){
			return a*b
		}
	});

});
