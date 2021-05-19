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
		}
	});

});