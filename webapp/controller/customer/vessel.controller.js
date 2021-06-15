sap.ui.define([
	"sap/ui/Device",
	"../BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/ValidateException",
	"sap/ui/core/Core",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Device, BaseController, Controller, Filter, FilterOperator, Fragment, ValidateException, Core, MessageToast, JSONModel) {
	"use strict";

	return BaseController.extend("com.demo.sharjahPort.controller.customer.vessel", {

		onInit: function () {
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
			// oMM.registerObject(oView.byId("voyageInp"), true);

			// this._formFragments = {};
			// this._showFormFragment("vesselMov");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("vessel").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
			this.getUserName();
			var status = sap.ui.getCore().getModel("etaIdModel").getData().status;
			this.getView().setModel(new JSONModel(sap.ui.getCore().getModel("etaIdModel").getData()), "visModel");
			if (status !== "APPROVED") {
				this.getLogDetails();
			} else {
				this.createLog();
			}
			var pageId = this.getView().getId();
			this.getView().byId(pageId + "--vesMovChangeId").setVisible(true);
			this.getModel("TugListSet","vesMovTugModel");
			this.getModel("PilotListSet","vesMovpilotModel");
			this.getModel("BerthListSet","vesMovBertModel");
			this.getModel("MBoatListSet","mBoatModel");
		},
		handleChangeSelect: function (evt) {
			var preDate = this.getView().byId(evt.getSource().getName()).getDateValue();
			var curDate = evt.getSource().getDateValue();
			if (preDate >= curDate) {
				evt.getSource().setValue(null);
				sap.m.MessageToast.show("The date & Time must be greater than the Start/Arrival Date & Time");
			}
		},
		_validateInput: function (oInput) {
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
		createLog: function () {

			var mandatory = sap.ui.getCore().getModel("etaDetailsModel").getData();
			var odata = {
				"ImLogSheetNo": "",
				"ImPortNo": "",
				"LogSheetNo": "",
				"CustomsReferenceNumber": mandatory.ZETANumber,
				"IMONo": mandatory.ZIMONumber,
				"PortNo": mandatory.ZPortName,
				"Portreg": "",
				"CallSign": mandatory.ZCallSign,
				"AgentCode": mandatory.ZAgentCode,
				"VoyageNature": "",
				"PreferredBerth": "",
				"VoyageType": "",
				"ETA": mandatory.ZExpectedArrivalDate,
				"Voyageno": mandatory.ZVoyageNumber,
				"ETD": mandatory.ZExpectedArrivalDate,
				"VesselType": "",
				"VesselName": mandatory.ZVesselName,
				"AgentName": mandatory.ZAgentName,
				"ArrivalDate": mandatory.ZExpectedArrivalDate,
				"VRN":mandatory.ZVRN,
				"GRT": mandatory.ZGRT,
				"DWT": "",
				"VesselLength": " ",
				"Flag": "",
				"LastPort": mandatory.ZLastPort,
				"CountryName": "",
				"NumberOfPC_Issues": "",
				"PartiallyInvoice": "",
				"logsheetRemark": "",
				"ExpectedArrivalDate": mandatory.ZExpectedArrivalDate,
				"ExpectedDepartureDate": mandatory.ZExpectedDepartureDate,
				"ExpectedArrivalTime": mandatory.ZExpectedArrivalTime,
				"ExpectedDepartureTime": mandatory.ZExpectedDepartureTime,
				"Anch_stime": "",
				"Anch_etime": "",
				"Anch_Date": "",
				"Anch_BerthNumber": "",
				"Anch_Time": "",
				"Anch_Fender": "",
				"Anch_M_Boat": "",
				"Anch_BerthDetention": "",
				"Anch_BerthRemark": "",
				"Anch_PilotName": "",
				"Anch_PilotCutter": "",
				"Anch_PilotDetention": "",
				"Anch_PilotRemark": "",
				"Anch_TugName": "",
				"Anch_NumberofTugs": "",
				"Anch_TugDetention": "",
				"Anch_TugRemark": "",
				"Anch_DeadVesselCB": "",
				"Anch_PiotDelayCB": "",
				"Anch_PilotUsedCB": "",
				"Anch_TugDelayCB": "",
				"Anch_TugUsedCB": "",
				"Anch_MooringUsedCB": "",
				"Berth_Date": "",
				"Berth_berthNumber": "",
				"Berth_Time": "",
				"Berth_stime": "",
				"Berth_etime": "",
				"Berth_Fender": "",
				"Berth_M_Boat": "",
				"Berth_BerthDetention": "",
				"Berth_Garbage": "",
				"Berth_BerthRemark": "",
				"Berth_Pilot": "",
				"Berth_PilotCutter": "",
				"Berth_PilotDetention": "",
				"Berth_PilotRemark": "",
				"Berth_TugName": "",
				"Berth_NumberofTugs": "",
				"Berth_TugDetention": "",
				"Berth_TugRemark": "",
				"Berth_DeadVesselCB": "",
				"Berth_PilotDelayCB": "",
				"Berth_PilotUsedCB": "",
				"Berth_TugDelayCB": "",
				"Berth_TugUsedCB": "",
				"Berth_MooringUsedCB": "",
				"UBerth_Date": "",
				"UBerth_BerthNumber": "",
				"UBerth_Time": "",
				"Unberth_stime": "",
				"Unberth_etime": "",
				"UBerth_Fender": "",
				"UBerth_M_Boat": "",
				"UBerth_BerthDetention": "",
				"UBerth_BerthRemark": "",
				"UBerth_Pilot": "",
				"UBerth_PilotCutter": "",
				"UBerth_PilotDetention": "",
				"UBerth_PilotRemark": "",
				"UBerth_TugName": "",
				"UBerth_NumberofTugs": "",
				"UBerth_TugDetention": "",
				"UBerth_TugRemark": "",
				"UBerth_DeadVesselCB": "",
				"UBerth_PiotDelayCB": "",
				"UBerth_PilotUsedCB": "",
				"UBerth_TugDelayCB": "",
				"UBerth_TugUsedCB": "",
				"UBerth_MooringUsedCB": "",
				"PC_Captain": "",
				"PC_DepartureDate": "",
				"PC_extport": "",
				"PC_Number": "",
				"PC_LockAccCB": "",
				"PC_LockAccRemark": "",
				"PC_LockTrafficCB": "",
				"PC_LockTrafficRemark": "",
				"PC_LockHmCb": "",
				"PC_LockHmRemark": "",
				"LeavingDate": "",
				"LeavingBerthNo": "",
				"LeavingTime": "",
				"Coordinator": "",
				"SalesOrderNumber": "",
				"BillNo": "",
				"TotalAmount": "",
				"CreatedDate": "",
				"CreatedTime": "",
				"CreatedBy": "",
				"LastEditedDate": "",
				"LastEditedTime": "",
				"LastEditedBy": "",
				"ImFlag": "CREATE",
				"Eta_no": mandatory.ZETANumber,
				"LogsheetToShifting": {
					"results": [{
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
					}]
				}
			};
			this.getView().setModel(new JSONModel(odata), "vesMovModel");
			sap.ui.core.BusyIndicator.hide();
		},
		getLogDetails: function () {
			var id = sap.ui.getCore().getModel("etaIdModel").getData().id;
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/LogSheetDetailsSet('" + id + "')", {
				urlParameters: {
					"$expand": "LogsheetToShifting"
				},
				success: function (data) {
					that.getView().setModel(new JSONModel(data), "vesMovModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {
					alert("Error...");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		_getFormFragment: function (sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: oView.getId(),
					name: "com.demo.sharjahPort.view.fragments." + sFragmentName
				});
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},
		_showFormFragment: function (sFragmentName) {
			var oPage = this.byId("page");

			/* oPage.removeAllContent(); */
			this._getFormFragment(sFragmentName).then(function (oVBox) {
				oPage.insertContent(oVBox);
			});
		},
		newLogPress: function () {
			var oView = this.getView(),
				aInputs = [
					oView.byId("agentInp"),
					oView.byId("callSignInp"),
					oView.byId("etaInp"),
					oView.byId("vnameInp"),
					oView.byId("portInp")
					// oView.byId("vrnInp"),
					// oView.byId("voyageInp")
					
				],
				bValidationError = false;
			console.log(aInputs);

			// Check that inputs are not empty.
			// Validation does not happen during data binding as this is only triggered by user actions.
			aInputs.forEach(function (oInput) {
				bValidationError = this._validateInput(oInput) || bValidationError;
			}, this);

			if (!bValidationError) {
				// MessageToast.show("The input is validated. Your form has been submitted.");
			
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var oEntry = this.getView().getModel("vesMovModel").getData();
			var that = this;
			oModel.create("/LogSheetDetailsSet", oEntry, {
				success: function (data) {
					sap.m.MessageToast.show("Logsheet - " + data.LogSheetNo + "Created Successfully", {
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
				error: function (oResponse) {
					sap.m.MessageToast.show("Something went wrong");
					sap.ui.core.BusyIndicator.hide();
				}
			});
			} else {
				MessageToast.show("A validation error has occurred. Complete your input first.");
			}
		},
		addNewRowPress: function (oEvent) {
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
		}
	});

});