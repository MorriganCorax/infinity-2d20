// Import document classes.
import { InfinityActor } from "./documents/actor.mjs";
import { InfinityItem } from "./documents/item.mjs";
// Import sheet classes.
import { InfinityActorSheet } from "./sheets/actor-sheet.mjs";
import { InfinityItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { INFINITY2D20 } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {

    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
    game.infinity2d20 = {
        InfinityActor,
        InfinityItem
    };

    // Add custom constants for configuration.
    CONFIG.INFINITY2D20 = INFINITY2D20;

    /**
     * Set an initiative formula for the system
     * @type {String}
     */
    CONFIG.Combat.initiative = {
        formula: "0",
        decimals: 0
    };

    // Define custom Document classes
    CONFIG.Actor.documentClass = InfinityActor;
    CONFIG.Item.documentClass = InfinityItem;
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("infinity2d20", InfinityActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("infinity2d20", InfinityItemSheet, { makeDefault: true });

    // Preload Handlebars templates.
    return preloadHandlebarsTemplates();

});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function() {
    // Include steps that need to happen after Foundry has fully loaded here.
  });