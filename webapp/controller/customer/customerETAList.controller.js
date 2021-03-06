sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.customerETAList", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("etaList").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var oCountData = sap.ui.getCore().getModel("countModel").getData();
			this.getView().setModel(new JSONModel(oCountData), "countModel");
			this.callForHarbourNotification('');
			this.getModel("CallSignSearchSet", "callSignModel");
			var status = oEvent.getParameter("arguments").sPath;
			var type = oEvent.getParameter("arguments").type;
			this.getEtaList(status, type, "");
			this.getUserName();
			this.adjustTableRowsCount();
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		onETADetailsPress: function(evt) {
			var sPath = evt.getSource().getBindingContext("etaListModel").getPath().split("/")[2];
			var oProperty = evt.getSource().getBindingContext("etaListModel").getProperty();
			var status = oProperty.Status;
			var id = oProperty.ETANo ? oProperty.ETANo : oProperty.Guid ? oProperty.Guid : oProperty.LogSheetNo;
			oProperty.LogSheetNo || oProperty.Guid ? this.openHotWorkDialog(id, status, "FLAG") : oProperty.Company_Name ? this.openHotWorkDialog(id, status, "SECURITY") :
				this.getRouter().navTo("etaDetails", {
					sPath: encodeURIComponent(sPath),
					id: id
				});
		},
		openHotWorkDialog: function(id, status, flag) {
			var oView = this.getView();
			if (!this.dialogHWA) {
				this.dialogHWA = sap.ui.xmlfragment("com.demo.sharjahPort.view.fragments.hotWorksAgentCreate", this);
				oView.addDependent(this.dialogHWA);
			}
			this.dialogHWA.open();
			flag === "FLAG" ? this.getModel("CallSignSearchSet", "callSignModel") : '';
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read(flag === "FLAG" ? '/HotWorksSet' + "('" + id + "')" : '/GatePassListSet' + "('" + id + "')", {
				success: function(data) {
					data['STATUS'] = status;
					that.getView().setModel(new JSONModel(data), "hotWorksModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					alert("Error...");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onAfterRendering: function() {
			var that = this;
			$(window).resize(function() {
				that.adjustTableRowsCount();
			});
		},
		adjustTableRowsCount: function() {
			var that = this;
			var pageId = this.getView().byId("etaPage").getId();
			var rows = Math.floor(($("#" + pageId).height() - 200) / 32);
			jQuery.sap.delayedCall(0, this, function() {
				that.byId("etaTable").setVisibleRowCount(rows);
			});
		},
		onBtnPress: function(evt) {
			//sap.ui.core.BusyIndicator.show();
			var splitVal = evt.getSource().getSelectedKey().split("/");
			this.getEtaList(splitVal[0], splitVal[1], "Press");
		},
		getEtaList: function(status, type,action) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			if (action === "") {
				var selKey = type === 'HOTWORKS' ? "OPEN/HOTWORKS" : type === 'SECURITY' ? "OPEN/SECURITY" : "NEW/ETA";
			}
			oModel.read(type === 'HOTWORKS' ? "/HotWorksSet" : type === 'SECURITY' ? "/GatePassListSet" : "/EtaListSet", {
				urlParameters: {
					"$filter": type === 'SECURITY' ? "ImStatus eq '" + status + "'" : "Status eq '" + status + "'"
				},
				success: function(data) {
					data['TYPE'] = type;
					that.getView().setModel(new JSONModel(data), "etaListModel");
					if (action === "") {
						that.getView().byId("etaList").setSelectedKey(selKey);
					}
					sap.m.MessageToast.show("Items loaded succesfully with status - " + status);
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
