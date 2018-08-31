export default {
    render(templateName, model) {
        templateName = templateName + 'Template';

        let templateElement = document.getElementById(templateName);
        let templateSource = templateElement.innerHTML;
        let renderFn = Handlebars.compile(templateSource);

        return renderFn(model);
    }
};