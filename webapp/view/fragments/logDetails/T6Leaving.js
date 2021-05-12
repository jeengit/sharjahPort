sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T6Leaving = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T6Leaving", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T6Leaving",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T6Leaving",
						type: "XML"
					}
				}
			}
		});

		return T6Leaving;

	});