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

	return BaseController.extend("com.demo.sharjahPort.controller.customer.gatepass", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("gatepass").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {},
		handleAgentPress: function(oEvent) {
			var model = oEvent.getSource().getModel("agentVesselModel");
			var oItem = oEvent.getSource().getSelectedItem();
			if (oItem) {
				var oContext = oItem.getBindingContext("agentVesselModel");
				var oPath = oContext.getPath();
				var obj = model.getProperty(oPath);
				console.log(obj);
				this.getView().byId("lineId").setValue(obj.LineCode);
				this.getView().byId("vesselId").setValue(obj.VesselName);
				this.getView().byId("imoId").setValue(obj.ImoNumber);
				this.getView().byId("grtId").setValue(obj.Grt);
			}
		},
		onCheck: function(evt) {
 //console.log(evt);
	// 		this.getView().byId("Dcheck").getSelected() === "true" ? this.getView().byId("dailyDet").setVisible(true) : this.getView()
	// 			.byId("dailyDet").setVisible(false);
			
			// this.getView().byId("purpVisit").getValue() === "LOADING" || this.getView().byId("purpVisit").getValue() ==="BOTH" ? this.getView().byId("cargoLoadBox").setVisible(true) : this.getView()
			// 	.byId("cargoLoadBox").setVisible(false);

		}
	

	});
});