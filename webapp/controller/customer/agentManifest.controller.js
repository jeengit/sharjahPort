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

	return BaseController.extend("com.demo.sharjahPort.controller.customer.agentManifest", {

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
				"BoeCreationDate": "",
				"CargoCategory": "",
				"CountryOfOrigin": "",
				"AgentCommoditiesSet": [{

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
				}]
			};
			this.getView().setModel(new JSONModel(odata), "inCreateModel");
			sap.ui.core.BusyIndicator.hide();

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
				"BillOfLading": mandatory.FROM_PORT,
				"ConsigneeCode": mandatory.BillOfEntrySet.results[0].ConsigneeCode,
				"BillOfEntry": mandatory.BillOfEntrySet.results[0].BENo,
				"Consignee": mandatory.BillOfEntrySet.results[0].ConsigneeName,
				"BoeCreationDate": mandatory.BillOfEntrySet.results[0].BEDate,
				"CargoCategory": mandatory.BillOfEntrySet.results[0].CargoCategory,
				"CountryOfOrigin": mandatory.BillOfEntrySet.results[0].CountryofOrigin,
				"AgentCommoditiesSet": [{

					"ManifestNo": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].ManifestNo,
					"Commodities": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].Commodities,
					"MarksAndNos": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].MarkAndNumbers,
					"UOM": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].UOM,
					"NoOfPackages": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].NoOfPackages,
					"PackageType": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].PackageType,
					"SubType": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].SubType,
					"GrowsWt": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].GrossWt,
					"CBM": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].CBM,
					"ChargeTon": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].ChargePerTon,
					"NetWt": mandatory.BillOfEntrySet.results[0].CommoditiesInDetailsSet.results[0].NetWt
				}]
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
				
                 var oData = this.getView().getModel("ManDetailsModel").getData();
                 oData['ActionFlag'] = "ADD_BOE";
				oModel.create("/AgentManifestSet", oData, {
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

		handleCallPress: function(oEvent) {
			var model = oEvent.getSource().getModel("callsigndetModel");
			console.log(model);
			var oItem = oEvent.getSource().getSelectedItem();
			console.log(oItem);
			if (oItem) {
				var oContext = oItem.getBindingContext("callsigndetModel");
				console.log(oContext);
				var oPath = oContext.getPath();
				var obj = model.getProperty(oPath);
				console.log(obj);
				this.getView().byId("lineId").setValue(obj.LineCode);
				this.getView().byId("vesselId").setValue(obj.VesselName);
				this.getView().byId("imoId").setValue(obj.ImoNumber);
				this.getView().byId("grtId").setValue(obj.Grt);
			}
		}

	});
});