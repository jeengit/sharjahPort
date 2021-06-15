sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardTower", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboard").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
		//	this.selectCallSign();
			this.getUserName();
			this.getModel("DashboardCount","DashboardCountModel");
			var oData = {
				"results": [{
					"count": 1,
					"title": "Pacific Vision",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 2,
					"title": "Delta Amazon",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 3,
					"title": "Ever Golden",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 4,
					"title": "Ever Glory",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pending"
				}, {
					"count": 5,
					"title": "Seapol Ruby",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 6,
					"title": "Yuan Jin Hai",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 7,
					"title": "Snow",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 8,
					"title": "Tihama",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 9,
					"title": "Available",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 10,
					"title": "Vincent Trader",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 11,
					"title": "Shandong Da De",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 12,
					"title": "Ezki",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 13,
					"title": "Available",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 14,
					"title": "Ore Brasil",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 15,
					"title": "Seamec Gallant",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 16,
					"title": "Olympic Lion",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 17,
					"title": "New Treasure",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pending"
				}, {
					"count": 18,
					"title": "Morco Polo",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 19,
					"title": "Berg Everest",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 20,
					"title": "New Renown",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pending"
				}, {
					"count": 21,
					"title": "Coswisdom Lake",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 22,
					"title": "Mette Maersk",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "completed"
				}, {
					"count": 23,
					"title": "Pacific Career",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pending"
				}]
			};
			this.getView().setModel(new JSONModel(oData), "berthModel");
			var etaData = {
				"results": [{
					"ship": "Marco Polo",
					"time": "10:20 Hrs"
				}, {
					"ship": "Pacific Auspice",
					"time": "11:45 Hrs"
				}, {
					"ship": "Vincent Trade",
					"time": "12:20 Hrs"
				}]
			};
			this.getView().setModel(new JSONModel(etaData), "etaTable");
			var anchorData = {
				"results": [{
					"ship": "Ever Golden",
					"agent": "Kanoo Shipping",
					"status": "Waiting for Berthing",
					"statusCode": 1
				}, {
					"ship": "Olympic Lion",
					"agent": "GAC Shipping",
					"status": "Waiting for Berthing",
					"statusCode": 1
				}, {
					"ship": "Snow",
					"agent": "NSS",
					"status": "Crew Change",
					"statusCode": 0
				}]
			};
			this.getView().setModel(new JSONModel(anchorData), "anchorTable");
			var harbourData = {
				"results": [{
					"ship": "Ever Golden",
					"berth": "Kanoo Shipping",
					"status": "Waiting for Berthing",
					"statusCode": 1
				}, {
					"ship": "Olympic Lion",
					"berth": "GAC Shipping",
					"status": "Waiting for Berthing",
					"statusCode": 1
				}, {
					"ship": "Snow",
					"berth": "NSS",
					"status": "Crew Change",
					"statusCode": 0
				}]
			};
			this.getView().setModel(new JSONModel(harbourData), "harbourTable");
			sap.ui.core.BusyIndicator.hide();
			this.setVesselMovement();
		},
		setVesselMovement: function() {
			this.statusData = [{
					"id": 7,
					"name": "3 Hours Call"
				},
				{
					"id": 6,
					"name": "1 Hour Call"
				},
				{
					"id": 5,
					"name": "5 Mile Call"
				},
				{
					"id": 4,
					"name": "1 Mile Call"
				},
				{
					"id": 3,
					"name": "Half Mile Call"
				},
				{
					"id": 2,
					"name": "Arrived"
				},
				{
					"id": 1,
					"name": "Departure"
				}];
		//	this.getView().setModel(new JSONModel(harbourData), "harbourTable");
		},
		handleListPress: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			var route = type === "ETA" ? "etaList" : "logList";
			this.getRouter().navTo(route, {
				sPath: status,
				type: type
			});
		},
		handleTabPress: function (evt) {
			if (evt.getSource().getSelectedKey() === "map") {
				var myLatLng = {
					lat: 25.3575,
					lng: 55.3747
				};
				var map = new google.maps.Map(document.getElementById(this.getView().getId() + "--map_canvas"), {
					zoom: 14,
					center: myLatLng,
				});
				new google.maps.Marker({
					position: myLatLng,
					map: map,
					title: "Sharjah Port",
				});
			}
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
						thisObj.getView().setModel(new JSONModel(data), "callSignSearchModel");
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
			if(selectedVal) {
			var thisObj = this;
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.read("/BerthStatusChangeSet('" + selectedVal + "')", {
					success: function(data) {
						var statusData = JSON.parse(JSON.stringify(thisObj.statusData));
						var curStatus = 8;
						var curStatusStr = '';
						if(data && data.Status) {
							curStatus = Number(data.Status);
						} else if(data && data.CallStatus) {
							curStatus = Number(data.CallStatus);
						}
						var curStatusInx = statusData.findIndex(cs => cs.id == Number(curStatus));
						data['cs'] = (curStatus > -1 && statusData[curStatusInx] && statusData[curStatusInx].name) ? statusData[curStatusInx].name : '';
						var dropdownStatusArr = statusData.filter(sd => Number(sd.id) < curStatus);
						dropdownStatusArr.unshift({id: 0, name: ''});
						thisObj.getView().setModel(new JSONModel({items: dropdownStatusArr}), 'vesselMovementStatusModel');
						thisObj.getView().setModel(new JSONModel(data), 'bearthStatusDataModel');
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
					//	sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
		    }
		},
		fnChangeStatusBox: function(oEvent) {
			var selValue = oEvent.getSource().getSelectedKey();
			if(selValue > 0) {
				this.getView().byId('VesselStatusUpdateBtn').setEnabled(true);
			} else {
					this.getView().byId('VesselStatusUpdateBtn').setEnabled(false);
			}
		},
		fnUpdateStatus: function(oEvent) {
			var thisObj = this;
			var oModel = this.getOwnerComponent().getModel("s4Model");
			var newStatus = this.getView().byId('upVesselStatusId').getSelectedKey();
			var exData = this.getView().getModel("bearthStatusDataModel").getData();
			var oEntry = {
    				BerthNumber : exData["BerthNumber"],
    				Port : exData["Port"],
    				CallSign : exData["CallSign"]
			}
			if(newStatus == 1 || newStatus == 2) {
				oEntry['CallStatus'] = '';
				oEntry['Status'] = newStatus.toString();
			} else {
				oEntry['Status'] = '';
				oEntry['CallStatus'] = newStatus.toString();
			}
	/*		delete oEntry['__metadata'];
			delete oEntry['cs']; */
			oModel.create("/BerthStatusChangeSet", oEntry, {
				success: function(data) {
					thisObj.clearStatusBox();
					sap.m.MessageToast.show("Status updated Successfully", {
						closeOnBrowserNavigation: false
					});
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		clearStatusBox: function() {
			this.getView().byId('callSignInputId').setValue();
			this.getView().setModel(new JSONModel({items: []}), 'vesselMovementStatusModel');
			this.getView().setModel(new JSONModel({}), 'bearthStatusDataModel');
		}
	});

});