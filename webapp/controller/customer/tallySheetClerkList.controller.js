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
			this.adjustTableRowsCount();
			this.getModel("ClerkTallySheetSet","tSClerkListModel");
		},
		handleDetailsPress : function (evt) {
			sap.ui.core.BusyIndicator.show();
			var id = evt.getSource().getText() !== 'Create' ? evt.getSource().getBindingContext("tSClerkListModel").getProperty().GUID : false;
			this.getRouter().navTo("tallySheetClerkDetails", {
				id: id
			});
		},
		onAfterRendering: function () {
			var that = this;
			$(window).resize(function () {
				that.adjustTableRowsCount();
			});
		},
		adjustTableRowsCount: function(){
			var that = this;
			var rows = Math.floor(($("#" + this.getView().getId()).height() - 200) / 30);
			jQuery.sap.delayedCall(0, this, function () {
				that.byId("tsClerkTable").setVisibleRowCount(rows);
			});
		}
	});
});