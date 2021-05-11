sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT5 = BlockBase.extend("com.demo.sharjahPort.SharedBlocks.BlockBlueT5", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT5",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT5",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT5;

	});