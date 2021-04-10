# Entity Notes

Entity notes is a simple privilege based note system for Foundry Virtual TableTop. It allows players to store their notes within the foundry system, and for those notes to remain private from each other.

At present, GMs can see notes of all players. In future iterations, this will be adjusted to offer privilege settings to more accurately partition information.

Why use entity notes?

This shared note-taking method allows a GM to best tune the experience of the players to their perceptions, as well making it easy to track how and when players have encountered items, NPCs, or lore.

# Dev Info

* HTML in FoundryVTT templates is parsed by [handlebars.js](https://handlebarsjs.com/guide/)
* The {{editor}} helper is a wrapper around a [TinyMCE](https://www.tiny.cloud/docs/) editor
* The first element in a [FormApplication](https://foundryvtt.com/api/FormApplication.html#isEditable) template file *must* be a form element (which also excludes comments)

## License
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
<br />
<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Entity Notes - a module for Foundry VTT -</span> attributed to by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/syl3r86?tab=repositories" property="cc:attributionName" rel="cc:attributionURL">Felix Müller</a> and <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/DodgySmalls?tab=repositories" property="cc:attributionName" rel="cc:attributionURL">Marten Wiebe</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.3.8](http://foundryvtt.com/pages/license.html).
