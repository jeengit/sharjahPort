sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT3 = BlockBase.extend("com.demo.sharjahPort.SharedBlocks.BlockBlueT3", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT3",
						type: "XML"
					},
					Expanded: {
						viewName: "com.demo.sharjahPort.SharedBlocks.BlockBlueT3",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT3;

	});