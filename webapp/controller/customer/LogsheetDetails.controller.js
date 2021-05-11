sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/model/ValidateException",
	"sap/ui/core/Core",
	"sap/ui/model/json/JSONModel"
], function(Device, BaseController, Controller, Filter, FilterOperator, Fragment, MessageToast, ValidateException, Core, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.LogsheetDetails", {

		onInit: function() {
			var oView = this.getView(),
				oMM = Core.getMessageManager();

			oView.setModel(new JSONModel({
				name: "",
				email: ""
			}));

			// attach handlers for validation errors
			oMM.registerObject(oView.byId("agentInp"), true);
			oMM.registerObject(oView.byId("callSignInp"), true);
			oMM.registerObject(oView.byId("etaInp"), true);
			oMM.registerObject(oView.byId("vnameInp"), true);
			oMM.registerObject(oView.byId("portInp"), true);
			// oMM.registerObject(oView.byId("vrnInp"), true);
			oMM.registerObject(oView.byId("voyageInp"), true);
			// this._formFragments = {};
			// this._showFormFragment("vesselMov");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("orderStatus").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/LogSheetDetailsSet('" + oEvent.getParameter("arguments").id + "')", {
				urlParameters: {
					"$expand": "LogsheetToShifting"
				},
				success: function(data) {
					that.getView().setModel(new JSONModel(data), "vesMovModel");
				},
				error: function(oResponse) {
					sap.m.MessageToast.show("Something went wrong!..");
				}
			});
			this.handleServiceGET(that, oModel,"TugListSet","vesMovTugModel");
			this.handleServiceGET(that, oModel,"PilotListSet","vesMovpilotModel");
			this.handleServiceGET(that, oModel,"BerthListSet","vesMovBertModel");
			this.handleServiceGET(that, oModel,"MBoatListSet","mBoatModel");
		},
		handleServiceGET: function(that, oModel, entitySet, modelName) {
				oModel.read("/" + entitySet, {
					success: function(data) {
						that.getView().setModel(new JSONModel(data), modelName);
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
					}
				});
			sap.ui.core.BusyIndicator.hide();
		},
		handleChangeSelect: function(evt) {
			var preDate = this.getView().byId(evt.getSource().getName()).getDateValue();
			var curDate = evt.getSource().getDateValue();
			if (preDate >= curDate) {
				evt.getSource().setValue(null);
				sap.m.MessageToast.show("The date & Time must be greater than the Start/Arrival Date & Time");
			}
		},
		_validateInput: function(oInput) {
			var sValueState = "None";
			var bValidationError = false;
			var oBinding = oInput.getBinding("value").getValue();
			console.log(oBinding);
			// console.log(oBinding.getType());
			if (!oBinding) {
				oInput.setValueState("Error");
				// oInput.setValueStateText(Utils.i18n("INVALID_VALUE"));
				bValidationError = true;
			} else {
				oInput.setValueState("None");
				bValidationError = false;
			}

			// try {
			// 	oBinding.getType().validateValue(oInput.getValue());
			// } catch (oException) {
			// 	sValueState = "Error";
			// 	bValidationError = true;
			// }
			// console.log(sValueState);
			// oInput.setValueState(sValueState);

			return bValidationError;
		},

		// onPilotChangeFn: function (oEvent) {
		// 	var id = oEvent.getParameter("id");
		// 	console.log(id);
		// 	var selctId = this.getView().byId(id).getSelectedKey();
		// 	console.log(selctId);
		// 	var oModel = this.getOwnerComponent().getModel("s4Model");
		// 	oModel.setUseBatch(false);
		// 	var that = this;
		// 	if (selctId) {
		// 		oModel.read("/MBoatListSet", {

		// 			success: function (data) {
		// 				that.getView().setModel(new JSONModel(data), "mBoatModel");
		// 				sap.ui.core.BusyIndicator.hide();
		// 			},
		// 			error: function (oResponse) {
		// 				alert("Error...");
		// 				sap.ui.core.BusyIndicator.hide();
		// 			}
		// 		});
		// 	} else {
		// 		MessageToast.show("");
		// 	}
		// },
		addNewRowPress: function(oEvent) {
			var oEntry = this.getView().getModel("vesMovModel").getData();
			var oData = {
				"ImLogSheetNo": "",
				"ImPortNo": "",
				"LogSheetNo": "",
				"ItemNumber": "",
				"Shift_FromDate": "",
				"Shift_FromTime": "",
				"Shift_ToDate": "",
				"Shift_ToTime": "",
				"Shift_FromBerthNumber": "",
				"Shift_ToBerthNumber": "",
				"Shift_Fender": "",
				"Shift_M_Boat": "",
				"Shift_BerthDetention": "",
				"Shift_Garbage": "",
				"Shift_BerthRemark": "",
				"Shift_PilotName": "",
				"Shift_PilotCutter": "",
				"Shift_PilotDetention": "",
				"Shift_PilotRemark": "",
				"Shift_TugName": "",
				"Shift_NumberofTugs": "",
				"Shift_TugDetention": "",
				"Shift_TugreMark": "",
				"Shift_DeadVessel": "",
				"Shift_PiotDelay": "",
				"Shift_PilotUsed": "",
				"Shift_TugDelay": "",
				"Shift_TugUsed": "",
				"Shift_MooringUsed": "",
				"Shift_Reason": "",
				"ActionFlag": "I"
			};
			if (oEvent.getSource().getTooltip() === "Add") {
				oEntry.LogsheetToShifting.results.push(oData);
			} else {
				oEntry.LogsheetToShifting.results.pop(oData);
			}
			this.getView().getModel("vesMovModel").refresh("true");
		},
		onApprove: function() {
			var oEntry = this.getView().getModel("vesMovModel").getData();
			oEntry['ImFlag'] = "APPROVE";
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oView = this.getView(),
				aInputs = [
					oView.byId("agentInp"),
					oView.byId("callSignInp"),
					oView.byId("etaInp"),
					oView.byId("vnameInp"),
					oView.byId("portInp"),
					// oView.byId("vrnInp"),
					oView.byId("voyageInp")

				],
				bValidationError = false;
			aInputs.forEach(function(oInput) {
				bValidationError = this._validateInput(oInput) || bValidationError;
			}, this);

			if (!bValidationError) {
				var that = this;
				oModel.create("/LogSheetDetailsSet", oEntry, {
					success: function(data) {
						sap.m.MessageToast.show("Logsheet Approved Successfully with sales order : " + data.SalesOrderNumber + "for Bill No" + data.BillNo, {
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
						// that.getRouter().navTo("dashboard");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
						sap.m.MessageToast.show("Something went wrong");
						sap.ui.core.BusyIndicator.hide();
					}
				});
				sap.ui.core.BusyIndicator.hide();

			} else {
				MessageToast.show("A validation error has occurred. Complete your input first.");
				sap.ui.core.BusyIndicator.hide();

			}
		},
		onSave: function() {
			var oEntry = this.getView().getModel("vesMovModel").getData();
			oEntry['ImFlag'] = "EDIT";
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oView = this.getView(),
				aInputs = [
					oView.byId("agentInp"),
					oView.byId("callSignInp"),
					oView.byId("etaInp"),
					oView.byId("vnameInp"),
					oView.byId("portInp"),
					// oView.byId("vrnInp"),
					oView.byId("voyageInp")

				],
				bValidationError = false;
			aInputs.forEach(function(oInput) {
				bValidationError = this._validateInput(oInput) || bValidationError;
			}, this);

			if (!bValidationError) {
				oModel.create("/LogSheetDetailsSet", oEntry, {
					success: function(data) {
						sap.m.MessageToast.show("Logsheet Updated Successfully..");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
						sap.m.MessageToast.show("Something went wrong");
						sap.ui.core.BusyIndicator.hide();
					}
				});
				sap.ui.core.BusyIndicator.hide();
			} else {
				sap.ui.core.BusyIndicator.hide();
				MessageToast.show("A validation error has occurred. Complete your input first.");
			}
		},
		handleChangePress: function(evt) {
			var text = evt.getSource().getText();
			var pageId = this.getView().getId();
			if (text === "Edit") {
				this.getView().byId(pageId + "--vesMovDispId").setVisible(false);
				this.getView().byId(pageId + "--vesMovChangeId").setVisible(true);
				this.getView().byId("approveBtn").setVisible(true);
				this.getView().byId("cancelBtn").setVisible(true);
				this.getView().byId("saveBtn").setVisible(true);
				this.getView().byId("editBtn").setVisible(false);
			}
			if (text === "Cancel" || text === "Save" || text === "Approve") {
				this.getView().byId(pageId + "--vesMovDispId").setVisible(true);
				this.getView().byId(pageId + "--vesMovChangeId").setVisible(false);
				this.getView().byId("approveBtn").setVisible(false);
				this.getView().byId("cancelBtn").setVisible(false);
				this.getView().byId("saveBtn").setVisible(false);
				this.getView().byId("editBtn").setVisible(true);
				if (text === "Approve") this.onApprove();
				if (text === "Save") this.onSave();
			}
		}
	});

});