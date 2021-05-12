sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T5Unberthing = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T5Unberthing", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T5Unberthing",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T5Unberthing",
						type: "XML"
					}
				}
			}
		});

		return T5Unberthing;

	});