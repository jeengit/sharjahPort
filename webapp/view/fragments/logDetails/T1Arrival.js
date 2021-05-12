sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T1Arrival = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T1Arrival", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T1Arrival",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T1Arrival",
						type: "XML"
					}
				}
			}
		});

		return T1Arrival;

	});