class PrivilegedNote extends FormApplication {

    constructor(object, options) {
        super(object, options);

        this.entity.apps[this.appId] = this;

        console.log(this.entity);
    }

    get entity() {
        return this.object;
    }

    static get defaultOptions() {

        const options = super.defaultOptions;
        options.template = "modules/entity-notes-extended/gm-template.html";
        options.width = '600';
        options.height = '700';
        options.classes = ['entity-notes-extended', 'sheet'];
        options.title = game.i18n.localize('PrivilegedNote.label');
        options.resizable = true;
        options.editable = true;

        console.log(options);

        return options;
    }

    getData() {
        const data = super.getData();

        data.notes = this.entity.getFlag('entity-notes-extended', 'content');
        data.flags = this.entity.data.flags;
        data.owner = game.user.id;
        data.isGM = game.user.isGM;

        console.log(data);

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
    
    async _updateObject(event, formData) {
        console.log(event);
        console.log(formData);
        if (game.user.isGM) {
            await this.entity.setFlag('entity-notes-extended', 'content', formData["flags.entity-notes-extended.content"]);
            this.render();
        } else {
            ui.notifications.error("You have to be GM to edit GM Notes.");
        }
    }

    static _initEntityHook(app, html, data) {
        //if (game.user.isGM) {
        let labelText = '';
        let title = game.i18n.localize('PrivilegedNote.label'); 
        if (game.settings.get('entity-notes-extended', 'showLabel')) {
            labelText = ' ' + title;
        }
        let content = app.entity.getFlag('entity-notes-extended', 'content');
        let openBtn = $(`<a class="open-entity-notes" title="${title}"><i class="fas fa-clipboard${content ? '-check':''}"></i>${labelText}</a>`);
        openBtn.click(ev => {
            let noteApp = null;
            for (let key in app.entity.apps) {
                let obj = app.entity.apps[key];
                if (obj instanceof PrivilegedNote) {
                    noteApp = obj;
                    break;
                }
            }
            if (!noteApp) noteApp = new PrivilegedNote(app.entity, { submitOnClose: true, closeOnSubmit: false, submitOnUnfocus: true });
            noteApp.render(true);
        });
        html.closest('.app').find('.open-entity-notes').remove();
        let titleElement = html.closest('.app').find('.window-title');
        openBtn.insertAfter(titleElement);
        //}
    }
}

Hooks.on('init', () => {
    game.settings.register("entity-notes-extended", 'showLabel', {
        name: game.i18n.localize('PrivilegedNote.setting'),
        hint: game.i18n.localize('PrivilegedNote.settingHint'),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
});

Hooks.on('renderActorSheet', (app, html, data) => {
    PrivilegedNote._initEntityHook(app, html, data);
});
Hooks.on('renderItemSheet', (app, html, data) => {
    PrivilegedNote._initEntityHook(app, html, data);
});
Hooks.on('renderJournalSheet', (app, html, data) => {
    PrivilegedNote._initEntityHook(app, html, data);
});
Hooks.on('renderRollTableConfig', (app, html, data) => {
    PrivilegedNote._initEntityHook(app, html, data);
});
