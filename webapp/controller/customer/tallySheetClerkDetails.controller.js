sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.tallySheetClerkDetails", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("tallySheetClerkDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var id = oEvent.getParameter("arguments").id;
			this.getUserName();
			this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(true);
			this.getView().byId(this.getView().getId() + "--tallyCargochangId").setVisible(false);
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/ClerkTallySheetSet('" + id + "')", {
				urlParameters: {
					"$expand": "ChargeDetailsSet,CargoDetailsSet"
				},
				success: function(data) {
					console.log(JSON.stringify(data));
					that.getView().setModel(new JSONModel(data), "tSClerkDetailModel");
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