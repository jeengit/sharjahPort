sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardHarbour", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardHarbour").attachPatternMatched(this._onObjectMatched, this);
			var oPopOver = this.getView().byId("idPopOver");
			var oVizFrame = this.getView().byId("idVizFrame");
			oPopOver.connect(oVizFrame.getVizUid());
		},
		_onObjectMatched: function() {
			this.getCalenderData();
			this.callForHarbourNotification();
			this.getUserName();
			this.getModel("DashboardCount", "DashboardCountModel");
			var that = this;
			setTimeout(function() {
				var oModData = that.getView().getModel("DashboardCountModel").getData();
				var res = {
					"results": [{
						"status": "Pending",
						"count": oModData['0'].LogsheetPending
					}, {
						"status": "Closed",
						"count": oModData['0'].LogsheetClosed
					}]
				};
				that.getView().setModel(new JSONModel(res), "pieChartModel");
			}, 2000);
			var oData = {
				"results": [{
					"count": 1,
					"title": "Pacific Vision",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 2,
					"title": "Delta Amazon",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 3,
					"title": "Ever Golden",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 4,
					"title": "Ever Glory",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 5,
					"title": "Seapol Ruby",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 6,
					"title": "Yuan Jin Hai",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
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
					"status": "pilotTug"
				}, {
					"count": 10,
					"title": "Vincent Trader",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 11,
					"title": "Shandong Da De",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 12,
					"title": "Ezki",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 13,
					"title": "Available",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 14,
					"title": "Ore Brasil",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 15,
					"title": "Seamec Gallant",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "anchorage"
				}, {
					"count": 16,
					"title": "Olympic Lion",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 17,
					"title": "New Treasure",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 18,
					"title": "Morco Polo",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "pilotTug"
				}, {
					"count": 19,
					"title": "Berg Everest",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 20,
					"title": "New Renown",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}, {
					"count": 21,
					"title": "Coswisdom Lake",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "berthing"
				}, {
					"count": 22,
					"title": "Mette Maersk",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "departure"
				}, {
					"count": 23,
					"title": "Pacific Career",
					"desc": "ETC:02:20 HRS | Size:362/65",
					"status": "ETA"
				}]
			};
			this.getView().setModel(new JSONModel(oData), "berthModel");
			var pilotTugData = {
				"results": [{
					"vessel": "Ever Golden",
					"status": "Pilot 1, Tug 2"
				}, {
					"vessel": "Olmpic Lion",
					"status": "Waiting"
				}, {
					"vessel": "Snow",
					"status": "Waiting"
				}]
			};
			this.getView().setModel(new JSONModel(pilotTugData), "pilotTugTable");
			var pendReqData = {
				"results": [{
					"vessel": "Ever Golden",
					"agent": "Kanoo Shipping",
					"status": "Log Sheet Approval",
					"statusCode": 1
				}, {
					"vessel": "Olympic Lion",
					"agent": "GAC Shipping",
					"status": "Log Sheet Approval",
					"statusCode": 1
				}, {
					"vessel": "Snow",
					"agent": "NSS",
					"status": "Hot Works",
					"statusCode": 0
				}]
			};
			this.getView().setModel(new JSONModel(pendReqData), "pendReqTable");
			sap.ui.core.BusyIndicator.hide();
		},
		handleListPress: function(oEvent) {
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			var route = type === "ETA" ? "etaList" : "logList";
			this.getRouter().navTo(route, {
				sPath: status,
				type: type
			});
		},
		getCalenderData: function() {
			var ddata = {
				startDate: new Date("2015", "11", "15", "8", "0"),
				people: [{
					appointments: [{
						start: new Date("2015", "11", "15", "0", "0"),
						end: new Date("2015", "11", "15", "0", "0"),
						title: "Team meeting"
					}, {
						start: new Date("2015", "11", "16", "0", "0"),
						end: new Date("2015", "11", "16", "0", "0"),
						title: "Vacation"
					}]
				}, {
					appointments: [{
						start: new Date("2015", "11", "15", "0", "0"),
						end: new Date("2015", "11", "15", "0", "0"),
						title: "Meeting"
					}, {
						start: new Date("2015", "11", "15", "0", "0"),
						end: new Date("2015", "11", "15", "0", "0"),
						title: "Team meeting"
					}, {
						start: new Date("2015", "11", "15", "0", "30"),
						end: new Date("2015", "11", "15", "0", "30"),
						title: "Lunch"
					}]
				}]
			};

			// var data = {
			//  "startDate": new Date("2015", "11", "15", "8", "0"),
			//   "Port": "",
			//   "CallSign": "JD345E",
			//   "CalendarSet": [{
			//     "results": [{

			//         "CallSign": "JD345E",
			//         "VesselName": "",
			//         "BerthNumber": "B0002",
			//         "Port": "",
			//         "ImoNo": "",
			//         "Status": "ESTIMATED",
			//         "EstdDate": new Date("2015", "11", "15", "0", "30"),
			//         "EndDate": new Date("2015", "11", "15", "0", "30")
			//       },
			//       {

			//         "CallSign": "JD345E",
			//         "VesselName": "",
			//         "BerthNumber": "B0002",
			//         "Port": "",
			//         "ImoNo": "",
			//         "Status": "ESTIMATED",
			//         "EstdDate": new Date("2015", "11", "15", "0", "30"),
			//         "EndDate":new Date("2015", "11", "15", "0", "30")
			//       }
			//     ]
			//   }]
			// };
			// this.getView().setModel(new JSONModel(data), "calenderSetModel");
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/CalendarDateSet('')", {
				method: "GET",
				urlParameters: {

					"$expand": "CalendarDetailsSet/CalendarSet",
					"$format": "json"
				},
				success: function(data) {
					console.log(data.StartDate);
					for (var k = 0; k < 1; k++) {
						data.StartDate =  new Date(data.StartDate);
						console.log(data.StartDate);
					}

					that.getView().setModel(new JSONModel(data), "calenderSetModel");
					console.log(JSON.stringify(data));
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}
	});
});