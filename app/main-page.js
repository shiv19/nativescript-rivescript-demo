const createViewModel = require("./main-view-model").createViewModel;

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel();
    page.bindingContext.listView = page.getViewById("listView");
}

exports.onNavigatingTo = onNavigatingTo;
