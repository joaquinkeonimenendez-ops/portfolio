var twitter = "https://twitter.com/joaquinkmenend";
var instagram = "https://www.instagram.com/joaquinkmenendez/";
var github = "https://github.com/joaquinkeonimenendez-ops";

let banner = [];

let aboutme = [
  "<br>",
  `<div id="aboutme-section">`,
  `<span class='underline output-blue'>Who I am</span>`,
  `<pre class="about-body indent-8 whitespace-pre-wrap break-words overflow-x-auto">I'm a CS student at UC Irvine. In my spare time I work on AI projects. I've been interested in coding since childhood- fun fact, I was awarded my first cash bug bounty (stored XSS) at age 12!</pre>`,
  `<span class="command">What I do</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">I'm currently building Magnum a CLI tool for selling websites to small businesses, and Charcoal a web alternative for Obsidian.md out of personal necessity. Use the projects command to explore further.</pre>`,
  "</div>",
];

let social = [
  "<br>",
  'github        <a href="' +
    github +
    '" target="_blank">github.com/joaquinkeonimenendez-ops</a>',
  'instagram     <a href="' +
    instagram +
    '" target="_blank">instagram.com/joaquinkmenendez</a>',
  'twitter       <a href="' +
    twitter +
    '" target="_blank">twitter.com/joaquinkmenend</a>',
];

let help = [
  "<br>",
  `<span class="cli-run-command cli-run-item" data-run-command="about" data-preview-key="help-option:about"><span class="command">about</span><br><span class="home-item-desc">&#8627; Displays who I am.</span></span>`,
  `<span class="cli-run-command cli-run-item" data-run-command="projects" data-preview-key="help-option:projects"><span class="command">projects</span><br><span class="home-item-desc">&#8627; View coding projects.</span></span>`,
  `<span class="cli-run-command cli-run-item" data-run-command="contact" data-preview-key="help-option:contact"><span class="command">contact</span><br><span class="home-item-desc">&#8627; Lists contact info.</span></span>`,
];

let projects = [
  "<br>",
  `<span class="home-item-desc">Select a project for a visual demonstration.</span>`,
  "<br>",
  `<span class="cli-run-command cli-run-item" data-run-command="charcoal" data-preview-key="project:charcoal"><span class="command">1. Charcoal</span><br><span class="home-item-desc">&#8627; A markdown based note-taking webapp inspired by Obsidian. Built for people who can't install desktop apps on work/school devices or don't want to pay for Obsidian sync.</span></span>`,
  `<span class="cli-run-command cli-run-item" data-run-command="magnum" data-preview-key="project:magnum"><span class="command">2. Magnum</span><br><span class="home-item-desc">&#8627; A CLI for selling websites to small businesses. Lead generation and website creation is entirely handled by AI agents. Fully integrated with OpenPhone and Stripe for a human operator to smoothly make sales calls.</span></span>`,
];

const charcoalProjectBrowserMock = `
<div class="charcoal-project project-card" data-initial-url="google.com" data-target-url="charcoal-md.vercel.app"
    data-target-src="https://charcoal-md.vercel.app/">
    <div class="projects-header block-left">
        <h2 class="section-title">Charcoal.md</h2>
        <p class="section-subtitle">
            Charcoal.md is a markdown-first note-taking web app inspired by Obsidian: simple, fast,
            and file-first. It's built for people who can't install desktop apps on work or school
            devices and want a cleaner, faster alternative to Notion. You can try it at <a
                href="https://charcoal-md.vercel.app/" target="_blank"
                rel="noopener noreferrer">https://charcoal-md.vercel.app/</a> or in the iframe below.
        </p>
    </div>
    <div class="chrome-shell">
        <div class="chrome-tabstrip">
            <div class="chrome-tab chrome-tab-active">
                <img class="chrome-tab-favicon" src="favicon.png" alt="" aria-hidden="true">
                <span class="chrome-tab-label">Charcoal notes</span>
                <span class="chrome-tab-close" aria-hidden="true">x</span>
            </div>
            <button class="chrome-new-tab" type="button" aria-label="New tab">+</button>
            <div class="chrome-tab-fade" aria-hidden="true"></div>
            <div class="chrome-window-controls" aria-hidden="true">
                <span class="chrome-window-btn chrome-window-min"></span>
                <span class="chrome-window-btn chrome-window-max"></span>
                <span class="chrome-window-btn chrome-window-close"></span>
            </div>
        </div>
        <div class="chrome-toolbar">
            <div class="chrome-nav-controls" aria-hidden="true">
                <span class="chrome-nav-btn chrome-nav-back"></span>
                <span class="chrome-nav-btn chrome-nav-forward"></span>
                <span class="chrome-nav-btn chrome-nav-reload"></span>
            </div>
            <div class="chrome-omnibox">
                <span class="chrome-site-icon" aria-hidden="true"></span>
                <span class="chrome-url">google.com</span>
            </div>
            <div class="chrome-toolbar-actions" aria-hidden="true">
                <span class="chrome-menu"></span>
            </div>
        </div>
        <div class="chrome-viewport">
            <div class="chrome-viewport-splash google-mock" aria-hidden="true"
                data-query="Obsidian alternatives for web">
                <div class="google-mock-home">
                    <div class="google-mock-center">
                        <div class="google-wordmark">
                            <span class="g-blue">G</span><span class="g-red">o</span><span
                                class="g-yellow">o</span><span class="g-blue">g</span><span
                                class="g-green">l</span><span class="g-red">e</span>
                        </div>
                        <div class="google-search-shell">
                            <span class="google-search-icon"></span>
                            <span class="google-search-text">Search Google or type a URL</span>
                            <span class="google-mic-icon"></span>
                        </div>
                        <div class="google-actions" aria-hidden="true">
                            <span class="google-btn">Google Search</span>
                            <span class="google-btn">I'm Feeling Lucky</span>
                        </div>
                    </div>
                </div>
                <div class="google-mock-results">
                    <div class="google-results-search">
                        <div class="google-search-shell google-search-shell-results">
                            <span class="google-search-icon"></span>
                            <span class="google-results-query">Obsidian alternatives for web</span>
                        </div>
                    </div>
                    <div class="google-results-meta">About 79,000,000 results (0.53 seconds)</div>
                    <div class="google-results-list">
                        <div class="google-result google-ai-overview google-result-primary">
                            <div class="google-ai-overview-label">
                                <span class="google-ai-overview-dot" aria-hidden="true"></span>
                                <span>AI Overview</span>
                            </div>
                            <div class="google-ai-summary-row">
                                <div class="google-ai-summary-copy">
                                    <p class="google-ai-overview-text">For a web-based Obsidian
                                        alternative, use
                                        <span class="google-ai-highlight">Charcoal</span>: a fast,
                                        markdown-native notes app built for school/work environments
                                        where desktop installs are often blocked.
                                    </p>
                                    <p class="google-ai-overview-text">Charcoal keeps the
                                        Obsidian-style experience people care about, including
                                        backlinks, local-first workflows, and file ownership, while
                                        staying clean and responsive in the browser.</p>
                                    <div class="google-ai-source-inline" aria-hidden="true">Google
                                        Search +5</div>
                                </div>
                                <div class="google-ai-figure" aria-hidden="true">
                                    <div class="google-ai-figure-inner"></div>
                                </div>
                            </div>
                            <div class="google-ai-details-title">Why Charcoal
                            </div>
                            <ul class="google-ai-detail-list">
                                <li><strong>Best fit:</strong> It combines markdown speed,
                                    Obsidian-like workflows, and browser access on locked-down devices
                                    without the clutter of heavier all-in-one tools.</li>
                            </ul>
                            <div class="google-ai-show-more" aria-hidden="true">
                                <span>Show more</span>
                            </div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">charcoal-md.vercel.app</div>
                            <div class="google-result-title">Charcoal.md - A real Obsidian alternative
                                for the web</div>
                            <div class="google-result-snippet">A browser-native markdown workspace with
                                local-first storage, backlinking, graph exploration, and fast command
                                palette workflows designed for people who want Obsidian-style thinking
                                without desktop lock-in. Includes clean note linking, flexible folders,
                                keyboard-heavy editing, and a modern interface that feels fast even on
                                large note collections.</div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">forum.obsidian.md</div>
                            <div class="google-result-title">Obsidian alternatives for web? (2026
                                thread)</div>
                            <div class="google-result-snippet">Huge community thread with side-by-side
                                comparisons, migration stories, and heated debates about sync,
                                offline-first design, plugins, collaboration, and what people give up
                                when moving from desktop PKM tools to web-first options.</div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">logseq.com</div>
                            <div class="google-result-title">Logseq - Open source knowledge base</div>
                            <div class="google-result-snippet">Graph notes, local markdown, plugin
                                ecosystem, daily journals, and block references. Strong if you like
                                outlining-first workflows and bidirectional linking with a lot of
                                extensibility.</div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">capacities.io</div>
                            <div class="google-result-title">Capacities</div>
                            <div class="google-result-snippet">Object-driven notes with backlinks,
                                embeds, and a clean editor geared toward personal knowledge workflows
                                that mix writing, research, and planning across projects, classes, and
                                reference material.</div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">notion.so</div>
                            <div class="google-result-title">Notion: docs, tasks, and wikis</div>
                            <div class="google-result-snippet">Popular all-in-one workspace.</div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">dev.to</div>
                            <div class="google-result-title">Web-first PKM tools people actually use
                            </div>
                            <div class="google-result-snippet">Roundup post with short demos, pricing
                                notes, and practical tradeoffs for teams vs solo note-takers,
                                including comments about speed, sync reliability, export options, and
                                markdown compatibility.</div>
                        </div>
                        <div class="google-result">
                            <div class="google-result-url">reddit.com/r/PKMS</div>
                            <div class="google-result-title">Switched from Obsidian to browser notes
                            </div>
                            <div class="google-result-snippet">Quick takes. Mixed reviews.</div>
                        </div>
                    </div>
                </div>
                <div class="google-mock-cursor" aria-hidden="true"></div>
            </div>
            <iframe src="about:blank" title="Charcoal.md local preview" loading="lazy"></iframe>
        </div>
    </div>
</div>
`;

let projectCharcoal = [
  "<br>",
  `<span class="output-blue">Charcoal</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">
A markdown-based note-taking web app inspired by Obsidian.
Built for people who can't install desktop apps on work/school devices
or who don't want to pay for Obsidian sync.
</pre>`,
  `<span class="cli-run-command cli-run-item" data-run-command="projects" data-preview-key="project:back"><span class="command">Back to projects</span></span>`,
];

let projectMagnum = [
  "<br>",
  `<span class="output-blue">Magnum</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">
A CLI for selling websites to small businesses.
Lead generation and website creation are handled by AI agents,
with integrations for OpenPhone and Stripe to support smooth operator workflows.
</pre>`,
  `<span class="cli-run-command cli-run-item" data-run-command="projects" data-preview-key="project:back"><span class="command">Back to projects</span></span>`,
];

const magnumGalleryItems = [
  {
    title: "Phase 1: Lead generation",
    description:
      "Scrapers find hundreds of businesses that do not own websites from Google maps.",
    src: "assets/1.mp4",
  },
  {
    title: "Phase 2: Lead qualification",
    description:
      "Haiku agents review each business and determine if they'd benefit from a website or not.",
    src: "assets/2.mp4",
  },
  {
    title: "Phase 3: Research web design",
    description:
      "For each type of business, AI agents analyze real website examples to identify effective design patterns and best practices.",
    src: "assets/3.mp4",
  },
  {
    title: "Phase 4: Generate website templates",
    description: "Placeholder GIF for sequencing calls, texts, and follow-ups.",
    src: "assets/4.mp4",
  },
  {
    title: "Phase 5: Deploy live websites",
    description: "Placeholder GIF for campaign health monitoring and alerts.",
    src: "assets/5.mp4",
  },
  {
    title: "Phase 6: Sell websites to businesses",
    description: "Placeholder GIF for human-in-the-loop approvals and handoffs.",
    src: "assets/6.mp4",
  },
];

let thoughts = [
  "<br>",
  `<span class="command">1. Brief thoughts on automation</span>`,
  `<span class="command">Q. Exit thoughts</span>`,
];

let thoughtsAutomation = [
  "<br>",
  `<span class='underline'>Brief thoughts on automation - 1/25/26</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">
ai POWERED automation systems are overrated and expensive 
but ai GENERATED automation systems are so fucking overpowered

automation systems usually require SO MUCH upfront cost, effort, and expertise and thats the reason why everything in the world isn't automated (yet). but not anymore

you MUST try generating playwright python scripts WITH opus and the python script does the browser based task not opus itself. 

these scripts are 1000 times more efficient than asking an AI browser to do a task because they're hyper specialized and don't have to relearn every time. and they don't cost any tokens to run. theres just slightly more upfront setup for each task

but there still generated by the brilliance of opus 4.5. you just have to run the script in playwright headed mode and describe to opus 4.5 where it went wrong and to adjust the script accordingly.

also playwright is not like devtools / javascript based interactions. its based on multiple types of selectors rather than simply just elements or classes. slight elemental/class changes to the structure of the webapp you want to automate a task on won't break anything either.

opus + playwright is such a brilliant combo that it can automate tasks before even seeing the website you want to automate it on so long as you describe the UI in your prompt.

gatekeep this tho
</pre>`,
];

