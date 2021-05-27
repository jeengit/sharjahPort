sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(Device, BaseController, Controller, Filter, FilterOperator, Fragment, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.deliveryDetails", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("deliveryDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
console.log(sap.ui.getCore().getModel( "odataNotUrlModel"));
		
			sap.ui.core.BusyIndicator.hide();
		},
	
		handelListPress: function(evt) {
			var sPath = evt.getSource().getBindingContext("BOEDetailsModel").getPath().split("/")[3];
			if (this.getView().byId("manifestDispId").getVisible() === true) {
				for (var i in this.getView().byId("dispDetails").getItems()) {
					this.getView().byId("dispDetails").getItems()[i].setVisible(false);
				}
				this.getView().byId("dispDetails").getItems()[sPath].setVisible(true);
			} else {
				for (var j in this.getView().byId("changeDetails").getItems()) {
					this.getView().byId("changeDetails").getItems()[j].setVisible(false);
				}
				this.getView().byId("changeDetails").getItems()[sPath].setVisible(true);
			}
		}
	
	});
});