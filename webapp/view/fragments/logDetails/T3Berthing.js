sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T3Berthing = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T3Berthing", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T3Berthing",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T3Berthing",
						type: "XML"
					}
				}
			}
		});

		return T3Berthing;

	});