sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T7Shifting = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T7Shifting", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T7Shifting",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T7Shifting",
						type: "XML"
					}
				}
			}
		});

		return T7Shifting;

	});