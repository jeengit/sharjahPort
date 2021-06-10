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
			var that = this;
			if (id !== 'false') {
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(true);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(false);
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(false);
				this.getView().byId(this.getView().getId() + "--save").setVisible(false);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(true);
				this.getView().byId(this.getView().getId() + "--create").setVisible(false);
				var oModel = this.getOwnerComponent().getModel("s4Model");
				oModel.setUseBatch(false);
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
				setTimeout(function() {
					var modData = that.getView().getModel("manifestListModel").getData();
					that.getFilter(modData);
				}, 2000);
				sap.ui.core.BusyIndicator.hide();
			}
		},
		getFilter: function(modData) {
			var keys = ['CallSign'],
				filtered = modData.filter(
					(s => o =>
						(k => !s.has(k) && s.add(k))
						(keys.map(k => o[k]).join('|'))
					)
					(new Set)
				);
			var filteredData = filtered.filter(res => res.CallSign !== '');
			this.getView().setModel(new JSONModel(filteredData), "callSignModel");
		},
		handleCallSignPress: function(evt) {
			this.getView().byId("manifestSel").getSelectedKey() !== '' ? this.getView().byId("manifestSel").setSelectedKey(null) : ''
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/ManifestListSet", {
				urlParameters: {
					"$filter": "ImStatus eq 'OPEN' and CallSign eq '" + evt.getSource().getSelectedKey() + "'"
				},
				success: function(data) {
					that.getView().setModel(new JSONModel(data.results), "manifestFilterListModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		addNewRowPress: function(evt) {
			evt.getSource().getAlt() === "X" ? this.goToCargoDetailsSet() : this.goToServiceChargeSet(evt.getSource().getAlt());
		},
		goToServiceChargeSet: function(item_type) {
			this.getView().getModel("tSClerkDetailModel").getData().ServiceChargeSet.results.unshift({
				"GUID": "",
				"ItmNo": "",
				"ItmType": item_type,
				"ManifestNo": "",
				"Commodity": "",
				"Equipment": "",
				"DelType": "",
				"NoOfPacks": "",
				"Shift": "",
				"HatchNo": "",
				"Date": "",
				"From": "",
				"To": "",
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
			var model = evt.getSource().getModel("manifestFilterListModel");
			var oItem = evt.getSource().getSelectedItem();
			var oContext = oItem.getBindingContext("manifestFilterListModel");
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
				AgentCode: obj.AgentID ? obj.AgentID : '',
				AgentName: obj.AgentName,
				Berth: oEntry['ManifestNo'] ? oEntry.Berth : '',
				CallSign: obj.CallSign,
				CargoDetailsSet: {
					results: oEntry['ManifestNo'] ? oEntry.CargoDetailsSet.results : []
				},
				CustomsRefNo: obj.CustomsRefManifestNo,
				Date: date,
				Derrik_Crain: "",
				EmployeeId: "",
				GUID: "",
				HatchNo: oEntry['ManifestNo'] ? oEntry.HatchNo : '',
				IMO: obj.IMOnumber,
				ImFlag: obj.ImFlag,
				Import_Export: "",
				ManifestNo: obj.ManifestNo,
				NoOfHooks: oEntry['ManifestNo'] ? oEntry.NoOfHooks : '',
				ServiceChargeSet: {
					results: oEntry['ManifestNo'] ? oEntry.ServiceChargeSet.results : []
				},
				Shift: oEntry['ManifestNo'] !== '' ? oEntry.Shift : '',
				TallyServiceNo: "",
				TimeCommenced: oEntry['ManifestNo'] ? oEntry.TimeCommenced : '',
				TimeCompleted: "",
				VesselName: obj.VesselName
			};
			this.getView().setModel(new JSONModel(oData), "tSClerkDetailModel");
		},
		deleteThisItem: function(oEvent) {
			var oRow = oEvent.getSource().getParent(); //Get Row
            var iRowIndex = oRow.getIndex();
            var oData = this.getView().getModel("tSClerkDetailModel").getData().ServiceChargeSet.results;
            oData.splice(iRowIndex, 1);
            this.getView().getModel("tSClerkDetailModel").refresh();
		}
	});
});