sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Popup"
], function(Controller, UIComponent, Fragment, JSONModel, Popup) {
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
						setTimeout(function() {
							sap.ui.getCore().setModel(new JSONModel(that.getView().getModel(modelName).getData()), modelName);
							sap.ui.core.BusyIndicator.hide();
						}, 2000);
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
						var export_res = data.results.filter(res => res.Import_Export === 'E');
						var import_res = data.results.filter(res => res.Import_Export === 'I');
						data.results['countE'] = export_res.length;
						data.results['countI'] = import_res.length;
						that.getView().setModel(new JSONModel(data.results), modelName);
						setTimeout(function() {
							sap.m.MessageToast.show("Items loaded succesfully with status - " + status);
							sap.ui.getCore().setModel(new JSONModel(that.getView().getModel(modelName).getData()), modelName);
							sap.ui.core.BusyIndicator.hide();
						}, 2000);
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
		},
		callOdata: function(entity, modelName, statusKey, statusValue) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			if (!statusKey || !statusValue) {
				oModel.read("/" + entity, {
					success: function(data) {
						that.getView().setModel(new JSONModel(data.results), modelName);
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oResponse) {
						sap.m.MessageToast.show(oResponse.statusText);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				oModel.read("/" + entity, {
					urlParameters: {
						"$filter": statusKey + " eq '" + statusValue + "'"
					},
					success: function(data) {
						var export_res = data.results.filter(res => res.Import_Export === 'E');
						var import_res = data.results.filter(res => res.Import_Export === 'I');
						data.results['countE'] = export_res.length;
						data.results['countI'] = import_res.length;
						that.getView().setModel(new JSONModel(data.results), modelName);
						//		sap.m.MessageToast.show("Items loaded succesfully with status - " + status);
						sap.ui.core.BusyIndicator.hide();
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
		},
		handleMenuItemPress: function(oEvent) {
			console.log(oEvent.getParameter("item"));
			// var oItem = oEvent.getParameter("item").getId();
			// if (oItem) {
				this.getRouter().navTo("etaDetails", {
					sPath: "0",
					id: "createETA"
				});
				sap.ui.getCore().setModel(new JSONModel({}), "navModel");
			//}
		},
		handlePressOpenMenu: function(oEvent) {
			var oButton = oEvent.getSource();
			// create menu only once
			if (!this._menu) {
				Fragment.load({
					name: "com.demo.sharjahPort.view.fragments.menuEventing",
					controller: this
				}).then(function(oMenu) {
					this._menu = oMenu;
					this.getView().addDependent(this._menu);
					this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
				}.bind(this));
			} else {
				this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
			}
		}
	});
});