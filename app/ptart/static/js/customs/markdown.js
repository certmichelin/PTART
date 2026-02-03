// Initialize mermaid.
mermaid.initialize({ startOnLoad: true });

/**
 * Active SimpleMDE markdown editor for a given element id.
 * 
 * @param {*} id Element id
 * @returns SomeMDE instance
 */
function activeMarkdown(id) {
    return new SimpleMDE({
        hideIcons: ["side-by-side", "fullscreen"],
        showIcons: ["code", "table"],
        forceSync: true,
        element: $("#" + id)[0],
        previewRender(plainText) {
            var html = (new SimpleMDE()).markdown(plainText);
            html = prepareMermaid(html);
            setTimeout(mermaid.run, 100);
            return html;
        }
    });
}

/**
 * Render mermaid diagrams in the given HTML content.
 * 
 * @param {*} element Optional DOM element to render mermaid diagrams in
 */
function prepareMermaid(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    const mermaidBlocks = element.querySelectorAll('code.lang-mermaid');
    if (mermaidBlocks.length > 0) {
        mermaidBlocks.forEach((block, i) => {
            const parent = block.parentElement;
            const code = block.textContent.trim();
            
            // Skip empty code blocks
            if (!code) {
            console.warn('Empty mermaid diagram found');
            return;
            }

            const container = document.createElement('div');
            container.className = 'mermaid';
            container.textContent = code;
            
            parent.replaceWith(container);
        });
    }
    return element.innerHTML;
}