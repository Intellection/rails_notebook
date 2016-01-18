// Ruby kernel.js

define(['base/js/namespace'], function (IPython) {
    "use strict";

    debugger;

    require.config({
        paths: {
            dagreD3: "./dagre-d3.min",
            qtip2: "./jquery.qtip.min",
            nvd3: "./nv.d3",
            // custom: "custom",
            d3:"./d3.min",
        }
    });

    var onload = function () {
        IPython.CodeCell.options_default['cm_config']['indentUnit'] = 2;
        var cells = IPython.notebook.get_cells();
        for (var i in cells) {
            var c = cells[i];
            if (c.cell_type === 'code')
                c.code_mirror.setOption('indentUnit', 2);
        }
    };
    return {onload: onload};
});
