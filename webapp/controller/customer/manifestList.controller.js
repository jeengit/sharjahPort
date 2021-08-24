sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function(Controller, BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.demo.sharjahPort.controller.customer.manifestList", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("manifest").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var oCountData = sap.ui.getCore().getModel("countModel").getData();
			this.getView().setModel(new JSONModel(oCountData), "countModel");
			var status = oEvent.getParameter("arguments").sPath;
			var type = oEvent.getParameter("arguments").type;
			this.getUserName();
			var res = sap.ui.getCore().getModel("rememberSelectionModel") ? sap.ui.getCore().getModel("rememberSelectionModel").getData() : '';
			if (type === "MANIFEST") {
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
				this.getView().setModel(new JSONModel(null), "GatePassListModel");
				this.getView().setModel(new JSONModel(null), "agentListModel");
				this.getManifestList(status,type);
				this.getView().byId("manifestList").setSelectedKey("CUSTOMS/MANIFEST/I");
			}
			if (type === "DELIVERY") {
				//	this.getModel("DeliveryListSet", "deliveryListModel");
				this.callOdata("DeliveryListSet", "deliveryListModel", "Status", status);
				this.getView().setModel(new JSONModel(null), "GatePassListModel");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
				this.getView().setModel(new JSONModel(null), "agentListModel");
				this.getView().byId("manifestList").setSelectedKey("OPEN/DELIVERY/");
			}
			if (type === "CONSIGNEE") {
				this.getConsigneeList("PENDING");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "agentListModel");
				this.getView().setModel(new JSONModel(null), "GatePassListModel");
				this.getView().byId("manifestList").setSelectedKey("NA/CONSIGNEE/PENDING");
			}
			if (type === "GATEPASS") {
				this.callOdata("GatePassSet", "GatePassListModel");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
				this.getView().setModel(new JSONModel(null), "agentListModel");
				this.getView().byId("manifestList").setSelectedKey("OPEN/DELIVERY/");
			}
			if (type === "AGENTMANIFEST") {

				this.callOdata("AgentManifestListSet", "agentListModel");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "GatePassListModel");
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
				this.getView().byId("manifestList").setSelectedKey("NEW/ETA");
			}
			var that = this;
			setTimeout(function() {
				res.id ? that.getView().byId(res.id).setSelectedItem(that.getView().byId(res.id).getItems()[res.path],
					true) : '';
			}, 1000);
			sap.ui.getCore().setModel(new JSONModel({
				"status": status,
				"type": type
			}), "navModel");
		},
		handelDetailPress: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var model = evt.getSource().getFieldGroupIds()[0] === "manifest" ? "manifestListModel" : "deliveryListModel";
			var sPath = evt.getSource().getBindingContext(model).getPath().split("/")[1];
			// evt.getSource().getParent().setSelectedItem(evt.getSource().getParent().getItems()[evt.getSource().getId().split("-")[4]], true);
			// sap.ui.getCore().setModel(new JSONModel({
			// 	path: evt.getSource().getId().split("-")[4],
			// 	id: evt.getSource().getParent().getId().split("--")[1]
			// }), "rememberSelectionModel");
			var property = evt.getSource().getBindingContext(model).getProperty();
			var id = evt.getSource().getFieldGroupIds()[0] === "manifest" && property.ManifestNo === '' ? property.CustomsRefManifestNo :
				evt.getSource().getFieldGroupIds()[0] === "manifest" && property.AgentManifestNo !== '' ? property.AgentManifestNo :evt.getSource().getFieldGroupIds()[0] === "manifest" && property.ManifestNo !== '' ? property.ManifestNo : property.DeliveryNo;
			var status = evt.getSource().getFieldGroupIds()[0] === "manifest" ? property.ManifestStatus : property.Status;
			this.getRouter().navTo(evt.getSource().getFieldGroupIds()[0] === "manifest" ? "manifestDetails" : "deliveryDetails", {
				sPath: encodeURIComponent(sPath),
				id: id,
				status: status
			});
		},
		handelgateDetailPress: function(evt) {
			var sPath = evt.getSource().getBindingContext("GatePassListModel").getPath().split("/")[1];
			var property = evt.getSource().getBindingContext("GatePassListModel").getProperty();
			console.log(property);
			var id = property.Guid;
			this.getRouter().navTo("gatepass", {
				sPath: "0",
				id: id

			});
		},
		getConsigneeList: function(flag) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/PaymentStatusListSet", {
				urlParameters: {
					"$filter": "ConsigneeCode eq '10000020' and FiscalYear eq '2021'"
				},
				success: function(data) {
					var result = data.results.filter(res => res.Status === flag);
					that.getView().setModel(new JSONModel(result), "consigneeListModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onBtnPress: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var splitVal = evt.getSource().getSelectedKey().split("/");
			this.getManifestList(splitVal[0],splitVal[1],splitVal[2]);
		},
		handelagentDetailPress: function(evt) {

			var sPath = evt.getSource().getBindingContext("agentListModel").getPath().split("/")[1];
			var property = evt.getSource().getBindingContext("agentListModel").getProperty();
			console.log(property);
			var id = property.AgentManifestNo;
			this.getRouter().navTo("manifestDetails", {
				sPath: "0",
				id: id,
				status: "AGENT"

			});
		},
		getManifestList: function(status, type, flag) {
			if (type === "MANIFEST") {
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
				this.getView().setModel(new JSONModel(null), "GatePassListModel");
				this.getManifestListData(status,type);
			}
			if (type === "DELIVERY") {
				this.callOdata("DeliveryListSet", "deliveryListModel", "Status", status);
				this.getView().setModel(new JSONModel(null), "GatePassListModel");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
			}
			if (type === "CONSIGNEE") {
				this.getConsigneeList(flag);
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
			}
			if (type === "gatePassList") {
				this.callOdata("GatePassSet", "GatePassListModel");
				this.getView().setModel(new JSONModel(null), "manifestListModel");
				this.getView().setModel(new JSONModel(null), "deliveryListModel");
				this.getView().setModel(new JSONModel(null), "consigneeListModel");
			}
			sap.ui.core.BusyIndicator.hide();
		},
		getManifestListData: function(status,type) {
			var oModel = this.getOwnerComponent().getModel("s4Model");
			oModel.setUseBatch(false);
			var that = this;
			oModel.read("/AgentManifestListSet" , {
				urlParameters: {
					"$filter": "ImStatus eq '" + status + "'"
				},
				success: function(data) {
					data['TYPE'] = type;
					that.getView().setModel(new JSONModel(data), "manifestListModel");
					setTimeout(function() {
						sap.m.MessageToast.show("Items loaded succesfully with status - " + status);
						sap.ui.core.BusyIndicator.hide();
					}, 2000);
				},
				error: function(oResponse) {
					sap.m.MessageToast.show(oResponse.statusText);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		}
	});
});
