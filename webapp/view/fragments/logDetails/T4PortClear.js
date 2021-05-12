sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var T4PortClear = BlockBase.extend("com.demo.sharjahPort.view.fragments.logDetails.T4PortClear", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T4PortClear",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.view.fragments.logDetails.T4PortClear",
						type: "XML"
					}
				}
			}
		});

		return T4PortClear;

	});