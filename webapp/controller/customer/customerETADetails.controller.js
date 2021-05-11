sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (Device, BaseController, Controller, Filter, FilterOperator, Fragment, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerETADetails", {

		onInit: function () {
			// this._formFragments = {};
			// this._showFormFragment("Display");
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("productDetails").attachPatternMatched(this._onObjectMatched, this);
		
		},
		_onObjectMatched: function (oEvent) {
			this.getUserName();
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var odata = {
				id: oEvent.getParameter("arguments").id
			};
			var pageId = this.getView().getId();
			var that = this;
			if (odata.id === "createETA") {
				var etaDetailsData = {
					"ETANo": "",
					"VRN": "",
					"VesselName": "",
					"ImoNo": "",
					"Port": "",
					"CallSign": "",
					"AgentName": "",
					"AgentCode": "",
					"LineCode": "",
					"GRT": "",
					"VesselNature": "",
					"VoyageNature": "",
					"VoyageNo": "",
					"PreferedBerth": "",
					"VisitPurpose": "",
					"CustomsRefNo": "",
					"VoyageType": "",
					"Status": "",
					"GenRemark": "",
					"ExpArrivalDate": "",
					"ExpDepartureDate": "",
					"ExpArrivalTime": "",
					"ExpDepartureTime": "",
					"LastPort": "",
					"NextPort": "",
					"ArrivalDraft": "",
					"CargoDischarge": "",
					"NoOfContainerD": "",
					"CargoWeightD": "",
					"CargoLoaded": "",
					"NoOfContainerL": "",
					"CargoWeightL": "",
					"RejectRemark": ""
				};
				this.getView().byId(pageId + "--etaDisp").setVisible(false);
				this.getView().byId(pageId + "--etaChange").setVisible(true);
				this.getView().setModel(new JSONModel(etaDetailsData), "etaDetailsModel");
				oModel.read("/AgentSearchSet", {
					success: function (data) {
						that.getView().setModel(new JSONModel(data), "agentModel");
						// console.log(data.results[0].ImAgentCode);      
						if(data.results[0].ImAgentCode){
								oModel.read("/AgentVesselListSet", {
					urlParameters: {
						"$filter": "ImAgentId eq '" + data.results[0].ImAgentCode + "'"
					},
					success: function (data1) {
						that.getView().setModel(new JSONModel(data1), "agentVesselModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oResponse) {
					
					}
				});
						}
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oResponse) {
						alert("Error...");
						sap.ui.core.BusyIndicator.hide();
					}
				});
				// var agentnum = that.getView().byId(pageId +"--AgentCode").getValue();
				// console.log(agentnum);
				// //var agentCode = agentnum.replace(/^0+/, '');
				// oModel.read("/AgentVesselListSet", {
				// 	urlParameters: {
				// 		"$filter": "ImAgentId eq '" + agentnum + "'"
				// 	},
				// 	success: function (data) {
				// 		that.getView().setModel(new JSONModel(data), "agentVesselModel");
				// 		sap.ui.core.BusyIndicator.hide();
				// 	},
				// 	error: function (oResponse) {
				// 		alert("Error...");
				// 		sap.ui.core.BusyIndicator.hide();
				// 	}
				// });
				oModel.read("/PortListSet", {
					success: function (data) {
						that.getView().setModel(new JSONModel(data), "portListModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oResponse) {
						alert("Error...");
						sap.ui.core.BusyIndicator.hide();
					}
				});
				oModel.read("/BerthListSet", {
					success: function (data) {
						that.getView().setModel(new JSONModel(data), "vesMovBertModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oResponse) {
						alert("Error...");
						sap.ui.core.BusyIndicator.hide();
					}
				});

			} else {
				this.getView().byId(pageId + "--etaDisp").setVisible(true);
				this.getView().byId(pageId + "--etaChange").setVisible(false);
				sap.ui.getCore().setModel(new JSONModel(odata), "etaIdModel");
				oModel.read("/ETAdetailsSet('" + odata.id + "')", {
					success: function (data) {
						that.getView().setModel(new JSONModel(data), "etaDetailsModel");
						sap.ui.getCore().setModel(new JSONModel(data), "etaDetailsModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oResponse) {
						alert("Error...");
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
			sap.ui.core.BusyIndicator.hide();
		},
		handleAgentPress: function (oEvent) {
			var model = oEvent.getSource().getModel("agentVesselModel");
			var oItem = oEvent.getSource().getSelectedItem();
			if (oItem) {
				var oContext = oItem.getBindingContext("agentVesselModel");
				var oPath = oContext.getPath();
				var obj = model.getProperty(oPath);
				this.getView().byId("lineId").setValue(obj.LineCode);
				this.getView().byId("vesselId").setValue(obj.VesselName);
				this.getView().byId("imoId").setValue(obj.ImoNumber);
				this.getView().byId("grtId").setValue(obj.Grt);
			}
		},
		gotoLog: function () {
			sap.ui.core.BusyIndicator.show();
			this.getRouter().navTo("vessel");
			var odata = sap.ui.getCore().getModel("etaIdModel").getData();
			odata['status'] = this.getView().getModel("etaDetailsModel").getData().ZStatus;
			sap.ui.getCore().setModel(new JSONModel(odata), "etaIdModel");
		},
		handleChangeSelect: function (evt) {
			var preDate = this.getView().byId(evt.getSource().getName()).getDateValue();
			var curDate = evt.getSource().getDateValue();
			if (preDate >= curDate) {
				evt.getSource().setValue(null);
				sap.m.MessageToast.show("The input must be greater than Start/Arrival Date or Time");
			}
		},
		handleCreateETAForAgent: function () {
			sap.ui.core.BusyIndicator.show();
			var oEntry = this.getView().getModel("etaDetailsModel").getData();
			oEntry['AgentCode'] = this.getView().byId("AgentCode").getValue();
			oEntry['AgentName'] = this.getView().byId("agentName").getValue();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.create("/ETACreateSet", oEntry, {
				success: function (data) {
					sap.m.MessageToast.show("ETA No - " + data.ReturnMsg + " Created Successfully", {
						closeOnBrowserNavigation: false
					});
					that.getRouter().navTo("dashboardAgent");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {
					sap.m.MessageToast.show("Something went wrong");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		handleAcceptRejectPress: function (evt) {
			sap.ui.core.BusyIndicator.show();
			var oEntry = {
				"ImFlag": evt.getSource().getType() === "Accept" ? "APPROVE" : "REJECT",
				"ETA_no": this.getView().getModel("etaDetailsModel").getData().ZETANumber,
				"Gen_Remark": "",
				"Reject_Remark": ""
			};
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.create("/ETApproveRejectSet", oEntry, {
				success: function (data) {
					sap.m.MessageToast.show("ETA " + oEntry.ImFlag + "ED Successfully", {
						closeOnBrowserNavigation: false
					});
					var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					var uRole = oStore.get("role");
					if (uRole === "HARBOR_MASTER") {
						that.getRouter().navTo("dashboardHarbour");
					}
					if (uRole === "CONTROL_ROOM") {
						that.getRouter().navTo("dashboard");
					}
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {
					sap.m.MessageToast.show("Something went wrong");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}
	});
});