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
			this.getView().setModel(new JSONModel(sap.ui.getCore().getModel("navModel").getData()), "navModel");
			this.getUserName();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var pageId = this.getView().getId();
			var status = oEvent.getParameter("arguments").status;
			console.log(status);
			var id = oEvent.getParameter("arguments").id;
			var that = this;
			if (status === "AGENT") {

				that.getView().byId(pageId + "--manifestChangeId").setVisible(true);
				that.getView().byId(pageId + "--manifestDispId").setVisible(false);
				that.getView().byId("tallyBtn").setVisible(false);
				that.getView().byId("tallyCrtBtn").setVisible(false);
				// that.getView().byId("createBtn").setVisible(true);
				oModel.read("/ManifestDetailsSet", {
					urlParameters: {
						"$filter": "ManifestNo eq '" + id + "' and ImFlag eq 'AGENT'",
						"$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
					},
					success: function(data) {
						that.getView().setModel(new JSONModel(data.results['0']), "ManDetModel");
					
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
					}
				});

			} else {
				oModel.read("/ManifestDetailsSet", {
					urlParameters: {
						"$filter": "ManifestNo eq '" + id + "' and ImFlag eq 'AGENT'",
						"$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
						// "$filter": status === "OPEN" ? "ManifestNo eq '" + oEvent.getParameter("arguments").id + "'" : "ManifestNo eq '" + oEvent.getParameter(
						// 	"arguments").id + "' and ImFlag eq 'CUSTOMS'",
						// "$expand": "BillOfEntrySet/CommoditiesInDetailsSet"
					},
					success: function(data) {
						that.getView().setModel(new JSONModel(data.results['0']), "BOEDetailsModel");
						that.getView().byId(pageId + "--manifestChangeId").setVisible(false);
						that.getView().byId(pageId + "--manifestDispId").setVisible(true);
				
						// data.results.Status === "OPEN" ? that.getView().byId("rejBtn").setVisible(true) : that.getView().byId("rejBtn").setVisible(false) ;
						for (var j in that.getView().byId("dispDetails").getItems()) {
							that.getView().byId("dispDetails").getItems()[j].setVisible(false);
						}
						that.getView().byId("dispDetails").getItems()[0].setVisible(true);
						var selItm = that.getView().byId("dispList").getItems()[0];
						that.getView().byId("dispList").setSelectedItem(selItm, true);
						if (status === 'CUST_APPROVED' || status === 'MAN_CREATED') {
							that.getView().byId("createBtn").setVisible(true);
							that.getView().byId("delCrtBtn").setVisible(false);
							that.getView().byId("tallyBtn").setVisible(false);
							that.getView().byId("tallyCrtBtn").setVisible(false);
							that.getView().byId("saveBtn").setVisible(false);
							that.getView().byId("cancelBtn").setVisible(false);
						} else {
							that.getView().byId("createBtn").setVisible(false);
							that.getView().byId("delCrtBtn").setVisible(true);
							// that.getView().byId("tallyBtn").setVisible(true);
							// that.getView().byId("tallyCrtBtn").setVisible(true);
							that.getView().byId("saveBtn").setVisible(false);
							that.getView().byId("cancelBtn").setVisible(false);
						}
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
					}
				});
			}

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
						console.log(data);
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
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;

			var oEntry = this.getView().getModel("BOEDetailsModel").getData();
			oModel.create("/ManifestDetailsSet", oEntry, {
				success: function(data) {
					// sap.m.MessageToast.show("" + data.ManifestNo + "Created Successfully..");
					sap.m.MessageToast.show("Manifest No - " + data.ManifestNo + " Created Successfully", {
						closeOnBrowserNavigation: false
					});
					that.getRouter().navTo("dashboardManifest");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		deliveryCreatePress: function(evt) {
			sap.ui.core.BusyIndicator.show();
			// this.getRouter().navTo("deliveryDetails");
			var selectId = this.getView().byId("dispList").getSelectedItem().getBindingContext("BOEDetailsModel");
			var sPath = selectId.getPath();
			var model = this.getView().getModel("BOEDetailsModel");
			var obj = model.getProperty(sPath);
			console.log(obj);
			sap.ui.getCore().setModel(new JSONModel(obj), "ManifBOEModel");
			this.getRouter().navTo("deliveryDetails", {
				sPath: encodeURIComponent(sPath),
				id: "create",
				status: status
			});
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
		},
		handelListPress: function(evt) {
			var sPath = evt.getSource().getBindingContext("BOEDetailsModel").getPath().split("/")[3];
			var selItm = this.getView().byId("dispList").getItems()[sPath];
			this.getView().byId("dispList").setSelectedItem(selItm, true);
			if (this.getView().byId("manifestDispId").getVisible() === true) {
				for (var i in this.getView().byId("dispDetails").getItems()) {
					this.getView().byId("dispDetails").getItems()[i].setVisible(false);
				}
				this.getView().byId("dispDetails").getItems()[sPath].setVisible(true);
			} else {
				for (var j in this.getView().byId("changeDetails").getItems()) {
					this.getView().byId("changeDetails").getItems()[j].setVisible(false);
				}
				this.getView().byId("changeDetails").getItems()[sPath].setVisible(true);
			}

		},
		handleCreatePress: function(evt) {
			//var oEntry  = this.getView().getModel("BOEDetailsModel").getData();
			var id = evt.getSource().getId().split("--")[1];
			if (id === "createBtn") {
				this.onCreate();
			}
			if (id === "editBtn") {
				this.getView().byId("manifestDispId").setVisible(false);
				this.getView().byId("manifestChangeId").setVisible(true);
				this.getView().byId("editBtn").setVisible(false);
				this.getView().byId("cancelBtn").setVisible(true);
				this.getView().byId("saveBtn").setVisible(true);
			}
			if (id === "saveBtn" || id === "cancelBtn") {
				this.getView().byId("manifestDispId").setVisible(true);
				this.getView().byId("manifestChangeId").setVisible(false);
				this.getView().byId("editBtn").setVisible(true);
				this.getView().byId("cancelBtn").setVisible(false);
				this.getView().byId("saveBtn").setVisible(false);
				if (id === "saveBtn") {
					this.onCreate();
				}
			}
			if (this.getView().byId("manifestDispId").getVisible() === true) {
				for (var i in this.getView().byId("dispDetails").getItems()) {
					this.getView().byId("dispDetails").getItems()[i].setVisible(false);
				}
				this.getView().byId("dispDetails").getItems()[0].setVisible(true);
			} else {
				for (var j in this.getView().byId("changeDetails").getItems()) {
					this.getView().byId("changeDetails").getItems()[j].setVisible(false);
				}
				this.getView().byId("changeDetails").getItems()[0].setVisible(true);
			}
		},
		handlePress: function(evt) {

			sap.ui.core.BusyIndicator.show();
			var oEntry = {

				"ManifestNo": this.getView().getModel("BOEDetailsModel").getData().AGENT_MANIFEST_NO,
				"Status": evt.getSource().getType() === "Accept" ? "APPROVE" : "REJECT",
				"RejectRemark": ""
			};
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.create("/AgentStatusSet", oEntry, {
				success: function(data) {
					sap.m.MessageToast.show("Manifest " + oEntry.Status + "ED Successfully", {
						closeOnBrowserNavigation: false
					});
				that.getRouter().navTo("dashboardManifest");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show("Something went wrong");
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		handleTallySheetPress: function(evt) {
			var tallyHeaderData = evt.getSource().getModel("BOEDetailsModel").getData();
			sap.ui.getCore().setModel(new JSONModel(tallyHeaderData), "ManifModel");
			var tallycode = evt.getSource().getModel("BOEDetailsModel").getData().TlyShtCode;
			var mafstNo = evt.getSource().getModel("BOEDetailsModel").getData().AGENT_MANIFEST_NO;
			var id = evt.getSource().getId().split("--")[1] === "tallyBtn" ? tallycode : mafstNo;
			var status = evt.getSource().getId().split("--")[1] === "tallyBtn" ? "Details" : "create";
			tallyHeaderData.ActionFlag === "No items to consolidate" ? sap.m.MessageToast.show(tallyHeaderData.ActionFlag) : this.getRouter().navTo(
				"tallySheetCargo", {
					sPath: encodeURIComponent(),
					id: id,
					status: status

				});

		}
	});
});
