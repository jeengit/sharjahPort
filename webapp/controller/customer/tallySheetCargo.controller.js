sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, History) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.tallySheetCargo", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("tallySheetCargo").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var id = oEvent.getParameter("arguments").id;
			var type = oEvent.getParameter("arguments").status;
	
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var pageId = this.getView().getId();
			var that = this;
			if (type === "create") {
                   	if (sap.ui.getCore().getModel("ManifModel") && sap.ui.getCore().getModel("ManifModel").getData() ) {
				var modData = sap.ui.getCore().getModel("ManifModel").getData();
                   	}
				oModel.read("/ServiceChargeSet", {
					urlParameters: {
						"$filter": "ManifestNo eq '" + id + "'"
					},
					success: function(data) {
						that.getView().setModel(new JSONModel(data), "tSgetModel");
						sap.ui.core.BusyIndicator.hide();
						that.createTal();
						that.getView().byId(pageId + "--tallyCargoSaveId").setVisible(true);
						that.getView().byId(pageId + "--tallyCargoDispId").setVisible(false);
						that.getView().byId(pageId + "--tallyCargochangeId").setVisible(false);
										that.getView().byId("tallyBtn").setVisible(true);
					that.getView().byId("editBtn").setVisible(false);

						
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});

			} else {
				that.getView().byId(pageId + "--tallyCargoSaveId").setVisible(false);
				that.getView().byId(pageId + "--tallyCargochangeId").setVisible(false);
				that.getView().byId(pageId + "--tallyCargoDispId").setVisible(true);
				that.getView().byId("tallyBtn").setVisible(false);
					that.getView().byId("editBtn").setVisible(true);

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
		},
		createTal: function() {

			var modData = sap.ui.getCore().getModel("ManifModel").getData();
			var Data =this.getView().getModel("tSgetModel").getData().results;
		
			for (var i in Data) {
				delete Data[i]["ImActionFlag"];
				delete Data[i]["GUID"];
				delete Data[i]["__metadata"];
			}

			var oData = {

				"TallySheetCode": modData.TlyShtCode,
				"PortName": modData.PortCode,
				"ManifestNo": modData.ManifestNo,
				"ConsigneeCode": "",
				"PortOfShipment": "",
				"BLNo": "",
				"ArrivalDate": modData.ArrivalDate,
				"CreationDate": modData.CreationDate,
				"AgentCode": modData.AgentCode,
				"PortOfDischarge": "",
				"BLDate": "",
				"VoyageNumber": modData.VoyegeNo,
				"VRNNo": "",
				"AgentName": modData.AgentName,
				"ConsigneeName": "",
				"GrandTotal": "",
				"ImFlag": "CREATE",
				"ChargeDetails": Data

			};
			this.getView().setModel(new JSONModel(oData), "tSCrtModel");
			
			sap.ui.core.BusyIndicator.hide();

		},
		editPress: function() {
			var pageId = this.getView().getId();
			this.getView().byId(pageId + "--tallyCargoSaveId").setVisible(false);
			this.getView().byId(pageId + "--tallyCargochangeId").setVisible(true);
			this.getView().byId(pageId + "--tallyCargoDispId").setVisible(false);
			this.getView().byId("saveBtn").setVisible(true);
			this.getView().byId("editBtn").setVisible(false);
			this.getView().byId("creteBtn").setVisible(false);
			this.getView().byId("tallyBtn").setVisible(false);

		},
		onTallyUpdatePress: function() {
			var pageId = this.getView().getId();
			this.getView().byId(pageId + "--tallyCargoSaveId").setVisible(false);
			this.getView().byId(pageId + "--tallyCargochangeId").setVisible(false);
			this.getView().byId(pageId + "--tallyCargoDispId").setVisible(true);
			this.getView().byId("saveBtn").setVisible(false);
			this.getView().byId("editBtn").setVisible(true);
			this.getView().byId("creteBtn").setVisible(true);
			this.getView().byId("tallyBtn").setVisible(false);
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oEntry = this.getView().getModel("tSDetailModel").getData();
            	oEntry['ImFlag'] = "EDIT";
			var that = this;
			oModel.create("/TallySheetDetailsSet", oEntry, {
				success: function() {
					sap.m.MessageToast.show("Updated Successfully..");
					// that.getRouter().navTo("dashboardManifest");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		tallyCrtPress: function() {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oEntry = this.getView().getModel("tSCrtModel").getData();

		
			var that = this;
			oModel.create("/TallySheetDetailsSet", oEntry, {
				success: function() {
					sap.m.MessageToast.show("Created Successfully..");
					// that.getRouter().navTo("dashboardManifest");
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