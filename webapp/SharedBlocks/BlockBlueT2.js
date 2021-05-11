sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT2 = BlockBase.extend("com.demo.sharjahPort.SharedBlocks.BlockBlueT2", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT2",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT2",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT2;

	});