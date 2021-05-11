sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, Fragment, JSONModel) {
	"use strict";
	return Controller.extend("com.demo.sharjahPort.BaseController", {
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onNavToPress: function (evt) {
			var route = evt.getParameter("id").split("--")[1];
			this.getRouter().navTo(route);
		},
		onNavToHome: function (evt) {
			this.getRouter().navTo("dashboard");
		},
		onNavSelect: function (evt) {
			this.getRouter().navTo(evt.getSource().getSelectedKey());
			var pageId = this.getView().getId();
			sap.ui.getCore().byId(pageId + "--dashFal").setVisible(false);
			var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var uRole = oStore.get("role");
			if (uRole === "HARBOR_MASTER") {
				sap.ui.getCore().byId(pageId + "--dashId").setVisible(false);
				sap.ui.getCore().byId(pageId + "--harbDashId").setVisible(true);
				sap.ui.getCore().byId(pageId + "--AgnetdashId").setVisible(false);
			}
			if (uRole === "CONTROL_ROOM") {
				sap.ui.getCore().byId(pageId + "--harbDashId").setVisible(false);
				sap.ui.getCore().byId(pageId + "--dashId").setVisible(true);
				sap.ui.getCore().byId(pageId + "--AgnetdashId").setVisible(false);
			}
			if (uRole === "AGENT") {
				sap.ui.getCore().byId(pageId + "--harbDashId").setVisible(false);
				sap.ui.getCore().byId(pageId + "--dashId").setVisible(false);
				sap.ui.getCore().byId(pageId + "--AgnetdashId").setVisible(true);
			}
		},
		onHomePress: function (evt) {
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
		getUserName: function () {
			var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oData = {
				"name": oStore.get("user"),
				"uRole": oStore.get("role")
			};
			this.getView().setModel(new JSONModel(oData), "loginModel");
		},
		handleLogOut: function () {
			$.ajax({
				type: "GET",
				url: "/sap/public/bc/icf/logoff" 
			}).done(function (data) {
				if (!document.execCommand("ClearAuthenticationCache")) {
					$.ajax({
						type: "GET",
						url: "/sap/opu/odata/SAP/ZSPA_DEMO_SRV/DashboardCount",
						username: "dummy",
						password: "dummy",
						statusCode: {
							200: function () {
								window.location.replace("/sap/bc/ui5_ui5/sap/zsharjahport/index.html");
							}
						},
						error: function () {
							//alert('reached error of wrong username password')
						}
					});
				}
			});
		},
		handleMyAccountPress: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();
			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "com.demo.sharjahPort.view.fragments.myAccount",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					oPopover.bindElement("/ProductCollection/0");
					return oPopover;
				});
			}
			this._pPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		}
	});
});