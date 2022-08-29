function wordwrap(text, limit) {
    text = String(text);
    if (text.indexOf("\n") != -1) {
        return text;
    }
    const split = text.split(" ");
    let all = [];
    let current = [];
    let currentLength = 0;
    for (let i = 0; i < split.length; i++) {
        const line = split[i];
        if (currentLength == 0 || (currentLength + line.length < limit && line[0] != "(")) {
            current.push(line);
            currentLength += line.length;
        } else {
            all.push(current.join(" "));
            current = [line];
            currentLength = line.length;
        }
    }
    all.push(current.join(" "));
    return all.join("\n");
}

function mangleName(name) {
    if (/^[A-Za-z]\w*$/.test(name)) {
        return name;
    }
    return JSON.stringify(name);
}

function line(name, properties) {
    const entries = Object.entries(properties);
    if (entries.length == 0) {
        return name;
    }
    return name + " [ " + entries.map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(" ") + " ]";
}
function parseFrom(raw) {
    if (typeof raw == "object") {
        const [fromName, label] = Object.entries(raw)[0];
        return [fromName, label, raw]
    }
    return [String(raw), null, {}];
}

const themes = {
    "classic": {
        "edge": "#2B303A",
        "edge-text": "#DB2955",
        "backwards-edge": "#7692FF",
        "start-fill": "#2B303A",
        "start-text": "#FFFFFF",
        "fact-fill": "#C6CCD2",
        "attack-fill": "#ED96AC",
        "action-fill": "#ABD2FA",
        "goal-fill": "#DB2955",
        "goal-text": "#FFFFFF",
    },
     "default": {
        "edge": "#2B303A",
        "edge-text": "#010065",
        "backwards-edge": "#7692FF",
        "backwards-edge-penwidth": 3,
        "backwards-edge-arrowsize": .5,
        "start-fill": "#23c548",
        "start-text": "#FFFFFF",
        "fact-fill": "#D2D5DD",
        "attack-fill": "#ff92cc",
        "action-fill": "#B9D6F2",
        "goal-fill": "#5f00c2",
        "goal-text": "#FFFFFF",
    },
    "accessible": {
        "edge": "#2B303A",
        "edge-text": "#010065",
        "backwards-edge": "#7692FF",
        "backwards-edge-penwidth": 3,
        "backwards-edge-arrowsize": .5,
        "start-fill": "#272727",
        "start-text": "#FFFFFF",
        "fact-fill": "#D2D5DD",
        "attack-fill": "#FF7EC3",
        "action-fill": "#CCCCFF",
        "goal-fill": "#5f00c2",
        "goal-text": "#FFFFFF",
    },
}

function convertToDot(yaml) {
    const parsed = jsyaml.load(yaml);
    const font = 'Arial'
    const theme = themes[Object.hasOwnProperty.call(themes, parsed.theme) ? parsed.theme : "default"];
    const header = `// Generated from https://www.deciduous.app/
digraph {
// base graph styling
rankdir="TB";
splines=true;
overlap=false;
nodesep="0.2";
ranksep="0.4";
label=${JSON.stringify(typeof parsed.title === "string" ? parsed.title : "")};
labelloc="t";
fontname=${JSON.stringify(font)};
node [ shape="plaintext" style="filled, rounded" fontname=${JSON.stringify(font)} margin=0.2 ]
edge [ fontname=${JSON.stringify(font)} fontsize=12 color="${theme["edge"]}" ]
// is start a hologram?
start [ label="Start" fillcolor="${theme["start-fill"]}" fontcolor="${theme["start-text"]}" ]
`;
    const goals = parsed.goals || [];
    const facts = parsed.facts || [];
    const attacks = parsed.attacks || [];
    const actions = parsed.actions || [];
    const filter = parsed.filter || [];
    const subgraphs = [];
    const forwards = {};
    const forwardsAll = {};
    const backwards = {};
    const allNodes = [...facts, ...attacks, ...actions, ...goals];
    const types = {};
    for (const node of allNodes) {
        const [toName] = Object.entries(node)[0];
        const fromNames = backwards[toName] || (backwards[toName] = []);
        if (node.from) {
            for (const from of node.from) {
                const [fromName, label, props] = parseFrom(from);
                if (!from.backwards && !from.ungrouped) {
                    const toNames = forwards[fromName] || (forwards[fromName] = []);
                    toNames.push(toName);
                    fromNames.push(fromName);
                }
                const toNames = forwardsAll[fromName] || (forwardsAll[fromName] = []);
                toNames.push(toName);
            }
        }
    }
    function anyDominates(forwards, d, n) {
        // search to see if any nodes in d dominate n
        // nodes dominate themselves
        const search = [];
        const added = {};
        for (const other of d) {
            added[other] = true;
            search.push(other);
        }
        while ((d = search.shift()) !== undefined) {
            if (d === n) {
                return true;
            }
            const others = forwards[d];
            if (others !== undefined) {
                for (const other of others) {
                    if (!Object.hasOwnProperty.call(added, other)) {
                        added[other] = true;
                        search.push(other);
                    }
                }
            }
        }
        return false;
    }
    function shouldShow(n) {
        if (filter.length == 0 || anyDominates(forwardsAll, filter, n)) {
            return true;
        }
        const arrayN = [n];
        return filter.find(other => anyDominates(forwardsAll, arrayN, other));
    }
    function defaultLabelForName(name) {
        return name.replace(/_/g, " ").replace(/^[a-z]/, c => c.toUpperCase());
    }
    function nodes(type, values, properties) {
        const result = [];
        for (const value of values) {
            const [name, label] = Object.entries(value)[0];
            types[name] = type;
            if (shouldShow(name)) {
                result.push(line(mangleName(name), {
                    label: wordwrap(label === null ? defaultLabelForName(name) : label, 18),
                    ...properties,
                }));
            }
        }
        return result;
    }
    const allNodeLines = [
        `// facts`,
        ...nodes("fact", facts, {
            fillcolor: theme["fact-fill"],
        }),
        `// attacks`,
        ...nodes("attack", attacks, {
            fillcolor: theme["attack-fill"],
        }),
        `// actions`,
        ...nodes("action", actions, {
            fillcolor: theme["action-fill"],
        }),
        `// goals`,
        ...nodes("goal", goals, {
            fillcolor: theme["goal-fill"],
            fontcolor: theme["goal-text"],
        })
    ];
    function edges(entries, properties) {
        return entries.reduce((edges, value) => {
            const [name] = Object.entries(value)[0];
            if (!shouldShow(name)) {
                return edges;
            }
            (value.from || []).forEach((from) => {
                const [fromName, label, fromProps] = parseFrom(from);
                if (!shouldShow(fromName)) {
                    return;
                }
                const props = {
                    ...properties,
                };
                if (typeof label === "string") {
                    props.xlabel = wordwrap(label, 20);
                    props.fontcolor = theme["edge-text"];
                }
                if (typeof fromProps.implemented == "boolean" && !fromProps.implemented) {
                    props.style = "dotted";
                }
                if (fromProps.backwards) {
                    props.style = "dotted";
                    props.color = theme["backwards-edge"];
                    props.penwidth = theme["backwards-edge-penwidth"];
                    props.arrowsize = theme["backwards-edge-arrowsize"];
                    props.weight = "0";
                }
                edges.push(line(`${mangleName(fromName)} -> ${mangleName(name)}`, props));
            });
            return edges;
        }, []);
    }
    const allEdgeLines = [...edges(goals, {}), ...edges(attacks, {}), ...edges(actions, {}), ...edges(facts, {})];
    const goalNames = goals.map((goal) => {
        const [goalName] = Object.entries(goal)[0];
        return goalName;
    });
    for (const [fromName, toNames] of Object.entries(forwards)) {
        if (!shouldShow(fromName)) {
            continue;
        }
        const copy = toNames.concat();
        const filteredToNames = [];
        for (let i = 0; i < toNames.length; i++) {
            copy.splice(i, 1);
            if (!anyDominates(forwards, copy, toNames[i]) && goalNames.indexOf(toNames[i]) == -1 && shouldShow(toNames[i])) {
                filteredToNames.push(toNames[i]);
            }
            copy.splice(i, 0, toNames[i]);
        }
        if (filteredToNames.length > 1) {
            subgraphs.push(`    subgraph ${mangleName(fromName)}_order {
rank=same;
${filteredToNames.map(toName => mangleName(toName) + ";").join("\n        ")}
}
${line(filteredToNames.map(mangleName).join(" -> "), { style: "invis" })}`);
        }
    }
    const shownGoals = goalNames.filter(shouldShow);
    if (shownGoals > 1) {

        subgraphs.push(`    subgraph goal_order {
rank=same;
${shownGoals.map(goalName => mangleName(goalName) + ";").join("\n        ")}
}`);
        subgraphs.push("    " + line(shownGoals.join(" -> "), { style: "invis" }));
    }
    subgraphs.push(`    { rank=min; start; }`);
    for (const node of allNodes) {
        const [toName] = Object.entries(node)[0];
        if (shouldShow(toName) && !forwards[toName] && shownGoals.indexOf(toName) === -1) {
            for (const goalName of shownGoals) {
                subgraphs.push("    " + line(mangleName(toName) + " -> " + mangleName(goalName), { style: "invis", weight: 0 }));
            }
        }
    }
    subgraphs.push(`    { rank=max; ${shownGoals.map(goalName => mangleName(goalName) + "; ").join("")}}`);
    const footer = "\n\n}\n";
    return [header + "    " + allNodeLines.join("\n    ") + "\n\n    " + allEdgeLines.join("\n    ") + "\n\n    // subgraphs to give proper layout\n" + subgraphs.join("\n\n")  + footer, typeof parsed.title === "string" ? parsed.title : "", types];
}

const renderTarget = document.getElementById("renderTarget");
const errorTarget = document.getElementById("errorTarget");
const inputSource = document.getElementById("inputSource");
const downloadLink = document.getElementById("downloadLink");
const downloadSvgLink = document.getElementById("downloadSvgLink");
const openGistLink = document.getElementById("openGistLink");
const inputHighlighted = document.getElementById("inputHighlighted");
const highlighting = document.getElementById("highlighting");
function syncScroll() {
    highlighting.scrollTop = inputSource.scrollTop;
    highlighting.scrollLeft = inputSource.scrollLeft;
}
window["@hpcc-js/wasm"].graphvizSync().then(graphviz => {
    let lastInput = "";
    let lastObjectURL = "";
    let lastSvgObjectURL = "";
    let types = {};
    
    //Michelin CERT customization to display attack scenario svg outside dedicated page
    function generateSvg(dom){
        let dot, title;
        [dot, title, types] = convertToDot(dom.value);
        return graphviz.layout(dot, "svg", "dot");
    }

    $('.scenarioToDraw').each(function(i, obj) {
        document.getElementById(obj.id + "_svg").innerHTML = generateSvg(obj);
    });
    
    function selectRange(start, end) {
        inputSource.blur();
        inputSource.selectionEnd = inputSource.selectionStart = start;
        inputSource.focus();
        inputSource.selectionEnd = end;
        syncScroll();
        setTimeout(syncScroll, 0);
    }

    function rerender() {
        syncScroll();
        const newInput = inputSource.value;
        if (newInput != lastInput) {
            lastInput = newInput;
            //if (window.localStorage) {
            //    localStorage.setItem("deciduous-content", newInput);
            //}
            function updateTextArea(){
                types["attacks"] = "attacks";
                types["actions"] = "actions";
                types["goals"] = "goals";
                types["facts"] = "facts";
                types["start"] = "facts";
                let current = "";
                let i = 0;
                const childNodes = inputHighlighted.childNodes;
                function insertTextNode(text) {
                    if (i < childNodes.length) {
                        const node = childNodes[i];
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (node.textContent !== text) {
                                node.textContent = text;
                            }
                        } else {
                            inputHighlighted.replaceChild(document.createTextNode(text), node);
                        }
                    } else {
                        inputHighlighted.appendChild(document.createTextNode(text));
                    }
                    i++;
                }
                function insertSpan(text, className) {
                    if (i < childNodes.length) {
                        const node = childNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.textContent !== text) {
                                node.textContent = text;
                            }
                            if (node.className !== className) {
                                node.className = className
                            }
                        } else {
                            const span = document.createElement("span");
                            span.className = className;
                            span.textContent = text;
                            inputHighlighted.replaceChild(span, node);
                        }
                    } else {
                        const span = document.createElement("span");
                        span.className = className;
                        span.textContent = text;
                        inputHighlighted.appendChild(span);
                    }
                    i++;
                }
                for (const token of (newInput[newInput.length-1] == "\n" ? newInput + " " : newInput).split(/\b/)) {
                    if (Object.hasOwnProperty.call(types, token)) {
                        insertTextNode(current);
                        current = "";
                        insertSpan(token, types[token]);
                    } else {
                        current += token;
                    }
                }
                insertTextNode(current);
                while (i < childNodes.length) {
                    inputHighlighted.removeChild(childNodes[i]);
                }
                // Resync line height
                const highlightedHeight = inputHighlighted.getBoundingClientRect().height;
                const inputHeight = inputSource.scrollHeight;
                if (highlightedHeight > inputHeight) {
                    // line height hack for Firefox+Windows
                    inputSource.style.lineHeight = highlightedHeight*20.01/(inputHeight-40) + "px";
                }
            }
            try {
                let dot, title;
                [dot, title, types] = convertToDot(newInput);
                // Syntax highlighting
                updateTextArea();
                // console.log(dot);
                // Render SVG into the document
                const svg = graphviz.layout(dot, "svg", "dot");
                renderTarget.innerHTML = svg;
                const svgElement = renderTarget.querySelector("svg");
                if (svgElement) {
                    const scale = 0.75;
                    svgElement.setAttribute("width", parseInt(svgElement.getAttribute("width"), 10) * scale + "pt");
                    svgElement.setAttribute("height", parseInt(svgElement.getAttribute("height"), 10) * scale + "pt");
                }
                // Create a download link
                if (window.File && URL.createObjectURL) {
                    const file = new File([dot], "graph.dot", {
                        "type": "text/vnd.graphviz",
                    });
                    downloadLink.download = title + ".dot";
                    const newObjectURL = URL.createObjectURL(file);
                    downloadLink.href = newObjectURL;
                    if (lastObjectURL != "") {
                        URL.revokeObjectURL(lastObjectURL);
                    }
                    lastObjectURL = newObjectURL;
                    const svgFile = new File([svg], "graph.svg", {
                        "type": "image/svg+xml",
                    });
                    downloadSvgLink.download = title + ".svg";
                    const newSvgObjectURL = URL.createObjectURL(svgFile);
                    downloadSvgLink.href = newSvgObjectURL;
                    if (lastSvgObjectURL != "") {
                        URL.revokeObjectURL(lastSvgObjectURL);
                    }
                    lastSvgObjectURL = newSvgObjectURL;
                }
                // Add quick linky links
                for (const title of renderTarget.querySelectorAll("title")) {
                    title.parentNode.style.cursor = "pointer";
                    title.parentNode.addEventListener("click", () => {
                        const node = title.textContent;
                        const matches = node.match(/^(\w+)->(\w+)$/);
                        if (matches) {
                            // Select the appropriate "from entry" inside the target attack, action or goal
                            const firstIndex = lastInput.indexOf("\n- " + matches[2]);
                            if (firstIndex != -1) {
                                let secondIndex = lastInput.indexOf("- " + matches[1], firstIndex + 4 + matches[2].length);
                                if (secondIndex != -1) {
                                    selectRange(secondIndex + 2, secondIndex + 2 + matches[1].length);
                                }
                            }
                        } else {
                            // Select a top level attack, action or goal
                            const index = lastInput.indexOf("\n- " + node);
                            if (index != -1) {
                                selectRange(index + 3, index + 3 + node.length);
                            }
                        }
                    }, false);
                    // Clone edge paths and make them thicker to make them easier to click
                    if (title.parentNode.getAttribute("class") === "edge") {
                        const path = title.parentNode.querySelector("path");
                        if (path) {
                            const thickPath = path.cloneNode(true);
                            thickPath.setAttribute("stroke", "transparent");
                            thickPath.setAttribute("stroke-width", "15px");
                            title.parentNode.insertBefore(thickPath, path);
                        }
                    }
                }
                // Clear any error text
                errorTarget.innerText = "";
            } catch (e) {
                errorTarget.innerText = String(e);
                updateTextArea();
            }
        }
    }
    function rerenderAndClearHash() {
        if (location.hash !== "") {
            location.hash = "";
        }
        rerender();
    }
    inputSource.addEventListener("change", rerenderAndClearHash, false);
    inputSource.addEventListener("input", rerenderAndClearHash, false);
    inputSource.addEventListener("scroll", syncScroll, false);
    inputSource.addEventListener("select", syncScroll, false);
    inputSource.addEventListener("wheel", syncScroll, false);
    inputSource.addEventListener("focus", syncScroll, false);
    inputSource.addEventListener("blur", syncScroll, false);
    let tabCompletionCandidates = [];
    inputSource.addEventListener("keydown", (e) => {
        // Tab support
        if (e.code === "Tab" && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            const start = inputSource.selectionStart;
            const end = inputSource.selectionEnd;
            const beforeText = inputSource.value;
            let newline = beforeText.lastIndexOf("\n", start - 1);
            if (e.shiftKey) {
                // Unindent line two spaces
                if (newline + 2 <= beforeText.length && beforeText.slice(newline + 1, newline + 3) === "  ") {
                    inputSource.value = beforeText.slice(0, newline + 1) + beforeText.slice(newline + 3);
                    selectRange(start - 2, start - 2);
                }
            } else {
                if (start === end) {
                    // Autocomplete
                    const beforeMatch = beforeText.slice(newline + 1, start).match(/\w+$/);
                    if (beforeMatch) {
                        const afterMatch = beforeText.slice(start).match(/^\w+/);
                        const afterMatchText = afterMatch ? afterMatch[0] : "";
                        let currentTabCompletionIndex = -1;
                        if (tabCompletionCandidates.length > 1) {
                            // Existing candidates
                            currentTabCompletionIndex = tabCompletionCandidates.indexOf(beforeMatch[0] + afterMatchText);
                        } else if (!afterMatch) {
                            // New candidates
                            tabCompletionCandidates = Object.keys(types).filter(key => key.startsWith(beforeMatch[0]) && key !== beforeMatch[0]);
                        } else {
                            // In middle of a word, skip tab completion
                            tabCompletionCandidates = [];
                        }
                        if (tabCompletionCandidates.length) {
                            const replacementText = tabCompletionCandidates[(currentTabCompletionIndex + 1) % tabCompletionCandidates.length];
                            const replacementStart = start - beforeMatch[0].length;
                            inputSource.value = beforeText.slice(0, replacementStart) + replacementText + beforeText.slice(end + afterMatchText.length);
                            selectRange(replacementStart + replacementText.length, replacementStart + replacementText.length);
                            rerender();
                            return;
                        }
                    }
                }
                // Insert two spaces
                inputSource.value = beforeText.slice(0, start) + "  " + beforeText.slice(end);
                selectRange(start + 2, start + 2);
            }
            rerender();
        } else if ((e.metaKey ^ e.ctrlKey) && !e.altKey && !e.shiftKey) {
            const start = inputSource.selectionStart;
            const end = inputSource.selectionEnd;
            const beforeText = inputSource.value;
            const newlineIndex = beforeText.lastIndexOf("\n", start - 1);
            switch (e.key) {
                case '[':
                    // Ctrl+[ to unindent line
                    if (newlineIndex + 2 <= beforeText.length && beforeText.slice(newlineIndex + 1, newlineIndex + 3) === "  ") {
                        inputSource.value = beforeText.slice(0, newlineIndex + 1) + beforeText.slice(newlineIndex + 3);
                        selectRange(start - 2, end - 2);
                        rerender();
                    }
                    break;
                case ']':
                    // Ctrl+] to indent line
                    inputSource.value = beforeText.slice(0, newlineIndex + 1) + "  " + beforeText.slice(newlineIndex + 1);
                    selectRange(start + 2, end + 2);
                    rerender();
                    break;
                case '/':
                    // Ctrl+/ to comment/uncomment line
                    if (newlineIndex + 2 <= beforeText.length && beforeText.slice(newlineIndex + 1, newlineIndex + 3) === "# ") {
                        // uncomment
                        inputSource.value = beforeText.slice(0, newlineIndex + 1) + beforeText.slice(newlineIndex + 3);
                        selectRange(start - 2, end - 2);
                    } else {
                        // comment
                        inputSource.value = beforeText.slice(0, newlineIndex + 1) + "# " + beforeText.slice(newlineIndex + 1);
                        selectRange(start + 2, end + 2);
                    }
                    rerender();
                default:
                    syncScroll();
                    break;
            }
        } else {
            syncScroll();
        }
        if (tabCompletionCandidates.length != 0) {
            tabCompletionCandidates = [];
        }
    }, false);
    inputSource.addEventListener("keyup", syncScroll, false);
    function tryHashRender() {
        const match = location.hash.match(/^#gist=(\w+)$/);
        if (match) {
            const url = `https://api.github.com/gists/${match[1]}`;
            inputSource.value = `# Loading ${url}`;
            fetch(url).then(response => response.json()).then(json => {
                const files = json.files;
                for (const key in files) {
                    if (/\.yaml$/.test(key)) {
                        const file = files[key];
                        if (file.truncated) {
                            return fetch(file.raw_url).then(fileResponse => fileResponse.text());
                        } else {
                            return files[key].content;
                        }
                    }
                }
                return `# No yaml in gist ID ${match[1]}`;
            }).catch(e => `# Error loading ${url}: ${e}`).then(text => {
                inputSource.value = text;
                rerender();
            });
        }
    }
    if (!tryHashRender()) {
        /*if (window.localStorage) {
            const content = localStorage.getItem("deciduous-content");
            if (content !== null && content !== "") {
                inputSource.value = content;
            }
        }*/
    }
    window.addEventListener("hashchange", tryHashRender, false);
    rerender();
    
    // Focus the textarea so that users know it's editable
    inputSource.selectionStart = inputSource.selectionEnd = 0;
    inputSource.focus();
    // Make the dragger draggable
    const dragger = document.getElementById("dragger");
    dragger.style.left = "40%";
    const leftPane = document.getElementById("leftPane");
    let currentPercentage = 40;
    if (window.localStorage) {
        currentPercentage = localStorage.getItem("deciduous-divider") || 40;
    }
    function updateDivider(percent) {
        /*
        dragger.style.left = percent + "%";
        leftPane.style.width = percent + "%";
        rightPane.style.left = percent + "%";
        rightPane.style.width = (100 - percent) + "%";
        currentPercentage = percent;
        */
    }
    function mouseMove(e) {
        const clientWidth = document.body.clientWidth;
        updateDivider(Math.max(Math.min(e.clientX, clientWidth - 200), 200) * 100 / clientWidth);
    }
    function mouseUp(e) {
        document.body.removeEventListener("mousemove", mouseMove);
        document.body.removeEventListener("mouseup", mouseUp);
        if (window.localStorage) {
            localStorage.setItem("deciduous-divider", currentPercentage);
        }
    }
    dragger.addEventListener("mousedown", e => {
        document.body.addEventListener("mousemove", mouseMove, false);
        document.body.addEventListener("mouseup", mouseUp, false);
    }, false);
    updateDivider(currentPercentage);
});