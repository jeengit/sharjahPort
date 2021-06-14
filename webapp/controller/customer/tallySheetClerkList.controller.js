sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel) {
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
		},
		onSearch: function(evt){
			var data = sap.ui.getCore().getModel("tSClerkListModel").getData();
			var key = evt.getSource().getValue().toLowerCase().replace(/\s/g, '');
			var searchedData = data.filter(val=> val.CallSign.toLowerCase().replace(/\s/g, '').includes(key));
			this.getView().setModel(new JSONModel(searchedData), "tSClerkListModel");
		}
	});
});