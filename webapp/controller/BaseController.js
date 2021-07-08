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
				"uRole": oStore.get("role"),
				"companyName": oStore.get("CompanyName")
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
			if (oEvent.getParameter("item").getIcon() !== "NA") {
				if (oEvent.getParameter("item").getIcon() !== "hotWorks") {
					this.getRouter().navTo(oEvent.getParameter("item").getIcon(), {
						sPath: "0",
						id: "create" + oEvent.getParameter("item").getIcon()
					});
				} else {
					var oView = this.getView();
					if (!this.dialogHWA) {
						this.dialogHWA = sap.ui.xmlfragment("com.demo.sharjahPort.view.fragments.hotWorksAgentCreate", this);
						oView.addDependent(this.dialogHWA);
					}
					this.dialogHWA.open();
				}
			}
			sap.ui.getCore().setModel(new JSONModel({}), "navModel");
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
		},
		openNotificationHarbourMaster: function(oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();
			//this.getAllNotifications();
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "com.demo.sharjahPort.view.fragments.harbourMasterNotification",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
		},
		closeHarbourMasterNotification: function(oEvent) {
			this.byId("harbourMasterNotificationPopupId").close();
		},
		getAllNotifications: function() {
			var thisObj = this;
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.read("/HarbourMasterStatusSet", {
				success: function(data) {
					var oButtonBadgeCustomData = thisObj.getView().byId('notifyButtonHarbourId').getBadgeCustomData();
					if (oButtonBadgeCustomData && data && data.results && data.results.length > 0) {
						oButtonBadgeCustomData.setValue(data.results.length);
						oButtonBadgeCustomData.setVisible(true);
						for (var ds of data.results) {
							if (ds && ds.CreatedDate && ds.CreatedTime) {
								ds['timeAgo'] = thisObj.timeDifference(new Date(Number(ds.CreatedDate.substring(0, 4)), Number(ds.CreatedDate.substring(4,
									6)), Number(ds.CreatedDate.substring(6, 8)), Number(ds.CreatedTime.substring(0, 2)), Number(ds.CreatedTime.substring(2,
									4)), Number(ds.CreatedTime.substring(4, 6)), 0));
							}
						}
					} else {
						oButtonBadgeCustomData.setValue(0);
						oButtonBadgeCustomData.setVisible(false);
					}
					thisObj.getView().setModel(new JSONModel(data), "harbourMasterNotificationListModel");
					//	sap.ui.getCore().setModel(new JSONModel(data), "harbourMasterNotificationListModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					//			sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		readHarbourNotifications: function(oEvent) {
			var notModel = oEvent.getSource().getBindingContext("harbourMasterNotificationListModel").getProperty();
			var thisObj = this;
			var oModel = this.getOwnerComponent().getModel("s4Model");
			notModel['HarbourStatus'] = 'NOTIFIED';
			delete notModel['__metadata'];
			console.log(notModel);
			oModel.create("/HarbourMasterStatusSet", notModel, {
				success: function(data) {
					thisObj.getAllNotifications();
				},
				error: function(oResponse) {
					//		sap.m.MessageToast.show(oResponse.statusText);
					//		sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		callForHarbourNotification: function(val) {
			var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var uRole = oStore.get("role");
			var thisObj = this;
			if (uRole === "HARBOR_MASTER") {
				thisObj.getAllNotifications();
			}
			if (val && uRole === "HARBOR_MASTER") {
				this.oneMinCallForHarbourNotification();
			}

		},
		oneMinCallForHarbourNotification: function() {
			var thisObj = this;
			setInterval(function() {
				thisObj.getAllNotifications();
			}, 60000);
		},
		timeDifference: function(previous) {

			var isoDateStr = new Date().toISOString();
			var isoDate = new Date(isoDateStr);

			var dYear = isoDate.getFullYear();
			var dMonth = isoDate.getMonth() + 1;
			var dDay = isoDate.getDate();

			var dHour = isoDate.getHours();
			var dMin = isoDate.getMinutes();
			var dSec = isoDate.getSeconds();

			var current = new Date(dYear, dMonth, dDay, dHour, dMin, dSec, 0);
			var msPerMinute = 60 * 1000;
			var msPerHour = msPerMinute * 60;
			var msPerDay = msPerHour * 24;
			var msPerMonth = msPerDay * 30;
			var msPerYear = msPerDay * 365;

			var elapsed = current - previous;

			if (elapsed < msPerMinute) {
				return Math.round(elapsed / 1000) + ' seconds ago';
			} else if (elapsed < msPerHour) {
				return Math.round(elapsed / msPerMinute) + ' minutes ago';
			} else if (elapsed < msPerDay) {
				return Math.round(elapsed / msPerHour) + ' hours ago';
			} else if (elapsed < msPerMonth) {
				return '' + Math.round(elapsed / msPerDay) + ' days ago';
			} else if (elapsed < msPerYear) {
				return '' + Math.round(elapsed / msPerMonth) + ' months ago';
			} else {
				return '' + Math.round(elapsed / msPerYear) + ' years ago';
			}
		},
		closeHotWorkPopup: function() {
			this.dialogHWA.close();
		},
		handleCallSignHotWorks: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/CallSignHotWorksSet", {
				urlParameters: {
					"$filter": "CallSign eq '" + evt.getSource().getSelectedKey() + "'"
				},
				success: function(data) {
					that.getView().setModel(new JSONModel(data.results[0]), "hotWorksModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		handleCreateHotWorks: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var data = this.getView().getModel("hotWorksModel").getData();
			var oEntry = {
					"LogSheetNo": data.LogSheetNo,
					"EtaNo": data.EtaNo,
					"Port": data.Port,
					"VesselName": data.VesselName,
					"Purpose": data.Purpose,
					"ImoNo": data.ImoNo,
					"CallSign": data.CallSign,
					"AgentName": data.AgentName,
					"AgentCode": data.AgentCode,
					"Flag": evt.getSource().getTooltip()
				}
				var that = this;
				oModel.create("/HotWorksSet", oEntry,{
						success: function(data) {
							that.dialogHWA.close();
							sap.m.MessageToast.show("Hotworks Created Successfully..");
							sap.ui.core.BusyIndicator.hide();
						},
						error: function(oResponse) {
							sap.m.MessageToast.show(oResponse.statusText);
							sap.ui.core.BusyIndicator.hide();
						}
					});
		}
	});
});