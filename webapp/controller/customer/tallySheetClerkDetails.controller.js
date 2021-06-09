sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.tallySheetClerkDetails", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("tallySheetClerkDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var id = oEvent.getParameter("arguments").id;
			this.getUserName();
			this.getView().byId(this.getView().getId() + "--tallyCargochangId").setVisible(false);
			if (id !== 'false') {
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(true);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(false);
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(false);
				this.getView().byId(this.getView().getId() + "--save").setVisible(false);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(true);
				this.getView().byId(this.getView().getId() + "--create").setVisible(false);
				var oModel = this.getOwnerComponent().getModel("s4Model");
				oModel.setUseBatch(false);
				var that = this;
				oModel.read("/ClerkTallySheetSet('" + id + "')", {
					urlParameters: {
						"$expand": "ServiceChargeSet,CargoDetailsSet"
					},
					success: function(data) {
						that.getView().setModel(new JSONModel(data), "tSClerkDetailModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				this.getModel("ManifestListSet", "manifestListModel", "OPEN");
				this.getView().setModel(new JSONModel(null), "tSClerkDetailModel");
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(false);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(true);
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(false);
				this.getView().byId(this.getView().getId() + "--save").setVisible(false);
				this.getView().byId(this.getView().getId() + "--create").setVisible(true);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(false);
				sap.ui.core.BusyIndicator.hide();
			}
		},
		addNewRowPress: function(evt) {
			evt.getSource().getAlt() === "X" ? this.goToCargoDetailsSet() : this.goToServiceChargeSet(evt.getSource().getAlt());
		},
		goToServiceChargeSet: function(item_type) {
			this.getView().getModel("tSClerkDetailModel").getData().ServiceChargeSet.results.unshift({
				"GUID": "",
				"ItemNo": "",
				"ItemType": item_type,
				"ManifestNo": "",
				"Commodities": "",
				"EquipmentCode": "",
				"DelType": "",
				"NoOfPackage": "",
				"Shift": "",
				"HatchNo": "",
				"Date": "",
				"FromTime": "",
				"ToTime": "",
				"Weight": "",
				"Quantity": "",
				"UOM": "",
				"Rate": "",
				"Amount": "",
				"Remark": "",
				"RefMaterial": ""
			});
			this.getView().getModel("tSClerkDetailModel").refresh();
		},
		goToCargoDetailsSet: function() {
			this.getView().getModel("tSClerkDetailModel").getData().CargoDetailsSet.results.unshift({
				"GUID": "",
				"Sling_No": "",
				"Desc_Package": "",
				"Marks_No": "",
				"Particular_TS": "",
				"Total": "",
				"Gross_Weight": "",
				"Sent_to": "",
				"Remark": ""
			});
			this.getView().getModel("tSClerkDetailModel").refresh();
		},
		handleChangePress: function(evt) {
			var oEntry = this.getView().getModel("tSClerkDetailModel").getData();
			var id = evt.getSource().getId().split("--")[1];
			if (id === "cancel" || id === "save") {
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(false);
				this.getView().byId(this.getView().getId() + "--save").setVisible(false);
				this.getView().byId(this.getView().getId() + "--create").setVisible(false);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(true);
				if (id === "save") {
					oEntry.ImFlag = "EDIT";
					this.handleSaveTallySheet(oEntry);
				}
			}
			if (id === "edit") {
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(true);
				this.getView().byId(this.getView().getId() + "--save").setVisible(true);
				this.getView().byId(this.getView().getId() + "--create").setVisible(false);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(false);
			} else {
				oEntry.ImFlag = "CREATE";
				this.handleSaveTallySheet(oEntry);
			}
		},
		handleSaveTallySheet: function(oEntry) {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.create("/ClerkTallySheetSet", oEntry, {
				success: function(data) {
						sap.m.MessageToast.show("Tally Sheet with Guid Number - " + data.GUID + " Created Successfully", {
						closeOnBrowserNavigation: false
					});
					that.getRouter().navTo("tallySheetClerkList");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		handleMDetailsPress: function(evt) {
			var oEntry = this.getView().getModel("tSClerkDetailModel").getData();
			var res = Object.keys(oEntry).length === 0 && oEntry.constructor === Object;
			var model = evt.getSource().getModel("manifestListModel");
			var oItem = evt.getSource().getSelectedItem();
			var oContext = oItem.getBindingContext("manifestListModel");
			var oPath = oContext.getPath();
			var obj = model.getProperty(oPath);
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			var ddFormat = dd < 10 ? '0' + '' + dd : dd;
			var mmFormat = mm < 10 ? '0' + '' + mm : mm;
			var date = yyyy + '' + mmFormat + '' + ddFormat;
			var oData = {
				ActionFlag: "",
				AgentCode: obj.AgentCode ? obj.AgentCode : '',
				AgentName: obj.AgentName,
				Berth: "",
				CallSign: obj.CallSign,
				CargoDetailsSet: {
					results: res === false ? oEntry.CargoDetailsSet.results : []
				},
				CustomsRefNo: obj.CustomsRefManifestNo,
				Date: date,
				Derrik_Crain: "",
				EmployeeId: "",
				GUID: "",
				HatchNo: "",
				IMO: obj.IMOnumber,
				ImFlag: obj.ImFlag,
				Import_Export: "",
				ManifestNo: obj.ManifestNo,
				NoOfHooks: "",
				ServiceChargeSet: {
					results: res === false ? oEntry.ServiceChargeSet.results : []
				},
				Shift: "",
				TallyServiceNo: "",
				TimeCommenced: "",
				TimeCompleted: "",
				VesselName: obj.VesselName
			};
			this.getView().setModel(new JSONModel(oData), "tSClerkDetailModel");
		}
	});
});