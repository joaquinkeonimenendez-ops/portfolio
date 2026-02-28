var twitter = "https://twitter.com/joaquinkmenend";
var instagram = "https://www.instagram.com/joaquinkmenendez/";
var github = "https://github.com/joaquinkeonimenendez-ops";

let banner = [
  `<div id="banner-section" class="banner">
 <span class="output-blue">Type help to see a list of supported commands</span>
  </div>`,
];

let aboutme = [
  "<br>",
  `<div id="aboutme-section">`,
  `<span class='underline output-blue'>Who I am</span>`,
  `<pre class="about-body indent-8 whitespace-pre-wrap break-words overflow-x-auto">I'm a CS student at UC Irvine. In my spare time I work on AI projects. I've been interested in coding since childhood- fun fact I was awarded my first cash bounty for stored XSS at age 12!</pre>`,
  `<span class="command">What I do</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">I'm currently building Magnum a CLI tool for selling websites to small businesses and Charcoal a web alternative for Obsidian.md out of personal necessity. Use the projects command to explore further.</pre>`,
  "</div>",
  "<br>",
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
  'phone         <a href="tel:+19256832581">+1 925-683-2581</a>',
  'email         <a href="mailto:joaquinkeonimenendez@gmail.com">joaquinkeonimenendez@gmail.com</a>',
  "<br>",
];

let help = [
  "<br>",
  `<span class="command">about</span>`,
  "&#8627; Displays who I am.",
  `<span class="command">projects</span>`,
  "&#8627; View coding projects.",
  `<span class="command">contact</span>`,
  "&#8627; Lists contact info.",
  "<br>",
];

let projects = [
  "<br>",
  `<div id="projects-section">`,
  `<span class='underline'>Charcoal.md</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">
Charcoal.md is a markdown-first note-taking web app inspired by Obsidian: simple, fast, and file-first. Built for people who can't install desktop apps on work/school devices and want a cleaner, faster alternative to Notion.
</pre>`,

  `<span class='underline'>Magnum CLI Tool</span>`,
  `<pre class="indent-8 whitespace-pre-wrap break-words overflow-x-auto">
A semi-autonomous web design agency in your command line: autonomous lead generation, lead prequalification, cost-efficient website generation, all funneled into a CRM for AI-assisted outreach, sales calls, and Stripe payments.
</pre>`,
  "</div>",
  "<br>",
];
