sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T2Anchorage = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T2Anchorage", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T2Anchorage",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T2Anchorage",
						type: "XML"
					}
				}
			}
		});

		return T2Anchorage;

	});