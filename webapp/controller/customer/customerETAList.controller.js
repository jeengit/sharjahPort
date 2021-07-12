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
			this.callForHarbourNotification('');
			this.getModel("CallSignSearchSet","callSignModel");
			var status = oEvent.getParameter("arguments").sPath;
			var type = oEvent.getParameter("arguments").type;
			this.getEtaList(status, type);
			this.getUserName();
			this.adjustTableRowsCount();
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		onETADetailsPress: function(evt) {
			var sPath = evt.getSource().getBindingContext("etaListModel").getPath().split("/")[2];
			var status = evt.getSource().getBindingContext("etaListModel").getProperty().Status;
			var id = evt.getSource().getBindingContext("etaListModel").getProperty().ETANo ? evt.getSource().getBindingContext("etaListModel").getProperty()
				.ETANo : evt.getSource().getBindingContext("etaListModel").getProperty().LogSheetNo;
			evt.getSource().getBindingContext("etaListModel").getProperty().LogSheetNo ? this.openHotWorkDialog(id,status) :
				this.getRouter().navTo("etaDetails", {
					sPath: encodeURIComponent(sPath),
					id: id
				});
		},
		openHotWorkDialog: function(id,status) {
			var oView = this.getView();
			if (!this.dialogHWA) {
				this.dialogHWA = sap.ui.xmlfragment("com.demo.sharjahPort.view.fragments.hotWorksAgentCreate", this);
				oView.addDependent(this.dialogHWA);
			}
			this.dialogHWA.open();
			this.getModel("CallSignSearchSet", "callSignModel");
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/HotWorksSet('" + id + "')", {
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
			this.getEtaList(splitVal[0],splitVal[1]);
		},
		getEtaList: function(status, type) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read(type === 'HOTWORKS' ? "/HotWorksSet" : "/EtaListSet", {
				urlParameters:  {
					"$filter": "Status eq '" + status + "'"
				},
				success: function(data) {
					data['TYPE'] = type;
					that.getView().setModel(new JSONModel(data), "etaListModel");
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