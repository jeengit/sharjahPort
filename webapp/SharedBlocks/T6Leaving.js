sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T6Leaving = BlockBase.extend("com.demo.sharjahPort.SharedBlocks.T6Leaving", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.SharedBlocks.T6Leaving",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.SharedBlocks.T6Leaving",
						type: "XML"
					}
				}
			}
		});

		return T6Leaving;

	});