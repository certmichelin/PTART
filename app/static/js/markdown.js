function activeMarkdown(id) {
    new SimpleMDE({
        hideIcons: ["side-by-side", "fullscreen"],
        showIcons: ["code", "table"],
        forceSync: true,
        element: $("#" + id)[0]
    });
}