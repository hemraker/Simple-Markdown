

app.controller("rhs.simplemarkcontroller", function ($scope, $log, $timeout, assetsService, dialogService, imageHelper) {
    
    /* Syntax coloring */
    if ($scope.model.config.coloredSyntax === null) {
        $scope.model.config.coloredSyntax = 0;
    }

    /* Use default value if present and editor is empty */
    if ($scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = $scope.model.config.defaultValue;
    }

    /* Load ghostdown */
    assetsService.load(["/app_plugins/simplemark/lib/ghostdown.js", "/app_plugins/simplemark/lib/jquery.ghostdown.js"]).then(function () {
        var theEditor = $("#editor_" + $scope.model.alias).ghostDown();
        theEditor.ghostDown.getEditor().refresh();

        $('a[data-toggle="tab"]').on('shown', function (e) {
            theEditor.ghostDown.getEditor().refresh();
        });

        $timeout(function () {
            theEditor.ghostDown.getEditor().refresh();
            theEditor.ghostDown.getEditor().on("change", function (editor, args) {
                $scope.model.value = editor.getValue();
            });
        });
    });

    /* Insert image */
    $scope.insertImage = function () {
        dialogService.mediaPicker({ callback: function (data) {
            var imagePropVal = imageHelper.getImagePropertyValue({ imageModel: data, scope: $scope }),
                theEditor = $("#editor_" + $scope.model.alias).ghostDown.getEditor();

            theEditor.replaceSelection(' <img src="' + imagePropVal + '" style="max-width:100%" /> ', 'end');

            $scope.model.value = theEditor.getValue();

        }
        });
    }


    assetsService.loadCss("/app_plugins/simplemark/lib/ghostdown.css");
});