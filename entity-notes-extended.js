class PrivilegedNote extends FormApplication {

    constructor(object, options) {
        super(object, options);

        this.entity.apps[this.appId] = this;
    }

    get entity() {
        return this.object;
    }

    get showExtraButtons() {
        return (game.dnd5e && this.entity.constructor.name !== 'RollTable');
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/entity-notes-extended/templates.html";
        options.width = '600';
        options.height = '700';
        options.classes = ['entity-notes-extended', 'sheet'];
        options.title = game.i18n.localize('PrivilegedNote.label');
        options.resizable = true;
        options.editable = true;
        return options;
    }

    getData() {
        const data = super.getData();

        data.notes = this.entity.getFlag('entity-notes-extended', 'notes');
        data.flags = this.entity.data.flags;
        data.owner = game.user.id;
        data.isGM = game.user.isGM;
        data.showExtraButtons = this.showExtraButtons;

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.moveToNote').click(ev => this._moveToNotes());
        html.find('.moveToDescription').click(ev => this._moveToDescription());
    }
    
    async _updateObject(event, formData) {
        if (game.user.isGM) {
            await this.entity.setFlag('entity-notes-extended', 'notes', formData["flags.entity-notes-extended.notes"]);
            this.render();
        } else {
            ui.notifications.error("You have to be GM to edit GM Notes.");
        }
    }

    static _initEntityHook(app, html, data) {
        if (game.user.isGM) {
            let labelTxt = '';
            let title = game.i18n.localize('PrivilegedNote.label'); 
            if (game.settings.get('entity-notes-extended', 'showLabel')) {
                labelTxt = ' ' + title;
            }
            let notes = app.entity.getFlag('entity-notes-extended', 'notes');
            let openBtn = $(`<a class="open-gm-note" title="${title}"><i class="fas fa-clipboard${notes ? '-check':''}"></i>${labelTxt}</a>`);
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
            html.closest('.app').find('.open-gm-note').remove();
            let titleElement = html.closest('.app').find('.window-title');
            openBtn.insertAfter(titleElement);
        }
    }
    
    async _moveToNotes() {
        if (game.dnd5e) {
            let descPath = '';
            switch (this.entity.constructor.name) {
                case 'Actor5e': descPath = 'data.details.biography.value'; break;
                case 'Item5e': descPath = 'data.description.value'; break;
                case 'JournalEntry': descPath = 'content'; break;
            }
            let description = getProperty(this.entity, 'data.'+descPath);
            let notes = getProperty(this.entity, 'data.flags.entity-notes-extended.notes');

            if (notes === undefined) notes = '';
            if (description === undefined) description = '';

            let obj = {};
            obj[descPath] = '';
            obj['flags.entity-notes-extended.notes'] = notes + description;

            await this.entity.update(obj);
            this.render();
        }
    }

    async _moveToDescription() {
        if (game.dnd5e) {
            let descPath = '';
            switch (this.entity.constructor.name) {
                case 'Actor5e': descPath = 'data.details.biography.value'; break;
                case 'Item5e': descPath = 'data.description.value'; break;
                case 'JournalEntry': descPath = 'content'; break;
            }
            let description = getProperty(this.entity, 'data.' + descPath);
            let notes = getProperty(this.entity, 'data.flags.entity-notes-extended.notes');

            if (notes === undefined) notes = '';
            if (description === undefined) description = '';

            let obj = {};
            obj[descPath] = description + notes;
            obj['flags.entity-notes-extended.notes'] = '';

            await this.entity.update(obj);
            this.render();
        }
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
