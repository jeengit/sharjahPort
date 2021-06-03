sap.ui.define([
	"../BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.tallySheetClerkList", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("tallySheetClerkList").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function() {
			this.getUserName();
			this.getModel("ClerkTallySheetSet","tSClerkListModel");
		},
		handleDetailsPress : function (evt) {
			sap.ui.core.BusyIndicator.show();                  
			var id = evt.getSource().getBindingContext("tSClerkListModel").getProperty().GUID;
			this.getRouter().navTo("tallySheetClerkDetails", {
				id: id
			});
		}
	});
});