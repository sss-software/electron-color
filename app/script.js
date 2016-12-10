const robot = require("robotjs");
const { clipboard } = require('electron');

const $bodyBackground = $('.body-background');
const $gradientColor = $('.gradient-color');
const $rgbaValue = $('.rgba-value');
const $hexValue = $('.hex-value');
const $hexContainer = $('.hex-container');
const $rgbaContainer = $('.rgba-containter');

const $eyedropperView = $('.eyedropper-view');

const $eyedropperButton = $('.eyedropper-button');
const $hexValueButton = $('.hex-value-button');

const $redValueInput = $('.red-value-input');
const $greenValueInput = $('.green-value-input');
const $blueValueInput = $('.blue-value-input');
const $alphaValueInput = $('.alpha-value-input');

const $redValueInputSlider = $('.red-value-input-slider');
const $greenValueInputSlider = $('.green-value-input-slider');
const $blueValueInputSlider = $('.blue-value-input-slider');
const $alphaValueInputSlider = $('.alpha-value-input-slider');

const $redValue = $('.red-value');
const $greenValue = $('.green-value');
const $blueValue = $('.blue-value');
const $alphaValue = $('.alpha-value');

function handleIndividualColorValue( colorSelector, colorValue, alternateColorSelector ) {
  let color = colorSelector;
  color = validateMaxColorValue(color, 255);
  colorSelector.val(color);
  colorValue.html(color);
  alternateColorSelector.val(color);
  updateColor();
}

$redValueInput.on('change', () => handleIndividualColorValue($redValueInput, $redValue, $redValueInputSlider));
$greenValueInput.on('change', () => handleIndividualColorValue($greenValueInput, $greenValue, $greenValueInputSlider));
$blueValueInput.on('change', () => handleIndividualColorValue($blueValueInput, $blueValue, $blueValueInputSlider));
$alphaValueInput.on('change', () => handleIndividualColorValue($alphaValueInput, $alphaValue, $alphaValueInputSlider));

$redValueInputSlider.on('change', () => handleIndividualColorValue($redValueInputSlider, $redValue, $redValueInput));
$greenValueInputSlider.on('change', () => handleIndividualColorValue($greenValueInputSlider, $greenValue, $greenValueInput));
$blueValueInputSlider.on('change', () => handleIndividualColorValue($blueValueInputSlider, $blueValue, $blueValueInput));
$alphaValueInputSlider.on('change', () => handleIndividualColorValue($alphaValueInputSlider, $alphaValue, $alphaValueInput));

$rgbaValue.on('click', function() {
  clipboard.writeText($rgbaValue.text().trim());
  $rgbaContainer.addClass('rgba-copied');
});

$hexValueButton.on('click', function() {
  clipboard.writeText($hexValueButton.text().trim());
  $hexContainer.addClass('hex-copied');
});

function rgbToHex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function validateMaxColorValue(inputValue, max) {
  let color = inputValue.val()
  if(color >= max) { return max; }
  if(color < 0) { return 0; }
  return color;
}

function updateColor(){ 
  let red = $redValueInput.val();
  let green = $greenValueInput.val();
  let blue = $blueValueInput.val();
  let alpha = $alphaValueInput.val();
  let rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  let hex = rgbToHex(rgba);
  updateGradientColor(red, green, blue, hex);
  updateBackgroundColor(red, green, blue);
  $hexValue.html(hex);
}

function updateBackgroundColor(red, green, blue) {
  $bodyBackground.css({'background-color': `rgba(${red}, ${green}, ${blue}, 0.5)`});
}

function updateGradientColor(red, green, blue, hex) {
  const gradient = `linear-gradient(-270deg, rgba(${red},${green},${blue}, 0) 0%, ${hex} 100%)`
  $gradientColor.css({'background-image': gradient});
}

function updateEyedropperView() {
  const { position, dropperColor } = getDropperColor();
  $eyedropperView.css({ 
    'top': `${position.y-70}px`, 
    'left': `${position.x-40}px`,
    'border': `solid 20px #${dropperColor}`, 
    'opacity': '1'
  });
}

function getMousePosition(){
  return robot.getMousePos();
}

function getDropperColor(){
  const position = getMousePosition();
  const dropperColor = robot.getPixelColor(position.x, position.y);
  const color = {position, dropperColor};
  return color;
}

function hexToRgb(hex) {
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16));
}

$eyedropperButton.on('click', () => {
  $eyedropperView.toggle();
  updateEyedropperView()
  $('html').on('mousemove', () => { 
    updateEyedropperView();
  });
  $('html').on('click', () => {
    console.log(getDropperColor());
  });
});

$(document).keyup(function(e) {
  if (e.keyCode == 69) {$eyedropperView.toggle()};
  if (e.keyCode == 27) {$bodyBackground.toggle()};
});
