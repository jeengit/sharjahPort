sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
], function (Device, BaseController, Controller, Filter, FilterOperator, JSONModel, MessageBox, MessageToast, BusyIndicator) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerLogin", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("loginC").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
			this.getView().byId("name").setValue(null);
			this.getView().byId("pwd").setValue(null);
		}
	});

});