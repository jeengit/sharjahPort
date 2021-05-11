sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function(Device, BaseController, Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerOrderList", {

		onInit: function() {
            var obj = {
				"results": [{
					name : "Model A034",
					id : "HT-100",
					quantity : 10,
					status : "Available",
					price : "15000"
				},{
					name : "Model A031",
					id : "HT-1253",
					quantity : 27,
					status : "Available",
					price : "12750"
				}]
			}
            this.getView().setModel(new JSONModel(obj), "orderListModel");
            sap.ui.getCore().setModel(new JSONModel(obj), "orderListModel");
            /* var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("orders").attachPatternMatched(this._onObjectMatched, this); */
			console.log(sap.ui.getCore().getModel("device").getData());
		},
		_onObjectMatched: function(oEvent){
		},
		handleNavButtonPress : function(){
			var oSplitApp = this.getView().getParent().getParent();
    var oMaster = oSplitApp.getMasterPages()[0];
    oSplitApp.toMaster(oMaster, "flip");
		},
		onDetailPress : function (evt){
			var route = evt.getParameter("id").split("--")[1].split("-__")[0];
            var sPath = evt.getSource().getBindingContext("orderListModel").getPath().split("/")[2];
			var id = evt.getSource().getBindingContext("orderListModel").getProperty().id;
            this.getRouter().navTo(route, {
                sPath: encodeURIComponent(sPath),
				id
			});
		}
	});
});
