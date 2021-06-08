sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.tallySheetCargo", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("tallySheetCargo").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
				var id = oEvent.getParameter("arguments").id;
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/TallySheetDetailsSet('" + id + "')", {
				urlParameters: {
					"$expand": "ChargeDetails"
				},
				success: function(data) {
					that.getView().setModel(new JSONModel(data), "tSDetailModel");
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