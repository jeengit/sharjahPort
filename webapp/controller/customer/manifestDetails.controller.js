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

	return BaseController.extend("com.demo.sharjahPort.controller.customer.manifestDetails", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("manifestDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			
			this.getUserName();
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
		
			var pageId = this.getView().getId();
			var that = this;

			// this.getView().byId(pageId + "--etaDisp").setVisible(false);
			this.getView().byId(pageId + "--manifestDisp").setVisible(true);
			oModel.read("/ManifestDetailsSet", {
				urlParameters: {
					"$filter": "ManifestNo eq '" + oEvent.getParameter("arguments").id + "' and ImFlag eq 'CUSTOMS'",
					"$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
				},
				success: function(data) {
					console.log(data);
					that.getView().setModel(new JSONModel(data), "manDetModel");
				},
				error: function(oResponse) {
					sap.m.MessageToast.show("Something went wrong!..");
				}
			});
			sap.ui.core.BusyIndicator.hide();

		},
		handleServiceGET: function(that, oModel, entitySet, modelName) {
			oModel.read("/" + entitySet, {
				success: function(data) {
					that.getView().setModel(new JSONModel(data), modelName);
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
				}
			});
			sap.ui.core.BusyIndicator.hide();
		},
	
		gotoLog: function() {
			sap.ui.core.BusyIndicator.show();
			this.getRouter().navTo("vessel");
			var odata = sap.ui.getCore().getModel("etaIdModel").getData();
			odata['status'] = this.getView().getModel("etaDetailsModel").getData().ZStatus;
			sap.ui.getCore().setModel(new JSONModel(odata), "etaIdModel");
		},
		handleChangeSelect: function(evt) {
			var preDate = this.getView().byId(evt.getSource().getName()).getDateValue();
			var curDate = evt.getSource().getDateValue();
			if (preDate >= curDate) {
				evt.getSource().setValue(null);
				sap.m.MessageToast.show("The input must be greater than Start/Arrival Date or Time");
			}
		}
	
	
	});
});