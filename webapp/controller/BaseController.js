sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, Fragment, JSONModel) {
	"use strict";
	return Controller.extend("com.demo.sharjahPort.BaseController", {
		getRouter: function() {
			return UIComponent.getRouterFor(this);
		},
		getModel: function(entity, modelName, status) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			if (!status) {
				oModel.read("/" + entity, {
					success: function(data) {
						that.getView().setModel(new JSONModel(data.results), modelName);
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				var filterVal = status === "CUSTOMS" ? "ImFlag" : "ImStatus";
				oModel.read("/" + entity, {
					urlParameters: {
						"$filter": filterVal + " eq '" + status + "'"
					},
					success: function(data) {
						that.getView().setModel(new JSONModel(data.results), modelName);
						sap.m.MessageToast.show("Items loaded succesfully with status - " + status);
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
		},
		onNavToPress: function(evt) {
			var route = evt.getParameter("id").split("--")[1];
			this.getRouter().navTo(route);
		},
		onNavToHome: function() {
			this.getRouter().navTo("dashboard");
		},
		onNavSelect: function(evt) {
			var selKey = evt.getSource().getSelectedKey().split("/");
			if (selKey.length > 1) {
				this.getRouter().navTo(selKey[1].toLowerCase(), {
					sPath: selKey[0],
					type: selKey[1]
				});
			} else {
				this.getRouter().navTo(evt.getSource().getSelectedKey());
			}
			this.getView().byId("sideNavigation").setSelectedKey(evt.getSource().getSelectedKey());
		},
		onHomePress: function(evt) {
			var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var uRole = oStore.get("role");
			if (uRole === "HARBOR_MASTER") {
				this.getRouter().navTo("dashboardHarbour");
			} else if (uRole === "CONTROL_ROOM") {
				this.getRouter().navTo("dashboard");
			} else if (uRole === "AGENT") {
				this.getRouter().navTo("dashboardAgent");
			}
		},
		getUserName: function() {
			var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oData = {
				"name": oStore.get("user"),
				"uRole": oStore.get("role")
			};
			this.getView().setModel(new JSONModel(oData), "loginModel");
		},
		handleLogOut: function() {
			$.ajax({
				type: "GET",
				url: "/sap/public/bc/icf/logoff"
			}).done(function(data) {
				if (!document.execCommand("ClearAuthenticationCache")) {
					$.ajax({
						type: "GET",
						url: "/sap/opu/odata/SAP/ZSPA_DEMO_SRV/DashboardCount",
						username: "dummy",
						password: "dummy",
						statusCode: {
							200: function() {
								window.location.replace("/sap/bc/ui5_ui5/sap/zsharjahport/index.html");
							}
						},
						error: function() {
							//alert('reached error of wrong username password')
						}
					});
				}
			});
		}
	});
});