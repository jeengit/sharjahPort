sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"com/demo/sharjahPort/model/formatter",
], function(Device, BaseController, Controller, Filter, FilterOperator, Fragment, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.deliveryDetails", {
		formatter: formatter,
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("deliveryDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.getView().setModel(new JSONModel(sap.ui.getCore().getModel("navModel").getData()), "navModel");
			console.log(sap.ui.getCore().getModel("navModel"));
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			var pageId = this.getView().getId();
			if (oEvent.getParameter("arguments").id === "create") {
				if (sap.ui.getCore().getModel("ManifBOEModel") && sap.ui.getCore().getModel("ManifBOEModel").getData()) {
					var modData = sap.ui.getCore().getModel("ManifBOEModel").getData();
					that.getView().byId(pageId + "--delDisp").setVisible(true);
					that.getView().byId(pageId + "--delDetails").setVisible(false);
					that.getView().byId(pageId + "--delSave").setVisible(false);
					that.getView().byId("apprvBtn").setVisible(false);
					that.getView().byId("editBtn").setVisible(false);
					that.getView().byId("saveBtn").setVisible(false);
					//	that.getView().byId("createbillBtn").setVisible(true);
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
						that.generateTableForCharges(data);
						if (data.Status === "OPEN") {
							that.getView().byId(pageId + "--delDisp").setVisible(false);
							that.getView().byId(pageId + "--delSave").setVisible(false);
							that.getView().byId(pageId + "--delDetails").setVisible(true);
							that.getView().byId("apprvBtn").setVisible(true);
							that.getView().byId("editBtn").setVisible(true);
							that.getView().byId("saveBtn").setVisible(false);
							that.getView().byId("createbillBtn").setVisible(false);
							that.getView().byId("crtBtn").setVisible(false);
							that.getView().byId("cancelBtn").setVisible(false);
						} else {
							that.getView().byId(pageId + "--delDisp").setVisible(false);
							that.getView().byId(pageId + "--delSave").setVisible(false);
							that.getView().byId(pageId + "--delDetails").setVisible(true);
							that.getView().byId("apprvBtn").setVisible(false);
							that.getView().byId("editBtn").setVisible(false);
							that.getView().byId("saveBtn").setVisible(false);
							that.getView().byId("createbillBtn").setVisible(false);
							that.getView().byId("crtBtn").setVisible(false);
							that.getView().byId("cancelBtn").setVisible(false);
						}
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
					}
				});
			}
			sap.ui.core.BusyIndicator.hide();
			this.addDeliverChargeModel(true);
			this.initChargeModel();
		},
		handleApprove: function() {
			var oEntry = this.getView().getModel("delvryDetailsModel").getData();
			sap.ui.core.BusyIndicator.show();
			oEntry['ImFlag'] = "APPROVE";
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			oModel.create("/DeliveryDetailsSet", oEntry, {
				success: function(data) {
					if (data && data.BillNo !== 'Not Created' && data.SalesOrderNumber !== 'Not Created') {
						sap.m.MessageToast.show("Delivery No - " + oEntry.DeliveryName + " has been approved with bill no " + data.BillNo +
							" and sales order no " + data.SalesOrderNumber);
					} else {
						sap.m.MessageToast.show("Delivery is not approved");
					}
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
			var delChargeData = this.getView().getModel("deliverChargeEditModel").getData();
			if (delChargeData && delChargeData.items && delChargeData.items.length > 0) {
				delChargeData.items.forEach(function(v) {
					delete v.selectedCharge
				});
				oEntry['DeliveryDetailsToDeliverCharge'] = delChargeData.items;
			} else {
				oEntry['DeliveryDetailsToDeliverCharge'] = [];
			}
			oModel.create("/DeliveryDetailsSet", oEntry, {
				success: function(data) {
					sap.m.MessageToast.show("Delivery No - " + oEntry.DeliveryName + " Updated Successfully");
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
			var delChargeData = this.getView().getModel("deliverChargeModel").getData();
			if (delChargeData && delChargeData.items && delChargeData.items.length > 0) {
				oEntry['DeliveryDetailsToDeliverCharge'] = delChargeData.items;
			} else {
				oEntry['DeliveryDetailsToDeliverCharge'] = [];
			}
			var that = this;
			oModel.create("/DeliveryDetailsSet", oEntry, {
				success: function(data) {
					sap.m.MessageToast.show("Delivery Created Successfully with delivery no " + +data.DeliveryName);
					setTimeout(function() {
						sap.ui.core.BusyIndicator.hide();
						that.getRouter().navTo("dashboardManifest");
					}, 3000);

				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		initChargeModel: function() {
			var cArray = [{
				"id": 0,
				"Charges": "",
				"Description": "",
				"Rate": 0
			}, {
				"id": 1,
				"Charges": "FL001",
				"Description": "FLT (5T)",
				"Rate": 100
			}, {
				"id": 2,
				"Charges": "GA001",
				"Description": "GANG-OVERTIME",
				"Rate": 200
			}, {
				"id": 3,
				"Charges": "SC001",
				"Description": "GANG ENGAGED-COLLECT/DISCH DONNAGES",
				"Rate": 400
			}, {
				"id": 4,
				"Charges": "GS001",
				"Description": "Wire sling 6.2 T 25 FT",
				"Rate": 150
			}, {
				"id": 5,
				"Charges": "GS002",
				"Description": "2 Leg stell chain sling 9.5 T 16FT",
				"Rate": 120
			}, {
				"id": 6,
				"Charges": "GS003",
				"Description": "Wire sling 3.3T 25 FT",
				"Rate": 300
			}, {
				"id": 7,
				"Charges": "CR001",
				"Description": "Crane (12t)",
				"Rate": 500
			}, {
				"id": 8,
				"Charges": "MS001",
				"Description": "Labour Charge",
				"Rate": 100
			}];
			this.getView().setModel(new JSONModel({
				items: cArray
			}), "chargeDiscModel");
		},
		addNextRowForDeliveryCharge: function() {
			this.addDeliverChargeModel(false);
		},
		addNextRowForDeliveryChargeEdit: function() {
			var delObj = {
				"DeliveryNo": "",
				"ItemNo": "",
				"Charges": "",
				"Description": "",
				"Rate": " ",
				"Quantity": "",
				"Amount": ""
			};
			var dData = this.getView().getModel("deliverChargeEditModel").getData();
			dData.items.push(delObj);
			this.getView().setModel(new JSONModel(dData), "deliverChargeEditModel");
		},
		deleteThisItem: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var edData = this.getView().getModel("deliverChargeModel").getData();
			edData['items'].splice(iRowIndex, 1);
			this.getView().setModel(new JSONModel(edData), "deliverChargeModel");
		},
		deleteThisItemEdit: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var edData = this.getView().getModel("deliverChargeEditModel").getData();
			edData['items'].splice(iRowIndex, 1);
			this.getView().setModel(new JSONModel(edData), "deliverChargeEditModel");
		},
		addDeliverChargeModel: function(isFirst) {
			var delObj = {
				"DeliveryNo": "",
				"ItemNo": "",
				"Charges": "",
				"Description": "",
				"Rate": " ",
				"Quantity": "",
				"Amount": ""
			};

			if (isFirst) {
				var delModel = {
					items: [delObj]
				};
				this.getView().setModel(new JSONModel(delModel), "deliverChargeModel");
			} else {
				var dData = this.getView().getModel("deliverChargeModel").getData();
				dData.items.push(delObj);
				this.getView().setModel(new JSONModel(dData), "deliverChargeModel");
			}

		},
		fnSelectChargeRow: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var selectedKeyItem = oEvent.getSource().getSelectedKey();
			if (selectedKeyItem !== 0) {
				var chargeDiscMain = this.getView().getModel("chargeDiscModel").getData();
				var delData = JSON.parse(JSON.stringify(this.getView().getModel("deliverChargeModel").getData()));
				let mainInx = chargeDiscMain.items.findIndex(mItem => Number(mItem.id) == Number(selectedKeyItem));
				delData.items[iRowIndex]['Description'] = chargeDiscMain.items[mainInx]['Description'];
				delData.items[iRowIndex]['Charges'] = chargeDiscMain.items[mainInx]['Charges'];
				delData.items[iRowIndex]['Rate'] = (chargeDiscMain.items[mainInx]['Rate']).toString();
				delData.items[iRowIndex]['Quantity'] = 0;
				delData.items[iRowIndex]['Amount'] = 0;
				this.getView().setModel(new JSONModel(delData), "deliverChargeModel");
			}
		},
		fnSelectChargeRowEdit: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var selectedKeyItem = oEvent.getSource().getSelectedKey();
			if (selectedKeyItem !== 0) {
				var chargeDiscMain = this.getView().getModel("chargeDiscModel").getData();
				var delData = JSON.parse(JSON.stringify(this.getView().getModel("deliverChargeEditModel").getData()));
				let mainInx = chargeDiscMain.items.findIndex(mItem => Number(mItem.id) == Number(selectedKeyItem));
				delData.items[iRowIndex]['Description'] = chargeDiscMain.items[mainInx]['Description'];
				delData.items[iRowIndex]['Charges'] = chargeDiscMain.items[mainInx]['Charges'];
				delData.items[iRowIndex]['Rate'] = (chargeDiscMain.items[mainInx]['Rate']).toString();
				delData.items[iRowIndex]['Quantity'] = 0;
				delData.items[iRowIndex]['Amount'] = 0;
				this.getView().setModel(new JSONModel(delData), "deliverChargeEditModel");
			}
		},
		chageQuantityEvent: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var newQuantity = oEvent.getSource().getValue();
			var delData = JSON.parse(JSON.stringify(this.getView().getModel("deliverChargeModel").getData()));
			delData.items[iRowIndex]['Quantity'] = newQuantity;
			delData.items[iRowIndex]['Amount'] = (Number(delData.items[iRowIndex]['Rate']) * Number(newQuantity)).toString();
			this.getView().setModel(new JSONModel(delData), "deliverChargeModel");
		},
		chageQuantityEventEdit: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var newQuantity = oEvent.getSource().getValue();
			var delData = JSON.parse(JSON.stringify(this.getView().getModel("deliverChargeEditModel").getData()));
			delData.items[iRowIndex]['Quantity'] = newQuantity;
			delData.items[iRowIndex]['Amount'] = (Number(delData.items[iRowIndex]['Rate']) * Number(newQuantity)).toString();
			this.getView().setModel(new JSONModel(delData), "deliverChargeEditModel");
		},
		generateTableForCharges: function(data) {
			if (data && data.DeliveryDetailsToDeliverCharge && data.DeliveryDetailsToDeliverCharge.results && data.DeliveryDetailsToDeliverCharge
				.results.length > 0) {
				var delArr = {
					items: []
				};
				for (var dc of data.DeliveryDetailsToDeliverCharge.results) {
					var delObj = {
						"DeliveryNo": dc.DeliveryNo,
						"ItemNo": dc.ItemNo,
						"Charges": dc.Charges,
						"Description": dc.Description,
						"Rate": dc.Rate,
						"Quantity": dc.Quantity,
						"Amount": dc.Amount,
						"selectedCharge": this.getSelectedKeyOfCharges(dc.Charges)
					};
					delArr.items.push(delObj)
				}
			}
			this.getView().setModel(new JSONModel(delArr), "deliverChargeEditModel");
		},
		getSelectedKeyOfCharges: function(val) {
			var chargeDiscMain = this.getView().getModel("chargeDiscModel").getData();
			let mainInx = chargeDiscMain.items.findIndex(mItem => mItem.Charges === val);
			return mainInx;
		}
	});
});