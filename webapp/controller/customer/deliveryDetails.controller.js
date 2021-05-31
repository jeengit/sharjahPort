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

	return BaseController.extend("com.demo.sharjahPort.controller.customer.deliveryDetails", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("deliveryDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function() {
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var modData = sap.ui.getCore().getModel("ManifBOEModel").getData();
			this.getView().setModel(new JSONModel(modData), "manifstModel");
			this.createDel();
		},
		createDel: function() {
			var mandatory = this.getView().getModel("manifstModel").getData();
			var odata = {
				"DeliveryName": "",
				"PortName": mandatory.PortName,
				"ManifestNo": mandatory.ManifestNo,
				"ConsigneeCode": mandatory.ConsigneeCode,
				"PortOfShipment": mandatory.PortOfOrigin,
				"BLno": mandatory.BLNo,
				"ArrivalDate": mandatory.ArrivalDate,
				"CaretedDate": mandatory.CreationDate,
				"AgentCode": mandatory.AgentCode,
				"PortOfDischarge": mandatory.PortName,
				"BLDate": mandatory.BLDate,
				"VoyageNo": mandatory.VoyegeNo,
				"DocNo": "",
				"Agentname": mandatory.AgentName,
				"ConsigneeName": mandatory.ConsigneeName,
				"MarksAndNo": mandatory.MarkAndNumbers,
				"CargoCategory": mandatory.CargoCategory,
				"GeneralRemark": mandatory.GeneralRemarks,
				"BOE": mandatory.BENo,
				"BOEdate": mandatory.BEDate,
				"BillType": "",
				"ExceptionCode": "",
				"Destination": "",
				"Country": "",
				"BillNo": mandatory.BilNo,
				"BillDate": "",
				"PaymentMode": "",
				"ImportedCode": "",
				"RNo": "",
				"DutyAmount": "",
				"TransitDetails": "",
				"CustomRefNo": "",
				"DisCompleteDate": "",
				"StorageUpto": "",
				"FreeDays": "",
				"PortHandlingCharge": "",
				"LastFreeDate": "",
				"StorageCharge": "",
				"NetCharge": "",
				"OtherTotalCharge": "",
				"SpecialInstruction": "",
				"ImFlag": "CREATE",
				"DeliveryDetailsToCommodities": [{
					"ManifestNo": "",
					"Commodities": "",
					"DeliveryNo": "",
					"MarkAndNumbers": "",
					"UOM": "TON",
					"NoOfPackages": "",
					"PackageType": "",
					"SubType": "",
					"GrossWt": "",
					"CBM": "",
					"ChargePerTon": " ",
					"NetWt": " ",
					"BOENo": "",
					"ConsigneeCode": ""
				}],
				"DeliveryDetailsToDeliverCharge": [{
					"DeliveryNo": "",
					"ItemNo": "",
					"Charges": "",
					"Description": "",
					"Rate": " ",
					"Quantity": "",
					"Amount": ""
				}]
			};
			this.getView().setModel(new JSONModel(odata), "delCrtModel");
			sap.ui.core.BusyIndicator.hide();
		},
		deliveryCreatePress: function() {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oEntry = this.getView().getModel("delCrtModel").getData();
			var that = this;
			oModel.create("/DeliveryDetailsSet", oEntry, {
				success: function() {
					sap.m.MessageToast.show("Created Successfully..");
					that.getRouter().navTo("dashboardManifest");
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