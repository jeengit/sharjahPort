sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerDashboardManifest", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("dashboardManifest").attachPatternMatched(this._onObjectMatched, this);
			var oPopOver = this.getView().byId("idPopOver");
			var oVizFrame = this.getView().byId("idVizFrame");
			oPopOver.connect(oVizFrame.getVizUid());
		},
		_onObjectMatched: function () {
			this.getCalenderData();
			this.getUserName();
			this.getModel("ManifestDashboardSet","DashboardCountModel");
			sap.ui.getCore().getModel("rememberSelectionModel") ? sap.ui.getCore().setModel(new JSONModel(null),"rememberSelectionModel") : '';
			var that = this;
			setTimeout(function() {
				var oModData = that.getView().getModel("DashboardCountModel").getData();
				var res = {
					"results": [{
						"status": "Custom",
						"count": oModData['0'].Manifest
					}, {
						"status": "Open",
						"count": oModData['0'].OpenManifest
					}, {
						"status": "Closed",
						"count": oModData['0'].ClosedManifest
					}]
				};
				that.getView().setModel(new JSONModel(res), "pieChartModel");
			}, 2000);
		},
		handleListPress: function (oEvent) {
			this.fnGetCount(oEvent);
			sap.ui.core.BusyIndicator.show();
			var status = oEvent.getSource().getAriaLabel().split("/")[0];
			var type = oEvent.getSource().getAriaLabel().split("/")[1];
			//var route = type === "MANIFEST" ? "manifest" : "dashboardManifest";
			this.getRouter().navTo("manifest", {
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
					"$expand": "CalendarDetailsSet/CalendarSet"
				},
				success: function(data) {
					var jsonCalendar = {
						"people": [],
						"startDate": new Date()
					};
					for (var i = 0; i < data.CalendarDetailsSet.results.length; i++) {
						var appointments = [];
						for (var k = 0; k < data.CalendarDetailsSet.results[i].CalendarSet.results.length; k++) {
							var de = data.CalendarDetailsSet.results[i].CalendarSet.results[k].EstdDate;
							var date = de.charAt(6) + de.charAt(7) - 1;
							var month = de.charAt(4) + de.charAt(5);
							var year = de.charAt(0) + de.charAt(1) + de.charAt(2) + de.charAt(3);
							appointments.push({
								"title": data.CalendarDetailsSet.results[i].CalendarSet.results[k].BerthNumber,
								"start": new Date(year, month, date),
								"end": new Date(year, month, date+30)
							});
						}
						jsonCalendar.people.push({
							"name": data.CalendarDetailsSet.results[i].CallSign,
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