// e.g node render-handlebar.js --data voc_v2_data_lyft.json --templateFile voc_v2_template.html
const fs = require("fs");
const Handlebars = require("handlebars");
const argv = require('yargs').argv;
const path = require('path');
const inlineCss = require('inline-css');

if(!argv.data){
  console.error("Provide test data file name");
  return;
}

if(!argv.templateFile) {
  console.error("Provide template file name");
  return;
}

console.log(argv.data, argv.templateFile);


const templateFileName = path.parse(argv.templateFile).name;
const dataFileName = path.parse(argv.data).name;

let buf = fs.readFileSync(argv.data);

let testData = JSON.parse(buf.toString());


// console.log(testData);

const templateBuf = fs.readFileSync(argv.templateFile);
const template = templateBuf.toString();
const compiledTemplate = Handlebars.compile(template);

const renderedData = compiledTemplate(testData);


if(!fs.existsSync('./output')){
  fs.mkdirSync('./output');
}
const outputFile = `./output/${templateFileName}-${dataFileName}.html`;
fs.writeFileSync(outputFile, renderedData);
inlineCss(template, {url: ' ', removeStyleTags: false, removeLinkTags: false}).then( function( inlineCssHTML ) {
  fs.writeFileSync(`./output/${templateFileName}-inline.html`, inlineCssHTML);
  console.log("Rendered HTML template with inline styles: ", `./output/${templateFileName}-inline.html`);
}, function(error){
  console.log(error);
});
inlineCss(renderedData, {url: ' ', removeStyleTags: false, removeLinkTags: false}).then( function( inlineCssHTML ) {
  fs.writeFileSync(`./output/${templateFileName}-${dataFileName}-inline.html`, inlineCssHTML);
  console.log("Rendered HTML template with data and inline styles: ", `./output/${templateFileName}-${dataFileName}-inline.html`);
}, function(error){
  console.log(error);
});
console.log("Rendered HTML file: ", outputFile);

