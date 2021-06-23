sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(Device, BaseController, Fragment, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.gatepass", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("gatepass").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.getView().setModel(new JSONModel(sap.ui.getCore().getModel("navModel").getData()), "navModel");
			this.getUserName();
			// this.creategatepass();
			var pageId = this.getView().getId();
			this.getView().byId(pageId + "--gatePass").setVisible(false);
			this.getView().byId(pageId + "--gatePassDet").setVisible(true);
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oEvent.getParameter("arguments").id === "gateId" ? that.creategatepass() : oModel.read("/GatePassSet('" + oEvent.getParameter(
				"arguments").id + "')", {

				success: function(data) {
					that.getView().byId("subId").setVisible(false);
					that.getView().byId("canId").setVisible(false);
					that.getView().byId(pageId + "--gatePass").setVisible(false);
					that.getView().byId(pageId + "--gatePassDet").setVisible(true);
					that.getView().setModel(new JSONModel(data), "gateDetModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		handleChangeSelect: function(evt) {
			var preDate = this.getView().byId(evt.getSource().getName()).getDateValue();
			var curDate = evt.getSource().getDateValue();
			if (preDate >= curDate) {
				evt.getSource().setValue(null);
				sap.m.MessageToast.show("The input must be greater than Start/Arrival Date or Time");
			}
		},
		onBtnPress: function(evt) {
			alert("hh");
			console.log(this.getView().byId("segBtn").getSelectedKey());
		},
		creategatepass: function() {
			var pageId = this.getView().getId();
			this.getView().byId("subId").setVisible(true);
			this.getView().byId("canId").setVisible(true);
			this.getView().byId(pageId + "--gatePass").setVisible(true);
			this.getView().byId(pageId + "--gatePassDet").setVisible(false);
			var mandatory = this.getView().getModel("loginModel").getData();
			var odata = {
				"Port": "",
				"Type": "",
				"Name": mandatory.name,
				"FromDate": "",
				"ToDate": "",
				"Purpose": "",
				"Company_Name": mandatory.companyName,
				"AgentCode": ""
			};
			this.getView().setModel(new JSONModel(odata), "crtGateModel");
			sap.ui.core.BusyIndicator.hide();

		},
		onCreatePress: function() {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oEntry = this.getView().getModel("crtGateModel").getData();

			var that = this;
			oModel.create("/GatePassSet", oEntry, {
				success: function(data) {
					sap.m.MessageToast.show("Gate Pass " + data.Guid + " Created Successfully ");
					setTimeout(function() {
						sap.ui.core.BusyIndicator.hide();
						that.getRouter().navTo("dashboardAgent");
					}, 3000);

				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}
	});
});