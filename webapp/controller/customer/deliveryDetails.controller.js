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
		_onObjectMatched: function(oEvent) {
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			var pageId = this.getView().getId();
			if (oEvent.getParameter("arguments").id === "create") {
				if (sap.ui.getCore().getModel("ManifBOEModel") && sap.ui.getCore().getModel("ManifBOEModel").getData()) {
					var modData = sap.ui.getCore().getModel("ManifBOEModel").getData();
					console.log(modData);
					that.getView().byId(pageId + "--delDisp").setVisible(true);
					that.getView().byId(pageId + "--delDetails").setVisible(false);
					that.getView().byId(pageId + "--delSave").setVisible(false);
					that.getView().byId("apprvBtn").setVisible(false);
					that.getView().byId("editBtn").setVisible(false);
					that.getView().byId("saveBtn").setVisible(false);
					that.getView().byId("createbillBtn").setVisible(true);
					that.getView().byId("crtBtn").setVisible(true);
					this.getView().byId("cancelBtn").setVisible(false);
				}
				this.getView().setModel(new JSONModel(modData), "manifstModel");
				this.createDel();
			} else {

				oModel.read("/DeliveryDetailsSet('" + oEvent.getParameter("arguments").id + "')", {
					urlParameters: {
						"$expand": "DeliveryDetailsToCommodities,DeliveryDetailsToDeliverCharge"
					},
					success: function(data) {
						that.getView().setModel(new JSONModel(data), "delvryDetailsModel");
						that.getView().byId(pageId + "--delDisp").setVisible(false);
						that.getView().byId(pageId + "--delSave").setVisible(false);
						that.getView().byId(pageId + "--delDetails").setVisible(true);
						that.getView().byId("apprvBtn").setVisible(true);
						that.getView().byId("editBtn").setVisible(true);
						that.getView().byId("saveBtn").setVisible(false);
						that.getView().byId("createbillBtn").setVisible(false);
						that.getView().byId("crtBtn").setVisible(false);
						that.getView().byId("cancelBtn").setVisible(false);
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
					}
				});
			}
			sap.ui.core.BusyIndicator.hide();
		},
		handleApprove: function() {
			var oEntry = this.getView().getModel("delvryDetailsModel").getData();
			sap.ui.core.BusyIndicator.show();
			oEntry['ImFlag'] = "APPROVE";
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			oModel.create("/DeliveryDetailsSet", oEntry, {
				success: function() {
					sap.m.MessageToast.show("Delivery No - " + oEntry.DeliveryName + " has been approved");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		handleEditPress: function() {
			var pageId = this.getView().getId();
			this.getView().byId("editBtn").setVisible(false);
			this.getView().byId("saveBtn").setVisible(true);
			this.getView().byId("cancelBtn").setVisible(true);
			this.getView().byId(pageId + "--delDisp").setVisible(false);
			this.getView().byId(pageId + "--delDetails").setVisible(false);
			this.getView().byId(pageId + "--delSave").setVisible(true);
		},
		handleCancelPress: function() {
			var pageId = this.getView().getId();
			this.getView().byId("editBtn").setVisible(true);
			this.getView().byId("saveBtn").setVisible(false);
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId(pageId + "--delDisp").setVisible(false);
			this.getView().byId(pageId + "--delDetails").setVisible(true);
			this.getView().byId(pageId + "--delSave").setVisible(false);
		},
		handleSavePress: function() {
			var pageId = this.getView().getId();
			this.getView().byId("editBtn").setVisible(true);
			this.getView().byId("saveBtn").setVisible(false);
			this.getView().byId("cancelBtn").setVisible(false);
			this.getView().byId(pageId + "--delDisp").setVisible(false);
			this.getView().byId(pageId + "--delDetails").setVisible(true);
			this.getView().byId(pageId + "--delSave").setVisible(false);
			var oEntry = this.getView().getModel("delvryDetailsModel").getData();
			sap.ui.core.BusyIndicator.show();
			oEntry['ImFlag'] = "EDIT";
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			// var that = this;
			oModel.create("/DeliveryDetailsSet", oEntry, {
				success: function(data) {
					sap.m.MessageToast.show("Delivery No - " + data.DeliveryName + " Updated Successfully");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		createDel: function() {
			var mandatory = this.getView().getModel("manifstModel").getData();
			if (mandatory && mandatory.CommoditiesInDetailsSet) {
				var delCommd = mandatory.CommoditiesInDetailsSet.results;
			}
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
				"DeliveryDetailsToCommodities": delCommd,
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