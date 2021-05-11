sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT4 = BlockBase.extend("com.demo.sharjahPort.SharedBlocks.BlockBlueT4", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT4",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT4",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT4;

	});