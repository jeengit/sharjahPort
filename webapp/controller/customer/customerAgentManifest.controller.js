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

	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerAgentManifest", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("agentManifest").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.getView().setModel(new JSONModel(sap.ui.getCore().getModel("navModel").getData()), "navModel");
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var pageId = this.getView().getId();
			var status = oEvent.getParameter("arguments").status;
			console.log(status);
			var id = oEvent.getParameter("arguments").id;

			this.onCreate();

			// oModel.read("/ManifestDetailsSet", {
			// 	urlParameters: {
			// 		"$filter": "ManifestNo eq '" + id + "' and ImFlag eq 'AGENT'",
			// 		"$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
			// 	},
			// 	success: function(data) {
			// 	that.getView().setModel(new JSONModel(data.results['0']), "ManDetModel");
			// 		that.createMan();
			// 	},
			// 	error: function(oResponse) {
			// 		sap.m.MessageToast.show(oResponse.statusText);
			// 	}
			// });

			sap.ui.core.BusyIndicator.hide();
		},

		searchCallSignData: function(oEvent) {
			var q = oEvent.getSource().getValue();
			var thisObj = this;
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.read("/CallSignSearchSet", {
				urlParameters: {
					"$filter": "CallSign eq '" + q + "'"
				},
				success: function(data) {
					thisObj.getView().setModel(new JSONModel(data), "callsignModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					//			sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		selectCallSign: function(oEvent) {
			var selectedVal = oEvent.getSource().getSelectedKey();
			if (selectedVal) {
				var thisObj = this;
				var oModel = this.getOwnerComponent().getModel("s4Model");
				oModel.read("/CallsignDetailsSet('" + selectedVal + "')", {
					success: function(data) {
						thisObj.getView().setModel(new JSONModel(data), "callsigndetModel");
					},
					error: function(oResponse) {
						//	sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
		},
		onCreate: function() {

			var odata = {
				"ManifestExt": "",
				"ManifestNo": "",
				"ManifestType": "",
				"ActionFlag": "",
				"ToPort": "",
				"FromPort": "",
				"Callsign": "",
				"ArrivalDate": "",
				"CreationDate": "",
				"AgentCode": "",
				"PortName": "",
				"VoyageNumber": "",
				"VesselName": "",
				"Caption": "",
				"BillOfLading": "",
				"ConsigneeCode": "",
				"BillOfEntry": "",
				"Consignee": "",
				"ConsigneeName": "",
				"ConsigneePhone": "",
				"ShipperPhone": "",
				"NotifierPhone": "",
				"BoeCreationDate": "",
				"CargoCategory": "",
				"CountryOfOrigin": "",
				"AgentCommoditiesSet": []
			};
			this.getView().setModel(new JSONModel(odata), "inCreateModel");
			sap.ui.core.BusyIndicator.hide();

		},
		onMatAddRow: function(oEvent) {
			var oTable = this.getView().byId("idworkOrderTable1");
			var matrTableRows = oTable.getRows();
			// for (var rowLength in matrTableRows) {
			// 	oTable.getRows()[rowLength].getCells()[0].setEditable(true);
			// }
			var oModel = oTable.getModel("inCreateModel");
			var oData = oModel.getData();

			oData.AgentCommoditiesSet.push({

				"ManifestNo": "",
				"Commodities": "",
				"MarksAndNos": "",
				"UOM": "",
				"NoOfPackages": "",
				"PackageType": "",
				"SubType": "",
				"GrowsWt": "",
				"CBM": "",
				"ChargeTon": "",
				"NetWt": ""
			});
			oModel.setData(oData);
			// var items1 = this.getView().byId("--idworkOrderTable1");
			// var itemsLength1 = items1.getRows().length;
			// for (var j = 0; j < itemsLength1; j++) {
			// 	items1.getRows()[j].getCells()[0].setEditable(true);
			// }
		},
		createMan: function() {

			var mandatory = this.getView().getModel("ManDetModel").getData();
			var odata = {
				"ManifestExt": mandatory.EXT_MANIFEST_NO,
				"ManifestNo": mandatory.AGENT_MANIFEST_NO,
				"ActionFlag": "",
				"ToPort": mandatory.TO_PORT,
				"FromPort": mandatory.FROM_PORT,
				"Callsign": mandatory.ZCallsign,
				"ArrivalDate": mandatory.ArrivalDate,
				"CreationDate": mandatory.CreationDate,
				"AgentCode": mandatory.AgentCode,
				"PortName": mandatory.PortName,
				"VoyageNumber": mandatory.VoyegeNo,
				"VesselName": mandatory.VesselName,
				"Caption": mandatory.Caption,
				"BillOfLading": "",
				"ConsigneeCode": mandatory.BillOfEntrySet.results[0].ConsigneeCode,
				"BillOfEntry": "",
				"Consignee": mandatory.BillOfEntrySet.results[0].ConsigneeName,
				"ConsigneeName": mandatory.BillOfEntrySet.results[0].ConsigneeName,
				"ConsigneePhone": mandatory.BillOfEntrySet.results[0].ConsigneePhone,
				"ShipperPhone": mandatory.BillOfEntrySet.results[0].ShipperPhone,
				"NotifierPhone": mandatory.BillOfEntrySet.results[0].NotifierPhone,
				"BoeCreationDate": mandatory.BillOfEntrySet.results[0].BEDate,
				"CargoCategory": mandatory.BillOfEntrySet.results[0].CargoCategory,
				"CountryOfOrigin": mandatory.BillOfEntrySet.results[0].CountryofOrigin,
				"AgentCommoditiesSet": []
			};
			this.getView().setModel(new JSONModel(odata), "ManDetailsModel");
			sap.ui.core.BusyIndicator.hide();
		},
		handleCreatePress: function() {
			var oEntry = this.getView().getModel("inCreateModel").getData();
			var dataVal = this.getView().getModel("ManDetailsModel");
			var mandatory = this.getView().getModel("callsigndetModel");
			var pageId = this.getView().getId();
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			if (dataVal) {

				var oData = this.getView().getModel("ManDetModel").getData();
				oEntry['ActionFlag'] = "ADD_BOE";
				oEntry['ManifestNo'] = oData.AGENT_MANIFEST_NO;
				oModel.create("/AgentManifestSet", oEntry, {
					success: function(data, oResponse) {
						// sap.m.MessageToast.show("" + data.ManifestNo + "Created Successfully..");
						sap.m.MessageToast.show("Manifest No - " + data.ManifestNo + " Created Successfully", {
							closeOnBrowserNavigation: false
						});
						oModel.read("/ManifestDetailsSet", {
							urlParameters: {
								"$filter": "ManifestNo eq '" + data.ManifestNo + "' and ImFlag eq 'AGENT'",
								"$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
							},
							success: function(data1) {
								that.getView().byId(pageId + "--extManid").setEditable(false);
								that.getView().setModel(new JSONModel(data1.results['0']), "ManDetModel");
								that.createMan();
							},
							error: function(oResponse) {
								sap.m.MessageToast.show(oResponse.statusText);
							}
						});
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				if (!mandatory) {
					sap.m.MessageToast.show("Please Enter the callsign");
					sap.ui.core.BusyIndicator.hide();
				} else {
					oEntry['Callsign'] = mandatory.getData().Callsign;
					oEntry['AgentCode'] = mandatory.getData().AgentCode;
					oEntry['VesselName'] = mandatory.getData().VesselName;
					oModel.create("/AgentManifestSet", oEntry, {
						success: function(data, oResponse) {
							// sap.m.MessageToast.show("" + data.ManifestNo + "Created Successfully..");
							sap.m.MessageToast.show("Manifest No - " + data.ManifestNo + " Created Successfully", {
								closeOnBrowserNavigation: false
							});
							oModel.read("/ManifestDetailsSet", {
								urlParameters: {
									"$filter": "ManifestNo eq '" + data.ManifestNo + "' and ImFlag eq 'AGENT'",
									"$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
								},
								success: function(data1) {
									that.getView().byId(pageId + "--callSignInputId").setEditable(false);

									that.getView().setModel(new JSONModel(data1.results['0']), "ManDetModel");
									that.createMan();
									that.getView().byId(pageId + "--changeList").setVisible(true);
								},
								error: function(oResponse) {
									sap.m.MessageToast.show(oResponse.statusText);
								}
							});
							sap.ui.core.BusyIndicator.hide();
						},
						error: function(oResponse) {
							sap.m.MessageToast.show(oResponse.statusText);
							sap.ui.core.BusyIndicator.hide();
						}
					});
				}
			}
		},
		deleteThisItem: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
			var iRowIndex = oRow.getIndex();
			var edData = this.getView().getModel("inCreateModel").getData();
			console.log(edData);
			edData['AgentCommoditiesSet'].splice(iRowIndex, 1);
			this.getView().setModel(new JSONModel(edData), "inCreateModel");

		},
		bilPressEvnt: function(evt) {
			this.getView().byId("billadId").setValue("");
			this.getView().byId("crtDateId").setValue("");
			// var oTable = this.getView().byId("idworkOrderTable1");
			// var tableData =	oTable.getModel("inCreateModel").getData("");
			// oTable.getModel().setData("");
			//  oTable.getModel().setData(tableData);
			//this.getView().byId("idworkOrderTable1").getModel().refresh(true);

		},
		handleCallPress: function(oEvent) {
			var model = oEvent.getSource().getModel("callsigndetModel");

			var oItem = oEvent.getSource().getSelectedItem();

			if (oItem) {
				var oContext = oItem.getBindingContext("callsigndetModel");

				var oPath = oContext.getPath();
				var obj = model.getProperty(oPath);

				this.getView().byId("lineId").setValue(obj.LineCode);
				this.getView().byId("vesselId").setValue(obj.VesselName);
				this.getView().byId("imoId").setValue(obj.ImoNumber);
				this.getView().byId("grtId").setValue(obj.Grt);
			}
		}

	});
});
