PImage img;

void setup() {
  size(244, 191);
  img = loadImage("global_map.png");
}

void draw() {
  loadPixels(); 
  // Since we are going to access the image's pixels too  
  img.loadPixels(); 
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      int loc = x + y*width;
      
      // The functions red(), green(), and blue() pull out the 3 color components from a pixel.
      float r = red(img.pixels[loc]);
      float g = green(img.pixels[loc]);
      float b = blue(img.pixels[loc]);
      
      // Image Processing would go here
      // If we were to change the RGB values, we would do it here, 
      // before setting the pixel in the display window.
      
      // Set the display pixel to the image pixel
      if (r == 0) {
        pixels[loc] = color(0);
      } else if (r < 40) {
        pixels[loc] = color(50);
      } else if (r < 80) {
        pixels[loc] = color(150);
      } else if (r < 120) {
        pixels[loc] = color(200);
      } else {
        pixels[loc] = color(255);
      }         
    }
  }
  updatePixels();
  saveFrame("filter.png");
}