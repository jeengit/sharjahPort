sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.tallySheetClerk", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("tallySheetClerk").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			// var status = oEvent.getParameter("arguments").sPath;
			// var type = oEvent.getParameter("arguments").type;
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/ClerkTallySheetSet('34543TEGY56HTYN6')", {
				urlParameters: {
					"$expand": "ChargeDetailsSet,CargoDetailsSet"
				},
				success: function(data) {
					that.getView().setModel(new JSONModel(data.results), "modelName");
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