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
			this.fnGetCount(oEvent);
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			var route = type === "ETA" || type === "HOTWORKS" ? "etaList" : "logList";
			this.getRouter().navTo(route, {
				sPath: status,
				type: type
			});
		},
		fnGetCount : function(obj){
			var count = [];
			for (var i of obj.getSource().getTileContent()[0].getContent().getData()) {
				count.push({
					"text": i.getTitle(),
					"count": i.getValue()
				});
			}
			sap.ui.getCore().setModel(new JSONModel(count), "countModel");
		},
		getCalenderData: function() {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			that.getView().byId("PC1").setViewKey("Month");
			oModel.read("/CalendarDateSet('')", {
				urlParameters: {
					"$expand": "CalendarBirthNoSet/CalendarBirthDetailsSet"
				},
				success: function(data) {
					var jsonCalendar = {
						"people": [],
						"startDate": new Date()
					};
					for (var i = 0; i < data.CalendarBirthNoSet.results.length; i++) {
						var appointments = [];
						for (var k = 0; k < data.CalendarBirthNoSet.results[i].CalendarBirthDetailsSet.results.length; k++) {
							var de = data.CalendarBirthNoSet.results[i].CalendarBirthDetailsSet.results[k].EstdDate;
							var date = de.charAt(6) + de.charAt(7) - 1;
							var month = de.charAt(4) + de.charAt(5);
							var year = de.charAt(0) + de.charAt(1) + de.charAt(2) + de.charAt(3);
							appointments.push({
								"title": data.CalendarBirthNoSet.results[i].CalendarBirthDetailsSet.results[k].CallSign,
								"start": new Date(year, month, date),
								"end": new Date(year, month, date+30)
							});
						}
						jsonCalendar.people.push({
							"name": data.CalendarBirthNoSet.results[i].BirthNo,
							"appointments": appointments
						});
					}
					that.getView().setModel(new JSONModel(jsonCalendar), "calenderSetModel");
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}
	});
});