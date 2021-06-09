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
				this.getView().setModel(new JSONModel({}), "tSClerkDetailModel");
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(false);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(true);
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(false);
				this.getView().byId(this.getView().getId() + "--save").setVisible(true);
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
				"Desc_Package": "Test",
				"Marks_No": "123",
				"Particular_TS": "wererwe",
				"Total": "234",
				"Gross_Weight": "123",
				"Sent_to": "",
				"Remark": ""
			});
			this.getView().getModel("tSClerkDetailModel").refresh();
		},
		handleChangePress: function(evt) {

		},
		handleMDetailsPress: function(evt) {
			var model = evt.getSource().getModel("manifestListModel");
			var oItem = evt.getSource().getSelectedItem();
			var oContext = oItem.getBindingContext("manifestListModel");
			var oPath = oContext.getPath();
			var obj = model.getProperty(oPath);
			var oData = {
				ActionFlag: "",
				AgentCode: obj.AgentCode,
				AgentName: obj.AgentName,
				Berth: "",
				CallSign: obj.CallSign,
				CargoDetailsSet: {
					results: []
				},
				CustomsRefNo: obj.CustomsRefManifestNo,
				Date: "",
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
					results: []
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