sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT1 = BlockBase.extend("com.demo.sharjahPort.SharedBlocks.BlockBlueT1", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT1",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT1",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT1;

	});