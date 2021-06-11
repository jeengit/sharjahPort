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
			this.getView().byId(this.getView().getId() + "--tallyCargochangeId").setVisible(false);
			this.getModel("ManifestListSet", "manifestListModel", "OPEN");
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
						setTimeout(function() {
						that.getManifestFilter(that.getView().getModel("tSClerkDetailModel").getData().CallSign);
						}, 2000);
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				this.getView().setModel(new JSONModel(null), "tSClerkDetailModel");
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(false);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(true);
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(false);
				this.getView().byId(this.getView().getId() + "--save").setVisible(false);
				this.getView().byId(this.getView().getId() + "--create").setVisible(true);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(false);
			}
			setTimeout(function() {
				var modData = that.getView().getModel("manifestListModel").getData();
				that.getFilter(modData);
				sap.ui.core.BusyIndicator.hide();
			}, 2000);
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
			console.log(this.getView().byId("manifestSel").getSelectedKey());
			this.getView().byId("manifestSel").getSelectedKey() !== '' ? this.getView().byId("manifestSel").setSelectedKey(null) : ''
			this.getManifestFilter(evt.getSource().getSelectedKey());
		},
		getManifestFilter: function(key) {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/ManifestListSet", {
				urlParameters: {
					"$filter": "ImStatus eq 'OPEN' and CallSign eq '" + key + "'"
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
			console.log(this.getView().byId(this.getView().getId() + "--save").getVisible());
			this.getView().getModel("tSClerkDetailModel").getData().ServiceChargeSet.results.unshift({
				"GUID": "",
				"ItmNo": "",
				"ItmType": item_type,
				"ManifestNo": this.getView().getModel("tSClerkDetailModel").getData().ManifestNo,
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
				"RefMaterial": "",
				"ImActionFlag": "I"
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
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(true);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(false);
				if (id === "save") {
					oEntry.ImFlag = "EDIT";
					this.handleSaveTallySheet(oEntry);
				}
			} else if (id === "edit") {
				this.getView().byId(this.getView().getId() + "--cancel").setVisible(true);
				this.getView().byId(this.getView().getId() + "--save").setVisible(true);
				this.getView().byId(this.getView().getId() + "--create").setVisible(false);
				this.getView().byId(this.getView().getId() + "--edit").setVisible(false);
				this.getView().byId(this.getView().getId() + "--tallyClerkDispId").setVisible(false);
				this.getView().byId(this.getView().getId() + "--tallyClerkchangId").setVisible(true);
			} else {
				oEntry.ImFlag = "CREATE";
				this.handleSaveTallySheet(oEntry);
			}
		},
		handleSaveTallySheet: function(oEntry) {
			sap.ui.core.BusyIndicator.show();
			var status = oEntry.ImFlag === 'CREATE' ? 'Created' : 'Updated';
			var msg = oEntry.ImFlag === 'CREATE' ? 'Tally Sheet with Guid Number' : 'Tally Sheet with Maniefst Number';
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.create("/ClerkTallySheetSet", oEntry, {
				success: function(data) {
					var item = data.GUID ? data.GUID : oEntry.ManifestNo;
					sap.m.MessageToast.show(msg + " - " + item + " " + status + " Successfully", {
						closeOnBrowserNavigation: false
					});
					msg === "Created" ? that.getRouter().navTo("tallySheetClerkList") : '';
					if (status === "Updated") {
						oModel.read("/ClerkTallySheetSet('" + oEntry.GUID + "')", {
							urlParameters: {
								"$expand": "ServiceChargeSet,CargoDetailsSet"
							},
							success: function(data) {
								that.getView().setModel(new JSONModel(data), "tSClerkDetailModel");
							},
							error: function(oResponse) {
								sap.m.MessageToast.show(oResponse.statusText);
								sap.ui.core.BusyIndicator.hide();
							}
						});
					}
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		handleMDetailsPress: function(evt) {
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
				Berth: '',
				CallSign: obj.CallSign,
				CargoDetailsSet: {
					results: []
				},
				CustomsRefNo: obj.CustomsRefManifestNo,
				Date: date,
				Derrik_Crain: "",
				EmployeeId: "",
				GUID: "",
				HatchNo: '',
				IMO: obj.IMOnumber,
				ImFlag: obj.ImFlag,
				Import_Export: "",
				ManifestNo: obj.ManifestNo,
				NoOfHooks: '',
				ServiceChargeSet: {
					results: []
				},
				Shift: '',
				TallyServiceNo: "",
				TimeCommenced: '',
				TimeCompleted: "",
				VesselName: obj.VesselName
			};
			this.getView().setModel(new JSONModel(oData), "tSClerkDetailModel");
		},
		deleteThisItem: function(oEvent) {
			if (this.getView().byId(this.getView().getId() + "--save").getVisible() === true) {
				oEvent.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag = "D";
				for (var i in oEvent.getSource().getParent().getCells()) {
					oEvent.getSource().getParent().getCells()[i].setVisible(false);
				}
			} else {
				var oRow = oEvent.getSource().getParent(); //Get Row
				var iRowIndex = oRow.getIndex();
				var oData = this.getView().getModel("tSClerkDetailModel").getData().ServiceChargeSet.results;
				oData.splice(iRowIndex, 1);
				this.getView().getModel("tSClerkDetailModel").refresh();
			}
		},
		handleLiveChange: function(evt) {
			if (this.getView().byId(this.getView().getId() + "--save").getVisible() === true) {
				if(evt.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag === ""){
					evt.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag = "U";
				}
				if(evt.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag === "U"){
					evt.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag = "U";
				}
				if(evt.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag === "I"){
					evt.getSource().getParent().getBindingContext("tSClerkDetailModel").getProperty().ImActionFlag = "I";
				}
			}
		}
	});
});